# Velua — APEXQUANT-OS V2

Paper-trading **real e rodando**: backend Python (biblioteca padrão, zero dependências)
que busca preços e candles reais, aplica a estratégia **EMA200 + RSI14 + ATR14**
e opera **múltiplas posições simultâneas** (BTC, ETH, SOL) com gestão de risco —
SL/TP por ATR, risco de US$ 2,50 por operação, limite diário de perda e kill-switch.

O artefato HTML "APEXQUANT-OS V2" foi reconstruído como sistema de verdade:
motor, persistência, API HTTP e dashboard ao vivo.

## Como rodar

```bash
python3 server.py     # http://localhost:8000
```

Abra no navegador — o dashboard atualiza a cada 3s via `/api/state`.

### Modos de dados (`APEX_DATA_MODE`)

| Modo   | Comportamento |
|--------|---------------|
| `auto` (padrão) | Tenta as fontes reais (Binance REST pública, Frankfurter, Stooq). Se estiverem inalcançáveis, cai para um **simulador local explícito** (banner azul na tela; nenhum preço simulado é apresentado como real). |
| `real` | Só fontes reais; falha visivelmente em vez de inventar preço. |
| `sim`  | Simulador local (movimento browniano geométrico), para testar sem internet. |

> Neste ambiente de desenvolvimento, a saída para `api.binance.com` está bloqueada
> (TLS/EOF), então o app roda em **modo SIMULAÇÃO**, sinalizado na interface.
> Na sua máquina (com acesso à Binance), o mesmo código usa dados reais sem mudar nada.

## O que faz

- **Múltiplas operações simultâneas** — até 3 posições (1 por símbolo), abertas
  manualmente (COMPRAR/VENDER) ou automaticamente pelo sinal.
- **Sinal ao vivo** — preço vs. EMA200 + faixa de RSI14 (45–65): COMPRAR / VENDER / AGUARDAR.
- **Risco** — SL = 1,5× ATR14, TP = 3× ATR14 (R:R 2,0), risco US$ 2,50/trade (0,5% de US$ 500),
  limite diário −US$ 10, kill-switch hard stop −US$ 25, taxas de 0,1% por lado.
- **Fechamento automático** no SL/TP a cada tick (2s) + "FECHAR TUDO" manual.
- **Backtest** da estratégia sobre os 500 candles de 1h (botão "Testar estratégia").
- **Registro de operações** persistido em `data/store.json`.
- **Meta Muse Bots** (Scanner → Filter → Analyzer → Executor → Risk → Logger) como pipeline real.

## API

| Rota | Descrição |
|------|-----------|
| `GET /api/state` | Estado completo: preços, indicadores, posições, risco, log |
| `GET /api/candles?symbol=BTCUSDT&limit=50` | Candles |
| `POST /api/order` | `{"symbol":"BTCUSDT","side":"BUY"\|"SELL"}` |
| `POST /api/close` | `{"id":"pos-…"}` fecha uma posição |
| `POST /api/close-all` | Fecha todas as posições abertas |
| `POST /api/auto` | `{"on":true}` liga/desliga o modo automático |
| `POST /api/backtest` | `{"symbol":"BTCUSDT"}` roda o backtest |
| `GET /api/backtests` | Histórico de backtests |

Configuração por variáveis de ambiente: `APEX_SYMBOLS`, `APEX_EQUITY`, `APEX_RISK`,
`APEX_MAX_POSITIONS`, `APEX_DAILY_LOSS`, `APEX_HARD_LOSS`, `APEX_DATA_MODE`, `APEX_PORT`…
(veja `apex/config.py`).

## Estrutura

```
server.py          # HTTP + API (sem dependências)
apex/              # motor: data, indicators, engine, backtest, store, config
web/index.html     # dashboard (atualiza via /api/state)
data/              # estado em runtime (ignorado pelo git)
```

⚠️ Paper-trading: **nenhuma ordem real é enviada a nenhuma corretora/exchange.**
