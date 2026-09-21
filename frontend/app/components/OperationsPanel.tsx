"use client";
import { useEffect, useState } from "react";

interface Operation {
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
  fee: number;
  error_type: string;
  lesson: string;
  mode: string;
}

export function OperationsPanel() {
  const [ops, setOps] = useState<Operation[]>([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api/backend";

  const fetchOps = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/analytics`);
      const data = await res.json();
      setOps(data.recent_operations || []);
    } catch {}
  };

  useEffect(() => {
    fetchOps();
    const interval = setInterval(fetchOps, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#15151f] border border-[#23233a] rounded-[20px] overflow-hidden">
      <div className="p-5 border-b border-[#23233a] flex items-center justify-between">
        <div>
          <h3 className="font-black text-sm flex items-center gap-2">
            <span className="w-6 h-6 bg-[#00ff88]/15 border border-[#00ff88]/20 rounded-full flex items-center justify-center text-xs">⚡</span>
            OPERAÇÕES AUDITADAS • REALIDADE
          </h3>
          <p className="text-[11px] text-gray-500 mt-1">Cada operação com client_order_id único, taxa e slippage reais</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-[#0a0a0f] border border-[#23233a] px-2.5 py-1 rounded-full">{ops.length} ops</span>
          <span className="text-xs bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88] px-2.5 py-1 rounded-full flex items-center gap-1">
            <span className="w-1 h-1 bg-[#00ff88] rounded-full animate-pulse" />
            SQLITE UNIQUE
          </span>
        </div>
      </div>

      <div className="max-h-[500px] overflow-y-auto scrollbar-thin">
        {ops.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 bg-[#23233a] rounded-2xl flex items-center justify-center mx-auto mb-3">📊</div>
            <p className="text-sm text-gray-400">Nenhuma operação ainda</p>
            <p className="text-xs text-gray-600 mt-1">Inicie o protocolo ou faça trade manual</p>
            <div className="mt-4 text-[11px] bg-[#0a0a0f] border border-[#23233a] rounded-xl p-3 text-left max-w-sm mx-auto">
              <div className="text-gray-500 font-mono">Como gerar operações:</div>
              <div className="text-gray-300 mt-1">• Clique ▶️ Iniciar Web4 no painel de agentes</div>
              <div className="text-gray-300">• Ou POST /trade/execute com notional ≥ $5</div>
              <div className="text-yellow-300/70 mt-2">⚠️ $100 com 1% risco = $1/trade impossível (mín $5). Use $1000.</div>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-[#23233a]/50">
            {ops.map((op) => {
              const isWin = op.pnl_net > 0;
              const isLoss = op.pnl_net < 0;
              const time = new Date(op.timestamp).toLocaleTimeString();
              const date = new Date(op.timestamp).toLocaleDateString();
              
              return (
                <div key={op.id} className="p-4 hover:bg-[#1a1a2e]/50 transition-colors group">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${
                        op.side === "BUY" ? "bg-[#00ff88]/15 border-[#00ff88]/20 text-[#00ff88]" : "bg-[#ff3b5c]/15 border-[#ff3b5c]/20 text-[#ff3b5c]"
                      }`}>
                        {op.side === "BUY" ? "B" : "S"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-white">{op.agent_id}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            op.side === "BUY" ? "bg-[#00ff88]/15 text-[#00ff88]" : "bg-[#ff3b5c]/15 text-[#ff3b5c]"
                          }`}>
                            {op.side} {op.symbol}
                          </span>
                          <span className="text-[10px] bg-[#23233a] px-1.5 py-0.5 rounded text-gray-400">
                            {op.qty.toFixed(6)} @ ${op.price.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] text-gray-500 font-mono">{date} {time}</span>
                          <span className="text-[10px] bg-[#0a0a0f] border border-[#23233a] px-1.5 py-0.5 rounded font-mono text-gray-500 truncate max-w-[180px]">
                            {op.client_order_id}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`font-mono font-black text-sm ${isWin ? "text-[#00ff88]" : isLoss ? "text-[#ff3b5c]" : "text-gray-400"}`}>
                        {isWin ? "+" : ""}${op.pnl_net.toFixed(4)}
                      </div>
                      <div className="text-[11px] text-gray-500">
                        Notional ${op.notional?.toFixed(2) || "0"} • Fee ${op.fee?.toFixed(4) || "0"}
                      </div>
                      <div className={`text-[10px] px-2 py-0.5 rounded-full mt-1 inline-block border ${
                        op.error_type === "NONE" ? "bg-[#00ff88]/10 border-[#00ff88]/20 text-[#00ff88]" :
                        op.error_type === "RISK_BLOCKED" ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-300" :
                        "bg-[#ff3b5c]/10 border-[#ff3b5c]/20 text-[#ff3b5c]"
                      }`}>
                        {op.error_type}
                      </div>
                    </div>
                  </div>

                  {op.lesson && (
                    <div className="mt-3 bg-[#0a0a0f] border border-[#23233a] rounded-xl p-3">
                      <div className="text-[11px] text-gray-400 font-mono">💡 LIÇÃO • AUDITADA</div>
                      <div className="text-xs text-gray-300 mt-1 leading-relaxed">{op.lesson}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${op.mode === "paper" ? "bg-[#23233a] text-gray-400" : "bg-[#ff3b5c]/15 text-[#ff3b5c]"}`}>
                          {op.mode.toUpperCase()}
                        </span>
                        <span className="text-[10px] text-gray-600">SQLite UNIQUE • Idempotente • Reconciliável</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="p-3 bg-[#0a0a0f] border-t border-[#23233a] flex items-center justify-between text-[11px]">
        <span className="text-gray-500">Auditado: taxa 0.1% por lado + slippage 0.05% • Fill pessimista</span>
        <span className="text-[#8b5cf6] flex items-center gap-1">
          <span className="w-1 h-1 bg-[#8b5cf6] rounded-full" />
          Alpaca FINRA + Binance CCXT
        </span>
      </div>
    </div>
  );
}
