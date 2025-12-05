#!/bin/bash

# Deploy script for ResumAI
# This script should be run on the production server

set -e  # Exit on error

echo "🚀 Iniciando Deploy do ResumAI..."
echo "=================================="

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
  echo "⚠️  Este script deve ser executado como root (use sudo)"
  exit 1
fi

# Variables
PROJECT_DIR="/var/www/vhosts/davidsodre.com/resumai.davidsodre.com"
REPO_URL="https://github.com/davidsodrelins/resumai.git"
BRANCH="main"

echo ""
echo "📁 Verificando diretório..."
echo "Diretório atual: $PROJECT_DIR"

# Create directory if it doesn't exist
if [ ! -d "$PROJECT_DIR" ]; then
  echo "📁 Criando diretório do projeto..."
  mkdir -p "$PROJECT_DIR"
fi

cd "$PROJECT_DIR"

# Clone or pull repository
if [ ! -d ".git" ]; then
  echo ""
  echo "📥 Clonando repositório do GitHub..."
  git clone "$REPO_URL" .
else
  echo ""
  echo "📥 Atualizando repositório..."
  git fetch origin
  git reset --hard origin/$BRANCH
  git pull origin $BRANCH
fi

# Check Node.js version
echo ""
echo "📦 Verificando Node.js..."
if ! command -v node &> /dev/null; then
  echo "❌ Node.js não está instalado!"
  echo "Instale Node.js v20+ antes de continuar."
  exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js instalado: $NODE_VERSION"

# Check pnpm
echo ""
echo "📦 Verificando pnpm..."
if ! command -v pnpm &> /dev/null; then
  echo "📦 Instalando pnpm..."
  npm install -g pnpm@latest
fi

PNPM_VERSION=$(pnpm -v)
echo "✅ pnpm instalado: $PNPM_VERSION"

# Install dependencies
echo ""
echo "📦 Instalando dependências..."
pnpm install --prod=false

# Check if .env exists
if [ ! -f ".env" ]; then
  echo ""
  echo "⚠️  Arquivo .env não encontrado!"
  echo "Crie o arquivo .env com as variáveis de ambiente necessárias."
  echo "Exemplo:"
  echo "DATABASE_URL=mysql://..."
  echo "JWT_SECRET=..."
  exit 1
fi

# Run database migrations
echo ""
echo "🗄️  Executando migrações do banco de dados..."
pnpm db:push || echo "⚠️  Migrações falharam (pode ser normal se já estiverem aplicadas)"

# Build project
echo ""
echo "🔨 Compilando projeto..."
pnpm build

# Check if PM2 is installed
echo ""
echo "📦 Verificando PM2..."
if ! command -v pm2 &> /dev/null; then
  echo "📦 Instalando PM2..."
  npm install -g pm2
fi

# Stop existing process
echo ""
echo "🛑 Parando processo anterior..."
pm2 stop resumai || echo "Nenhum processo anterior encontrado"
pm2 delete resumai || echo "Nenhum processo anterior para deletar"

# Start new process
echo ""
echo "▶️  Iniciando aplicação..."
pm2 start dist/index.js --name resumai --node-args="--max-old-space-size=2048"

# Save PM2 configuration
pm2 save

# Setup PM2 startup script (only needs to be run once)
pm2 startup || echo "PM2 startup já configurado"

echo ""
echo "✅ Deploy concluído com sucesso!"
echo "=================================="
echo ""
echo "📊 Status da aplicação:"
pm2 status

echo ""
echo "📝 Logs disponíveis com: pm2 logs resumai"
echo "🔄 Reiniciar com: pm2 restart resumai"
echo "🛑 Parar com: pm2 stop resumai"
