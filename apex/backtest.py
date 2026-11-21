"""Backtest da estratégia EMA200 + RSI14 + ATR14 sobre candles reais.

Replica exatamente a lógica do motor (entrada no sinal, SL 1,5× ATR,
TP 3× ATR, risco US$ 2,50, taxas de 0,1% por lado) para medir o
desempenho histórico antes de operar.
"""
from __future__ import annotations

import time

from . import config
from .indicators import atr, ema, rsi


def run_backtest(candles: list[dict], symbol: str = "") -> dict:
    if len(candles) < 100:
        raise RuntimeError("Candles insuficientes para o backtest (mín. 100).")
    closes = [c["c"] for c in candles]
    e200 = ema(closes, 200)
    r14 = rsi(closes, 14)
    a14 = atr(candles, 14)

    equity = config.EQUITY_START
    pos = None
    trades = wins = 0
    gross_win = gross_loss = 0.0

    for i in range(60, len(candles)):
        candle = candles[i]
        if pos is None:
            price, e, r, a = closes[i], e200[i], r14[i], a14[i]
            if e != e or r != r or a != a or a <= 0:
                continue
            if price > e and 50 <= r <= 65:
                sl = price - config.SL_ATR_MULT * a
                pos = {
                    "entry": price,
                    "sl": sl,
                    "tp": price + config.TP_ATR_MULT * a,
                    "size": config.RISK_PER_TRADE / (price - sl),
                }
                trades += 1
        else:
            exit_price = None
            if candle["l"] <= pos["sl"]:
                exit_price = pos["sl"]
            elif candle["h"] >= pos["tp"]:
                exit_price = pos["tp"]
            elif closes[i] < e200[i]:
                exit_price = closes[i]
            if exit_price is not None:
                pnl = (exit_price - pos["entry"]) * pos["size"]
                pnl -= pos["entry"] * pos["size"] * config.FEE_RATE
                pnl -= exit_price * pos["size"] * config.FEE_RATE
                equity += pnl
                if pnl > 0:
                    wins += 1
                    gross_win += pnl
                else:
                    gross_loss += abs(pnl)
                pos = None

    if pos is not None:
        pnl = (closes[-1] - pos["entry"]) * pos["size"]
        equity += pnl
        if pnl > 0:
            wins += 1
            gross_win += pnl
        else:
            gross_loss += abs(pnl)

    return {
        "symbol": symbol or config.PRIMARY_SYMBOL,
        "trades": trades,
        "wins": wins,
        "winRate": (wins / trades * 100) if trades else 0.0,
        "profitFactor": (gross_win / gross_loss) if gross_loss else 0.0,
        "pnl": equity - config.EQUITY_START,
        "equityEnd": equity,
        "candles": len(candles),
        "createdAt": time.strftime("%Y-%m-%dT%H:%M:%S"),
    }
