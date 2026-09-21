"use client";
import { useEffect, useState } from "react";

interface Analytics {
  balance: {
    initial: number;
    current: number;
    peak: number;
    pnl_total: number;
    pnl_pct: number;
    max_drawdown: number;
  };
  stats: {
    total_trades: number;
    winrate: number;
    profit_factor: number;
    total_fees: number;
    wins: number;
    losses: number;
  };
  equity_curve: { timestamp: string; equity: number; pnl: number }[];
  daily_pnl: { date: string; pnl: number }[];
  risk?: any;
  evolution?: any;
}

export function AnalyticsHeader() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api/backend";

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/analytics`);
      if (!res.ok) return;
      const data = await res.json();
      setAnalytics(data);
    } catch {}
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!analytics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="bg-[#15151f] border border-[#23233a] rounded-2xl p-6 animate-pulse">
            <div className="h-4 bg-[#23233a] rounded w-1/2 mb-3" />
            <div className="h-8 bg-[#23233a] rounded w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  const { balance, stats } = analytics;
  const isPositive = (balance?.pnl_total ?? 0) >= 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-5 bg-gradient-to-br from-[#15151f] via-[#1a1a2e] to-[#15151f] border border-[#23233a] rounded-[24px] p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#8b5cf6]/20 to-[#00ff88]/20 rounded-full blur-3xl -translate-y-32 translate-x-32" />
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono tracking-widest text-gray-500">SALDO ATUAL • AUDITADO SQLITE</span>
              <span className="text-xs bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88] px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-pulse" />
                LIVE PAPER • REAL PRICE
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black tracking-tight text-white">${(balance?.current ?? 0).toLocaleString()}</span>
              <span className="text-sm text-gray-500">de ${(balance?.initial ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-3 mt-3">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${isPositive ? "bg-[#00ff88]/15 text-[#00ff88] border border-[#00ff88]/20" : "bg-[#ff3b5c]/15 text-[#ff3b5c] border border-[#ff3b5c]/20"}`}>
                <span>{isPositive ? "↗" : "↘"}</span>
                <span>{isPositive ? "+" : ""}${(balance?.pnl_total ?? 0).toFixed(2)} ({(balance?.pnl_pct ?? 0) >=0 ? "+" : ""}{(balance?.pnl_pct ?? 0).toFixed(2)}%)</span>
              </div>
              <span className="text-xs text-gray-500">Peak ${(balance?.peak ?? 0).toLocaleString()} • DD {(balance?.max_drawdown ?? 0).toFixed(2)}%</span>
            </div>
            
            <div className="mt-5 h-12 flex items-end gap-[2px]">
              {(analytics.equity_curve || []).slice(-40).map((point, i) => {
                const equities = analytics.equity_curve.map(p => p.equity);
                const min = Math.min(...equities);
                const max = Math.max(...equities);
                const range = max - min || 1;
                const height = ((point.equity - min) / range) * 100;
                const prev = i > 0 ? analytics.equity_curve[Math.max(0, analytics.equity_curve.length - 40 + i - 1)].equity : point.equity;
                const isUp = point.equity >= prev;
                return (
                  <div
                    key={i}
                    className={`flex-1 rounded-full transition-all ${isUp ? "bg-[#00ff88]/60" : "bg-[#ff3b5c]/60"}`}
                    style={{ height: `${Math.max(8, height)}%` }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#15151f] border border-[#23233a] rounded-2xl p-5 hover:border-[#2a2a45] transition-colors">
            <div className="text-[10px] font-mono tracking-widest text-gray-500 mb-2">PNL TOTAL • REAL</div>
            <div className={`text-2xl font-black ${isPositive ? "text-[#00ff88]" : "text-[#ff3b5c]"}`}>
              {isPositive ? "+" : ""}${(balance?.pnl_total ?? 0).toFixed(2)}
            </div>
            <div className="text-xs text-gray-500 mt-1">{stats?.total_trades ?? 0} trades • {stats?.wins ?? 0}W {stats?.losses ?? 0}L</div>
            <div className="mt-3 w-full bg-[#0a0a0f] rounded-full h-1.5 overflow-hidden border border-[#23233a]/30">
              <div className="h-full bg-gradient-to-r from-[#00ff88] to-[#00ff88]/60" style={{ width: `${Math.min(100, stats?.winrate ?? 0)}%` }} />
            </div>
            <div className="text-[10px] text-gray-500 mt-1">{(stats?.winrate ?? 0).toFixed(1)}% winrate</div>
          </div>

          <div className="bg-[#15151f] border border-[#23233a] rounded-2xl p-5">
            <div className="text-[10px] font-mono tracking-widest text-gray-500 mb-2">PROFIT FACTOR • EDGE</div>
            <div className={`text-2xl font-black ${(stats?.profit_factor ?? 0) >= 1.2 ? "text-[#00ff88]" : (stats?.profit_factor ?? 0) >= 1 ? "text-yellow-400" : "text-[#ff3b5c]"}`}>
              {(stats?.profit_factor ?? 0).toFixed(2)}
            </div>
            <div className="text-xs text-gray-500 mt-1">{(stats?.profit_factor ?? 0) >= 1.2 ? "✅ Edge detectado" : "❌ Sem edge"}</div>
            <div className="text-[10px] bg-[#23233a] px-2 py-1 rounded-full mt-2 inline-block font-mono">
              PF {">"}1.2 = edge
            </div>
          </div>

          <div className="bg-[#15151f] border border-[#23233a] rounded-2xl p-5">
            <div className="text-[10px] font-mono tracking-widest text-gray-500 mb-2">TAXAS PAGAS • REAL</div>
            <div className="text-2xl font-black text-white">${(stats?.total_fees ?? 0).toFixed(2)}</div>
            <div className="text-xs text-gray-500 mt-1">0.1% por lado + 0.05% slippage</div>
            <div className="text-[10px] text-yellow-300/70 mt-2 leading-relaxed">
              $100 1% risco = $1/trade → taxa come 15-30% do alvo
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#8b5cf6]/10 to-[#6366f1]/10 border border-[#8b5cf6]/20 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#8b5cf6]/5 to-transparent" />
            <div className="relative">
              <div className="text-[10px] font-mono tracking-widest text-[#8b5cf6] mb-2">MODO ATUAL • SEGURO</div>
              <div className="text-lg font-black text-white">PAPER</div>
              <div className="text-xs text-[#8b5cf6]/70 mt-1">Seguro • Sem ordem real</div>
              <div className="mt-3 space-y-1">
                <div className="text-[10px] flex items-center gap-1.5">
                  <span className="w-1 h-1 bg-[#00ff88] rounded-full" /> Preço real Binance CCXT
                </div>
                <div className="text-[10px] flex items-center gap-1.5">
                  <span className="w-1 h-1 bg-[#00ff88] rounded-full" /> Taxa e slippage reais
                </div>
                <div className="text-[10px] flex items-center gap-1.5">
                  <span className="w-1 h-1 bg-[#00ff88] rounded-full" /> Auditado SQLite UNIQUE
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {(analytics.daily_pnl?.length ?? 0) > 0 && (
        <div className="bg-[#15151f] border border-[#23233a] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono tracking-widest text-gray-500">PNL DIÁRIO • ÚLTIMOS {analytics.daily_pnl.length} DIAS • AUDITADO</span>
            <span className="text-xs text-gray-500">Cada barra = 1 dia auditado SQLite</span>
          </div>
          <div className="flex items-end gap-1 h-16">
            {analytics.daily_pnl.map((day, i) => {
              const maxAbs = Math.max(...analytics.daily_pnl.map(d => Math.abs(d.pnl)), 1);
              const height = (Math.abs(day.pnl) / maxAbs) * 100;
              const isPos = day.pnl >= 0;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={`w-full rounded-full transition-all ${isPos ? "bg-[#00ff88]" : "bg-[#ff3b5c]"}`}
                    style={{ height: `${Math.max(4, height)}%` }}
                    title={`${day.date}: $${day.pnl}`}
                  />
                  <span className="text-[8px] text-gray-600 hidden md:block">{day.date.slice(5)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
