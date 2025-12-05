#!/bin/bash

# Script de Deploy - ResumAI
# Uso: sudo ./deploy.sh

set -e

echo "🚀 Iniciando Deploy do ResumAI..."
echo "=================================="

# Verificar se está rodando como root
if [ "$EUID" -ne 0 ]; then 
  echo "⚠️  Por favor, execute como root: sudo ./deploy.sh"
  exit 1
fi

# Parar processos antigos (execute manualmente se necessário)
echo "🛑 Parando processos antigos..."
# pkill -f "node.*curriculum_generator" || true
# pm2 delete resumai || true

# Limpar builds anteriores
echo "🧹 Limpando builds anteriores..."
rm -rf dist node_modules

# Instalar pnpm se necessário
echo "📦 Verificando pnpm..."
if ! command -v pnpm &> /dev/null; then
  echo "📦 Instalando pnpm..."
  npm install -g pnpm@latest
fi

echo "✅ pnpm instalado: $(pnpm -v)"

# Instalar dependências
echo "📦 Instalando dependências..."
pnpm install --prod=false

# Build do projeto
echo "🔨 Compilando projeto..."
pnpm run build

# Iniciar com PM2
echo "🚀 Iniciando aplicação..."
pm2 start dist/index.js --name resumai --time

echo ""
echo "✅ Deploy concluído com sucesso!"
echo "=================================="
echo "📊 Status: pm2 status"
echo "📝 Logs: pm2 logs resumai"
echo "🔄 Restart: pm2 restart resumai"
