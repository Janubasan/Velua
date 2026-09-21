"use client";
import { useEffect, useState, useRef } from "react";

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
    stop_atr_mult?: number;
    take_atr_mult?: number;
    ema_fast?: number;
    ema_slow?: number;
  };
  is_active: boolean;
  generation: number;
  total_pnl: number;
}

export function EvolutionPanel() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api/backend";

  const fetchAgents = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/agents`);
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data)) setAgents(data);
    } catch (e) {
      // silent
    }
  };

  const fetchStatus = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/status`);
      if (!res.ok) return;
      const data = await res.json();
      setIsRunning(data.is_running);
      setStats(data);
    } catch {}
  };

  useEffect(() => {
    fetchAgents();
    fetchStatus();

    // WebSocket - preview compatível wss://host/api/backend/ws/agents
    try {
      const wsUrl = apiUrl.includes("/api/backend")
        ? `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/api/backend/ws/evolution`
        : `${apiUrl.replace("http", "ws").replace("https", "wss")}/ws/evolution`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          // Backend sends {type, agents, stats} or agents_update
          if (msg.agents) setAgents(msg.agents);
          if (msg.agents_update) setAgents(msg.agents_update);
          if (msg.stats) setStats((prev: any) => ({ ...prev, evolution: msg.stats }));
        } catch {}
      };

      ws.onopen = () => {
        console.log("[Evolution] WS connected", wsUrl);
      };

      ws.onerror = () => {
        console.log("[Evolution] WS error, fallback to polling");
      };

      ws.onclose = () => {
        console.log("[Evolution] WS closed");
      };
    } catch (e) {
      console.log("[Evolution] WS failed", e);
    }

    // Polling fallback - reduzido para 5s para não spammar backend
    const interval = setInterval(() => {
      const ws = wsRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        fetchAgents();
      }
      fetchStatus();
    }, 5000);

    return () => {
      clearInterval(interval);
      if (wsRef.current) {
        try { wsRef.current.close(); } catch {}
      }
    };
  }, []);

  const startEvolution = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/start`, { method: "POST" });
      if (res.ok) setIsRunning(true);
      else {
        const err = await res.json();
        if (err.detail?.includes("already running")) setIsRunning(true);
      }
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
    try {
      await fetch(`${apiUrl}/api/evolve`, { method: "POST" });
      fetchAgents();
    } catch {}
  };

  const sorted = [...agents].sort((a, b) => b.fitness - a.fitness);
  const topAgent = sorted[0];

  // Risk data - backend retorna risk com current_equity etc
  const risk = stats?.risk;
  const evolution = stats?.evolution;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black flex items-center gap-2 tracking-tight">
            <span className="w-8 h-8 bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] rounded-xl flex items-center justify-center text-sm">🧬</span>
            POPULAÇÃO EVOLUTIVA • WEB4
            <span className="text-xs bg-[#23233a] border border-[#2a2a45] px-2.5 py-1 rounded-full ml-2 font-mono">
              Gen {evolution?.generation || stats?.evolution?.generation || 0}
            </span>
            <span className="text-xs bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88] px-2.5 py-1 rounded-full font-mono">
              {agents.length} AGENTES
            </span>
          </h2>
          <p className="text-xs text-gray-500 mt-1.5">
            {agents.length} agentes • Top fitness: {topAgent?.fitness.toFixed(1) || "0"} • Total trades: {evolution?.total_trades || 0} • IDs persistentes agent_00..11 • Mutação com clamp
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={forceEvolve}
            className="px-4 py-2 bg-[#1a1a2e] hover:bg-[#23233a] rounded-full text-xs border border-[#23233a] font-bold transition-colors"
          >
            🧬 Evoluir Agora
          </button>
          {isRunning ? (
            <button
              onClick={stopEvolution}
              className="px-5 py-2 bg-[#ff3b5c]/15 hover:bg-[#ff3b5c]/25 border border-[#ff3b5c]/30 text-[#ff3b5c] rounded-full text-xs font-black transition-colors"
            >
              ⏸️ Pausar Protocolo
            </button>
          ) : (
            <button
              onClick={startEvolution}
              className="px-5 py-2 bg-[#00ff88]/15 hover:bg-[#00ff88]/25 border border-[#00ff88]/30 text-[#00ff88] rounded-full text-xs font-black animate-pulse shadow-lg shadow-[#00ff88]/10 transition-colors"
            >
              ▶️ Iniciar Web4 Real
            </button>
          )}
        </div>
      </div>

      {/* Risk Bar auditado */}
      {risk && (
        <div className="bg-[#15151f]/80 backdrop-blur border border-[#23233a] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-[#00ff88] rounded-full animate-pulse" />
              💰 Equity: <b className="text-white">${(risk.current_equity ?? risk.current_balance ?? 0).toFixed(2)}</b>
            </span>
            <span>📉 Drawdown: <b className={(risk.drawdown_pct ?? 0) > 5 ? "text-[#ff3b5c]" : "text-[#00ff88]"}>{(risk.drawdown_pct ?? 0).toFixed(2)}%</b></span>
            <span>📊 Exposição: ${risk.exposure_usd ?? 0} / {(risk.limits?.max_exposure_pct ?? 30)}% max</span>
            <span>🔥 Streak: {risk.consecutive_losses ?? 0} losses • {risk.daily_trades ?? 0}/{risk.max_trades_per_day ?? risk.limits?.max_trades_per_day ?? 20} trades/dia</span>
            <span>💸 Daily PnL: <b className={(risk.daily_pnl ?? 0) >=0 ? "text-[#00ff88]" : "text-[#ff3b5c]"}>${(risk.daily_pnl ?? 0).toFixed(2)}</b></span>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold border ${risk.is_killed ? "bg-[#ff3b5c]/15 border-[#ff3b5c]/20 text-[#ff3b5c]" : "bg-[#00ff88]/10 border-[#00ff88]/20 text-[#00ff88]"}`}>
            {risk.is_killed ? `🚨 KILL ${risk.kill_reason}` : "🟢 Operando • Gate Ativo"}
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sorted.map((agent, idx) => {
          const isTop = idx === 0;
          const isWeak = !agent.is_active || agent.fitness < 50;
          const pnlColor = agent.total_pnl >= 0 ? "text-[#00ff88]" : "text-[#ff3b5c]";
          
          return (
            <div
              key={agent.id}
              className={`relative rounded-[20px] border p-4 transition-all group ${
                isTop
                  ? "bg-gradient-to-br from-[#00ff88]/10 via-[#8b5cf6]/10 to-[#15151f] border-[#00ff88]/30 shadow-xl shadow-[#00ff88]/10 scale-[1.02]"
                  : isWeak
                  ? "bg-[#1a0f0f]/50 border-[#ff3b5c]/20 opacity-60"
                  : "bg-[#15151f] border-[#23233a] hover:border-[#2a2a45] hover:bg-[#1a1a2e]"
              }`}
            >
              {isTop && (
                <div className="absolute -top-2 -right-2 bg-[#00ff88] text-black text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg">
                  🔥 TOP • GEN {agent.generation}
                </div>
              )}
              {isWeak && (
                <div className="absolute -top-2 -right-2 bg-[#ff3b5c] text-white text-[10px] font-bold px-2 py-1 rounded-full">
                  ☠️ {agent.is_active ? "SENDO SUBSTITUÍDO" : "MORTO"}
                </div>
              )}

              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-mono font-black text-sm flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${isTop ? "bg-[#00ff88] text-black" : "bg-[#23233a] text-gray-400"}`}>
                      {idx + 1}
                    </span>
                    {agent.id}
                    <span className="text-[10px] bg-[#0a0a0f] border border-[#23233a] px-1.5 py-0.5 rounded font-mono">G{agent.generation}</span>
                  </h3>
                  <div className="flex gap-2 mt-1.5">
                    <span className={`text-xs font-black ${pnlColor}`}>${agent.balance.toFixed(2)}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${agent.winrate >= 50 ? "bg-[#00ff88]/10 border-[#00ff88]/20 text-[#00ff88]" : "bg-[#ff3b5c]/10 border-[#ff3b5c]/20 text-[#ff3b5c]"}`}>
                      {agent.winrate}% WR
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-gray-500 font-mono tracking-widest">FITNESS</div>
                  <div className={`font-black text-lg ${isTop ? "text-[#00ff88]" : "text-white"}`}>{agent.fitness.toFixed(1)}</div>
                </div>
              </div>

              <div className="space-y-2.5 text-[11px]">
                <div className="flex justify-between text-gray-400 bg-[#0a0a0f] rounded-xl p-2 border border-[#23233a]/50">
                  <span>Trades: <b className="text-white">{agent.trades}</b></span>
                  <span className="text-[#00ff88]">{agent.wins}W</span>
                  <span className="text-[#ff3b5c]">{agent.losses}L</span>
                  <span className={`font-bold ${pnlColor}`}>{agent.total_pnl >= 0 ? "+" : ""}{agent.total_pnl.toFixed(2)}</span>
                </div>
                
                <div className="bg-[#0a0a0f] border border-[#23233a]/50 rounded-xl p-2.5 space-y-1.5 font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-500">RSI Buy/Sell</span>
                    <span className="text-white font-bold">{agent.dna.rsi_buy.toFixed(0)} / {agent.dna.rsi_sell.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">EMA Fast/Slow</span>
                    <span className="text-white">{agent.dna.ema_fast ?? 9} / {agent.dna.ema_slow ?? 21}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Risk/SL/TP ATR</span>
                    <span className="text-white">{(agent.dna.risk_per_trade*100).toFixed(1)}% / {agent.dna.stop_atr_mult?.toFixed(1) ?? (agent.dna.stop_loss*100).toFixed(1)}x / {agent.dna.take_atr_mult?.toFixed(1) ?? (agent.dna.take_profit*100).toFixed(1)}x</span>
                  </div>
                </div>

                {/* Barra de fitness visual */}
                <div className="w-full bg-[#0a0a0f] rounded-full h-1.5 overflow-hidden border border-[#23233a]/30">
                  <div 
                    className={`h-full transition-all duration-500 ${isTop ? "bg-gradient-to-r from-[#00ff88] to-[#8b5cf6]" : isWeak ? "bg-[#ff3b5c]" : "bg-[#8b5cf6]"}`}
                    style={{ width: `${Math.min(100, Math.max(5, (agent.fitness / 200) * 100))}%` }}
                  />
                </div>

                <div className="flex justify-between text-[10px] text-gray-600 font-mono">
                  <span>ID persistente • Não uuid</span>
                  <span className={agent.is_active ? "text-[#00ff88]" : "text-[#ff3b5c]"}>{agent.is_active ? "● ATIVO" : "○ INATIVO"}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {agents.length === 0 && (
        <div className="bg-[#15151f] border border-dashed border-[#23233a] rounded-[20px] p-12 text-center">
          <div className="w-16 h-16 bg-[#23233a] rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">🧬</div>
          <p className="text-gray-300 font-bold">Nenhum agente carregado</p>
          <p className="text-gray-500 text-sm mt-1">Clique em Iniciar Web4 para começar a evolução real com IDs persistentes agent_00..11</p>
          <button onClick={startEvolution} className="mt-6 px-8 py-3 bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] hover:from-[#7c3aed] hover:to-[#4f46e5] text-white rounded-full text-sm font-black shadow-lg shadow-purple-500/20 transition-all">
            🧬 Iniciar Protocolo JEV Real
          </button>
          <div className="mt-4 text-[11px] text-gray-600 bg-[#0a0a0f] border border-[#23233a] rounded-xl p-3 max-w-md mx-auto">
            <div className="font-mono text-gray-500">Fixes aplicados:</div>
            <div>• IDs determinísticos agent_00..11, não uuid por restart</div>
            <div>• Mutação com clamp rsi_buy 10-45, rsi_sell 55-90</div>
            <div>• Evolução por counter, não sum%50</div>
            <div>• Fitness de backtest, não random</div>
          </div>
        </div>
      )}
    </div>
  );
}
