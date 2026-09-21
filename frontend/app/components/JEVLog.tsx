"use client";
import { useEffect, useState } from "react";

interface JEVTrade {
  id: number;
  client_order_id: string;
  timestamp: string;
  agent_id: string;
  symbol: string;
  side: string;
  price: number;
  qty: number;
  notional: number;
  pnl_net: number;
  pnl_gross: number;
  fee: number;
  error_type: string;
  lesson: string;
  mode: string;
  context_json?: string;
}

interface JEVStats {
  total_trades: number;
  total_pnl_net: number;
  total_fees: number;
  winrate: number;
  profit_factor: number;
  wins: number;
  losses: number;
}

export function JEVLog() {
  const [logs, setLogs] = useState<JEVTrade[]>([]);
  const [stats, setStats] = useState<JEVStats | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api/backend";

  const fetchLogs = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/jev?limit=50`);
      if (!res.ok) return;
      const data = await res.json();
      // Backend returns array of trades
      if (Array.isArray(data)) setLogs(data);
    } catch {}
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/jev/stats`);
      if (!res.ok) return;
      const data = await res.json();
      setStats(data);
    } catch {}
  };

  useEffect(() => {
    fetchLogs();
    fetchStats();

    let ws: WebSocket | null = null;
    try {
      const wsUrl = apiUrl.includes("/api/backend")
        ? `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/api/backend/ws/jev`
        : `${apiUrl.replace("http", "ws").replace("https", "wss")}/ws/jev`;
      ws = new WebSocket(wsUrl);
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.trades) setLogs(msg.trades);
          if (msg.stats) setStats(msg.stats);
          if (msg.type === "jev" && msg.trades) {
            setLogs(msg.trades);
            if (msg.stats) setStats(msg.stats);
          }
        } catch {}
      };
      ws.onerror = () => {
        // fallback handled by interval
      };
    } catch {}

    const interval = setInterval(() => {
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        fetchLogs();
        fetchStats();
      }
    }, 4000);

    return () => {
      clearInterval(interval);
      if (ws) ws.close();
    };
  }, []);

  const totalPnl = stats?.total_pnl_net ?? logs.reduce((acc, t) => acc + (t.pnl_net || 0), 0);
  const isPositive = totalPnl >= 0;

  return (
    <div className="bg-[#15151f] border border-[#23233a] rounded-[20px] overflow-hidden backdrop-blur">
      <div className="p-5 border-b border-[#23233a] flex items-center justify-between">
        <div>
          <h3 className="font-black text-sm flex items-center gap-2">
            <span className="w-6 h-6 bg-[#8b5cf6]/15 border border-[#8b5cf6]/20 rounded-full flex items-center justify-center text-xs">📓</span>
            JEV REAL • SQLITE AUDITADO
            <span className="text-[10px] bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88] px-2 py-0.5 rounded-full font-mono">UNIQUE CLIENT_ORDER_ID</span>
          </h3>
          <p className="text-[11px] text-gray-500 mt-1">Cada erro vira vetor de aprendizado • Idempotência • Reconciliação • Filho nunca repete erro do pai</p>
        </div>
        <div className="flex gap-2 text-xs">
          <span className="bg-[#0a0a0f] border border-[#23233a] px-2.5 py-1 rounded-full">
            {stats?.total_trades ?? logs.length} trades
          </span>
          <span className={`px-2.5 py-1 rounded-full border ${isPositive ? "bg-[#00ff88]/10 border-[#00ff88]/20 text-[#00ff88]" : "bg-[#ff3b5c]/10 border-[#ff3b5c]/20 text-[#ff3b5c]"}`}>
            PnL ${totalPnl.toFixed(2)}
          </span>
          <span className="bg-[#23233a] px-2.5 py-1 rounded-full">
            WR {stats?.winrate?.toFixed(1) ?? "0"}%
          </span>
        </div>
      </div>

      {/* Stats bar auditado */}
      {stats && (
        <div className="px-5 py-3 bg-[#0a0a0f] border-b border-[#23233a] grid grid-cols-4 gap-4 text-xs">
          <div>
            <div className="text-gray-500 text-[10px] font-mono tracking-widest">PROFIT FACTOR</div>
            <div className={`font-black ${stats.profit_factor >= 1.2 ? "text-[#00ff88]" : "text-yellow-400"}`}>{stats.profit_factor?.toFixed(2) ?? "0"}</div>
          </div>
          <div>
            <div className="text-gray-500 text-[10px] font-mono tracking-widest">WINS / LOSSES</div>
            <div className="font-bold text-white">{stats.wins}W / {stats.losses}L</div>
          </div>
          <div>
            <div className="text-gray-500 text-[10px] font-mono tracking-widest">TAXAS</div>
            <div className="font-bold text-gray-300">${stats.total_fees?.toFixed(2) ?? "0"}</div>
          </div>
          <div>
            <div className="text-gray-500 text-[10px] font-mono tracking-widest">AUDIT</div>
            <div className="text-[#8b5cf6] font-bold">SQLite WAL • UNIQUE</div>
          </div>
        </div>
      )}

      {/* Logs */}
      <div className="max-h-[480px] overflow-y-auto scrollbar-thin">
        {logs.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 bg-[#23233a] rounded-2xl flex items-center justify-center mx-auto mb-3">📓</div>
            <p className="text-sm text-gray-400">Nenhum log JEV ainda</p>
            <p className="text-xs text-gray-600 mt-1">Inicie o protocolo para ver erros virando aprendizado</p>
            <div className="mt-4 bg-[#0a0a0f] border border-[#23233a] rounded-xl p-3 text-left max-w-sm mx-auto text-[11px]">
              <div className="text-gray-500 font-mono">JEV Real = SQLite com client_order_id UNIQUE</div>
              <div className="text-gray-300 mt-1">• Idempotência: retry não duplica ordem</div>
              <div className="text-gray-300">• Reconciliação: local vs exchange</div>
              <div className="text-gray-300">• Lições influenciam decisão real</div>
              <div className="text-[#00ff88]/70 mt-2">✅ Auditável de verdade, diferente de on-chain falso</div>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-[#23233a]/50">
            {logs.map((log) => {
              const isLoss = (log.pnl_net ?? 0) < 0;
              const isWin = (log.pnl_net ?? 0) > 0;
              const time = new Date(log.timestamp).toLocaleTimeString();
              const date = new Date(log.timestamp).toLocaleDateString();
              let rsiInfo = "";
              try {
                const ctx = log.context_json ? JSON.parse(log.context_json) : null;
                if (ctx?.rsi) rsiInfo = `RSI ${ctx.rsi} • ${ctx.trend ?? ""}`;
              } catch {}

              return (
                <div key={log.client_order_id || log.id} className={`p-4 hover:bg-[#1a1a2e]/50 transition-colors group ${isLoss ? "border-l-2 border-l-[#ff3b5c]/50" : isWin ? "border-l-2 border-l-[#00ff88]/50" : "border-l-2 border-l-transparent"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${log.side === "BUY" ? "bg-[#00ff88]/15 border-[#00ff88]/20 text-[#00ff88]" : "bg-[#ff3b5c]/15 border-[#ff3b5c]/20 text-[#ff3b5c]"}`}>
                        {log.side?.[0] ?? "?"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-white">{log.agent_id}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${log.side === "BUY" ? "bg-[#00ff88]/15 text-[#00ff88]" : "bg-[#ff3b5c]/15 text-[#ff3b5c]"}`}>
                            {log.side} {log.symbol}
                          </span>
                          <span className="text-[10px] bg-[#23233a] px-1.5 py-0.5 rounded text-gray-400">
                            {Number(log.qty || 0).toFixed(6)} @ ${Number(log.price || 0).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] text-gray-500 font-mono">{date} {time}</span>
                          <span className="text-[10px] bg-[#0a0a0f] border border-[#23233a] px-1.5 py-0.5 rounded font-mono text-gray-500 truncate max-w-[180px]">
                            {log.client_order_id}
                          </span>
                          {rsiInfo && <span className="text-[10px] bg-[#23233a] px-1.5 py-0.5 rounded text-gray-400">{rsiInfo}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`font-mono font-black text-sm ${isWin ? "text-[#00ff88]" : isLoss ? "text-[#ff3b5c]" : "text-gray-400"}`}>
                        {isWin ? "+" : ""}${(log.pnl_net ?? 0).toFixed(4)}
                      </div>
                      <div className="text-[11px] text-gray-500">
                        Notional ${Number(log.notional || 0).toFixed(2)} • Fee ${Number(log.fee || 0).toFixed(4)}
                      </div>
                      <div className={`text-[10px] px-2 py-0.5 rounded-full mt-1 inline-block border ${log.error_type === "NONE" ? "bg-[#00ff88]/10 border-[#00ff88]/20 text-[#00ff88]" : log.error_type === "RISK_BLOCKED" ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-300" : "bg-[#ff3b5c]/10 border-[#ff3b5c]/20 text-[#ff3b5c]"}`}>
                        {log.error_type}
                      </div>
                    </div>
                  </div>

                  {log.lesson && (
                    <div className="mt-3 bg-[#0a0a0f] border border-[#23233a] rounded-xl p-3">
                      <div className="text-[11px] text-gray-400 font-mono">💡 LIÇÃO • INFLUENCIA DECISÃO REAL</div>
                      <div className="text-xs text-gray-300 mt-1 leading-relaxed">{log.lesson}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${log.mode === "paper" ? "bg-[#23233a] text-gray-400" : "bg-[#ff3b5c]/15 text-[#ff3b5c]"}`}>
                          {log.mode?.toUpperCase()}
                        </span>
                        <span className="text-[10px] text-gray-600">SQLite UNIQUE • Idempotente • Reconciliável • JEV que filho usa</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="p-3 bg-[#0a0a0f] border-t border-[#23233a] text-[10px] text-gray-500 flex justify-between items-center">
        <span>jev_real.db • WAL • {logs.length} eventos • client_order_id UNIQUE</span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-pulse" />
          Auditável real • Reconciliação • Sem gas falso on-chain
        </span>
      </div>
    </div>
  );
}
