"use client";
import { useState, useEffect } from "react";
import { WalletConnect } from "./components/WalletConnect";
import { TradingViewChart } from "./components/TradingViewChart";
import { EvolutionPanel } from "./components/EvolutionPanel";
import { JEVLog } from "./components/JEVLog";

export default function Home() {
  const [backendStatus, setBackendStatus] = useState<"checking" | "online" | "offline">("checking");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch(`${apiUrl}/health`, { signal: AbortSignal.timeout(3000) });
        if (res.ok) setBackendStatus("online");
        else setBackendStatus("offline");
      } catch {
        setBackendStatus("offline");
      }
    };
    checkBackend();
    const interval = setInterval(checkBackend, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-gray-100">
      {/* Grid background */}
      <div className="fixed inset-0 grid-pattern opacity-30 pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#0a0a0f]/80 border-b border-[#23233a]">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-[#8b5cf6] to-[#00ff88] rounded-xl flex items-center justify-center font-black text-black">
                V
              </div>
              <div>
                <h1 className="font-black text-lg leading-none tracking-tight">VELUA</h1>
                <p className="text-[10px] text-gray-500 font-mono tracking-widest">WEB4 PROTOCOL • BROKERAGE</p>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-2">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs border ${backendStatus === "online" ? "bg-green-500/10 border-green-500/20 text-green-300" : backendStatus === "offline" ? "bg-red-500/10 border-red-500/20 text-red-300" : "bg-yellow-500/10 border-yellow-500/20 text-yellow-300"}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${backendStatus === "online" ? "bg-green-400 animate-pulse" : backendStatus === "offline" ? "bg-red-400" : "bg-yellow-400 animate-pulse"}`} />
                Backend {backendStatus === "online" ? "ONLINE" : backendStatus === "offline" ? "OFFLINE" : "CHECKING"} • {apiUrl}
              </div>
              <div className="text-xs bg-[#15151f] border border-[#23233a] px-3 py-1 rounded-full">
                Protocolo.JEV • {backendStatus === "online" ? "🧬 12 agentes" : "⏳"}
              </div>
            </div>
          </div>

          <WalletConnect />
        </div>
      </header>

      {/* Main */}
      <div className="max-w-[1600px] mx-auto px-6 py-6 space-y-6 relative">
        {/* Top Banner - Brokerage Level */}
        <div className="bg-gradient-to-r from-[#15151f] via-[#1a1a2e] to-[#15151f] border border-[#23233a] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 bg-[#00ff88] rounded-full animate-pulse" />
              <span className="font-bold text-white">FULLSTACK REAL</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-300">Sem random • Preço real Binance • Auditado Arbitrum • 24/7</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="bg-[#0a0a0f] border border-[#23233a] px-3 py-1.5 rounded-full">
              💼 Conta: <b className="text-white">$100</b> • Risco 1% = $1/trade
            </span>
            <span className="bg-[#0a0a0f] border border-[#23233a] px-3 py-1.5 rounded-full">
              🛡️ SL 2% • TP 4% • R:R 1:2 • Max 3 trades
            </span>
            <a href="https://github.com" target="_blank" className="text-[#8b5cf6] hover:underline">📄 Docs</a>
          </div>
        </div>

        {/* Chart + Risk side by side */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <TradingViewChart />
          </div>
          
          {/* Quick stats */}
          <div className="space-y-4">
            <div className="bg-[#15151f] border border-[#23233a] rounded-xl p-4">
              <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                <span className="text-[#ffcc00]">⚡</span> Como rodar 24/7 com $100
              </h3>
              <div className="space-y-3 text-xs text-gray-300 leading-relaxed">
                <div className="flex gap-2">
                  <span className="bg-[#23233a] w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0">1</span>
                  <span><b className="text-white">VPS $6/mês</b> - Contabo/Hetzner Ubuntu, <code className="bg-black/50 px-1 rounded">pm2 start backend/main.py</code></span>
                </div>
                <div className="flex gap-2">
                  <span className="bg-[#23233a] w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0">2</span>
                  <span><b className="text-white">Binance Spot</b> - API só SPOT sem saque, modo DEMO usa Testnet (mercado real, dinheiro fake)</span>
                </div>
                <div className="flex gap-2">
                  <span className="bg-[#23233a] w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0">3</span>
                  <span><b className="text-white">Auditoria</b> - Todo trade no <code className="bg-black/50 px-1 rounded">JEVJournal.sol</code> Arbitrum $0.30 deploy, link Arbiscan</span>
                </div>
                <div className="bg-[#00ff88]/10 border border-[#00ff88]/20 rounded-lg p-2.5 mt-3">
                  <p className="text-[#00ff88] font-medium">✅ Toggle DEMO/REAL no header já troca backend: <code>is_demo</code> + MetaMask assinatura</p>
                </div>
              </div>
            </div>

            <div className="bg-[#15151f] border border-[#23233a] rounded-xl p-4">
              <h3 className="font-bold text-sm mb-3">📦 Stack Real (sem alucinação)</h3>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-[#0a0a0f] border border-[#23233a] rounded-lg p-2.5">
                  <div className="text-gray-500">Frontend</div>
                  <div className="text-white font-medium">Next.js 14 + Wagmi + Viem + TradingView</div>
                </div>
                <div className="bg-[#0a0a0f] border border-[#23233a] rounded-lg p-2.5">
                  <div className="text-gray-500">Backend</div>
                  <div className="text-white font-medium">FastAPI + CCXT Binance Real + WS</div>
                </div>
                <div className="bg-[#0a0a0f] border border-[#23233a] rounded-lg p-2.5">
                  <div className="text-gray-500">Blockchain</div>
                  <div className="text-white font-medium">Ethers v6 + MetaMask + WalletConnect v2</div>
                </div>
                <div className="bg-[#0a0a0f] border border-[#23233a] rounded-lg p-2.5">
                  <div className="text-gray-500">Audit</div>
                  <div className="text-white font-medium">JEVJournal.sol Arbitrum + PM2 + Docker</div>
                </div>
              </div>
            </div>

            {backendStatus === "offline" && (
              <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-4">
                <h4 className="font-bold text-red-300 text-sm mb-2">⚠️ Backend Offline</h4>
                <p className="text-xs text-red-200/70 mb-3">O backend FastAPI não está rodando. Para iniciar:</p>
                <code className="block bg-black/50 border border-red-900/30 rounded-lg p-2.5 text-xs font-mono text-red-200">
                  pip install -r backend/requirements.txt<br/>
                  uvicorn backend.main:app --reload --port 8000 --host 0.0.0.0
                </code>
                <p className="text-[11px] text-gray-500 mt-2">Ou: <code>docker-compose up</code></p>
              </div>
            )}
          </div>
        </div>

        {/* Evolution */}
        <EvolutionPanel />

        {/* JEV + Contract */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <JEVLog />
          </div>
          <div className="space-y-4">
            <div className="bg-[#15151f] border border-[#23233a] rounded-xl p-4">
              <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                <span>📜</span> JEVJournal.sol - Auditoria On-Chain
              </h3>
              <div className="bg-[#0a0a0f] rounded-lg p-3 font-mono text-[11px] text-gray-300 overflow-x-auto">
                <div className="text-gray-500">// SPDX-License-Identifier: MIT</div>
                <div><span className="text-[#8b5cf6]">contract</span> <span className="text-[#00ff88]">JEVJournal</span> {"{"}</div>
                <div className="pl-4 text-gray-400">struct TradeLog {"{"} agentId, action, pnl, lesson {"}"}</div>
                <div className="pl-4"><span className="text-[#8b5cf6]">event</span> TradeAudited(agentId, pnl);</div>
                <div className="pl-4"><span className="text-[#8b5cf6]">function</span> logTrade(...) {"{"} logs.push(...) {"}"}</div>
                <div>{"}"}</div>
              </div>
              <div className="flex gap-2 mt-3">
                <span className="text-xs bg-[#23233a] px-2 py-1 rounded-full">Arbitrum • $0.30 deploy</span>
                <span className="text-xs bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88] px-2 py-1 rounded-full">Arbiscan auditável</span>
              </div>
            </div>

            <div className="bg-[#15151f] border border-[#23233a] rounded-xl p-4">
              <h3 className="font-bold text-sm mb-2">🚀 Deploy 24/7</h3>
              <code className="block bg-[#0a0a0f] border border-[#23233a] rounded-lg p-3 text-[11px] font-mono text-gray-300 leading-relaxed">
                <span className="text-gray-500"># Backend</span><br/>
                docker build -f Dockerfile.backend -t velua-backend .<br/>
                docker run -d -p 8000:8000 --env-file backend/.env velua-backend<br/><br/>
                <span className="text-gray-500"># Frontend</span><br/>
                cd frontend && npm run build && npm start<br/><br/>
                <span className="text-gray-500"># Ou tudo</span><br/>
                docker-compose up -d
              </code>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#23233a] pt-6 pb-10 text-center text-xs text-gray-500">
          <p>Velua • Protocolo.JEV + Web 4.0 Automation • Brokerage Level • Sem Random • Preço Real Binance • Auditado Arbitrum</p>
          <p className="mt-1">Cada erro vira vetor de aprendizado. Agentes se auto-substituem. Filho nunca repete erro do pai. 🧬</p>
        </div>
      </div>
    </main>
  );
}
