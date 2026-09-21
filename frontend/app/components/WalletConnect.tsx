"use client";
import { useBrokerageWallet } from "@/hooks/useWallet";
import { useState } from "react";

export function WalletConnect() {
  const { address, isConnected, isConnecting, mode, connectMetaMask, disconnect, switchToDemo, switchToReal, shortAddress } = useBrokerageWallet();
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="flex items-center gap-3">
      {/* Toggle DEMO/REAL */}
      <div className="flex items-center bg-[#1a1a2e] rounded-full p-1 border border-[#23233a]">
        <button
          onClick={switchToDemo}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            mode === 'DEMO' 
              ? 'bg-[#00ff88] text-black shadow-lg shadow-green-500/20' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          DEMO $100
        </button>
        <button
          onClick={() => setShowConfirm(true)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            mode === 'REAL' 
              ? 'bg-[#ff3b5c] text-white shadow-lg shadow-red-500/20' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          REAL
        </button>
      </div>

      {/* Wallet Button */}
      {isConnected ? (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-[#15151f] border border-[#23233a] rounded-full px-3 py-1.5">
            <div className="w-2 h-2 bg-[#00ff88] rounded-full animate-pulse" />
            <span className="text-sm font-mono text-gray-300">{shortAddress}</span>
            <span className="text-xs bg-[#23233a] px-2 py-0.5 rounded-full">Arbitrum</span>
          </div>
          <button
            onClick={disconnect}
            className="text-xs text-gray-500 hover:text-white px-2"
          >
            sair
          </button>
        </div>
      ) : (
        <button
          onClick={connectMetaMask}
          disabled={isConnecting}
          className="flex items-center gap-2 bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] hover:from-[#7c3aed] hover:to-[#4f46e5] text-white px-5 py-2 rounded-full font-medium text-sm transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50"
        >
          <span className="text-base">🦊</span>
          {isConnecting ? 'Conectando...' : 'Conectar MetaMask'}
        </button>
      )}

      {/* Confirm REAL modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#15151f] border border-[#ff3b5c]/30 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">⚠️</div>
              <h3 className="text-lg font-bold text-white">Ativar Modo REAL?</h3>
            </div>
            
            <div className="space-y-3 text-sm text-gray-300 mb-6">
              <p>• Você vai tradar com <span className="text-white font-bold">$100 reais</span> na Binance Spot</p>
              <p>• Cada agente arrisca <span className="text-[#00ff88]">1% = $1</span> por trade</p>
              <p>• Stop Loss 2% e Take Profit 4% (R:R 1:2)</p>
              <p>• Máximo 3 trades simultâneos = $3 exposição</p>
              <p>• Se drawdown 10% ($10), sistema pausa e evolui</p>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mt-4">
                <p className="text-yellow-300 text-xs">🔐 Segurança: Sua API Key deve ter permissão só de SPOT, sem saque. O sistema exigirá assinatura da carteira para confirmar.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 bg-[#23233a] hover:bg-[#2a2a45] text-white py-2.5 rounded-full font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  const ok = await switchToReal();
                  if (ok) setShowConfirm(false);
                }}
                className="flex-1 bg-[#ff3b5c] hover:bg-[#e63552] text-white py-2.5 rounded-full font-medium"
              >
                Assinar e Ativar REAL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
