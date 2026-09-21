"use client";
import { useState, useEffect } from 'react';

interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  chainId: number | null;
}

export function useBrokerageWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    isConnected: false,
    isConnecting: false,
    chainId: null
  });
  const [mode, setModeState] = useState<'DEMO' | 'REAL'>('DEMO');

  useEffect(() => {
    // Recupera modo do localStorage
    const savedMode = localStorage.getItem('velua_mode') as 'DEMO' | 'REAL' | null;
    if (savedMode) setModeState(savedMode);

    // Verifica se já tem wallet conectada
    const savedAddress = localStorage.getItem('velua_wallet');
    if (savedAddress) {
      setWallet(prev => ({ ...prev, address: savedAddress, isConnected: true }));
    }

    // Listen para mudanças de conta no MetaMask
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      (window as any).ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          setWallet(prev => ({ ...prev, address: accounts[0], isConnected: true }));
          localStorage.setItem('velua_wallet', accounts[0]);
        }
      });
      (window as any).ethereum.on('chainChanged', (chainId: string) => {
        setWallet(prev => ({ ...prev, chainId: parseInt(chainId, 16) }));
      });
    }
  }, []);

  const connectMetaMask = async () => {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      alert('MetaMask não encontrada! Instale em https://metamask.io');
      window.open('https://metamask.io/download/', '_blank');
      return null;
    }

    setWallet(prev => ({ ...prev, isConnecting: true }));
    try {
      const accounts = await (window as any).ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      const chainId = await (window as any).ethereum.request({ method: 'eth_chainId' });
      
      const address = accounts[0];
      setWallet({
        address,
        isConnected: true,
        isConnecting: false,
        chainId: parseInt(chainId, 16)
      });
      
      localStorage.setItem('velua_wallet', address);
      
      // Tenta trocar para Arbitrum (42161) para auditoria barata
      try {
        await (window as any).ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xa4b1' }], // Arbitrum One
        });
      } catch (switchError: any) {
        // Se não tem Arbitrum, adiciona
        if (switchError.code === 4902) {
          await (window as any).ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0xa4b1',
              chainName: 'Arbitrum One',
              rpcUrls: ['https://arb1.arbitrum.io/rpc'],
              nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
              blockExplorerUrls: ['https://arbiscan.io']
            }]
          });
        }
      }

      return address;
    } catch (error) {
      console.error('Erro conectar MetaMask:', error);
      setWallet(prev => ({ ...prev, isConnecting: false }));
      return null;
    }
  };

  const disconnect = () => {
    setWallet({ address: null, isConnected: false, isConnecting: false, chainId: null });
    localStorage.removeItem('velua_wallet');
  };

  const switchToDemo = () => {
    setModeState('DEMO');
    localStorage.setItem('velua_mode', 'DEMO');
    // Notifica backend
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/mode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'DEMO', symbol: 'BTC/USDT' })
    }).catch(() => {});
  };

  const switchToReal = async () => {
    let addr = wallet.address;
    if (!wallet.isConnected) {
      addr = await connectMetaMask();
      if (!addr) return false;
    }

    // Exige assinatura para provar propriedade (segurança)
    try {
      const message = `Autorizo trading Web4 Velua em modo REAL com $100 - ${new Date().toISOString()}`;
      await (window as any).ethereum.request({
        method: 'personal_sign',
        params: [message, addr]
      });
      
      setModeState('REAL');
      localStorage.setItem('velua_mode', 'REAL');
      
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/mode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'REAL', symbol: 'BTC/USDT' })
      });

      return true;
    } catch (e) {
      console.error('Assinatura recusada:', e);
      return false;
    }
  };

  return {
    ...wallet,
    mode,
    connectMetaMask,
    disconnect,
    switchToDemo,
    switchToReal,
    shortAddress: wallet.address ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}` : null
  };
}
