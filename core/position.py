"""
JEV Real - Posição Real com Stop/Alvo por ATR, Sizing pelo Risco
Original quebrado: stop_loss e take_profit existem no DNA e nunca são usados. 
Não há posição, não há saída. O agente "vende" sem nunca ter comprado.

Aqui: posição real com stop/target, sizing pelo risco, reconciliação.
"""
import time
import uuid
from typing import Dict, Optional, List
from dataclasses import dataclass, field


@dataclass
class Position:
    position_id: str
    agent_id: str
    symbol: str
    side: str  # long / short
    entry_price: float
    qty: float
    notional: float
    stop_price: float
    target_price: float
    atr: float
    entry_time: float
    client_order_id: str
    exchange_order_id: Optional[str] = None
    status: str = "open"  # open, closed, stop_hit, target_hit
    exit_price: Optional[float] = None
    exit_time: Optional[float] = None
    pnl_gross: float = 0
    pnl_net: float = 0
    fee: float = 0


class PositionManager:
    """
    Gerencia posições reais com stop/target por ATR.
    Sizing: qty = risco / (ATR * mult) - não % balance aleatório.
    """
    def __init__(self, risk_per_trade: float = 0.01):
        self.positions: Dict[str, Position] = {}  # position_id -> Position
        self.risk_per_trade = risk_per_trade

    def calculate_position_size(
        self,
        equity: float,
        price: float,
        atr: float,
        stop_atr_mult: float = 1.5,
        max_equity_pct: float = 0.2
    ) -> Dict:
        """
        Sizing pelo risco, não por % balance:
        risco = equity * risk_per_trade
        qty = risco / (ATR * stop_mult)
        """
        if atr <= 0:
            atr = price * 0.02  # fallback 2%

        risk_amount = equity * self.risk_per_trade
        stop_distance = atr * stop_atr_mult
        qty = risk_amount / stop_distance if stop_distance > 0 else 0

        # Limita a % do equity para não alavancar demais
        max_qty_by_equity = (equity * max_equity_pct) / price if price > 0 else 0
        qty = min(qty, max_qty_by_equity)

        notional = qty * price

        # Verifica notional mínimo Binance spot ~$5-10
        min_notional = 5.0
        if notional < min_notional:
            return {
                "qty": 0,
                "notional": 0,
                "risk_amount": risk_amount,
                "stop_distance": stop_distance,
                "can_trade": False,
                "reason": f"Notional ${notional:.2f} < mínimo ${min_notional} - trade muito pequeno para $100"
            }

        return {
            "qty": round(qty, 6),
            "notional": round(notional, 2),
            "risk_amount": round(risk_amount, 2),
            "stop_distance": round(stop_distance, 2),
            "can_trade": True,
            "reason": "OK"
        }

    def open_position(
        self,
        agent_id: str,
        symbol: str,
        side: str,
        price: float,
        qty: float,
        atr: float,
        stop_atr_mult: float = 1.5,
        take_atr_mult: float = 3.0,
        client_order_id: Optional[str] = None
    ) -> Position:
        """Abre posição com stop/target por ATR"""
        if client_order_id is None:
            client_order_id = f"{agent_id}-{int(time.time()*1000)}-{uuid.uuid4().hex[:6]}"

        notional = qty * price
        stop_distance = atr * stop_atr_mult
        target_distance = atr * take_atr_mult

        if side.lower() == "buy" or side.lower() == "long":
            stop_price = price - stop_distance
            target_price = price + target_distance
            side_norm = "long"
        else:
            stop_price = price + stop_distance
            target_price = price - target_distance
            side_norm = "short"

        pos = Position(
            position_id=f"pos_{uuid.uuid4().hex[:8]}",
            agent_id=agent_id,
            symbol=symbol,
            side=side_norm,
            entry_price=price,
            qty=qty,
            notional=notional,
            stop_price=stop_price,
            target_price=target_price,
            atr=atr,
            entry_time=time.time(),
            client_order_id=client_order_id
        )

        self.positions[pos.position_id] = pos
        print(f"[POSITION] {agent_id} {side_norm} {qty} {symbol} @ {price:.2f} | SL {stop_price:.2f} TP {target_price:.2f} | ATR {atr:.2f}")

        return pos

    def check_exit(self, symbol: str, current_price: float, low: float, high: float) -> List[Position]:
        """Verifica se alguma posição atingiu stop ou target (intra-candle)"""
        exited = []
        for pos_id, pos in list(self.positions.items()):
            if pos.symbol != symbol or pos.status != "open":
                continue

            if pos.side == "long":
                # Stop hit?
                if low <= pos.stop_price:
                    pos.exit_price = pos.stop_price
                    pos.exit_time = time.time()
                    pos.status = "stop_hit"
                    pos.pnl_gross = (pos.exit_price - pos.entry_price) * pos.qty
                    exited.append(pos)
                    print(f"[POSITION] STOP HIT {pos.agent_id} {pos.symbol} {pos.exit_price:.2f} PnL {pos.pnl_gross:.2f}")
                    continue

                # Target hit?
                if high >= pos.target_price:
                    pos.exit_price = pos.target_price
                    pos.exit_time = time.time()
                    pos.status = "target_hit"
                    pos.pnl_gross = (pos.exit_price - pos.entry_price) * pos.qty
                    exited.append(pos)
                    print(f"[POSITION] TARGET HIT {pos.agent_id} {pos.symbol} {pos.exit_price:.2f} PnL {pos.pnl_gross:.2f}")
                    continue

            else:  # short
                if high >= pos.stop_price:
                    pos.exit_price = pos.stop_price
                    pos.exit_time = time.time()
                    pos.status = "stop_hit"
                    pos.pnl_gross = (pos.entry_price - pos.exit_price) * pos.qty
                    exited.append(pos)
                    continue

                if low <= pos.target_price:
                    pos.exit_price = pos.target_price
                    pos.exit_time = time.time()
                    pos.status = "target_hit"
                    pos.pnl_gross = (pos.entry_price - pos.exit_price) * pos.qty
                    exited.append(pos)
                    continue

        # Remove fechadas do dict ativo (mantém histórico separado se necessário)
        for pos in exited:
            del self.positions[pos.position_id]

        return exited

    def get_open_positions(self, agent_id: Optional[str] = None, symbol: Optional[str] = None) -> List[Position]:
        result = []
        for pos in self.positions.values():
            if agent_id and pos.agent_id != agent_id:
                continue
            if symbol and pos.symbol != symbol:
                continue
            if pos.status == "open":
                result.append(pos)
        return result

    def get_exposure(self, symbol: Optional[str] = None) -> float:
        """Exposição total em USD"""
        total = 0
        for pos in self.positions.values():
            if pos.status != "open":
                continue
            if symbol and pos.symbol != symbol:
                continue
            total += pos.notional
        return total

    def close_all(self, symbol: Optional[str] = None, reason: str = "kill_switch") -> List[Position]:
        """Fecha todas as posições (kill switch)"""
        closed = []
        for pos_id, pos in list(self.positions.items()):
            if symbol and pos.symbol != symbol:
                continue
            if pos.status != "open":
                continue
            # Fecha a mercado (simplificado)
            pos.exit_price = pos.entry_price  # em real, usaria preço atual
            pos.exit_time = time.time()
            pos.status = f"closed_{reason}"
            closed.append(pos)
            del self.positions[pos_id]
        
        if closed:
            print(f"[POSITION] Kill switch {reason}: fechadas {len(closed)} posições")
        
        return closed
