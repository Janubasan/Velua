# JEV Real — Versão Corrigida | 19 Falhas Corrigidas

Reescrita do "Protocolo.JEV + Web 4.0" para funcionar com mercado real.

## O que estava quebrado no código original

### Quebra na hora de rodar
1. **web4_automation.py chama random.uniform() sem import random** → `NameError` no primeiro trade.
   - **Fix**: `import random` + `import uuid`, `threading` no topo. Agora em `core/web4_automation.py` corrigido.

2. **calculate_rsi() e JEV_ABI citados mas nunca existem**
   - **Fix**: `calculate_rsi()` implementado puro Python em `core/market.py` (sem TA-Lib). JEV_ABI removido, substituído por SQLite real.

3. **get_learnings_for_agent filtra df['loss'] < 0 → KeyError enquanto nenhum trade negativo**
   - **Fix**: Usa `.get("loss", 0)` e list comprehension, não pandas filter que quebra. Em `jev_sqlite.py` usa `pnl_net < 0` com SQL seguro.

4. **agent_id é uuid novo a cada restart → .jev nunca casa com agente. Memória zero.**
   - **Fix**: IDs determinísticos `agent_00`..`agent_11` em `EvolutionEngine`, persistidos em SQLite `agents` table. Counter `_next_id` para novos agentes.

### Erro conceitual central
5. **Fitness vinha de simulate_trade → random.uniform(-5,10). Evolução selecionava sortudos. Com 12 agentes num random walk sempre existe um "top agent" — estatística, não aprendizado.**
   - **Fix**: `research.py` faz backtest com taxa, slippage e fill pessimista. Fitness = PnL líquido real - drawdown penalty. Evolução offline + walk-forward validação fora da amostra. Se <3 folds passarem, não há edge → pare.

6. **jev_context é passado para agent.decide() e ignorado dentro da função. As "lições" nunca influenciam decisão.**
   - **Fix**: Em `trading_agent.py`, `jev_context.lower()` é analisado para `avoid_buy` / `avoid_sell`. JEV bloqueia trades que repetem erro. Em `jev_sqlite.py`, `get_learnings_for_agent()` retorna lições com RSI e PnL que realmente filtram.

### Quebra com dinheiro real
7. **Modo demo chama mesma linha do modo real — set_sandbox_mode(True) comentado. Demo mandava ordem de verdade.**
   - **Fix**: Modos separados `paper` (default, seguro, sem ordem), `testnet` (usa `set_sandbox_mode(True)` corretamente), `live` (exige `LIVE_CONFIRM=eu-aceito-perder-este-capital` + `API_TOKEN`). Em `api/main.py`.

8. **amount = balance * risk_per_trade é USD, mas create_market_order espera quantidade em BTC. Ordem errada por ~60.000x.**
   - **Fix**: `qty = notional / price`, `notional = qty * price`. Em `core/position.py` `calculate_position_size()` e `api/main.py` `execute_trade()`.

9. **Trade de $1 é rejeitado: notional mínimo Binance spot ~$5-10.**
   - **Fix**: `RiskManagerV2` com `min_notional_usd=5.0` como gate. Retorna erro explicativo com matemática. Em `position.py` verifica `if notional < 5: can_trade=False`.

10. **stop_loss e take_profit existem no DNA e nunca são usados. Não há posição, não há saída. Agente "vende" sem ter comprado.**
    - **Fix**: `PositionManager` com `open_position()`, `check_exit()` que verifica low/high intra-candle para stop/target por ATR. `stop_atr_mult` e `take_atr_mult` no DNA. Posição real com `position_id`, `client_order_id`.

11. **POST /api/start sem auth e allow_origins=["*"], disparando ordem de mercado. Qualquer um que alcance porta 8000 opera sua conta.**
    - **Fix**: CORS restrito `CORS_ORIGINS=http://localhost:3000,...` (não "*"). Bearer token `API_TOKEN` obrigatório em testnet/live via `HTTPBearer`. Em `api/main.py` `verify_token()`.

12. **Chamar /api/start duas vezes cria dois loops concorrentes no mesmo par.**
    - **Fix**: `threading.Lock` + `is_running` check em `AppState`. Se já rodando, retorna `already running` sem criar novo task. Em `api/main.py` e `web4_automation.py`.

13. **Loop de 5s num timeframe de 15m → 180 sinais idênticos por candle.**
    - **Fix**: Loop por timeframe: `loop_interval = {"1m":60, "15m":900, "1h":3600}[timeframe]`. Default 60s, não 5s. `cooldown_sec` mínimo 20s, não 5s. Em `api/main.py` e `web4_automation.py`.

14. **Sem clientOrderId: qualquer retry duplica ordem.**
    - **Fix**: `generate_client_order_id()` = `f"{agent_id}-{timestamp}-{uuid}"`. SQLite `UNIQUE(client_order_id)` para idempotência. Em `jev_sqlite.py` `IntegrityError` → ignora duplicata. Em `api/main.py` passa `clientOrderId` para CCXT.

15. **ccxt é bloqueante e roda dentro de async → trava event loop.**
    - **Fix**: `await asyncio.to_thread(market.get_market_snapshot, symbol)` e `await asyncio.to_thread(exchange.create_market_order, ...)`. Em `api/main.py` `fetch_market_async()`.

16. **Mutação child[k] *= uniform(0.8,1.2) sem clamp: rsi_buy vira 97 e agente compra sempre; risk_per_trade cresce sem teto.**
    - **Fix**: Clamp após mutação: `rsi_buy 10-45`, `rsi_sell 55-90`, `risk_per_trade 0.002-0.05`, `stop_atr_mult 0.5-3.0`, `take_atr_mult 1.0-6.0`, `cooldown 20-300`. Garante `ema_fast < ema_slow` e `rsi_buy < rsi_sell`. Em `evolution/engine.py` e `trading_agent.py`.

17. **sum(trades) % 50 == 0 com 12 agentes incrementando juntos: gatilho evolução dispara por acaso ou nunca.**
    - **Fix**: Counter `last_evolution_count` e `total_trades - last_evolution_count >= evolution_interval`. Não `sum%50`. Em `api/main.py` e `web4_automation.py`.

### Parte que não serve pra nada
18. **MetaMask/Arbitrum/JEVJournal.sol: ordem em Binance é off-chain. Logar on-chain resultado que você mesmo calcula e envia não torna nada auditável — você controla input. "Impossível falsificar" é falso, e cada log custa gas.**
    - **Fix**: On-chain marcado como **opcional e não-auditável** por padrão `OFF`. Documentado em `api/main.py` e `README.md`. SQLite local com reconciliação `reconcile()` é auditável de verdade (compara local vs exchange). Contrato mantido em `contracts/` mas com aviso.

### Matemática do capital
19. **$100 com 1% risco = $1/trade. Com 0.1% taxa por lado + spread + slippage, custo por round-trip come maior parte do alvo. Sistema negativo por construção.**
    - **Fix**: `RiskManagerV2.explain_math()` explica: risco $1, notional $5-10, custo $0.03-0.06 por trade = 15-30% do alvo $0.20. Recomendado equity >= $1000 ou paper mode. Default `EQUITY_USD=1000`, não 100. Paper default, live exige confirmação explícita.

## O que mudou

| Original | Aqui (JEV Real) |
|----------|-----------------|
| Fitness de random | Backtest com taxa, slippage, fill pessimista em `research.py` |
| Evoluir com capital real | Evolução offline + validação walk-forward fora da amostra |
| .jev JSONL append | SQLite com `client_order_id` único (idempotência, reconciliação) |
| Demo = real | paper / testnet / live separados, live exige confirmação explícita |
| Risco em comentário | RiskManager como gate: perda diária, drawdown, trades/dia, kill switch |
| Sem posição | Posição real com stop/alvo por ATR, sizing pelo risco |
| API aberta | Bearer token nos endpoints de dinheiro, CORS restrito |

## Como rodar (corrigido)

```bash
pip install fastapi uvicorn ccxt pandas numpy

# 1. Pesquisa — antes de qualquer capital
python research.py --symbol BTC/USDT --timeframe 1h --candles 6000
# se menos de 3 folds passarem: não há edge. Pare aqui.

# 2. Paper com preços reais (default, seguro)
uvicorn api.main:app --port 8000
# ou
MODE=paper EQUITY_USD=1000 uvicorn api.main:app --port 8000

# 3. Testnet (ordens reais em testnet, não mainnet)
MODE=testnet EXCHANGE_API_KEY=... EXCHANGE_API_SECRET=... API_TOKEN=$(openssl rand -hex 32) uvicorn api.main:app

# 4. Real — só depois de 30+ dias de paper coerente com backtest
MODE=live LIVE_CONFIRM=eu-aceito-perder-este-capital API_TOKEN=$(openssl rand -hex 32) EQUITY_USD=1000 uvicorn api.main:app --port 8000

# Frontend
cd frontend && npm install && npm run dev
# Backend deve estar em paper por padrão, seguro
```

## Testes

```bash
# Backtest offline (sem internet, usa sintético volátil)
python research.py --candles 1000 --folds 3
# Deve gerar ~20-30 trades, mostrar PF, WR, DD, e dizer se há edge

# API segura
curl http://localhost:8000/health
curl http://localhost:8000/ | jq .fixes  # lista 11 correções
# Endpoints de dinheiro exigem token em testnet/live:
curl -X POST http://localhost:8000/api/start -H "Authorization: Bearer $API_TOKEN"

# Testa idempotência
curl -X POST http://localhost:8000/trade/execute -H "Authorization: Bearer $API_TOKEN" -d '{"agent_id":"agent_00","side":"BUY","notional_usd":10,"client_order_id":"test-123"}'
curl -X POST ... mesma client_order_id → não duplica (SQLite UNIQUE)
```

## Arquitetura Corrigida

```
Velua/
├── research.py              # Backtest realista + walk-forward (fix #5)
├── api/
│   └── main.py              # API segura: Bearer, CORS restrito, paper/testnet/live, lock, to_thread, clientOrderId (fix #7, #11, #12, #14, #15)
├── core/
│   ├── jev_sqlite.py        # SQLite UNIQUE client_order_id, idempotência, reconciliação (fix #3, #4, #14)
│   ├── market.py            # calculate_rsi real + to_thread async (fix #2, #15)
│   ├── risk_v2.py           # Gate real: daily loss, DD, trades/dia, kill switch, math $100 (fix #9, #19)
│   ├── position.py          # Posição real stop/target ATR, sizing risco (fix #8, #10)
│   └── web4_automation.py   # Corrigido: import random, lock, loop por TF, clientOrderId, clamp (fix #1, #12, #13, #14, #16, #17)
├── agents/
│   └── trading_agent.py     # IDs persistentes agent_00.., clamp, usa JEV, qty correto (fix #4, #6, #8, #16)
├── evolution/
│   └── engine.py            # IDs persistentes, clamp, counter evolução (fix #4, #16, #17)
├── backend/
│   └── main.py              # Wrapper para api.main (seguro)
├── frontend/                # Mostra math warning + risk gate
└── contracts/
    └── JEVJournal.sol       # Opcional, documentado como não-auditável (fix #18)
```
