"""Indicadores técnicos (EMA, RSI de Wilder, ATR de Wilder, SMA).

Implementações puras em Python, sem dependências externas.
Entradas são listas de floats (preços de fechamento) ou de candles
(dicts com chaves o/h/l/c).
"""
from __future__ import annotations


def sma(values: list[float], period: int) -> list[float]:
    out: list[float] = []
    for i in range(len(values)):
        if i < period - 1:
            out.append(float("nan"))
        else:
            out.append(sum(values[i - period + 1 : i + 1]) / period)
    return out


def ema(values: list[float], period: int) -> list[float]:
    """EMA clássica com seed = SMA do primeiro período."""
    out: list[float] = []
    if not values:
        return out
    k = 2.0 / (period + 1)
    seed = sum(values[:period]) / period if len(values) >= period else values[0]
    prev = seed
    for i, v in enumerate(values):
        if i < period - 1:
            out.append(float("nan"))
        elif i == period - 1:
            prev = seed
            out.append(prev)
        else:
            prev = v * k + prev * (1 - k)
            out.append(prev)
    return out


def rsi(closes: list[float], period: int = 14) -> list[float]:
    """RSI de Wilder. Retorna NaN nos primeiros `period` valores."""
    out: list[float] = [float("nan")] * len(closes)
    if len(closes) <= period:
        return out
    gains, losses = [], []
    for i in range(1, len(closes)):
        d = closes[i] - closes[i - 1]
        gains.append(max(d, 0.0))
        losses.append(max(-d, 0.0))
    avg_gain = sum(gains[:period]) / period
    avg_loss = sum(losses[:period]) / period
    out[period] = _rsi_value(avg_gain, avg_loss)
    for i in range(period + 1, len(closes)):
        g, l = gains[i - 1], losses[i - 1]
        avg_gain = (avg_gain * (period - 1) + g) / period
        avg_loss = (avg_loss * (period - 1) + l) / period
        out[i] = _rsi_value(avg_gain, avg_loss)
    return out


def _rsi_value(avg_gain: float, avg_loss: float) -> float:
    if avg_loss == 0:
        return 100.0
    rs = avg_gain / avg_loss
    return 100.0 - 100.0 / (1.0 + rs)


def atr(candles: list[dict], period: int = 14) -> list[float]:
    """ATR de Wilder sobre candles [{o,h,l,c}]."""
    out: list[float] = [float("nan")] * len(candles)
    if len(candles) <= period:
        return out
    trs: list[float] = []
    for i in range(1, len(candles)):
        c = candles[i]
        prev_close = candles[i - 1]["c"]
        tr = max(c["h"] - c["l"], abs(c["h"] - prev_close), abs(c["l"] - prev_close))
        trs.append(tr)
    avg = sum(trs[:period]) / period
    out[period] = avg
    for i in range(period + 1, len(candles)):
        avg = (avg * (period - 1) + trs[i - 1]) / period
        out[i] = avg
    return out


def compute_all(candles: list[dict]) -> dict:
    """Retorna {price, ema200, rsi14, atr14} do último candle, ou None."""
    if len(candles) < 210:
        return None
    closes = [c["c"] for c in candles]
    e = ema(closes, 200)
    r = rsi(closes, 14)
    a = atr(candles, 14)
    return {
        "price": closes[-1],
        "ema200": e[-1],
        "rsi14": r[-1],
        "atr14": a[-1],
    }
