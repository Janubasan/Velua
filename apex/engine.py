"""Motor de paper-trading com MÚLTIPLAS operações simultâneas.

Pipeline (os "Meta Muse Bots" do artefato, agora reais):
  Scanner  -> busca candles/preços das fontes
  Filter   -> indicadores (EMA200, RSI14, ATR14) válidos?
  Analyzer -> sinal COMPRAR / VENDER / AGUARDAR
  Executor -> abre posições (manual ou automático)
  Risk     -> limites: máx. posições, perda diária, kill-switch
  Logger   -> registra cada operação no histórico

Cada posição tem entry/SL/TP/size calculados do ATR no momento da abertura
(SL = 1,5× ATR, TP = 3× ATR, risco US$ 2,50). O motor marca a mercado a
cada tick e fecha automaticamente no SL/TP.
"""
from __future__ import annotations

import threading
import time
import uuid

from . import config
from .data import MarketData
from .indicators import compute_all
from .store import Store


def signal_of(ind: dict | None) -> str:
    if not ind:
        return "AGUARDAR"
    price, ema, rsi = ind["price"], ind["ema200"], ind["rsi14"]
    if price > ema and 45 <= rsi <= 65:
        return "COMPRAR"
    if price < ema and 35 <= rsi <= 65:
        return "VENDER"
    return "AGUARDAR"


class Engine:
    def __init__(self, store: Store | None = None):
        self.store = store or Store(config.STORE_PATH)
        self.data = MarketData()
        self._lock = threading.Lock()
        self._stop = threading.Event()
        self._candles: dict[str, list[dict]] = {}
        self._indicators: dict[str, dict | None] = {}
        self._prices: dict[str, float] = {}
        self._changes: dict[str, float] = {}
        self._eurusd: float | None = None
        self._us100: float | None = None
        self._last_candle_refresh = 0.0
        self._attempts = 0
        self._last_attempt: str | None = None
        self._killed = False  # kill-switch de perda diária
        self._daily_warned = False
        self._thread: threading.Thread | None = None

    # ------------------------------------------------------------------
    # ciclo de vida
    # ------------------------------------------------------------------
    def start(self) -> None:
        self._thread = threading.Thread(target=self._loop, daemon=True, name="apex-engine")
        self._thread.start()

    def stop(self) -> None:
        self._stop.set()

    def _loop(self) -> None:
        while not self._stop.is_set():
            try:
                self._tick()
            except Exception as exc:  # nunca derruba o motor
                self.store.log("erro", f"Falha no tick: {exc}")
            self._stop.wait(config.TICK_SEC)

    def _tick(self) -> None:
        now = time.time()
        # 1) Scanner: preços a cada tick
        for sym in config.SYMBOLS:
            try:
                self._prices[sym] = self.data.get_price(sym)
                self._changes[sym] = self.data.get_24h_change(sym)
            except Exception:
                pass
        if now - self._last_candle_refresh >= config.CANDLE_REFRESH_SEC or not self._candles:
            self._refresh_candles(now)
            self._eurusd = self.data.get_eurusd()
            self._us100 = self.data.get_us100()
        # 2) Risk + Executor: SL/TP e sinais automáticos
        self._manage_positions()
        if self.store.get_auto() and not self._killed:
            self._auto_trade()

    def _refresh_candles(self, now: float) -> None:
        self._attempts += 1
        self._last_attempt = time.strftime("%H:%M:%S")
        for sym in config.SYMBOLS:
            try:
                candles = self.data.get_candles(sym, config.INTERVAL, config.CANDLE_LIMIT)
                if candles:
                    self._candles[sym] = candles
                    self._indicators[sym] = compute_all(candles)
            except Exception as exc:
                self.store.log("erro", f"Scanner: sem candles de {sym} ({exc})")
        self._last_candle_refresh = now

    # ------------------------------------------------------------------
    # posições
    # ------------------------------------------------------------------
    def _pnl(self, pos: dict, price: float) -> float:
        side = 1 if pos["side"] == "BUY" else -1
        gross = side * (price - pos["entry"]) * pos["size"]
        fees = pos["entry"] * pos["size"] * config.FEE_RATE + price * pos["size"] * config.FEE_RATE
        return gross - fees

    def open_position(self, symbol: str, side: str, manual: bool = False) -> dict:
        """Abre uma operação respeitando os limites de risco."""
        with self._lock:
            ind = self._indicators.get(symbol)
            price = self._prices.get(symbol) or (ind["price"] if ind else None)
            if not ind or price is None:
                raise RuntimeError("Aguardando preço real para operar.")
            opens = self.store.open_positions()
            if any(p["symbol"] == symbol for p in opens):
                raise RuntimeError(f"Já existe posição aberta em {symbol}.")
            if len(opens) >= config.MAX_POSITIONS:
                raise RuntimeError(f"Limite de {config.MAX_POSITIONS} posições simultâneas atingido.")
            if self._killed:
                raise RuntimeError("Kill-switch ativo: limite de perda diária atingido.")
            atr = ind["atr14"]
            if not atr or atr <= 0:
                raise RuntimeError("ATR indisponível no momento.")
            sl_dist = config.SL_ATR_MULT * atr
            size = config.RISK_PER_TRADE / sl_dist
            if side == "BUY":
                sl, tp = price - sl_dist, price + config.TP_ATR_MULT * atr
            else:
                sl, tp = price + sl_dist, price - config.TP_ATR_MULT * atr
            pos = {
                "id": f"pos-{int(time.time() * 1000)}-{uuid.uuid4().hex[:6]}",
                "symbol": symbol,
                "side": side,
                "entry": price,
                "sl": sl,
                "tp": tp,
                "size": size,
                "atr": atr,
                "status": "open",
                "manual": manual,
                "createdAt": time.strftime("%Y-%m-%dT%H:%M:%S"),
            }
            self.store.add_position(pos)
            self.store.log(
                "abertura",
                f"{'Manual' if manual else 'Auto'}: {side} {symbol} @ {price:,.2f} "
                f"(SL {sl:,.2f} / TP {tp:,.2f} / size {size:.5f})",
            )
            return pos

    def close_position(self, pos_id: str, reason: str = "manual") -> dict:
        with self._lock:
            for pos in self.store.positions():
                if pos["id"] == pos_id and pos["status"] == "open":
                    price = self._prices.get(pos["symbol"]) or pos["entry"]
                    pos.update(
                        status="closed",
                        exitPrice=price,
                        pnl=self._pnl(pos, price),
                        closedAt=time.strftime("%Y-%m-%dT%H:%M:%S"),
                        closeReason=reason,
                    )
                    self.store.update_position(pos)
                    self.store.log(
                        "fechamento",
                        f"{reason}: {pos['side']} {pos['symbol']} @ {price:,.2f} "
                        f"→ P&L {pos['pnl']:+,.2f} USD",
                    )
                    return pos
            raise RuntimeError("Posição não encontrada ou já fechada.")

    def close_all(self) -> int:
        opens = self.store.open_positions()
        for pos in opens:
            try:
                self.close_position(pos["id"], reason="fechar-tudo")
            except RuntimeError:
                pass
        return len(opens)

    def _manage_positions(self) -> None:
        """Fecha no SL/TP e avalia o kill-switch de perda diária."""
        for pos in self.store.open_positions():
            price = self._prices.get(pos["symbol"])
            if price is None:
                continue
            if pos["side"] == "BUY":
                if price <= pos["sl"]:
                    self.close_position(pos["id"], reason="stop-loss")
                elif price >= pos["tp"]:
                    self.close_position(pos["id"], reason="take-profit")
            else:
                if price >= pos["sl"]:
                    self.close_position(pos["id"], reason="stop-loss")
                elif price <= pos["tp"]:
                    self.close_position(pos["id"], reason="take-profit")
        # kill-switch: perda realizada do dia
        realized = self._realized_pnl()
        if realized <= -config.HARD_LOSS_LIMIT:
            if not self._killed:
                self._killed = True
                self.store.log("risco", f"KILL-SWITCH: perda realizada {realized:,.2f} USD atingiu o hard stop.")
        elif realized <= -config.DAILY_LOSS_LIMIT:
            if not self._daily_warned:
                self.store.log("risco", f"Limite diário de perda atingido ({realized:,.2f} USD). Novas operações bloqueadas.")
                self._daily_warned = True
            self._killed = True

    def _auto_trade(self) -> None:
        """Abre operações nos símbolos com sinal, respeitando o risco."""
        opens = self.store.open_positions()
        open_symbols = {p["symbol"] for p in opens}
        for sym in config.SYMBOLS:
            if sym in open_symbols:
                continue
            if len(opens) >= config.MAX_POSITIONS:
                break
            sig = signal_of(self._indicators.get(sym))
            if sig == "COMPRAR":
                self.open_position(sym, "BUY")
            elif sig == "VENDER":
                self.open_position(sym, "SELL")

    # ------------------------------------------------------------------
    # métricas / estado
    # ------------------------------------------------------------------
    def _realized_pnl(self) -> float:
        return sum(p.get("pnl", 0.0) for p in self.store.positions() if p.get("status") == "closed")

    def _unrealized_pnl(self) -> float:
        total = 0.0
        for pos in self.store.open_positions():
            price = self._prices.get(pos["symbol"])
            if price is not None:
                total += self._pnl(pos, price)
        return total

    def state(self) -> dict:
        with self._lock:
            primary = config.PRIMARY_SYMBOL
            ind = self._indicators.get(primary)
            opens = self.store.open_positions()
            closed = [p for p in self.store.positions() if p.get("status") == "closed"]
            realized = sum(p.get("pnl", 0.0) for p in closed)
            unrealized = self._unrealized_pnl()
            equity = config.EQUITY_START + realized + unrealized
            daily_used = min(100.0, abs(min(0.0, realized)) / config.DAILY_LOSS_LIMIT * 100)
            return {
                "mode": self.data.mode,
                "auto": self.store.get_auto(),
                "killed": self._killed,
                "price": self._prices.get(primary) or (ind["price"] if ind else None),
                "change24h": self._changes.get(primary),
                "indicators": ind,
                "signal": signal_of(ind),
                "candles": self._candles.get(primary, [])[-50:],
                "symbols": {
                    sym: {
                        "price": self._prices.get(sym),
                        "change24h": self._changes.get(sym),
                        "signal": signal_of(self._indicators.get(sym)),
                        "indicators": self._indicators.get(sym),
                    }
                    for sym in config.SYMBOLS
                },
                "eurusd": self._eurusd,
                "us100": self._us100,
                "positions": opens,
                "closedCount": len(closed),
                "realizedPnl": realized,
                "unrealizedPnl": unrealized,
                "equity": equity,
                "dailyLossPct": daily_used,
                "attempts": self._attempts,
                "lastAttempt": self._last_attempt,
                "log": self.store.get_log(40),
                "backtests": self.store.backtests()[:5],
                "config": {
                    "equityStart": config.EQUITY_START,
                    "riskPerTrade": config.RISK_PER_TRADE,
                    "maxPositions": config.MAX_POSITIONS,
                    "dailyLossLimit": config.DAILY_LOSS_LIMIT,
                    "hardLossLimit": config.HARD_LOSS_LIMIT,
                    "symbols": config.SYMBOLS,
                },
            }

    def get_candles(self, symbol: str, limit: int = 50) -> list[dict]:
        return self._candles.get(symbol, [])[-limit:]
