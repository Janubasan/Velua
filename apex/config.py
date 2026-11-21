"""Configuração do APEXQUANT-OS V2.

Tudo pode ser ajustado por variáveis de ambiente (APEX_*) ou editando aqui.
Valores padrão fiéis ao artefato original: equity US$ 500, risco US$ 2,50/trade
(0,5%), SL 1,5× ATR, TP 3× ATR (R:R 2,0), limite diário −US$ 10 (−2%),
hard stop −US$ 25 (−5%).
"""
from __future__ import annotations

import os

# --- Conta / risco -------------------------------------------------------
EQUITY_START = float(os.getenv("APEX_EQUITY", "500"))
RISK_PER_TRADE = float(os.getenv("APEX_RISK", "2.50"))          # US$ por operação
MAX_POSITIONS = int(os.getenv("APEX_MAX_POSITIONS", "3"))       # operações simultâneas
DAILY_LOSS_LIMIT = float(os.getenv("APEX_DAILY_LOSS", "10"))    # −US$ 10/dia
HARD_LOSS_LIMIT = float(os.getenv("APEX_HARD_LOSS", "25"))      # −US$ 25 (kill-switch)
SL_ATR_MULT = float(os.getenv("APEX_SL_ATR", "1.5"))
TP_ATR_MULT = float(os.getenv("APEX_TP_ATR", "3.0"))
FEE_RATE = 0.001  # 0,1% por lado (entrada + saída), como no artefato

# --- Mercado -------------------------------------------------------------
# Símbolos operados (Binance, sem chave de API — endpoints públicos).
SYMBOLS = os.getenv("APEX_SYMBOLS", "BTCUSDT,ETHUSDT,SOLUSDT").split(",")
PRIMARY_SYMBOL = SYMBOLS[0]
INTERVAL = os.getenv("APEX_INTERVAL", "1h")
CANDLE_LIMIT = 500
CANDLE_REFRESH_SEC = int(os.getenv("APEX_CANDLE_REFRESH", "30"))
TICK_SEC = int(os.getenv("APEX_TICK", "2"))

# --- Modo de dados -------------------------------------------------------
# auto  -> tenta fontes reais (Binance/Frankfurter/Stooq); se inalcançáveis,
#          cai para o simulador local e avisa claramente na tela.
# real  -> só fontes reais (sem fallback).
# sim   -> simulador local (útil para testar sem internet).
DATA_MODE = os.getenv("APEX_DATA_MODE", "auto").lower()

STORE_PATH = os.getenv("APEX_STORE", "data/store.json")
PORT = int(os.getenv("APEX_PORT", "8000"))
HOST = os.getenv("APEX_HOST", "0.0.0.0")
