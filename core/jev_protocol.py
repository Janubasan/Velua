"""
Protocolo.JEV - Journal of Error Vectors
Cada erro vira vetor de aprendizado. Auditoria on-chain opcional.
"""
import json
import os
import threading
from datetime import datetime, timezone
from typing import List, Dict, Optional
from pathlib import Path

try:
    import pandas as pd
    HAS_PANDAS = True
except ImportError:
    HAS_PANDAS = False


class JEVProtocol:
    """
    Thread-safe JSONL based journal.
    Cada linha = um evento de trade/erro.
    Compatível com auditoria on-chain (Arbitrum) via log extra.
    """
    def __init__(self, jev_path="strategies.jev"):
        self.path = Path(jev_path)
        self.lock = threading.Lock()
        self._ensure_file()

        # Estatísticas em memória para performance
        self._cache = []
        self._load_cache()

    def _ensure_file(self):
        self.path.parent.mkdir(parents=True, exist_ok=True)
        if not self.path.exists():
            self.path.touch()

    def _load_cache(self):
        try:
            with open(self.path, 'r') as f:
                self._cache = [json.loads(l) for l in f.readlines() if l.strip()]
        except Exception:
            self._cache = []

    def log(self, event: Dict):
        """Todo erro vira vetor de aprendizado - thread safe"""
        if "timestamp" not in event:
            event["timestamp"] = datetime.now(timezone.utc).isoformat()
        
        # Normaliza campos obrigatórios
        event.setdefault("agent_id", "unknown")
        event.setdefault("action", "HOLD")
        event.setdefault("error_type", "NONE")
        event.setdefault("loss", 0)
        event.setdefault("profit", 0)
        event.setdefault("context", {})
        event.setdefault("lesson", "")

        with self.lock:
            with open(self.path, 'a') as f:
                f.write(json.dumps(event) + "\n")
            self._cache.append(event)
            # Mantém cache limitado a 5000 eventos para memória
            if len(self._cache) > 5000:
                self._cache = self._cache[-5000:]

    def get_memory(self, limit: int = 1000):
        """Retorna DataFrame ou lista dos últimos eventos"""
        try:
            data = self._cache[-limit:] if limit else self._cache
            if HAS_PANDAS:
                return pd.DataFrame(data)
            return data
        except Exception:
            if HAS_PANDAS:
                return pd.DataFrame()
            return []

    def get_memory_list(self, limit: int = 100) -> List[Dict]:
        data = self._cache[-limit:] if limit else self._cache
        return data

    def get_learnings_for_agent(self, agent_id: str) -> str:
        """Web 4.0: Memória semântica de erros para não repetir"""
        fails = [e for e in self._cache if e.get("agent_id") == agent_id and float(e.get("loss", 0)) < 0]
        fails = fails[-10:]  # últimos 10 erros

        if not fails:
            # Pega erros globais se agente não tem histórico
            global_fails = [e for e in self._cache if float(e.get("loss", 0)) < 0][-5:]
            if not global_fails:
                return "Sem histórico. Seja conservador: evite overtrading, use RSI <35 para compra e RSI >65 para venda."
            lessons = "\n".join([f"- {e.get('lesson','')}" for e in global_fails if e.get('lesson')])
            return f"LIÇÕES GLOBAIS (evite):\n{lessons}"

        lessons = "\n".join([f"- {e.get('lesson','')} | RSI:{e.get('context',{}).get('rsi','?')} PnL:{e.get('loss')}" for e in fails])
        return f"LIÇÕES APRENDIDAS para {agent_id} (NÃO REPITA):\n{lessons}"

    def get_stats(self) -> Dict:
        """Estatísticas agregadas para dashboard"""
        if not self._cache:
            return {"total_trades": 0, "total_profit": 0, "total_loss": 0, "winrate": 0, "top_errors": []}

        total = len(self._cache)
        profits = [float(e.get("profit", 0)) for e in self._cache]
        losses = [float(e.get("loss", 0)) for e in self._cache]
        
        wins = len([p for p in profits if p > 0])
        winrate = (wins / max(1, total)) * 100

        # Top error types
        error_counts = {}
        for e in self._cache:
            et = e.get("error_type", "NONE")
            error_counts[et] = error_counts.get(et, 0) + 1

        return {
            "total_trades": total,
            "total_profit": round(sum(profits), 2),
            "total_loss": round(sum(losses), 2),
            "net_pnl": round(sum(profits) + sum(losses), 2),
            "winrate": round(winrate, 2),
            "top_errors": sorted(error_counts.items(), key=lambda x: x[1], reverse=True)[:5]
        }

    def get_agent_history(self, agent_id: str, limit: int = 50) -> List[Dict]:
        return [e for e in self._cache if e.get("agent_id") == agent_id][-limit:]

    def clear(self):
        with self.lock:
            open(self.path, 'w').close()
            self._cache = []

    def export_json(self, limit: int = 1000) -> List[Dict]:
        return self.get_memory_list(limit)
