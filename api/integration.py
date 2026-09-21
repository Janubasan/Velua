"""
API Integration - Compatibilidade com arquitetura original
Wrapper para backend/main.py
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.main import app, protocol, market_feed

# Re-exporta para compatibilidade com import original: from api.integration import app
# Mock de feed de mercado - agora usa RealMarketFeed
async def get_market_data():
    snapshot = market_feed.get_market_snapshot("BTC/USDT")
    return snapshot

# O app já está configurado em backend/main.py
# Este arquivo mantém compatibilidade com a arquitetura proposta no prompt
