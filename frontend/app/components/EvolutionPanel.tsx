"use client";
import { useEffect, useState } from "react";

interface Agent {
  id: string;
  fitness: number;
  balance: number;
  winrate: number;
  trades: number;
  wins: number;
  losses: number;
  dna: {
    rsi_buy: number;
    rsi_sell: number;
    risk_per_trade: number;
    stop_loss: number;
    take_profit: number;
  };
  is_active: boolean;
  generation: number;
  total_pnl: number;
}

export function EvolutionPanel() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [stats, setStats] = useState<any>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api/backend";

  const fetchAgents = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/agents`);
      const data = await res.json();
      setAgents(data);
    } catch (e) {
      console.error("Erro fetch agents:", e);
    }
  };

  const fetchStatus = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/status`);
      const data = await res.json();
      setIsRunning(data.is_running);
      setStats(data);
    } catch {}
  };

  useEffect(() => {
    fetchAgents();
    fetchStatus();

    // WebSocket para tempo real - preview compatível
    let ws: WebSocket | null = null;
    try {
      const wsUrl = apiUrl.includes("/api/backend")
        ? `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/api/backend/ws/agents`
        : `${apiUrl.replace("http", "ws").replace("https", "wss")}/ws/agents`;
      ws = new WebSocket(wsUrl);
      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.type === "agents_update") {
          setAgents(msg.agents);
        }
      };
      ws.onerror = () => {
        // fallback polling
        const interval = setInterval(fetchAgents, 2000);
        return () => clearInterval(interval);
      };
    } catch {
      // fallback polling se WS falhar
    }

    const interval = setInterval(() => {
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        fetchAgents();
      }
      fetchStatus();
    }, 3000);

    return () => {
      clearInterval(interval);
      if (ws) ws.close();
    };
  }, []);

  const startEvolution = async () => {
    try {
      await fetch(`${apiUrl}/api/start`, { method: "POST" });
      setIsRunning(true);
    } catch (e) {
      console.error(e);
    }
  };

  const stopEvolution = async () => {
    try {
      await fetch(`${apiUrl}/api/stop`, { method: "POST" });
      setIsRunning(false);
    } catch {}
  };

  const forceEvolve = async () => {
    await fetch(`${apiUrl}/api/evolve`, { method: "POST" });
    fetchAgents();
  };

  const sorted = [...agents].sort((a, b) => b.fitness - a.fitness);
  const topAgent = sorted[0];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="text-[#8b5cf6]">🧬</span> População Evolutiva
            <span className="text-xs bg-[#23233a] px-2 py-1 rounded-full ml-2">
              Gen {stats?.evolution?.generation || 0}
            </span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {agents.length} agentes • Top fitness: {topAgent?.fitness.toFixed(2) || 0} • Total trades: {stats?.evolution?.total_trades || 0}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={forceEvolve}
            className="px-3 py-1.5 bg-[#23233a] hover:bg-[#2a2a45] rounded-full text-xs border border-[#2a2a45]"
          >
            🧬 Evoluir Agora
          </button>
          {isRunning ? (
            <button
              onClick={stopEvolution}
              className="px-4 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 rounded-full text-xs font-medium"
            >
              ⏸️ Pausar
            </button>
          ) : (
            <button
              onClick={startEvolution}
              className="px-4 py-1.5 bg-[#00ff88]/20 hover:bg-[#00ff88]/30 border border-[#00ff88]/30 text-[#00ff88] rounded-full text-xs font-bold animate-pulse"
            >
              ▶️ Iniciar Web4
            </button>
          )}
        </div>
      </div>

      {/* Risk Bar */}
      {stats?.risk && (
        <div className="bg-[#15151f] border border-[#23233a] rounded-xl p-3 flex items-center justify-between text-xs">
          <div className="flex gap-4">
            <span>💰 Balance: <b className="text-white">${stats.risk.current_balance}</b></span>
            <span>📉 Drawdown: <b className={stats.risk.drawdown_pct > 5 ? "text-red-400" : "text-green-400"}>{stats.risk.drawdown_pct}%</b></span>
            <span>📊 Exposição: ${stats.risk.exposure_usd} / $3 max</span>
            <span>🔥 Streak: {stats.risk.consecutive_losses} losses</span>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs ${stats.risk.is_paused ? "bg-red-500/20 text-red-300" : "bg-green-500/20 text-green-300"}`}>
            {stats.risk.is_paused ? `⏸️ ${stats.risk.pause_reason}` : "🟢 Operando"}
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {sorted.map((agent, idx) => {
          const isTop = idx === 0;
          const isWeak = agent.fitness < 90 || !agent.is_active;
          const pnlColor = agent.total_pnl >= 0 ? "text-[#00ff88]" : "text-[#ff3b5c]";
          
          return (
            <div
              key={agent.id}
              className={`relative rounded-xl border p-4 transition-all ${
                isTop
                  ? "bg-gradient-to-br from-[#00ff88]/10 to-[#8b5cf6]/10 border-[#00ff88]/30 shadow-lg shadow-green-500/10"
                  : isWeak
                  ? "bg-red-950/20 border-red-900/30 opacity-75"
                  : "bg-[#15151f] border-[#23233a] hover:border-[#2a2a45]"
              }`}
            >
              {isTop && (
                <div className="absolute -top-2 -right-2 bg-[#00ff88] text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                  🔥 TOP
                </div>
              )}
              {isWeak && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  ☠️ {agent.is_active ? "SENDO SUBSTITUÍDO" : "MORTO"}
                </div>
              )}

              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-mono font-bold text-sm flex items-center gap-2">
                    {agent.id}
                    <span className="text-[10px] bg-[#23233a] px-1.5 py-0.5 rounded">G{agent.generation}</span>
                  </h3>
                  <div className="flex gap-2 mt-1">
                    <span className={`text-xs font-bold ${pnlColor}`}>${agent.balance.toFixed(2)}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${agent.winrate >= 50 ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}>
                      {agent.winrate}% WR
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Fitness</div>
                  <div className={`font-bold ${isTop ? "text-[#00ff88]" : "text-white"}`}>{agent.fitness.toFixed(1)}</div>
                </div>
              </div>

              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between text-gray-400">
                  <span>Trades: {agent.trades}</span>
                  <span className="text-green-400">{agent.wins}W</span>
                  <span className="text-red-400">{agent.losses}L</span>
                  <span className={pnlColor}>{agent.total_pnl >= 0 ? "+" : ""}{agent.total_pnl.toFixed(2)}</span>
                </div>
                
                <div className="bg-black/30 rounded-lg p-2 space-y-1 font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-500">RSI Buy/Sell</span>
                    <span className="text-white">{agent.dna.rsi_buy.toFixed(0)} / {agent.dna.rsi_sell.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Risk/SL/TP</span>
                    <span className="text-white">{(agent.dna.risk_per_trade*100).toFixed(1)}% / {(agent.dna.stop_loss*100).toFixed(1)}% / {(agent.dna.take_profit*100).toFixed(1)}%</span>
                  </div>
                </div>

                {/* Barra de fitness visual */}
                <div className="w-full bg-[#0a0a0f] rounded-full h-1 overflow-hidden">
                  <div 
                    className={`h-full transition-all ${isTop ? "bg-[#00ff88]" : isWeak ? "bg-red-500" : "bg-[#8b5cf6]"}`}
                    style={{ width: `${Math.min(100, Math.max(5, (agent.fitness / 200) * 100))}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {agents.length === 0 && (
        <div className="bg-[#15151f] border border-dashed border-[#23233a] rounded-xl p-8 text-center">
          <div className="text-4xl mb-3">🧬</div>
          <p className="text-gray-400 text-sm">Nenhum agente carregado. Clique em "Iniciar Web4" para começar a evolução.</p>
          <button onClick={startEvolution} className="mt-4 px-6 py-2 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-full text-sm font-medium">
            Iniciar Protocolo
          </button>
        </div>
      )}
    </div>
  );
}
