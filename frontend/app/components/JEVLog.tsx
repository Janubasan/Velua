"use client";
import { useEffect, useState } from "react";

interface JEVEntry {
  timestamp: string;
  agent_id: string;
  action: string;
  error_type: string;
  loss: number;
  profit: number;
  lesson: string;
  context?: any;
  mode?: string;
}

export function JEVLog() {
  const [logs, setLogs] = useState<JEVEntry[]>([]);
  const [stats, setStats] = useState<any>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api/backend";

  const fetchLogs = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/jev?limit=50`);
      const data = await res.json();
      setLogs(data);
    } catch {}
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/jev/stats`);
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
        const msg = JSON.parse(event.data);
        if (msg.type === "jev_update") {
          setLogs(msg.logs);
          setStats(msg.stats);
        }
      };
    } catch {}

    const interval = setInterval(() => {
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        fetchLogs();
        fetchStats();
      }
    }, 3000);

    return () => {
      clearInterval(interval);
      if (ws) ws.close();
    };
  }, []);

  return (
    <div className="bg-[#15151f] border border-[#23233a] rounded-xl overflow-hidden">
      <div className="p-4 border-b border-[#23233a] flex items-center justify-between">
        <div>
          <h3 className="font-bold flex items-center gap-2">
            <span className="text-[#00ff88]">📓</span> Journal of Error Vectors (.jev)
            <span className="text-xs bg-[#23233a] px-2 py-0.5 rounded-full">ON-CHAIN AUDIT</span>
          </h3>
          <p className="text-xs text-gray-500 mt-1">Cada erro vira dado de treino - filho nunca repete erro do pai</p>
        </div>
        <div className="flex gap-2 text-xs">
          <span className="bg-[#0a0a0f] border border-[#23233a] px-2 py-1 rounded-full">
            Total: {stats?.total_trades || logs.length}
          </span>
          <span className="bg-green-500/10 border border-green-500/20 text-green-300 px-2 py-1 rounded-full">
            WR: {stats?.winrate || 0}%
          </span>
          <span className={`px-2 py-1 rounded-full border ${ (stats?.net_pnl || 0) >=0 ? "bg-green-500/10 border-green-500/20 text-green-300" : "bg-red-500/10 border-red-500/20 text-red-300"}`}>
            PnL: ${stats?.net_pnl || 0}
          </span>
        </div>
      </div>

      {/* Stats bar */}
      {stats?.top_errors && (
        <div className="px-4 py-2 bg-[#0a0a0f] border-b border-[#23233a] flex gap-4 text-xs overflow-x-auto">
          {stats.top_errors.map(([type, count]: any) => (
            <span key={type} className="whitespace-nowrap">
              <span className="text-gray-500">{type}:</span> <b className="text-white">{count}</b>
            </span>
          ))}
        </div>
      )}

      {/* Logs */}
      <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
        <div className="divide-y divide-[#23233a]/50">
          {logs.map((log, i) => {
            const isLoss = log.loss < 0;
            const isWin = log.profit > 0;
            const time = new Date(log.timestamp).toLocaleTimeString();
            
            return (
              <div key={i} className={`p-3 flex gap-3 text-xs hover:bg-[#1a1a2e]/50 transition-colors ${isLoss ? "border-l-2 border-l-red-500/50" : isWin ? "border-l-2 border-l-green-500/50" : "border-l-2 border-l-transparent"}`}>
                <div className="text-gray-500 font-mono text-[10px] min-w-[60px]">{time}</div>
                
                <div className={`min-w-[70px] font-mono font-bold px-2 py-0.5 rounded text-[10px] text-center h-fit ${
                  log.agent_id?.includes("01") ? "bg-purple-500/20 text-purple-300" :
                  log.agent_id?.includes("02") ? "bg-blue-500/20 text-blue-300" :
                  log.agent_id?.includes("03") ? "bg-yellow-500/20 text-yellow-300" :
                  "bg-gray-500/20 text-gray-300"
                }`}>
                  {log.agent_id}
                </div>

                <div className={`min-w-[50px] font-bold px-2 py-0.5 rounded text-center h-fit text-[10px] ${
                  log.action === "BUY" ? "bg-green-500/20 text-green-300" :
                  log.action === "SELL" ? "bg-red-500/20 text-red-300" :
                  "bg-gray-500/20 text-gray-400"
                }`}>
                  {log.action}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-mono ${isLoss ? "text-red-400" : isWin ? "text-green-400" : "text-gray-400"}`}>
                      {isLoss ? `${log.loss}` : isWin ? `+${log.profit}` : "0"} 
                    </span>
                    <span className="text-[10px] bg-[#23233a] px-1.5 py-0.5 rounded text-gray-400">
                      RSI {log.context?.rsi?.toFixed?.(0) || log.context?.rsi} • {log.context?.trend}
                    </span>
                    {log.mode && (
                      <span className={`text-[9px] px-1 py-0.5 rounded ${log.mode === "REAL" ? "bg-red-500/20 text-red-300" : "bg-[#23233a] text-gray-400"}`}>
                        {log.mode}
                      </span>
                    )}
                  </div>
                  <div className="text-gray-300 mt-1 leading-relaxed truncate" title={log.lesson}>
                    💡 {log.lesson}
                  </div>
                </div>

                <div className={`text-[10px] px-1.5 py-0.5 rounded h-fit ${
                  log.error_type === "NONE" ? "bg-green-500/10 text-green-400" :
                  log.error_type === "STOP_LOSS_HIT" ? "bg-red-500/20 text-red-300" :
                  log.error_type === "RISK_BLOCKED" ? "bg-yellow-500/20 text-yellow-300" :
                  "bg-[#23233a] text-gray-400"
                }`}>
                  {log.error_type}
                </div>
              </div>
            );
          })}
        </div>

        {logs.length === 0 && (
          <div className="p-8 text-center text-gray-500 text-sm">
            <div className="text-2xl mb-2">📓</div>
            Nenhum log ainda. Inicie o protocolo para ver os erros virando aprendizado.
          </div>
        )}
      </div>

      <div className="p-2 bg-[#0a0a0f] border-t border-[#23233a] text-[10px] text-gray-500 flex justify-between">
        <span>strategies.jev • JSONL • {logs.length} eventos</span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-pulse" />
          Auditável on-chain Arbitrum • <a href="https://arbiscan.io" target="_blank" className="text-[#8b5cf6] hover:underline">Arbiscan</a>
        </span>
      </div>
    </div>
  );
}
