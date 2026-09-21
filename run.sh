#!/bin/bash
set -e

echo "🧬 Velua - Web4 Protocol - Brokerage Level"
echo "=========================================="

# Check python
if ! command -v python3 &> /dev/null; then
  echo "Python3 não encontrado"
  exit 1
fi

# Install backend deps
echo "📦 Instalando backend deps..."
pip install -q -r backend/requirements.txt

# Start backend
echo "🚀 Iniciando backend FastAPI em :8000..."
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

sleep 3

# Check frontend
if command -v node &> /dev/null; then
  echo "📦 Instalando frontend deps..."
  cd frontend
  npm install -q
  echo "🚀 Iniciando frontend Next.js em :3000..."
  npm run dev &
  FRONTEND_PID=$!
  cd ..
else
  echo "Node não encontrado, apenas backend rodando"
fi

echo ""
echo "✅ Velua rodando:"
echo "   Backend: http://localhost:8000"
echo "   Docs: http://localhost:8000/docs"
echo "   Frontend: http://localhost:3000"
echo ""
echo "   Para parar: kill $BACKEND_PID $FRONTEND_PID"
echo ""

wait
