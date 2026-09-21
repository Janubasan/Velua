"""
Risk Management para conta de $100 - Nível Corretora
Regras:
- 1% por trade = $1
- SL 2% e TP 4% (R:R 1:2)
- Max 3 trades simultâneos = $3 exposição
- Drawdown 10% ($10) = pausa e evolução forçada
"""
from typing import Dict, List
import time


class RiskManager:
    def __init__(self, initial_balance: float = 100.0):
        self.initial_balance = initial_balance
        self.current_balance = initial_balance
        self.max_drawdown_pct = 10.0  # 10%
        self.max_open_trades = 3
        self.risk_per_trade_pct = 1.0  # 1% = $1
        self.stop_loss_pct = 2.0
        self.take_profit_pct = 4.0
        self.open_positions: List[Dict] = []
        self.is_paused = False
        self.pause_reason = ""
        self.total_trades = 0
        self.consecutive_losses = 0

    def update_balance(self, new_balance: float):
        self.current_balance = new_balance
        self.check_drawdown()

    def check_drawdown(self) -> bool:
        """Retorna True se deve pausar"""
        drawdown = ((self.initial_balance - self.current_balance) / self.initial_balance) * 100
        if drawdown >= self.max_drawdown_pct:
            self.is_paused = True
            self.pause_reason = f"Drawdown {drawdown:.2f}% >= {self.max_drawdown_pct}% - Pausa para evolução"
            print(f"[RISK] {self.pause_reason}")
            return True
        if self.current_balance < self.initial_balance * 0.9:
            # Se perder 10%, reduz risco para 0.5%
            self.risk_per_trade_pct = 0.5
        else:
            self.risk_per_trade_pct = 1.0
        return False

    def can_open_trade(self) -> tuple[bool, str]:
        if self.is_paused:
            return False, f"Pausado: {self.pause_reason}"
        if len(self.open_positions) >= self.max_open_trades:
            return False, f"Máximo de {self.max_open_trades} trades simultâneos atingido"
        if self.consecutive_losses >= 5:
            return False, "5 perdas consecutivas - cooldown 60s"
        return True, "OK"

    def calculate_position_size(self, price: float, stop_loss_pct: float = None) -> Dict:
        """Calcula tamanho da posição baseado em risco de 1%"""
        sl_pct = stop_loss_pct or self.stop_loss_pct
        risk_amount = self.current_balance * (self.risk_per_trade_pct / 100)  # $1 se $100
        # Position size = risk_amount / (price * sl_pct)
        # Simplificado para spot: amount = risk_amount / price ajustado por SL
        # Para spot, usamos fração do balance: 1% do balance em valor
        amount_usd = self.current_balance * (self.risk_per_trade_pct / 100)
        amount_coin = amount_usd / price if price > 0 else 0

        # Limites mínimos da Binance (BTC ~0.00001)
        min_notional = 5.0  # $5 mínimo na Binance spot, mas para $100 usamos $1 simulado
        # Em modo real, precisa respeitar min notional, então ajustamos
        if amount_usd < 1.0:
            amount_usd = 1.0
            amount_coin = amount_usd / price if price > 0 else 0

        return {
            "amount_coin": round(amount_coin, 6),
            "amount_usd": round(amount_usd, 2),
            "risk_amount": round(risk_amount, 2),
            "stop_loss_price": round(price * (1 - sl_pct/100), 2) if sl_pct else None,
            "take_profit_price": round(price * (1 + self.take_profit_pct/100), 2)
        }

    def open_position(self, agent_id: str, symbol: str, side: str, price: float, amount_coin: float):
        pos = {
            "agent_id": agent_id,
            "symbol": symbol,
            "side": side,
            "entry_price": price,
            "amount": amount_coin,
            "timestamp": time.time(),
            "stop_loss": price * (1 - self.stop_loss_pct/100) if side == "BUY" else price * (1 + self.stop_loss_pct/100),
            "take_profit": price * (1 + self.take_profit_pct/100) if side == "BUY" else price * (1 - self.take_profit_pct/100)
        }
        self.open_positions.append(pos)
        self.total_trades += 1
        return pos

    def close_position(self, agent_id: str, exit_price: float, pnl: float):
        # Remove posição e atualiza consecutive losses
        self.open_positions = [p for p in self.open_positions if p["agent_id"] != agent_id]
        if pnl < 0:
            self.consecutive_losses += 1
        else:
            self.consecutive_losses = 0
        self.current_balance += pnl
        self.check_drawdown()

    def get_status(self) -> Dict:
        drawdown = ((self.initial_balance - self.current_balance) / self.initial_balance) * 100
        return {
            "initial_balance": self.initial_balance,
            "current_balance": round(self.current_balance, 2),
            "drawdown_pct": round(drawdown, 2),
            "risk_per_trade_pct": self.risk_per_trade_pct,
            "open_positions": len(self.open_positions),
            "max_open": self.max_open_trades,
            "is_paused": self.is_paused,
            "pause_reason": self.pause_reason,
            "consecutive_losses": self.consecutive_losses,
            "total_trades": self.total_trades,
            "exposure_usd": round(sum([p["amount"] * p["entry_price"] for p in self.open_positions]), 2)
        }

    def resume(self):
        """Resume após evolução"""
        self.is_paused = False
        self.pause_reason = ""
        self.consecutive_losses = 0
        print("[RISK] Sistema resumido após evolução")
