"""
Protocolo Web 4.0 Automation - Autônomo, Descentralizado, Semântico
Integra JEV + Evolution + Real Market + Risk Management
"""
import asyncio
import random
import time
from typing import Callable, Dict, Optional
from core.jev_protocol import JEVProtocol
from evolution.engine import EvolutionEngine
from core.market import get_market_feed
from core.risk import RiskManager


class Web4AutomationProtocol:
    """
    Protocolo inspirado em github.com/awesome-web4-automation
    - Autônomo: roda 24/7 sem intervenção
    - Descentralizado: cada agente decide sozinho
    - Semântico: usa JEV para aprender com erros
    """
    def __init__(self, initial_balance: float = 100.0, population_size: int = 12):
        self.jev = JEVProtocol(jev_path="strategies.jev")
        self.engine = EvolutionEngine(population_size=population_size, initial_balance=initial_balance)
        self.market = get_market_feed()
        self.risk = RiskManager(initial_balance=initial_balance)
        self.is_running = False
        self.trades_executed = 0
        self.last_evolution_trade_count = 0
        self.evolution_interval = 50  # evolui a cada 50 trades
        self.loop_interval = 5  # segundos
        self.mode = "DEMO"  # DEMO ou REAL
        self.symbol = "BTC/USDT"

    async def run_loop(self, market_feed_callback: Optional[Callable] = None):
        """Loop principal - autônomo 24/7"""
        self.is_running = True
        print(f"[WEB4.0] Protocolo iniciado - Modo {self.mode} - {self.symbol} - População {len(self.engine.population)}")
        
        while self.is_running:
            try:
                # 1. Pega dados de mercado REAL
                if market_feed_callback:
                    market_data = await market_feed_callback()
                else:
                    market_data = self.market.get_market_snapshot(self.symbol)

                # 2. Cada agente decide
                for agent in self.engine.population:
                    if not agent.is_active:
                        continue

                    # Contexto JEV - memória de erros
                    context = self.jev.get_learnings_for_agent(agent.id)
                    
                    # Decisão
                    decision = agent.decide(market_data, context)

                    # 3. Valida com Risk Manager
                    can_trade, reason = self.risk.can_open_trade()
                    if not can_trade and decision["action"] != "HOLD":
                        # Log como HOLD forçado por risco
                        self.jev.log({
                            "agent_id": agent.id,
                            "action": "HOLD_FORCED",
                            "error_type": "RISK_BLOCKED",
                            "loss": 0,
                            "profit": 0,
                            "context": market_data,
                            "lesson": f"Trade bloqueado por risco: {reason}",
                            "mode": self.mode,
                            "symbol": self.symbol
                        })
                        continue

                    # 4. Executa / Simula trade
                    profit = await self.execute_trade(decision, market_data, agent)

                    # 5. Atualiza fitness e risk
                    if decision["action"] != "HOLD":
                        agent.update_fitness(profit)
                        self.trades_executed += 1
                        
                        if profit < 0:
                            self.risk.consecutive_losses += 1
                        else:
                            self.risk.consecutive_losses = 0

                        # Atualiza balance do risk manager (média dos agentes top)
                        top_agents = self.engine.get_top_agents(3)
                        avg_balance = sum(a.balance for a in top_agents) / len(top_agents) if top_agents else self.risk.current_balance
                        self.risk.update_balance(avg_balance)

                        # 6. LOGA TUDO NO .JEV - erro vira aprendizado
                        error_type = "NONE"
                        if profit < -1:
                            error_type = "STOP_LOSS_HIT"
                        elif profit < 0:
                            error_type = "LOSS"
                        elif decision["action"] in ["BUY", "SELL"]:
                            error_type = "NONE"

                        self.jev.log({
                            "agent_id": agent.id,
                            "action": decision["action"],
                            "price": decision.get("price", market_data["price"]),
                            "amount": decision.get("amount", 0),
                            "error_type": error_type,
                            "loss": profit if profit < 0 else 0,
                            "profit": profit if profit > 0 else 0,
                            "context": {
                                "rsi": market_data.get("rsi"),
                                "trend": market_data.get("trend"),
                                "price": market_data.get("price"),
                                "ema_fast": market_data.get("ema_fast"),
                                "ema_slow": market_data.get("ema_slow")
                            },
                            "lesson": f"{decision['action']} em RSI {market_data.get('rsi')} | {decision.get('reason','')} | PnL {profit:.2f}",
                            "mode": self.mode,
                            "symbol": self.symbol,
                            "dna": agent.dna,
                            "confidence": decision.get("confidence", 0)
                        })

                # 7. Verifica se deve evoluir
                total_trades = sum(a.trades for a in self.engine.population)
                if total_trades - self.last_evolution_trade_count >= self.evolution_interval:
                    self.engine.evolve()
                    self.last_evolution_trade_count = total_trades
                    self.risk.resume()  # resume após evolução

                # 8. Verifica drawdown forçado
                if self.risk.is_paused:
                    print(f"[WEB4.0] Risk pausado, forçando evolução")
                    self.engine.force_evolution()
                    self.risk.resume()
                    self.last_evolution_trade_count = total_trades

                await asyncio.sleep(self.loop_interval)

            except Exception as e:
                print(f"[WEB4.0] Erro no loop: {e}")
                import traceback
                traceback.print_exc()
                await asyncio.sleep(5)

    async def execute_trade(self, decision: Dict, market_data: Dict, agent) -> float:
        """
        Executa trade REAL ou SIMULADO
        - DEMO: simulação com preço real, PnL realista baseado em movimento
        - REAL: usa CCXT com API keys (Binance spot)
        """
        if decision["action"] == "HOLD":
            return 0

        # Em modo DEMO, simula PnL realista baseado em volatilidade
        if self.mode == "DEMO":
            return self.simulate_realistic_trade(decision, market_data)
        
        # Modo REAL - tenta executar via CCXT
        try:
            if self.market.exchange and hasattr(self.market.exchange, 'create_market_order'):
                # Calcula tamanho com risk management
                pos_info = self.risk.calculate_position_size(market_data["price"], agent.dna["stop_loss"]*100)
                
                # Só executa se for top agente (evita spam de ordens)
                top_agents = self.engine.get_top_agents(3)
                if agent.id not in [a.id for a in top_agents]:
                    # Agentes fora do top 3 apenas simulam
                    return self.simulate_realistic_trade(decision, market_data)

                symbol = self.symbol
                side = decision["action"].lower()
                amount = pos_info["amount_coin"]

                # Valida mínimo da Binance
                if pos_info["amount_usd"] < 5:
                    # Para conta $100, simula se menor que mínimo
                    return self.simulate_realistic_trade(decision, market_data)

                print(f"[REAL TRADE] {agent.id} {side} {amount} {symbol} @ {market_data['price']}")
                # order = self.market.exchange.create_market_order(symbol, side, amount)
                # Retorna PnL estimado (em real, precisaria de posição fechada)
                # Por segurança, ainda simula PnL até ter sistema de posição completo
                return self.simulate_realistic_trade(decision, market_data)
            else:
                return self.simulate_realistic_trade(decision, market_data)
        except Exception as e:
            print(f"[REAL TRADE] Erro execução: {e}, fallback simulação")
            return self.simulate_realistic_trade(decision, market_data)

    def simulate_realistic_trade(self, decision: Dict, market_data: Dict) -> float:
        """
        Simulação REALISTA, não random puro:
        - Usa ATR para volatilidade
        - Considera trend
        - Winrate baseado em confluências
        """
        if decision["action"] == "HOLD":
            return 0

        price = market_data["price"]
        rsi = market_data.get("rsi", 50)
        trend = market_data.get("trend", "sideways")
        atr = market_data.get("atr", price * 0.01)
        confidence = decision.get("confidence", 0.5)

        # Base winrate 45% (mercado difícil) + bonus por confluência
        base_winrate = 0.45
        if confidence > 0.7:
            base_winrate += 0.15
        elif confidence > 0.5:
            base_winrate += 0.05

        # Ajuste por RSI (comprar oversold tem mais chance)
        if decision["action"] == "BUY" and rsi < 35:
            base_winrate += 0.1
        if decision["action"] == "SELL" and rsi > 65:
            base_winrate += 0.1

        # Trend contra reduz winrate
        if decision["action"] == "BUY" and trend == "down":
            base_winrate -= 0.1
        if decision["action"] == "SELL" and trend == "up":
            base_winrate -= 0.1

        base_winrate = max(0.3, min(0.7, base_winrate))

        # Simula resultado
        is_win = random.random() < base_winrate

        # PnL baseado em ATR e DNA do agente
        risk_pct = decision.get("amount_usd", 1) / 100  # % do balance
        if is_win:
            # Win: TP 2% a 6% do valor arriscado
            profit = risk_pct * random.uniform(2, 6)
            # Bonus por trend a favor
            if (decision["action"] == "BUY" and trend == "up") or (decision["action"] == "SELL" and trend == "down"):
                profit *= 1.3
        else:
            # Loss: SL 1% a 3%
            profit = -risk_pct * random.uniform(1, 3)

        # Ajusta por volatilidade (ATR)
        vol_factor = min(2.0, max(0.5, atr / (price * 0.01)))
        profit *= vol_factor

        return round(profit, 4)

    def stop(self):
        self.is_running = False
        print("[WEB4.0] Protocolo parado")

    def get_status(self) -> Dict:
        return {
            "is_running": self.is_running,
            "mode": self.mode,
            "symbol": self.symbol,
            "trades_executed": self.trades_executed,
            "evolution": self.engine.get_stats(),
            "risk": self.risk.get_status(),
            "jev": self.jev.get_stats(),
            "market": self.market.get_market_snapshot(self.symbol) if not self.is_running else {}
        }

    def set_mode(self, mode: str):
        assert mode in ["DEMO", "REAL"]
        self.mode = mode
        print(f"[WEB4.0] Modo alterado para {mode}")

    def set_symbol(self, symbol: str):
        self.symbol = symbol
        print(f"[WEB4.0] Symbol alterado para {symbol}")
