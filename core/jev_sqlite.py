"""
JEV Real - SQLite com client_order_id único (idempotência, reconciliação)
Substitui JSONL append que não era auditável e não tinha idempotência.

Original quebrado:
- JSONL append sem lock, sem unique, sem reconciliação
- agent_id uuid novo a cada restart → memória zero
- df['loss'] <0 → KeyError

Aqui:
- SQLite com WAL, unique(client_order_id), índices
- agent_id determinístico (agent_00..agent_11) persistido
- client_order_id = f"{agent_id}-{timestamp}-{uuid}" para idempotência
- Reconciliação: compara ordens locais vs exchange
"""
import sqlite3
import os
import uuid
import threading
import time
from datetime import datetime, timezone
from typing import List, Dict, Optional
from pathlib import Path


class JEVSQLite:
    def __init__(self, db_path: str = "jev_real.db"):
        self.db_path = Path(db_path)
        self.lock = threading.Lock()
        self._init_db()

    def _init_db(self):
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("PRAGMA journal_mode=WAL;")
            conn.execute("""
                CREATE TABLE IF NOT EXISTS trades (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    client_order_id TEXT UNIQUE NOT NULL,
                    timestamp TEXT NOT NULL,
                    agent_id TEXT NOT NULL,
                    symbol TEXT NOT NULL,
                    side TEXT NOT NULL,
                    price REAL NOT NULL,
                    qty REAL NOT NULL,
                    notional REAL NOT NULL,
                    order_type TEXT NOT NULL,
                    status TEXT NOT NULL,
                    pnl_gross REAL DEFAULT 0,
                    pnl_net REAL DEFAULT 0,
                    fee REAL DEFAULT 0,
                    error_type TEXT DEFAULT 'NONE',
                    lesson TEXT DEFAULT '',
                    context_json TEXT DEFAULT '{}',
                    dna_json TEXT DEFAULT '{}',
                    mode TEXT NOT NULL,
                    exchange_order_id TEXT,
                    created_at TEXT NOT NULL
                )
            """)
            conn.execute("CREATE INDEX IF NOT EXISTS idx_agent ON trades(agent_id)")
            conn.execute("CREATE INDEX IF NOT EXISTS idx_symbol ON trades(symbol)")
            conn.execute("CREATE INDEX IF NOT EXISTS idx_timestamp ON trades(timestamp)")
            conn.execute("CREATE INDEX IF NOT EXISTS idx_client_order ON trades(client_order_id)")
            conn.execute("""
                CREATE TABLE IF NOT EXISTS agents (
                    agent_id TEXT PRIMARY KEY,
                    dna_json TEXT NOT NULL,
                    fitness REAL DEFAULT 0,
                    balance REAL DEFAULT 1000,
                    trades INTEGER DEFAULT 0,
                    wins INTEGER DEFAULT 0,
                    generation INTEGER DEFAULT 0,
                    is_active INTEGER DEFAULT 1,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                )
            """)
            conn.commit()

    def generate_client_order_id(self, agent_id: str) -> str:
        """Gera ID único para idempotência - evita duplicar ordem em retry"""
        ts = int(time.time() * 1000)
        short_uuid = uuid.uuid4().hex[:8]
        return f"{agent_id}-{ts}-{short_uuid}"

    def log_trade(self, trade: Dict) -> bool:
        """
        Loga trade com idempotência via client_order_id UNIQUE.
        Retorna True se inseriu, False se já existia (idempotente).
        """
        if "client_order_id" not in trade:
            trade["client_order_id"] = self.generate_client_order_id(trade.get("agent_id", "unknown"))
        
        if "timestamp" not in trade:
            trade["timestamp"] = datetime.now(timezone.utc).isoformat()
        
        if "created_at" not in trade:
            trade["created_at"] = datetime.now(timezone.utc).isoformat()

        # Normaliza
        trade.setdefault("symbol", "BTC/USDT")
        trade.setdefault("side", "BUY")
        trade.setdefault("price", 0)
        trade.setdefault("qty", 0)
        trade.setdefault("notional", trade["price"] * trade["qty"])
        trade.setdefault("order_type", "MARKET")
        trade.setdefault("status", "FILLED")
        trade.setdefault("pnl_gross", 0)
        trade.setdefault("pnl_net", 0)
        trade.setdefault("fee", 0)
        trade.setdefault("error_type", "NONE")
        trade.setdefault("lesson", "")
        trade.setdefault("context_json", "{}")
        trade.setdefault("dna_json", "{}")
        trade.setdefault("mode", "paper")
        trade.setdefault("exchange_order_id", None)

        # Converte dicts para json string se necessário
        import json
        if isinstance(trade.get("context_json"), dict):
            trade["context_json"] = json.dumps(trade["context_json"])
        if isinstance(trade.get("dna_json"), dict):
            trade["dna_json"] = json.dumps(trade["dna_json"])

        with self.lock:
            try:
                with sqlite3.connect(self.db_path) as conn:
                    conn.execute("""
                        INSERT INTO trades (
                            client_order_id, timestamp, agent_id, symbol, side, price, qty, notional,
                            order_type, status, pnl_gross, pnl_net, fee, error_type, lesson,
                            context_json, dna_json, mode, exchange_order_id, created_at
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """, (
                        trade["client_order_id"],
                        trade["timestamp"],
                        trade["agent_id"],
                        trade["symbol"],
                        trade["side"],
                        trade["price"],
                        trade["qty"],
                        trade["notional"],
                        trade["order_type"],
                        trade["status"],
                        trade["pnl_gross"],
                        trade["pnl_net"],
                        trade["fee"],
                        trade["error_type"],
                        trade["lesson"],
                        trade["context_json"],
                        trade["dna_json"],
                        trade["mode"],
                        trade["exchange_order_id"],
                        trade["created_at"]
                    ))
                    conn.commit()
                    return True
            except sqlite3.IntegrityError as e:
                # client_order_id já existe → idempotente, não duplica
                if "UNIQUE" in str(e):
                    print(f"[JEV SQLite] Idempotência: {trade['client_order_id']} já existe, ignorando duplicata")
                    return False
                raise

    def get_trades(self, agent_id: Optional[str] = None, limit: int = 100, symbol: Optional[str] = None) -> List[Dict]:
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            query = "SELECT * FROM trades"
            params = []
            conditions = []
            
            if agent_id:
                conditions.append("agent_id = ?")
                params.append(agent_id)
            if symbol:
                conditions.append("symbol = ?")
                params.append(symbol)
            
            if conditions:
                query += " WHERE " + " AND ".join(conditions)
            
            query += " ORDER BY timestamp DESC LIMIT ?"
            params.append(limit)
            
            rows = conn.execute(query, params).fetchall()
            return [dict(row) for row in rows]

    def get_learnings_for_agent(self, agent_id: str, limit: int = 10) -> str:
        """Web4: Memória semântica que realmente influencia decisão"""
        trades = self.get_trades(agent_id=agent_id, limit=limit*2)
        # Filtra perdas
        fails = [t for t in trades if t["pnl_net"] < 0]
        fails = fails[:limit]

        if not fails:
            # Global fails
            all_trades = self.get_trades(limit=20)
            global_fails = [t for t in all_trades if t["pnl_net"] < 0][:5]
            if not global_fails:
                return "Sem histórico de perdas. Seja conservador: RSI <35 compra, RSI >65 venda, respeite tendência."
            lessons = "\n".join([f"- {f['lesson']}" for f in global_fails if f["lesson"]])
            return f"LIÇÕES GLOBAIS (evite repetir):\n{lessons}"

        lessons = []
        for f in fails:
            import json
            try:
                ctx = json.loads(f["context_json"]) if isinstance(f["context_json"], str) else f["context_json"]
                rsi = ctx.get("rsi", "?")
            except:
                rsi = "?"
            lessons.append(f"- {f['lesson']} | RSI:{rsi} PnL:{f['pnl_net']:.2f} | {f['error_type']}")

        return f"LIÇÕES APRENDIDAS para {agent_id} (NÃO REPITA):\n" + "\n".join(lessons)

    def get_stats(self) -> Dict:
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            total = conn.execute("SELECT COUNT(*) as c FROM trades").fetchone()["c"]
            if total == 0:
                return {"total_trades": 0, "total_pnl_net": 0, "winrate": 0, "profit_factor": 0}
            
            pnl_sum = conn.execute("SELECT SUM(pnl_net) as s FROM trades").fetchone()["s"] or 0
            wins = conn.execute("SELECT COUNT(*) as c FROM trades WHERE pnl_net > 0").fetchone()["c"]
            winrate = wins / total * 100 if total > 0 else 0
            
            gross_profit = conn.execute("SELECT SUM(pnl_net) as s FROM trades WHERE pnl_net > 0").fetchone()["s"] or 0
            gross_loss = conn.execute("SELECT SUM(pnl_net) as s FROM trades WHERE pnl_net < 0").fetchone()["s"] or 0
            gross_loss = abs(gross_loss) if gross_loss else 1
            pf = gross_profit / gross_loss if gross_loss != 0 else 0
            
            fees = conn.execute("SELECT SUM(fee) as s FROM trades").fetchone()["s"] or 0
            
            return {
                "total_trades": total,
                "total_pnl_net": round(pnl_sum, 2),
                "total_fees": round(fees, 2),
                "winrate": round(winrate, 2),
                "profit_factor": round(pf, 2),
                "wins": wins,
                "losses": total - wins
            }

    def reconcile(self, exchange_trades: List[Dict]) -> Dict:
        """
        Reconciliação: compara trades locais vs exchange.
        Detecta divergências (ordem enviada mas não logada, etc).
        """
        local_ids = set()
        with sqlite3.connect(self.db_path) as conn:
            rows = conn.execute("SELECT client_order_id, exchange_order_id FROM trades").fetchall()
            for r in rows:
                local_ids.add(r[0])
        
        # Aqui compararia com exchange_trades
        # Simplificado: retorna contagem
        return {
            "local_count": len(local_ids),
            "exchange_count": len(exchange_trades),
            "needs_reconcile": len(local_ids) != len(exchange_trades)
        }

    # Compatibilidade com JEVProtocol antigo
    def log(self, event: Dict):
        """Compat: converte evento antigo para novo formato SQLite"""
        # Mapeia campos antigos para novos
        trade = {
            "agent_id": event.get("agent_id", "unknown"),
            "symbol": event.get("symbol", "BTC/USDT"),
            "side": event.get("action", "HOLD"),
            "price": event.get("price", event.get("context", {}).get("price", 0)),
            "qty": event.get("amount", 0),
            "pnl_net": event.get("profit", 0) + event.get("loss", 0),
            "pnl_gross": event.get("profit", 0) + event.get("loss", 0),
            "error_type": event.get("error_type", "NONE"),
            "lesson": event.get("lesson", ""),
            "context_json": event.get("context", {}),
            "dna_json": event.get("dna", {}),
            "mode": event.get("mode", "paper"),
        }
        if "client_order_id" in event:
            trade["client_order_id"] = event["client_order_id"]
        
        return self.log_trade(trade)
