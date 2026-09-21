"""
Backend Real - FastAPI + CCXT + WebSocket + JEV + Web4 Automation
Nível Corretora - Sem Random, Sem Fake, Auditável

JEV Real - Versão Corrigida (19 falhas corrigidas):
- Import random fix
- calculate_rsi implementado
- get_learnings_for_agent sem KeyError
- agent_id persistente (agent_00..agent_11) não uuid por restart
- Fitness de backtest com taxa/slippage, não random
- jev_context realmente usado
- Demo ≠ Real: paper/testnet/live separados
- amount USD vs BTC qty corrigido
- Min notional $5 check
- Position real com stop/target ATR
- API com Bearer token, CORS restrito
- Lock anti-duplo-start
- Loop por timeframe, não 5s fixo em 15m
- clientOrderId único (idempotência)
- ccxt em thread (não bloqueia loop)
- Mutação com clamp
- Evolução por counter, não sum%50
- On-chain opcional, documentado como não-auditável
- Matemática $100 explicada

Para compatibilidade, este arquivo re-exporta app seguro de api.main
Use: uvicorn api.main:app --port 8000 (recomendado) ou uvicorn backend.main:app
"""
import os
import sys
from pathlib import Path

# Adiciona raiz ao path
sys.path.append(str(Path(__file__).parent.parent))

# Tenta importar versão corrigida segura
try:
    from api.main import app, state as protocol_state
    print("[BACKEND] Usando api.main (JEV Real Corrigido) - Seguro, com Bearer token, SQLite, Risk gate")
    # Re-exporta para compatibilidade com código antigo que importa protocol
    protocol = protocol_state
    market_feed = protocol_state.market
except ImportError as e:
    print(f"[BACKEND] Fallback para implementação legada (api.main não encontrado): {e}")
    # Fallback legado (mantido para compatibilidade, mas com avisos)
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware
    
    app = FastAPI(title="Velua Legacy - Use api.main:app para versão corrigida")
    app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3000"], allow_methods=["*"], allow_headers=["*"])
    
    @app.get("/")
    def root():
        return {
            "warning": "Você está usando backend/main.py legado. Use api.main:app para versão corrigida com 19 falhas corrigidas",
            "fix": "uvicorn api.main:app --port 8000",
            "research": "python research.py --symbol BTC/USDT --timeframe 1h --candles 6000"
        }

# Para rodar direto
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    # Recomenda api.main
    print(f"[BACKEND] Iniciando em porta {port} - Modo: {os.getenv('MODE', 'paper')}")
    print(f"[BACKEND] Para versão corrigida: uvicorn api.main:app --host 0.0.0.0 --port {port}")
    uvicorn.run("api.main:app", host="0.0.0.0", port=port)

