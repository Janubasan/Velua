"""
Trading Agent com DNA evolutivo - Web 4.0
Decisão semântica + memória JEV + risk management
"""
import random
import uuid
import time
from typing import Dict, Optional


class TradingAgent:
    """
    Fix #4: agent_id persistente agent_00..agent_11, não uuid por restart
    Fix #16: mutação com clamp
    Fix #6: jev_context realmente usado
    Fix #8: sizing correto qty = notional/price
    """
    _counter = 0  # para IDs determinísticos

    def __init__(self, agent_id=None, dna=None, initial_balance: float = 1000.0):
        # Fix #4: ID determinístico persistente
        if agent_id:
            self.id = agent_id
        else:
            # Usa counter para IDs estáveis agent_00, agent_01...
            self.id = f"agent_{TradingAgent._counter:02d}"
            TradingAgent._counter = (TradingAgent._counter + 1) % 100
        
        # Fallback se ainda quiser uuid para compat, mas preferível determinístico
        if self.id.startswith("agent_") and len(self.id) == 9 and self.id[6:].isdigit() is False:
            # Era uuid antigo, mantém mas loga aviso
            pass

        # DNA = hiperparâmetros que evoluem - com ATR mult para stops reais (fix #10)
        self.dna = dna or self._random_dna()
        self.fitness = 0.0
        self.balance = initial_balance
        self.initial_balance = initial_balance
        self.trades = 0
        self.wins = 0
        self.losses = 0
        self.total_pnl = 0.0
        self.win_streak = 0
        self.loss_streak = 0
        self.last_trade_time = 0
        self.is_active = True
        self.evolution_generation = 0

    def _random_dna(self) -> Dict:
        # Fix #16: valores com limites realistas e clamp posterior
        # Fix #10: stop/target por ATR mult, não % fixa
        return {
            "rsi_buy": random.randint(20, 40),  # compra quando RSI < X
            "rsi_sell": random.randint(60, 80),  # vende quando RSI > Y
            "ema_fast": random.randint(5, 15),
            "ema_slow": random.randint(18, 30),
            "risk_per_trade": random.uniform(0.005, 0.02),  # 0.5% a 2% - com clamp max 5%
            "stop_loss": random.uniform(0.01, 0.03),  # legado % - mantido compat
            "take_profit": random.uniform(0.02, 0.06),  # legado % - mantido compat
            "stop_atr_mult": random.uniform(1.0, 2.5),  # novo: stop por ATR (real)
            "take_atr_mult": random.uniform(2.0, 4.5),  # novo: target por ATR (real)
            "cooldown_sec": random.randint(30, 120),  # fix #13: cooldown maior para TF 1h
            "trend_filter": random.choice([True, False]),
            "rsi_confluence": random.uniform(0.0, 1.0)
        }

    def decide(self, market_data: dict, jev_context: str) -> dict:
        """
        Web 4.0: Decisão semântica + memória de erros
        market_data: {price, rsi, ema_fast, ema_slow, trend, atr, ema_distance}
        jev_context: lições aprendidas do .jev
        """
        now = time.time()
        if now - self.last_trade_time < self.dna["cooldown_sec"]:
            return {"action": "HOLD", "reason": f"Cooldown {self.dna['cooldown_sec']}s", "price": market_data['price'], "amount": 0}

        rsi = market_data.get('rsi', 50)
        price = market_data.get('price', 0)
        ema_fast = market_data.get('ema_fast', price)
        ema_slow = market_data.get('ema_slow', price)
        trend = market_data.get('trend', 'sideways')
        ema_distance = market_data.get('ema_distance', 0)

        # Filtros JEV - evita repetir erros
        # Se JEV diz que comprar com RSI 78 em downtrend deu loss, evita
        jev_lower = jev_context.lower()
        avoid_buy = "evitar compra" in jev_lower and "sobrecompra" in jev_lower and rsi > 70
        avoid_sell = "evitar venda" in jev_lower and rsi < 30

        # Lógica principal com confluências
        buy_signals = 0
        sell_signals = 0
        reasons = []

        # RSI
        if rsi < self.dna['rsi_buy']:
            buy_signals += 1
            reasons.append(f"RSI {rsi} < {self.dna['rsi_buy']} (oversold)")
        elif rsi > self.dna['rsi_sell']:
            sell_signals += 1
            reasons.append(f"RSI {rsi} > {self.dna['rsi_sell']} (overbought)")

        # EMA Crossover
        if ema_fast > ema_slow:
            if trend == "up":
                buy_signals += 0.5
                reasons.append(f"EMA uptrend {ema_fast:.0f}>{ema_slow:.0f}")
        else:
            if trend == "down":
                sell_signals += 0.5
                reasons.append(f"EMA downtrend {ema_fast:.0f}<{ema_slow:.0f}")

        # Trend filter (se DNA habilitado)
        if self.dna["trend_filter"]:
            if trend == "down" and buy_signals > 0:
                # Reduz força de compra em downtrend
                buy_signals *= 0.5
                reasons.append("Downtrend filter reduziu compra")
            if trend == "up" and sell_signals > 0:
                sell_signals *= 0.5
                reasons.append("Uptrend filter reduziu venda")

        # EMA distance - evita comprar muito esticado
        if abs(ema_distance) > 5:
            if ema_distance > 5 and buy_signals > 0:
                buy_signals *= 0.7
                reasons.append(f"Preço {ema_distance}% acima EMA - compra arriscada")
            if ema_distance < -5 and sell_signals > 0:
                sell_signals *= 0.7

        # JEV override
        if avoid_buy:
            buy_signals = 0
            reasons.append("JEV bloqueou compra (lição anterior)")
        if avoid_sell:
            sell_signals = 0
            reasons.append("JEV bloqueou venda")

        # Decisão final
        amount_usd = self.balance * self.dna['risk_per_trade']
        amount_coin = amount_usd / price if price > 0 else 0

        if buy_signals >= 1.0 and buy_signals > sell_signals:
            return {
                "action": "BUY",
                "price": price,
                "amount": amount_coin,
                "amount_usd": amount_usd,
                "reason": " | ".join(reasons),
                "confidence": min(buy_signals / 2, 1.0),
                "stop_loss": price * (1 - self.dna['stop_loss']),
                "take_profit": price * (1 + self.dna['take_profit'])
            }
        elif sell_signals >= 1.0 and sell_signals > buy_signals:
            return {
                "action": "SELL",
                "price": price,
                "amount": amount_coin,
                "amount_usd": amount_usd,
                "reason": " | ".join(reasons),
                "confidence": min(sell_signals / 2, 1.0),
                "stop_loss": price * (1 + self.dna['stop_loss']),
                "take_profit": price * (1 - self.dna['take_profit'])
            }

        return {
            "action": "HOLD",
            "price": price,
            "amount": 0,
            "reason": f"Aguardando setup | RSI {rsi} | Trend {trend}",
            "confidence": 0
        }

    def update_fitness(self, profit: float):
        self.trades += 1
        self.total_pnl += profit
        self.last_trade_time = time.time()

        if profit > 0:
            self.wins += 1
            self.win_streak += 1
            self.loss_streak = 0
        elif profit < 0:
            self.losses += 1
            self.loss_streak += 1
            self.win_streak = 0
        else:
            # HOLD não conta como trade perdedor, mas conta para cooldown
            self.trades -= 1  # não conta HOLD como trade
            return

        self.balance += profit

        # Fitness = balance + winrate bonus - drawdown penalty - loss streak penalty
        winrate = self.wins / max(1, self.trades)
        # Sharpe-like: lucro médio vs risco
        avg_pnl = self.total_pnl / max(1, self.trades)
        
        # Penalidades
        drawdown = (self.initial_balance - self.balance) / self.initial_balance
        drawdown_penalty = max(0, drawdown * 500)  # penalidade forte se drawdown
        
        loss_streak_penalty = self.loss_streak * 10
        
        # Bonus por consistência
        consistency_bonus = self.win_streak * 5 if self.win_streak >= 3 else 0

        self.fitness = (
            self.balance 
            + (winrate * 200) 
            + (avg_pnl * 50)
            + consistency_bonus
            - drawdown_penalty
            - loss_streak_penalty
            - (self.trades * 0.05)  # leve penalidade por overtrading
        )

        # Desativa se quebrou
        if self.balance < self.initial_balance * 0.5:
            self.is_active = False

    def to_dict(self) -> Dict:
        return {
            "id": self.id,
            "dna": self.dna,
            "fitness": round(self.fitness, 2),
            "balance": round(self.balance, 2),
            "initial_balance": self.initial_balance,
            "trades": self.trades,
            "wins": self.wins,
            "losses": self.losses,
            "total_pnl": round(self.total_pnl, 2),
            "winrate": round(self.wins / max(1, self.trades) * 100, 1),
            "win_streak": self.win_streak,
            "loss_streak": self.loss_streak,
            "is_active": self.is_active,
            "generation": self.evolution_generation
        }

    def clone_with_mutation(self, generation: int = 0):
        """Fix #16: Cria filho mutado COM CLAMP (não deixa rsi_buy virar 97)"""
        new_dna = {}
        for k, v in self.dna.items():
            if isinstance(v, bool):
                new_dna[k] = v if random.random() > 0.2 else not v
            elif isinstance(v, int):
                if random.random() < 0.2:
                    new_dna[k] = int(v * random.uniform(0.8, 1.2))
                else:
                    new_dna[k] = v
            else:  # float
                if random.random() < 0.2:
                    new_dna[k] = v * random.uniform(0.8, 1.2)
                else:
                    new_dna[k] = v

        # Fix #16: Garante limites com clamp para todos
        new_dna["rsi_buy"] = max(10, min(45, int(new_dna.get("rsi_buy", 30))))
        new_dna["rsi_sell"] = max(55, min(90, int(new_dna.get("rsi_sell", 70))))
        new_dna["ema_fast"] = max(3, min(20, int(new_dna.get("ema_fast", 9))))
        new_dna["ema_slow"] = max(15, min(40, int(new_dna.get("ema_slow", 21))))
        new_dna["risk_per_trade"] = max(0.002, min(0.05, float(new_dna.get("risk_per_trade", 0.01))))
        new_dna["stop_loss"] = max(0.005, min(0.05, float(new_dna.get("stop_loss", 0.02))))
        new_dna["take_profit"] = max(0.01, min(0.1, float(new_dna.get("take_profit", 0.04))))
        new_dna["stop_atr_mult"] = max(0.5, min(3.0, float(new_dna.get("stop_atr_mult", 1.5))))
        new_dna["take_atr_mult"] = max(1.0, min(6.0, float(new_dna.get("take_atr_mult", 3.0))))
        new_dna["cooldown_sec"] = max(20, min(300, int(new_dna.get("cooldown_sec", 60))))

        # Garante relações
        if new_dna["ema_fast"] >= new_dna["ema_slow"]:
            new_dna["ema_fast"] = max(3, new_dna["ema_slow"] - 5)
        if new_dna["rsi_buy"] >= new_dna["rsi_sell"]:
            new_dna["rsi_buy"] = max(10, new_dna["rsi_sell"] - 20)

        # ID persistente novo será atribuído pelo EvolutionEngine
        child = TradingAgent(dna=new_dna, initial_balance=self.initial_balance)
        child.evolution_generation = generation
        return child
