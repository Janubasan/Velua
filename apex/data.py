"""Fontes de dados de mercado.

Fontes REAIS (endpoints públicos, sem chave):
  - Binance REST: klines (candles) e ticker de preço — BTC/ETH/SOL USDT
  - Frankfurter: EUR/USD
  - Stooq: US100 (índice Nasdaq-100)

Se nenhuma fonte real responder (ex.: sandbox sem saída para a Binance),
o feed cai para um SIMULADOR local (movimento browniano geométrico) e o
modo fica claramente marcado como "SIMULAÇÃO" na interface — nenhum preço
simulado é apresentado como real.
"""
from __future__ import annotations

import json
import math
import random
import time
import urllib.request

from . import config

_TIMEOUT = 8
_UA = {"User-Agent": "APEXQUANT-OS/2.0 (paper-trading demo)"}


def _get_json(url: str):
    req = urllib.request.Request(url, headers=_UA)
    with urllib.request.urlopen(req, timeout=_TIMEOUT) as resp:
        return json.loads(resp.read().decode("utf-8"))


def _get_text(url: str) -> str:
    req = urllib.request.Request(url, headers=_UA)
    with urllib.request.urlopen(req, timeout=_TIMEOUT) as resp:
        return resp.read().decode("utf-8")


# ---------------------------------------------------------------------------
# Conectores reais
# ---------------------------------------------------------------------------
class BinanceFeed:
    """Candles + preço via Binance REST pública."""

    BASE = "https://data-api.binance.vision"

    def get_candles(self, symbol: str, interval: str, limit: int) -> list[dict]:
        url = (
            f"{self.BASE}/api/v3/klines?symbol={symbol}"
            f"&interval={interval}&limit={limit}"
        )
        raw = _get_json(url)
        candles = []
        for k in raw:
            candles.append(
                {
                    "t": int(k[0]),
                    "o": float(k[1]),
                    "h": float(k[2]),
                    "l": float(k[3]),
                    "c": float(k[4]),
                    "v": float(k[5]),
                }
            )
        return candles

    def get_price(self, symbol: str) -> float:
        data = _get_json(f"{self.BASE}/api/v3/ticker/price?symbol={symbol}")
        return float(data["price"])

    def get_24h_change(self, symbol: str) -> float:
        data = _get_json(f"{self.BASE}/api/v3/ticker/24hr?symbol={symbol}")
        return float(data["priceChangePercent"])


class FrankfurterFeed:
    def get_eurusd(self) -> float:
        data = _get_json("https://api.frankfurter.app/latest?from=USD&to=EUR")
        return float(data["rates"]["EUR"])


class StooqFeed:
    def get_us100(self) -> float:
        text = _get_text("https://stooq.com/q/l/?s=^ndx&f=sd2t2ohlcv&h&e=csv")
        lines = [ln for ln in text.strip().splitlines() if ln]
        # cabeçalho + linha de dados: Symbol,Date,Time,Open,High,Low,Close,Volume
        parts = lines[-1].split(",")
        return float(parts[6])


# ---------------------------------------------------------------------------
# Simulador local (fallback explícito — nunca se passa por dado real)
# ---------------------------------------------------------------------------
class SimulatorFeed:
    """Movimento browniano geométrico por símbolo, com candles de 1h.

    Serve apenas para demonstrar o motor rodando quando as fontes reais
    estão inalcançáveis. A interface exibe o selo SIMULAÇÃO.
    """

    SEEDS = {"BTCUSDT": 97000.0, "ETHUSDT": 3400.0, "SOLUSDT": 165.0}
    VOL = {"BTCUSDT": 0.012, "ETHUSDT": 0.016, "SOLUSDT": 0.022}

    def __init__(self, seed: int = 42):
        self._rng = random.Random(seed)
        self._price: dict[str, float] = dict(self.SEEDS)
        self._candles: dict[str, list[dict]] = {}
        for sym in self.SEEDS:
            self._candles[sym] = self._gen_history(sym, 500)

    TICK_VOL_DIVISOR = 45.0  # σ_tick ≈ σ_1h / √1800 (ticks de 2s em 1h)

    def _step(self, sym: str) -> float:
        vol = self.VOL.get(sym, 0.015) / self.TICK_VOL_DIVISOR
        shock = self._rng.gauss(0.0, vol)
        self._price[sym] *= math.exp(shock)
        return shock

    def _gen_history(self, sym: str, n: int) -> list[dict]:
        price = self.SEEDS[sym]
        now_ms = int(time.time() * 1000)
        hour_ms = 3_600_000
        vol = self.VOL.get(sym, 0.015)
        phase = self._rng.uniform(0, math.pi * 2)
        candles = []
        for i in range(n):
            o = price
            # regime senoidal lento (ciclo ~10 dias) + ruído: gera tendências
            # e reversões realistas, em vez de 500 horas de deriva única
            regime = 0.004 * math.sin(i / 38.0 + phase)
            shock = self._rng.gauss(regime, vol)
            c = o * math.exp(shock)
            h = max(o, c) * (1 + abs(self._rng.gauss(0, 0.004)))
            l = min(o, c) * (1 - abs(self._rng.gauss(0, 0.004)))
            candles.append(
                {
                    "t": now_ms - (n - i) * hour_ms,
                    "o": o,
                    "h": h,
                    "l": l,
                    "c": c,
                    "v": 1.0,
                }
            )
            price = c
        self._price[sym] = price
        return candles

    def tick(self, sym: str) -> float:
        """Avança o preço um passo e atualiza o candle atual."""
        self._step(sym)
        price = self._price[sym]
        candles = self._candles[sym]
        last = candles[-1]
        last["c"] = price
        last["h"] = max(last["h"], price)
        last["l"] = min(last["l"], price)
        return price

    def get_candles(self, symbol: str, interval: str, limit: int) -> list[dict]:
        return list(self._candles.get(symbol, []))[-limit:]

    def get_price(self, symbol: str) -> float:
        return self._price.get(symbol, 0.0)

    def get_24h_change(self, symbol: str) -> float:
        candles = self._candles.get(symbol) or []
        if len(candles) >= 24:
            ref = candles[-24]["c"]
        elif candles:
            ref = candles[0]["c"]
        else:
            return 0.0
        return (self._price[symbol] - ref) / ref * 100.0


# ---------------------------------------------------------------------------
# Fachada: tenta o real, cai para o simulador (modo auto)
# ---------------------------------------------------------------------------
class MarketData:
    def __init__(self):
        self.mode = "real"  # ou "simulacao"
        self.binance = BinanceFeed()
        self.frankfurter = FrankfurterFeed()
        self.stooq = StooqFeed()
        self.sim = SimulatorFeed()
        self._real_ok: bool | None = None

    def _check_real(self) -> bool:
        if config.DATA_MODE == "sim":
            self._real_ok = False
        elif self._real_ok is None:
            try:
                self.binance.get_price(config.PRIMARY_SYMBOL)
                self._real_ok = True
            except Exception:
                self._real_ok = False
                if config.DATA_MODE == "real":
                    raise
        self.mode = "real" if self._real_ok else "simulacao"
        return self._real_ok

    def use_real(self) -> bool:
        return self._check_real()

    def get_candles(self, symbol: str, interval: str, limit: int) -> list[dict]:
        if self._check_real():
            return self.binance.get_candles(symbol, interval, limit)
        return self.sim.get_candles(symbol, interval, limit)

    def get_price(self, symbol: str) -> float:
        if self._check_real():
            return self.binance.get_price(symbol)
        return self.sim.tick(symbol)

    def get_24h_change(self, symbol: str) -> float:
        if self._check_real():
            return self.binance.get_24h_change(symbol)
        return self.sim.get_24h_change(symbol)

    def get_eurusd(self) -> float | None:
        if not self._check_real():
            return None
        try:
            return self.frankfurter.get_eurusd()
        except Exception:
            return None

    def get_us100(self) -> float | None:
        if not self._check_real():
            return None
        try:
            return self.stooq.get_us100()
        except Exception:
            return None
