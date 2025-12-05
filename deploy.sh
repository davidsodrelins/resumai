#!/bin/bash

# ============================================
# Script de Deploy Automatizado - ResumAI
# ============================================
# Este script faz o deploy completo do ResumAI no servidor Plesk
# Autor: Manus AI
# Data: 05 de dezembro de 2024
# ============================================

set -e  # Para em caso de erro

echo "🚀 Iniciando Deploy do ResumAI..."
echo "=================================="

# Ir para o diretório correto
cd /var/www/vhosts/davidsodre.com/resumai.davidsodre.com

echo "📁 Diretório: $(pwd)"

# Clonar repositório (se não existir)
if [ ! -d ".git" ]; then
    echo "📥 Clonando repositório..."
    git clone https://github.com/davidsodrelins/resumai.git .
else
    echo "📥 Atualizando repositório..."
    git pull origin main
fi

# Instalar dependências
echo "📦 Instalando dependências..."
npm install --production

# Gerar JWT Secret
echo "🔐 Gerando JWT Secret..."
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")

# Criar arquivo .env
echo "⚙️  Criando arquivo .env..."
cat > .env << ENVEOF
# ============================================
# PRODUCTION ENVIRONMENT - ResumAI
# ============================================

# Database MySQL
DATABASE_URL=mysql://resumai_adm:Intel23!!@@localhost:3306/resumai_production

# JWT Secret (gerado automaticamente)
JWT_SECRET=$JWT_SECRET

# Manus API (ADICIONAR DEPOIS)
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=CONFIGURE_DEPOIS
VITE_FRONTEND_FORGE_API_KEY=CONFIGURE_DEPOIS
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im

# OAuth Manus (ADICIONAR DEPOIS)
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
VITE_APP_ID=CONFIGURE_DEPOIS
OWNER_OPEN_ID=CONFIGURE_DEPOIS
OWNER_NAME=David Sodré

# Stripe (MODO TESTE - Substitua por chaves LIVE em produção)
STRIPE_SECRET_KEY=sk_test_51QRnVvP6zH8qH3VK4vN9xKLmYqZJxKqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKq
STRIPE_WEBHOOK_SECRET=whsec_CONFIGURE_DEPOIS
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51QRnVvP6zH8qH3VKtestkeytestkeytestkeytestkeytestkeytestkeytestkey

# SMTP (Servidor de Email - JÁ CONFIGURADO)
SMTP_HOST=resumai.davidsodre.com
SMTP_PORT=465
SMTP_USER=news@resumai.davidsodre.com
SMTP_PASS=Intel23!!
SMTP_SECURE=true
SMTP_FROM_NAME=ResumAI
SMTP_FROM_EMAIL=news@resumai.davidsodre.com

# Google Analytics (ADICIONAR DEPOIS)
VITE_ANALYTICS_WEBSITE_ID=G-XXXXXXXXXX
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im

# App Config
VITE_APP_TITLE=ResumAI - Gerador de Currículos com IA
VITE_APP_LOGO=https://resumai.davidsodre.com/logo.png
NODE_ENV=production
PORT=3010
VITE_APP_URL=https://resumai.davidsodre.com
VITE_API_URL=https://resumai.davidsodre.com/api
ENVEOF

echo "✅ Arquivo .env criado!"

# Build do frontend
echo "🔨 Compilando frontend..."
npm run build

# Criar ecosystem.config.js
echo "⚙️  Criando configuração do PM2..."
cat > ecosystem.config.js << 'PMEOF'
module.exports = {
  apps: [{
    name: 'resumai',
    script: 'server/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3010
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '1G',
    autorestart: true,
    watch: false,
    max_restarts: 10,
    min_uptime: '10s',
    listen_timeout: 10000,
    kill_timeout: 5000
  }]
};
PMEOF

# Criar diretório de logs
mkdir -p logs

# Parar aplicação antiga (se existir)
echo "🛑 Parando aplicação antiga..."
pm2 stop resumai 2>/dev/null || true
pm2 delete resumai 2>/dev/null || true

# Executar migrações do banco
echo "🗄️  Criando tabelas no banco de dados..."
npm run db:push

# Iniciar aplicação
echo "🚀 Iniciando aplicação com PM2..."
pm2 start ecosystem.config.js

# Salvar configuração
pm2 save

# Configurar PM2 para iniciar no boot
echo "🔄 Configurando PM2 para iniciar automaticamente..."
pm2 startup systemd -u root --hp /root

echo ""
echo "=================================="
echo "✅ Deploy concluído com sucesso!"
echo "=================================="
echo ""
pm2 status
echo ""
echo "📝 Comandos úteis:"
echo "   pm2 logs resumai      # Ver logs em tempo real"
echo "   pm2 restart resumai   # Reiniciar aplicação"
echo "   pm2 stop resumai      # Parar aplicação"
echo "   pm2 monit             # Monitor de recursos"
echo ""
echo "🎉 Aplicação rodando em http://localhost:3010"
echo ""
echo "⚠️  PRÓXIMOS PASSOS:"
echo "1. Configure o reverse proxy no Plesk:"
echo "   - Vá em Hosting Settings do domínio"
echo "   - Adicione em 'Additional nginx directives':"
echo ""
echo "   location / {"
echo "       proxy_pass http://localhost:3010;"
echo "       proxy_http_version 1.1;"
echo "       proxy_set_header Upgrade \$http_upgrade;"
echo "       proxy_set_header Connection 'upgrade';"
echo "       proxy_set_header Host \$host;"
echo "       proxy_cache_bypass \$http_upgrade;"
echo "       proxy_set_header X-Real-IP \$remote_addr;"
echo "       proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;"
echo "       proxy_set_header X-Forwarded-Proto \$scheme;"
echo "   }"
echo ""
echo "2. Habilite SSL/HTTPS no Plesk (Let's Encrypt)"
echo ""
echo "3. Configure depois no arquivo .env:"
echo "   - Chaves do Manus API"
echo "   - Google Analytics ID"
echo "   - Stripe Webhook Secret"
echo ""
echo "=================================="
