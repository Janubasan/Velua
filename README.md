# Velua - Web4 Trading Protocol | Brokerage Level

**Protocolo.JEV + Web 4.0 Automation - Sistema evolutivo de verdade, não só bot de trade.**

> `.JEV` = Journal of Error Vectors - cada erro do agente vira dado de treino.  
> Web 4.0 Automation = agentes autônomos, descentralizados e semânticos que se auto-substituem.

![Brokerage Dashboard](https://img.shields.io/badge/Level-Brokerage-00ff88?style=for-the-badge)
![Real Market](https://img.shields.io/badge/Market-Binance%20Real-ff9900?style=for-the-badge)
![On-Chain](https://img.shields.io/badge/Audit-Arbitrum-8b5cf6?style=for-the-badge)

---

## 🏗️ Arquitetura

```
Velua/
├── core/
│   ├── jev_protocol.py       # Lê/escreve .jev e transforma erro em aprendizado
│   ├── web4_automation.py    # Protocolo Web 4.0 - autônomo, descentralizado, semântico
│   ├── market.py             # Feed REAL via CCXT Binance (sem random)
│   └── risk.py               # Risk management $100: 1% risco, SL 2%, TP 4%
├── agents/
│   └── trading_agent.py      # Agente trader com DNA evolutivo
├── evolution/
│   └── engine.py             # Mata os ruins, clona e muta os bons
├── backend/
│   ├── main.py               # FastAPI + WebSocket + CCXT real
│   └── requirements.txt
├── api/
│   └── integration.py        # Wrapper compatível
├── contracts/
│   └── JEVJournal.sol        # Auditoria on-chain Arbitrum
├── frontend/
│   ├── app/
│   │   ├── page.tsx          # Dashboard brokerage level
│   │   └── components/
│   │       ├── EvolutionPanel.tsx
│   │       ├── TradingViewChart.tsx
│   │       ├── WalletConnect.tsx
│   │       └── JEVLog.tsx
│   └── hooks/useWallet.ts    # MetaMask + WalletConnect v2
├── strategies.jev            # JSONL - onde a mágica acontece
└── docker-compose.yml
```

---

## 📓 O Arquivo `.jev` - Onde a mágica acontece

JSONL, cada linha um erro/aprendizado auditável on-chain:

```json
{"timestamp": "2026-09-21T15:00:00Z", "agent_id": "agent_03", "action": "BUY BTC", "error_type": "STOP_LOSS_HIT", "loss": -2.3, "context": {"rsi": 78, "trend": "down"}, "lesson": "evitar compra em sobrecompra em downtrend"}
```

Filho nunca repete erro do pai. Cada erro vira vetor de treino.

---

## 🚀 Quick Start

### 1. Backend Real (sem random)

```bash
pip install -r backend/requirements.txt

# Sem API keys = modo público (preço real Binance, sem trade real)
# Com API keys = trade real spot
cp backend/.env.example backend/.env
# Edite BINANCE_API_KEY e BINANCE_SECRET

uvicorn backend.main:app --reload --port 8000 --host 0.0.0.0
# Docs: http://localhost:8000/docs
```

### 2. Frontend Brokerage

```bash
cd frontend
npm install
npm run dev
# http://localhost:3000
# Preview E2B: https://3000-xxx.e2b.app
```

### 3. Docker 24/7

```bash
docker-compose up -d
# Backend: :8000
# Frontend: :3000
```

---

## 💼 Gestão de Risco REAL para $100

- **Cada agente arrisca 1% = $1 por trade**
- **Stop Loss 2% e Take Profit 4% (Risk/Reward 1:2)**
- **Máximo 3 trades simultâneos = exposição máxima $3**
- **Se drawdown 10% ($10), pausa e evolui forçado**
- **Cooldown 5 perdas consecutivas = 60s**

### DEMO vs REAL

- **DEMO**: Binance Testnet (mercado real, dinheiro fake) - toggle no dashboard
- **REAL**: Binance Spot real, API Key só SPOT sem saque, exige assinatura MetaMask

---

## 🔗 Endpoints

### Market Real
- `GET /market/BTCUSDT` - Preço real + RSI + EMA + ATR + OHLCV
- `GET /market/{symbol}` - Qualquer par
- `WS /ws/market` - Live market

### Agentes
- `GET /api/agents` - Lista população ordenada por fitness
- `GET /api/agents/top` - Top 3
- `POST /api/start` - Inicia protocolo Web4
- `POST /api/stop` - Pausa
- `POST /api/evolve` - Força evolução
- `WS /ws/agents` - Live agents

### JEV
- `GET /api/jev?limit=50` - Últimos logs
- `GET /api/jev/stats` - Estatísticas
- `WS /ws/jev` - Live logs

### Trading
- `POST /trade/execute` - Executa trade (DEMO ou REAL)
- `POST /api/mode` - Troca DEMO/REAL + symbol

---

## 🦊 Wallet - MetaMask Popup Real

```typescript
// hooks/useWallet.ts
const { connectMetaMask, switchToReal } = useBrokerageWallet()

// Abre popup real da MetaMask
await connectMetaMask()

// Troca para Arbitrum automaticamente para auditoria barata
// Exige personal_sign para modo REAL
await switchToReal()
```

---

## 📜 Contrato Auditoria - `JEVJournal.sol`

Todo trade vai pra blockchain Arbitrum. Impossível falsificar.

```solidity
contract JEVJournal {
  struct TradeLog { string agentId; string action; int256 pnl; string lesson; }
  function logTrade(agentId, action, amount, pnl, lesson) public
}
```

Deploy por $0.30 na Arbitrum. Todo log tem link Arbiscan.

---

## 🧬 Motor Evolutivo

```python
# evolution/engine.py
engine.evolve()
# 1. Rankeia por fitness = balance + winrate*200 - drawdown*500
# 2. Mata 40% piores
# 3. Crossover + mutação 20% dos top 3
# 4. Filho nunca repete erro do pai (JEV)
```

---

## 🖥️ VPS 24/7 $6/mês

```bash
# Contabo/Hetzner Ubuntu
pm2 start backend/main.py --name web4
pm2 startup
pm2 save

# Ou Docker
docker-compose up -d
```

---

## 🔧 Stack Definitiva (sem alucinação)

- **Frontend**: Next.js 14 + Wagmi + Viem + TradingView Lightweight Charts
- **Backend**: FastAPI + CCXT (Binance real) + WebSocket
- **Blockchain**: Ethers.js v6 + MetaMask SDK + WalletConnect v2
- **On-chain Audit**: JEVJournal.sol Arbitrum
- **Infra 24/7**: Docker + PM2 + VPS $6/mês

---

## 📊 Dashboard Features

- ✅ TradingView Chart com EMA 9/21, RSI, ATR - preço real Binance
- ✅ 12 agentes evolutivos com DNA visível (RSI buy/sell, risk, SL/TP)
- ✅ Fitness, balance, winrate, win/loss streak ao vivo via WebSocket
- ✅ JEV log ao vivo - cada erro com lição
- ✅ WalletConnect MetaMask + toggle DEMO/REAL $100
- ✅ Risk bar: drawdown, exposição, pausa automática
- ✅ On-chain audit preview

---

## 🚀 Próximos Passos

1. Configure `backend/.env` com Binance API (SPOT, sem saque)
2. Teste em DEMO $100
3. Deploy contrato `JEVJournal.sol` na Arbitrum
4. VPS + `docker-compose up -d` = 24/7

**Quer que eu já gere o .env completo + Dockerfile + script deploy 24/7 com contrato deployado?**

---

Built with 🧬 Protocolo.JEV + Web 4.0 Automation
