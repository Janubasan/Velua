"use client";
import { useEffect, useState } from "react";

interface AlpacaAccount {
  cash: number;
  portfolio_value: number;
  buying_power: number;
  equity: number;
  status: string;
  mode: string;
  is_configured: boolean;
  warning?: string;
}

export function AlpacaPanel() {
  const [account, setAccount] = useState<AlpacaAccount | null>(null);
  const [positions, setPositions] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api/backend";

  const fetchAlpaca = async () => {
    try {
      const [accRes, posRes, ordRes] = await Promise.all([
        fetch(`${apiUrl}/api/alpaca/account`),
        fetch(`${apiUrl}/api/alpaca/positions`),
        fetch(`${apiUrl}/api/alpaca/orders?limit=10`)
      ]);
      setAccount(await accRes.json());
      const posData = await posRes.json();
      setPositions(posData.positions || []);
      const ordData = await ordRes.json();
      setOrders(ordData.orders || []);
    } catch {}
  };

  useEffect(() => {
    fetchAlpaca();
    const interval = setInterval(fetchAlpaca, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#15151f] border border-[#23233a] rounded-[20px] overflow-hidden">
      <div className="p-5 border-b border-[#23233a]">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-sm flex items-center gap-2">
            <span className="w-6 h-6 bg-[#ffcc00]/15 border border-[#ffcc00]/20 rounded-full flex items-center justify-center text-xs">🦙</span>
            ALPACA INTEGRATION • AUDITADO FINRA
          </h3>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2.5 py-1 rounded-full border ${account?.is_configured ? "bg-[#00ff88]/10 border-[#00ff88]/20 text-[#00ff88]" : "bg-yellow-500/10 border-yellow-500/20 text-yellow-300"}`}>
              {account?.is_configured ? "✅ CONFIGURADO" : "⚠️ SIMULADO"}
            </span>
            <span className="text-xs bg-[#23233a] px-2 py-1 rounded-full">{account?.mode || "paper"}</span>
          </div>
        </div>
        <p className="text-[11px] text-gray-500 mt-2">
          Broker regulado FINRA • Ordens com client_order_id único • Auditável via API
          {account?.warning && <span className="text-yellow-300/70"> • {account.warning}</span>}
        </p>
      </div>

      <div className="p-5 space-y-4">
        {/* Account */}
        {account ? (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0a0a0f] border border-[#23233a] rounded-xl p-4">
              <div className="text-[10px] font-mono tracking-widest text-gray-500">CASH • AUDITADO</div>
              <div className="text-xl font-black text-white mt-1">${Number(account.cash || 0).toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-1">Disponível para trade</div>
            </div>
            <div className="bg-[#0a0a0f] border border-[#23233a] rounded-xl p-4">
              <div className="text-[10px] font-mono tracking-widest text-gray-500">PORTFOLIO</div>
              <div className="text-xl font-black text-white mt-1">${Number(account.portfolio_value || account.equity || 0).toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-1">Buying power ${Number(account.buying_power || 0).toLocaleString()}</div>
            </div>
            <div className="bg-[#0a0a0f] border border-[#23233a] rounded-xl p-4 col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono tracking-widest text-gray-500">STATUS</div>
                  <div className="text-sm font-bold text-white mt-1 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${account.status === "ACTIVE" ? "bg-[#00ff88] animate-pulse" : "bg-gray-500"}`} />
                    {account.status || "UNKNOWN"} • {account.mode?.toUpperCase()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-gray-500">Alpaca é FINRA regulado</div>
                  <div className="text-[10px] text-[#8b5cf6] mt-1">Ordens auditáveis com client_order_id</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#0a0a0f] border border-dashed border-[#23233a] rounded-xl p-8 text-center">
            <div className="animate-pulse text-gray-500 text-sm">Carregando Alpaca...</div>
          </div>
        )}

        {/* Positions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono tracking-widest text-gray-500">POSIÇÕES ABERTAS • REAL</span>
            <span className="text-xs bg-[#23233a] px-2 py-1 rounded-full">{positions.length} posições</span>
          </div>
          {positions.length === 0 ? (
            <div className="bg-[#0a0a0f] border border-[#23233a] rounded-xl p-4 text-center">
              <div className="text-xs text-gray-500">Nenhuma posição aberta</div>
              <div className="text-[11px] text-gray-600 mt-1">Posições aparecem aqui quando robôs abrem via Alpaca ou PositionManager</div>
            </div>
          ) : (
            <div className="space-y-2">
              {positions.map((pos, i) => (
                <div key={i} className="bg-[#0a0a0f] border border-[#23233a] rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <div className="font-mono font-bold text-sm text-white">{pos.symbol}</div>
                    <div className="text-xs text-gray-500">{pos.qty} • Avg ${pos.avg_entry_price}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-mono font-bold text-sm ${Number(pos.unrealized_pl) >=0 ? "text-[#00ff88]" : "text-[#ff3b5c]"}`}>
                      {Number(pos.unrealized_pl) >=0 ? "+" : ""}${Number(pos.unrealized_pl || 0).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">{pos.side}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Orders */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono tracking-widest text-gray-500">ORDENS • CLIENT_ORDER_ID ÚNICO</span>
            <span className="text-xs bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88] px-2 py-1 rounded-full">IDEMPOTENTE</span>
          </div>
          {orders.length === 0 ? (
            <div className="bg-[#0a0a0f] border border-[#23233a] rounded-xl p-4 text-center">
              <div className="text-xs text-gray-500">Nenhuma ordem recente</div>
              <div className="text-[11px] text-gray-600 mt-1">Ordens com client_order_id único não duplicam em retry</div>
            </div>
          ) : (
            <div className="space-y-2 max-h-[200px] overflow-y-auto scrollbar-thin">
              {orders.slice(0, 5).map((order, i) => (
                <div key={i} className="bg-[#0a0a0f] border border-[#23233a] rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-white">{order.symbol} {order.side} {order.qty}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${order.status === "filled" ? "bg-[#00ff88]/10 border-[#00ff88]/20 text-[#00ff88]" : "bg-[#23233a] border-[#23233a] text-gray-400"}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-gray-500 mt-1 truncate">{order.client_order_id}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Config help */}
        {!account?.is_configured && (
          <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-xl p-4">
            <div className="text-xs font-bold text-yellow-300">🔧 Para ativar Alpaca real:</div>
            <code className="block bg-black/30 border border-yellow-500/10 rounded-lg p-2.5 mt-2 text-[11px] font-mono text-yellow-200/70">
              ALPACA_API_KEY=...<br/>
              ALPACA_API_SECRET=...<br/>
              MODE=paper # ou live<br/>
              # Crie em https://app.alpaca.markets/
            </code>
            <div className="text-[11px] text-gray-500 mt-2">Paper é grátis, sem risco, mercado real. Live exige KYC.</div>
          </div>
        )}
      </div>

      <div className="p-3 bg-[#0a0a0f] border-t border-[#23233a] text-[10px] text-gray-500 flex items-center justify-between">
        <span>Alpaca FINRA regulado • Auditável • client_order_id único</span>
        <a href="https://docs.alpaca.markets/" target="_blank" className="text-[#8b5cf6] hover:underline">Docs →</a>
      </div>
    </div>
  );
}
