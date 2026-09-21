"""
Motor Evolutivo - Mata os fracos, clona e muta os bons
Web 4.0: Agentes autônomos que se auto-substituem
"""
import random
import time
from typing import List, Dict
from agents.trading_agent import TradingAgent


class EvolutionEngine:
    def __init__(self, population_size=12, replacement_rate=0.4, initial_balance=100.0):
        self.population_size = population_size
        self.replacement_rate = replacement_rate
        self.initial_balance = initial_balance
        self.population: List[TradingAgent] = [TradingAgent(initial_balance=initial_balance) for _ in range(population_size)]
        self.generation = 0
        self.evolution_history: List[Dict] = []
        self.best_fitness_ever = 0
        self.best_agent_ever = None

    def evolve(self) -> List[TradingAgent]:
        """Evolução: rankeia, mata os piores, clona e muta os melhores"""
        self.generation += 1
        
        # Filtra apenas ativos e rankeia por fitness
        active_pop = [a for a in self.population if a.is_active]
        if not active_pop:
            print("[EVOLUÇÃO] Todos inativos, resetando população")
            self.population = [TradingAgent(initial_balance=self.initial_balance) for _ in range(self.population_size)]
            return self.population

        active_pop.sort(key=lambda a: a.fitness, reverse=True)

        # Atualiza melhor de todos os tempos
        if active_pop and active_pop[0].fitness > self.best_fitness_ever:
            self.best_fitness_ever = active_pop[0].fitness
            self.best_agent_ever = active_pop[0].to_dict()

        # Calcula sobreviventes
        num_survivors = max(2, int(len(active_pop) * (1 - self.replacement_rate)))
        survivors = active_pop[:num_survivors]
        num_to_replace = self.population_size - len(survivors)

        # Log
        top = survivors[0]
        print(f"[WEB4.0 Gen {self.generation}] Top: {top.id} | Fitness: {top.fitness:.2f} | Balance: ${top.balance:.2f} | Winrate: {top.wins/max(1,top.trades)*100:.1f}% | Trades: {top.trades}")
        print(f"[EVOLUÇÃO] Eliminando {num_to_replace} agentes falhos | Survivors: {len(survivors)}")

        # Estatísticas para histórico
        avg_fitness = sum(a.fitness for a in active_pop) / len(active_pop)
        avg_balance = sum(a.balance for a in active_pop) / len(active_pop)
        self.evolution_history.append({
            "generation": self.generation,
            "timestamp": time.time(),
            "top_fitness": top.fitness,
            "top_balance": top.balance,
            "avg_fitness": avg_fitness,
            "avg_balance": avg_balance,
            "eliminated": num_to_replace,
            "top_dna": top.dna
        })

        # Cria novos agentes via crossover + mutação dos top 3
        new_agents = []
        for _ in range(num_to_replace):
            # Seleciona 2 pais dos top 3 (torneio)
            parent_pool = survivors[:min(3, len(survivors))]
            if len(parent_pool) >= 2:
                parent1, parent2 = random.sample(parent_pool, 2)
                child_dna = self.crossover_mutate(parent1.dna, parent2.dna)
                child = TradingAgent(dna=child_dna, initial_balance=self.initial_balance)
            else:
                # Se poucos sobreviventes, clona o melhor com mutação
                child = survivors[0].clone_with_mutation(generation=self.generation)
            
            child.evolution_generation = self.generation
            new_agents.append(child)

        self.population = survivors + new_agents
        return self.population

    def crossover_mutate(self, dna1: Dict, dna2: Dict) -> Dict:
        """Crossover + mutação 20%"""
        child = {}
        for k in dna1:
            # Crossover: escolhe aleatoriamente de um dos pais
            child[k] = random.choice([dna1[k], dna2[k]])
            
            # Mutação 20%
            if random.random() < 0.2:
                if isinstance(child[k], bool):
                    child[k] = not child[k]
                elif isinstance(child[k], int):
                    child[k] = int(child[k] * random.uniform(0.8, 1.2))
                else:
                    child[k] *= random.uniform(0.8, 1.2)

        # Garante limites válidos
        child["rsi_buy"] = max(10, min(45, int(child.get("rsi_buy", 30))))
        child["rsi_sell"] = max(55, min(90, int(child.get("rsi_sell", 70))))
        child["risk_per_trade"] = max(0.002, min(0.05, float(child.get("risk_per_trade", 0.01))))
        child["stop_loss"] = max(0.005, min(0.05, float(child.get("stop_loss", 0.02))))
        child["take_profit"] = max(0.01, min(0.1, float(child.get("take_profit", 0.04))))
        child["cooldown_sec"] = max(5, min(120, int(child.get("cooldown_sec", 30))))

        return child

    def get_population_status(self) -> List[Dict]:
        return [a.to_dict() for a in sorted(self.population, key=lambda x: x.fitness, reverse=True)]

    def get_top_agents(self, n: int = 3) -> List[TradingAgent]:
        return sorted(self.population, key=lambda a: a.fitness, reverse=True)[:n]

    def get_stats(self) -> Dict:
        if not self.population:
            return {}
        active = [a for a in self.population if a.is_active]
        return {
            "generation": self.generation,
            "population_size": len(self.population),
            "active": len(active),
            "best_fitness_ever": round(self.best_fitness_ever, 2),
            "best_agent_ever": self.best_agent_ever,
            "avg_fitness": round(sum(a.fitness for a in active) / max(1, len(active)), 2) if active else 0,
            "total_trades": sum(a.trades for a in self.population),
            "history": self.evolution_history[-20:]  # últimas 20 gerações
        }

    def force_evolution(self):
        """Força evolução quando drawdown atingido"""
        print("[EVOLUÇÃO FORÇADA] Drawdown detectado - evoluindo")
        return self.evolve()

    def reset(self):
        self.population = [TradingAgent(initial_balance=self.initial_balance) for _ in range(self.population_size)]
        self.generation = 0
        self.evolution_history = []
        print("[EVOLUÇÃO] População resetada")
