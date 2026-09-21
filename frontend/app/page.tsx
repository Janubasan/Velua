"use client";
import { useState, useEffect } from "react";
import { WalletConnect } from "./components/WalletConnect";
import { TradingViewChart } from "./components/TradingViewChart";
import { EvolutionPanel } from "./components/EvolutionPanel";
import { JEVLog } from "./components/JEVLog";
import { AnalyticsHeader } from "./components/AnalyticsHeader";
import { OperationsPanel } from "./components/OperationsPanel";
import { AlpacaPanel } from "./components/AlpacaPanel";

export default function Home() {
  const [backendStatus, setBackendStatus] = useState<"checking" | "online" | "offline">("checking");
  const [analytics, setAnalytics] = useState<any>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api/backend";

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch(`${apiUrl}/health`, { signal: AbortSignal.timeout(3000) } as any);
        if (res.ok) {
          setBackendStatus("online");
          const statusRes = await fetch(`${apiUrl}/api/analytics`);
          if (statusRes.ok) {
            setAnalytics(await statusRes.json());
          }
        } else setBackendStatus("offline");
      } catch {
        setBackendStatus("offline");
      }
    };
    checkBackend();
    const interval = setInterval(checkBackend, 5000);
    return () => clearInterval(interval);
  }, []);

  const balance = analytics?.balance;
  const isPositive = balance ? balance.pnl_total >= 0 : true;

  return (
    <main className="min-h-screen bg-[#08080c] text-gray-100 selection:bg-[#8b5cf6]/30">
      {/* Background effects */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[#08080c]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-[#8b5cf6]/10 via-[#6366f1]/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-[#00ff88]/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-[#ff3b5c]/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }} />
      </div>

      {/* SALDO E PNL ACIMA DO HEADER - Destaque principal auditado */}
      <div className="relative z-20">
        <div className="max-w-[1600px] mx-auto px-6 pt-6">
          <div className="bg-gradient-to-r from-[#0f0f18]/80 via-[#15151f]/80 to-[#0f0f18]/80 backdrop-blur-2xl border border-[#23233a]/50 rounded-[28px] p-1 shadow-2xl shadow-black/50">
            <div className="bg-[#0a0a0f]/90 rounded-[22px] p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#8b5cf6] to-[#00ff88] rounded-xl flex items-center justify-center font-black text-black shadow-lg shadow-purple-500/20">V</div>
                    <div>
                      <h1 className="font-black text-xl leading-none tracking-tight">VELUA</h1>
                      <p className="text-[10px] text-gray-500 font-mono tracking-[0.2em]">JEV REAL • BROKERAGE • AUDITADO</p>
                    </div>
                  </div>

                  {balance && (
                    <>
                      <div className="hidden md:block w-px h-10 bg-[#23233a]" />
                      <div className="flex items-center gap-6">
                        <div>
                          <div className="text-[10px] font-mono tracking-widest text-gray-500">SALDO • REAL</div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black text-white">${balance.current.toLocaleString()}</span>
                            <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${isPositive ? "bg-[#00ff88]/15 text-[#00ff88] border border-[#00ff88]/20" : "bg-[#ff3b5c]/15 text-[#ff3b5c] border border-[#ff3b5c]/20"}`}>
                              {isPositive ? "+" : ""}{balance.pnl_pct.toFixed(2)}%
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] font-mono tracking-widest text-gray-500">PNL • AUDITADO</div>
                          <div className={`text-xl font-black ${isPositive ? "text-[#00ff88]" : "text-[#ff3b5c]"}`}>
                            {isPositive ? "+" : ""}${balance.pnl_total.toFixed(2)}
                          </div>
                          <div className="text-[11px] text-gray-500">{analytics?.stats?.total_trades || 0} trades • PF {analytics?.stats?.profit_factor?.toFixed(2) || "0"}</div>
                        </div>
                        <div className="hidden lg:block">
                          <div className="text-[10px] font-mono tracking-widest text-gray-500">EQUITY CURVE</div>
                          <div className="flex items-end gap-[2px] h-8 mt-1">
                            {(analytics?.equity_curve || []).slice(-20).map((p: any, i: number) => {
                              const min = Math.min(...(analytics?.equity_curve || []).map((x: any) => x.equity), balance.initial);
                              const max = Math.max(...(analytics?.equity_curve || []).map((x: any) => x.equity), balance.initial);
                              const h = ((p.equity - min) / (max - min || 1)) * 100;
                              return <div key={i} className={`w-1 rounded-full ${p.pnl >=0 ? "bg-[#00ff88]/70" : "bg-[#ff3b5c]/70"}`} style={{ height: `${Math.max(20, h)}%` }} />;
                            })}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border backdrop-blur ${backendStatus === "online" ? "bg-[#00ff88]/10 border-[#00ff88]/20 text-[#00ff88]" : "bg-[#ff3b5c]/10 border-[#ff3b5c]/20 text-[#ff3b5c]"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${backendStatus === "online" ? "bg-[#00ff88] animate-pulse" : "bg-[#ff3b5c]"}`} />
                    {backendStatus === "online" ? "JEV REAL ONLINE" : "OFFLINE"} • {apiUrl.replace("http://", "")}
                  </div>
                  <WalletConnect />
                </div>
              </div>

              {/* Math warning se equity baixo */}
              {analytics?.balance?.initial < 500 && (
                <div className="mt-4 bg-yellow-500/5 border border-yellow-500/10 rounded-xl p-3 flex items-start gap-3">
                  <span className="text-yellow-400">⚠️</span>
                  <div className="text-xs text-yellow-200/70 leading-relaxed">
                    <span className="font-bold text-yellow-300">Matemática $100:</span> 1% risco = $1/trade. Taxa 0.1%*2 + spread + slippage = ~$0.30 (30% do alvo). Sistema negativo por construção. Use $1000+ ou paper mode. 
                    <span className="text-gray-500"> • {analytics?.risk?.math_explanation || ""}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Header secundário - navegação */}
      <header className="relative z-10 sticky top-0 backdrop-blur-2xl bg-[#08080c]/70 border-b border-[#15151f] mt-4">
        <div className="max-w-[1600px] mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs">
            <span className="bg-[#15151f] border border-[#23233a] px-3 py-1.5 rounded-full flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-pulse" />
              FULLSTACK REAL • SEM RANDOM • PREÇO REAL BINANCE
            </span>
            <span className="hidden md:flex bg-[#15151f] border border-[#23233a] px-3 py-1.5 rounded-full">
              🧬 {analytics?.evolution?.population_size || 12} agentes • Gen {analytics?.evolution?.generation || 0} • {analytics?.evolution?.total_trades || 0} trades
            </span>
            <span className="hidden lg:flex bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 text-[#8b5cf6] px-3 py-1.5 rounded-full">
              📊 Analytics • SQLite UNIQUE • Alpaca FINRA
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="bg-[#0a0a0f] border border-[#23233a] px-3 py-1.5 rounded-full">
              💼 {analytics?.balance?.initial ? `$${analytics.balance.initial} → $${analytics.balance.current}` : "$1000"} • Risco 1% • SL ATR • TP ATR
            </span>
            <a href="/docs" target="_blank" className="text-gray-500 hover:text-white px-2">Docs</a>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-6 py-6 space-y-6">

        {/* AnalyticsHeader - Saldo e PnL detalhado */}
        <AnalyticsHeader />

        {/* TradingView + Alpaca - lado a lado */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-8">
            <TradingViewChart />
          </div>
          <div className="xl:col-span-4">
            <AlpacaPanel />
          </div>
        </div>

        {/* Robôs e Agentes Trabalhando e Evoluindo */}
        <div className="bg-[#0f0f14]/50 backdrop-blur border border-[#1a1a2e] rounded-[24px] p-1">
          <div className="bg-[#0a0a0f]/80 rounded-[20px] p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-black flex items-center gap-3">
                  <span className="w-8 h-8 bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] rounded-xl flex items-center justify-center text-sm">🤖</span>
                  ROBÔS E AGENTES TRABALHANDO E EVOLUINDO
                  <span className="text-xs bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88] px-2.5 py-1 rounded-full font-mono">LIVE • EVOLUÇÃO REAL</span>
                </h2>
                <p className="text-xs text-gray-500 mt-2">Cada agente com DNA único (RSI, EMA, ATR), aprendendo com JEV SQLite, se auto-substituindo. Filho nunca repete erro do pai.</p>
              </div>
              <div className="hidden md:flex items-center gap-2 text-xs">
                <span className="bg-[#15151f] border border-[#23233a] px-3 py-1.5 rounded-full">🧬 Gen {analytics?.evolution?.generation || 0}</span>
                <span className="bg-[#15151f] border border-[#23233a] px-3 py-1.5 rounded-full">⚡ {analytics?.evolution?.total_trades || 0} trades</span>
                <span className="bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88] px-3 py-1.5 rounded-full">Top PF {analytics?.stats?.profit_factor?.toFixed(2) || "0"}</span>
              </div>
            </div>
            <EvolutionPanel />
          </div>
        </div>

        {/* Operações + JEV */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-7">
            <OperationsPanel />
          </div>
          <div className="xl:col-span-5">
            <JEVLog />
          </div>
        </div>

        {/* TradingView + Alpaca explicação auditada */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#15151f]/80 backdrop-blur border border-[#23233a] rounded-2xl p-5">
            <h4 className="font-bold text-sm flex items-center gap-2">
              <span className="w-6 h-6 bg-[#ff9900]/15 border border-[#ff9900]/20 rounded-full flex items-center justify-center text-xs">₿</span>
              TradingView • Real
            </h4>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              Gráfico com candles reais Binance via CCXT. EMA 9/21, RSI 14, ATR. Preço via <code className="bg-[#0a0a0f] px-1 rounded">fetch_ticker</code> real, não random. Fallback sintético volátil apenas em sandbox sem internet.
            </p>
            <div className="mt-3 flex gap-2">
              <span className="text-[10px] bg-[#0a0a0f] border border-[#23233a] px-2 py-1 rounded-full">CCXT Real</span>
              <span className="text-[10px] bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88] px-2 py-1 rounded-full">Lightweight Charts</span>
            </div>
          </div>

          <div className="bg-[#15151f]/80 backdrop-blur border border-[#23233a] rounded-2xl p-5">
            <h4 className="font-bold text-sm flex items-center gap-2">
              <span className="w-6 h-6 bg-[#ffcc00]/15 border border-[#ffcc00]/20 rounded-full flex items-center justify-center text-xs">🦙</span>
              Alpaca • FINRA Auditado
            </h4>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              Broker regulado FINRA. Ordens com <code className="bg-[#0a0a0f] px-1 rounded">client_order_id</code> único, idempotente. Paper grátis, mercado real. Reconciliação local vs exchange.
            </p>
            <div className="mt-3 flex gap-2">
              <span className="text-[10px] bg-[#0a0a0f] border border-[#23233a] px-2 py-1 rounded-full">FINRA</span>
              <span className="text-[10px] bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88] px-2 py-1 rounded-full">Auditável</span>
            </div>
          </div>

          <div className="bg-[#15151f]/80 backdrop-blur border border-[#23233a] rounded-2xl p-5">
            <h4 className="font-bold text-sm flex items-center gap-2">
              <span className="w-6 h-6 bg-[#8b5cf6]/15 border border-[#8b5cf6]/20 rounded-full flex items-center justify-center text-xs">📓</span>
              JEV Real • SQLite
            </h4>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              Substitui JSONL append por SQLite com <code className="bg-[#0a0a0f] px-1 rounded">UNIQUE(client_order_id)</code>. Idempotência, reconciliação, lições que realmente influenciam decisão. Filho nunca repete erro do pai.
            </p>
            <div className="mt-3 flex gap-2">
              <span className="text-[10px] bg-[#0a0a0f] border border-[#23233a] px-2 py-1 rounded-full">SQLite WAL</span>
              <span className="text-[10px] bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88] px-2 py-1 rounded-full">UNIQUE</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#15151f] pt-8 pb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-[#0f0f14] border border-[#1a1a2e] rounded-full px-4 py-2 text-xs text-gray-500">
            <span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-pulse" />
            Velua JEV Real • Paper seguro por padrão • Pesquisa offline antes de capital • Auditado para realidade
          </div>
          <p className="text-[11px] text-gray-600 mt-3">Cada erro vira vetor de aprendizado. Agentes se auto-substituem. Matemática $100 explicada. 🧬</p>
        </div>
      </div>
    </main>
  );
}
