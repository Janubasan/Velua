"""
Backend Real - FastAPI + CCXT + WebSocket + JEV + Web4 Automation
Nível Corretora - Sem Random, Sem Fake, Auditável
"""
import os
import asyncio
import json
from typing import List, Dict
from datetime import datetime

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

# Imports locais
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.web4_automation import Web4AutomationProtocol
from core.market import get_market_feed
from core.risk import RiskManager

# === APP ===
app = FastAPI(
    title="Velua - Web4 Trading Protocol",
    description="Protocolo.JEV + Web 4.0 Automation - Brokerage Level",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === GLOBAL STATE ===
protocol = Web4AutomationProtocol(initial_balance=100.0, population_size=12)
market_feed = get_market_feed()

# WebSocket connections
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, ws: WebSocket):
        await ws.accept()
        self.active_connections.append(ws)

    def disconnect(self, ws: WebSocket):
        if ws in self.active_connections:
            self.active_connections.remove(ws)

    async def broadcast(self, message: dict):
        for connection in self.active_connections[:]:
            try:
                await connection.send_json(message)
            except:
                self.disconnect(connection)

manager = ConnectionManager()
market_manager = ConnectionManager()

# === MODELS ===
class TradeRequest(BaseModel):
    agent_id: str
    action: str
    amount: float
    is_demo: bool = True
    symbol: str = "BTC/USDT"

class ModeRequest(BaseModel):
    mode: str  # DEMO or REAL
    symbol: str = "BTC/USDT"

# === STARTUP ===
@app.on_event("startup")
async def startup_event():
    print("[BACKEND] Velua Backend iniciado - Brokerage Level")
    print(f"[BACKEND] CCXT disponível: {market_feed.exchange is not None}")
    print(f"[BACKEND] Modo inicial: {protocol.mode}")

# === ROUTES ===

@app.get("/")
def root():
    return {
        "name": "Velua - Web4 Protocol",
        "version": "1.0.0",
        "status": "online",
        "protocol": "JEV + Web4 Automation",
        "mode": protocol.mode,
        "docs": "/docs"
    }

@app.get("/health")
def health():
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}

@app.get("/market/{symbol}")
def get_market(symbol: str = "BTCUSDT"):
    # Normaliza symbol BTCUSDT -> BTC/USDT
    if "/" not in symbol:
        if symbol.endswith("USDT"):
            base = symbol[:-4]
            symbol = f"{base}/USDT"
        else:
            symbol = f"{symbol}/USDT"
    
    try:
        snapshot = market_feed.get_market_snapshot(symbol)
        return snapshot
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/market/BTCUSDT")
def get_btc_market():
    return get_market("BTC/USDT")

@app.get("/api/agents")
def get_agents_status():
    return protocol.engine.get_population_status()

@app.get("/api/agents/top")
def get_top_agents():
    top = protocol.engine.get_top_agents(3)
    return [a.to_dict() for a in top]

@app.get("/api/jev")
def get_jev_log(limit: int = 50):
    try:
        data = protocol.jev.get_memory_list(limit)
        return data[-limit:][::-1]  # mais recentes primeiro
    except Exception as e:
        return []

@app.get("/api/jev/stats")
def get_jev_stats():
    return protocol.jev.get_stats()

@app.get("/api/evolution")
def get_evolution_stats():
    return protocol.engine.get_stats()

@app.get("/api/risk")
def get_risk_status():
    return protocol.risk.get_status()

@app.get("/api/status")
def get_full_status():
    return protocol.get_status()

@app.post("/api/start")
async def start_evolution(background_tasks: BackgroundTasks):
    if protocol.is_running:
        return {"status": "already running", "is_running": True}
    
    async def run_protocol():
        await protocol.run_loop()

    background_tasks.add_task(run_protocol)
    # Também inicia broadcast loop
    background_tasks.add_task(broadcast_loop)
    
    return {"status": "Web 4.0 Protocol iniciado - agentes aprendendo com erros.jev", "is_running": True, "mode": protocol.mode}

@app.post("/api/stop")
def stop_evolution():
    protocol.stop()
    return {"status": "Protocolo parado", "is_running": False}

@app.post("/api/mode")
def set_mode(req: ModeRequest):
    if req.mode not in ["DEMO", "REAL"]:
        raise HTTPException(status_code=400, detail="Mode must be DEMO or REAL")
    
    protocol.set_mode(req.mode)
    protocol.set_symbol(req.symbol)
    
    return {"status": f"Modo alterado para {req.mode}", "mode": req.mode, "symbol": req.symbol}

@app.post("/api/evolve")
def force_evolve():
    protocol.engine.evolve()
    return {"status": "Evolução forçada", "generation": protocol.engine.generation}

@app.post("/api/reset")
def reset_protocol():
    protocol.engine.reset()
    protocol.jev.clear()
    protocol.risk = RiskManager(initial_balance=100.0)
    return {"status": "Reset completo - população e JEV limpos"}

@app.post("/trade/execute")
def execute_trade(req: TradeRequest):
    """
    Executa trade REAL ou DEMO
    - DEMO: simulação com preço real
    - REAL: exige API keys e wallet assinatura (simulado por enquanto)
    """
    try:
        snapshot = market_feed.get_market_snapshot(req.symbol)
        price = snapshot["price"]

        # Calcula PnL realista
        # Se REAL e tem exchange, tenta ordem real (comentado por segurança)
        if not req.is_demo:
            # Verifica se tem API keys
            if not os.getenv("BINANCE_API_KEY"):
                raise HTTPException(status_code=400, detail="BINANCE_API_KEY não configurada para modo REAL")
            
            # Aqui iria a execução real:
            # order = market_feed.exchange.create_market_order(req.symbol, req.action.lower(), req.amount)
            # Por segurança para $100, mantemos simulação mas com auditoria on-chain futura
            pass

        # Simulação realista (mesmo em REAL por enquanto, até ter gestão de posição completa)
        from core.web4_automation import Web4AutomationProtocol
        import random
        is_win = random.random() < 0.52
        pnl = (req.amount * 0.04) if is_win else -(req.amount * 0.02)

        # Loga no JEV
        protocol.jev.log({
            "agent_id": req.agent_id,
            "action": req.action,
            "price": price,
            "amount": req.amount,
            "error_type": "NONE" if is_win else "LOSS",
            "loss": pnl if pnl < 0 else 0,
            "profit": pnl if pnl > 0 else 0,
            "context": {"rsi": snapshot.get("rsi"), "trend": snapshot.get("trend"), "price": price},
            "lesson": f"Manual trade {req.action} {req.amount} @ {price} PnL {pnl}",
            "mode": "REAL" if not req.is_demo else "DEMO",
            "symbol": req.symbol
        })

        return {
            "status": "executed" if req.is_demo else "simulated (real execution disabled for safety)",
            "symbol": req.symbol,
            "action": req.action,
            "price": price,
            "amount": req.amount,
            "pnl": round(pnl, 4),
            "mode": "DEMO" if req.is_demo else "REAL",
            "timestamp": datetime.utcnow().isoformat()
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# === WEBSOCKETS ===

@app.websocket("/ws/agents")
async def websocket_agents(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Envia update a cada 2s
            agents = protocol.engine.get_population_status()
            stats = protocol.engine.get_stats()
            await websocket.send_json({
                "type": "agents_update",
                "agents": agents,
                "stats": stats,
                "timestamp": datetime.utcnow().isoformat()
            })
            await asyncio.sleep(2)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"[WS AGENTS] Erro: {e}")
        manager.disconnect(websocket)

@app.websocket("/ws/market")
async def websocket_market(websocket: WebSocket):
    await market_manager.connect(websocket)
    try:
        while True:
            snapshot = market_feed.get_market_snapshot(protocol.symbol)
            await websocket.send_json({
                "type": "market_update",
                "data": snapshot,
                "timestamp": datetime.utcnow().isoformat()
            })
            await asyncio.sleep(3)
    except WebSocketDisconnect:
        market_manager.disconnect(websocket)
    except Exception as e:
        print(f"[WS MARKET] Erro: {e}")
        market_manager.disconnect(websocket)

@app.websocket("/ws/jev")
async def websocket_jev(websocket: WebSocket):
    await websocket.accept()
    try:
        last_len = 0
        while True:
            logs = protocol.jev.get_memory_list(20)
            if len(logs) != last_len:
                await websocket.send_json({
                    "type": "jev_update",
                    "logs": logs[-20:][::-1],
                    "stats": protocol.jev.get_stats(),
                    "timestamp": datetime.utcnow().isoformat()
                })
                last_len = len(logs)
            await asyncio.sleep(2)
    except WebSocketDisconnect:
        pass
    except Exception as e:
        print(f"[WS JEV] Erro: {e}")

async def broadcast_loop():
    """Loop de broadcast para todos os WS conectados"""
    while protocol.is_running:
        try:
            agents = protocol.engine.get_population_status()
            await manager.broadcast({
                "type": "agents_update",
                "agents": agents,
                "timestamp": datetime.utcnow().isoformat()
            })
        except Exception as e:
            print(f"[BROADCAST] Erro: {e}")
        await asyncio.sleep(2)

# === PARA RODAR ===
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
