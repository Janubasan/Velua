"""
JEV Real - RiskManager como Gate (não comentário)
Original: risco em comentário, sem enforcement.
Aqui: gate real que bloqueia trades se limites forem atingidos.

Gates:
- Perda diária máxima (ex: 3% equity)
- Drawdown máximo (ex: 10%)
- Trades por dia máximo (ex: 20)
- Exposição máxima (ex: 30% equity)
- Kill switch manual
- Cooldown após perdas consecutivas
"""
import time
from datetime import datetime, timezone, date
from typing import Dict, List
from dataclasses import dataclass, field


@dataclass
class RiskLimits:
    max_daily_loss_pct: float = 3.0  # % equity por dia
    max_drawdown_pct: float = 10.0
    max_trades_per_day: int = 20
    max_exposure_pct: float = 30.0  # % equity em posições abertas
    max_consecutive_losses: int = 5
    cooldown_after_losses_sec: int = 300  # 5 min
    min_notional_usd: float = 5.0  # Binance spot mínimo


class RiskManagerV2:
    def __init__(self, initial_equity: float = 1000.0, limits: RiskLimits = None):
        self.initial_equity = initial_equity
        self.current_equity = initial_equity
        self.limits = limits or RiskLimits()
        
        self.daily_pnl = 0.0
        self.daily_trades = 0
        self.current_date = date.today()
        self.consecutive_losses = 0
        self.last_loss_time = 0
        self.is_killed = False
        self.kill_reason = ""
        self.trade_history: List[Dict] = []
        self.exposure_usd = 0.0
        self.peak_equity = initial_equity

    def _check_new_day(self):
        today = date.today()
        if today != self.current_date:
            print(f"[RISK] Novo dia: reset diário PnL {self.daily_pnl:.2f} trades {self.daily_trades}")
            self.current_date = today
            self.daily_pnl = 0.0
            self.daily_trades = 0

    def update_equity(self, new_equity: float):
        self.current_equity = new_equity
        if new_equity > self.peak_equity:
            self.peak_equity = new_equity

    def update_pnl(self, pnl: float):
        self._check_new_day()
        self.daily_pnl += pnl
        self.daily_trades += 1
        self.trade_history.append({"pnl": pnl, "time": time.time(), "date": str(self.current_date)})
        
        if pnl < 0:
            self.consecutive_losses += 1
            self.last_loss_time = time.time()
        else:
            self.consecutive_losses = 0
        
        self.current_equity += pnl

    def update_exposure(self, exposure_usd: float):
        self.exposure_usd = exposure_usd

    def can_trade(self, proposed_notional: float = 0) -> tuple[bool, str]:
        """
        Gate principal: retorna (pode_operar, motivo)
        Bloqueia se qualquer limite for atingido.
        """
        self._check_new_day()

        if self.is_killed:
            return False, f"KILL SWITCH ativado: {self.kill_reason}"

        # Perda diária
        daily_loss_pct = (-self.daily_pnl / self.initial_equity * 100) if self.daily_pnl < 0 else 0
        if daily_loss_pct >= self.limits.max_daily_loss_pct:
            return False, f"Perda diária {daily_loss_pct:.2f}% >= limite {self.limits.max_daily_loss_pct}%"

        # Drawdown
        drawdown_pct = (self.peak_equity - self.current_equity) / self.peak_equity * 100 if self.peak_equity > 0 else 0
        if drawdown_pct >= self.limits.max_drawdown_pct:
            return False, f"Drawdown {drawdown_pct:.2f}% >= limite {self.limits.max_drawdown_pct}%"

        # Trades por dia
        if self.daily_trades >= self.limits.max_trades_per_day:
            return False, f"Trades/dia {self.daily_trades} >= limite {self.limits.max_trades_per_day}"

        # Exposição
        exposure_pct = (self.exposure_usd + proposed_notional) / self.current_equity * 100 if self.current_equity > 0 else 0
        if exposure_pct > self.limits.max_exposure_pct:
            return False, f"Exposição {exposure_pct:.1f}% > limite {self.limits.max_exposure_pct}% (atual ${self.exposure_usd:.2f} + proposto ${proposed_notional:.2f})"

        # Perdas consecutivas + cooldown
        if self.consecutive_losses >= self.limits.max_consecutive_losses:
            elapsed = time.time() - self.last_loss_time
            if elapsed < self.limits.cooldown_after_losses_sec:
                remaining = self.limits.cooldown_after_losses_sec - elapsed
                return False, f"{self.consecutive_losses} perdas consecutivas - cooldown {remaining:.0f}s restantes"
            else:
                # Cooldown passou, reseta
                self.consecutive_losses = 0

        # Notional mínimo
        if proposed_notional > 0 and proposed_notional < self.limits.min_notional_usd:
            return False, f"Notional ${proposed_notional:.2f} < mínimo Binance ${self.limits.min_notional_usd} - trade muito pequeno para $100 (matemática negativa por taxas)"

        return True, "OK"

    def kill_switch(self, reason: str):
        """Ativa kill switch manual - fecha tudo e bloqueia novos trades"""
        self.is_killed = True
        self.kill_reason = reason
        print(f"[RISK] 🚨 KILL SWITCH: {reason}")

    def reset_kill(self):
        self.is_killed = False
        self.kill_reason = ""
        self.consecutive_losses = 0
        print("[RISK] Kill switch resetado")

    def get_status(self) -> Dict:
        self._check_new_day()
        daily_loss_pct = (-self.daily_pnl / self.initial_equity * 100) if self.daily_pnl < 0 else 0
        drawdown_pct = (self.peak_equity - self.current_equity) / self.peak_equity * 100 if self.peak_equity > 0 else 0
        exposure_pct = self.exposure_usd / self.current_equity * 100 if self.current_equity > 0 else 0

        return {
            "initial_equity": self.initial_equity,
            "current_equity": round(self.current_equity, 2),
            "peak_equity": round(self.peak_equity, 2),
            "daily_pnl": round(self.daily_pnl, 2),
            "daily_loss_pct": round(daily_loss_pct, 2),
            "drawdown_pct": round(drawdown_pct, 2),
            "daily_trades": self.daily_trades,
            "max_trades_per_day": self.limits.max_trades_per_day,
            "exposure_usd": round(self.exposure_usd, 2),
            "exposure_pct": round(exposure_pct, 2),
            "consecutive_losses": self.consecutive_losses,
            "is_killed": self.is_killed,
            "kill_reason": self.kill_reason,
            "limits": {
                "max_daily_loss_pct": self.limits.max_daily_loss_pct,
                "max_drawdown_pct": self.limits.max_drawdown_pct,
                "max_exposure_pct": self.limits.max_exposure_pct,
                "min_notional_usd": self.limits.min_notional_usd
            }
        }

    def explain_math(self, equity: float = 100) -> str:
        """Explica matemática do capital $100"""
        risk_per_trade = equity * 0.01  # 1%
        fee_per_side = 0.001  # 0.1%
        # Round-trip: 2* fee + spread 0.05% + slippage 0.05% = ~0.3%
        cost_pct = 0.003
        cost_usd = risk_per_trade * cost_pct * 10  # notional ~10x risco se stop 10%? Simplificado
        # Para $100, risco $1, notional $10 (se stop 10%), custo ~$0.03 por lado = $0.06 round-trip
        # Alvo 2% de $10 = $0.20, custo $0.06 = 30% do alvo comido por taxas
        
        return (
            f"Matemática $100 com 1% risco = ${risk_per_trade}/trade. "
            f"Taxa 0.1% por lado + spread 0.05% + slippage 0.05% = ~0.3% round-trip. "
            f"Com notional ~$5-10 (mínimo Binance), custo ~$0.03-0.06 por trade. "
            f"Se alvo é 2% de $10 = $0.20, taxa come 15-30%. Sistema negativo por construção. "
            f"Recomendado: equity >= $1000 ou paper mode para pesquisa."
        )
