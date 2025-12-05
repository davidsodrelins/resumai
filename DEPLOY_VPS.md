# 🚀 Guia de Deploy VPS - ResumAI

Este documento descreve o processo de deploy do ResumAI em um servidor VPS (como o seu servidor Plesk).

## ⚠️ Problema Identificado

O erro que você está enfrentando:

```
npm error ERESOLVE could not resolve
npm error peer vite@"^4.0.0 || ^5.0.0" from @builder.io/vite-plugin-jsx-loc@0.1.1
```

**Causa:** Conflito de dependências entre Vite 7 (usado no projeto) e o plugin `@builder.io/vite-plugin-jsx-loc` que só suporta Vite 4-5.

**Solução:** O plugin foi removido do `package.json` pois não é essencial para produção.

## 🔧 Correções Aplicadas

1. ✅ Removido `@builder.io/vite-plugin-jsx-loc` do package.json
2. ✅ Criado arquivo `.npmrc` com configurações otimizadas
3. ✅ Criado script `deploy.sh` automatizado
4. ✅ Script usa `pnpm` ao invés de `npm`

## 📋 Pré-requisitos no Servidor

```bash
# 1. Node.js v20+
node -v  # Deve mostrar v20.x.x

# 2. pnpm
npm install -g pnpm@latest

# 3. PM2 (gerenciador de processos)
npm install -g pm2
```

## 🚀 Deploy Automático

### Passo 1: Fazer Pull das Mudanças

```bash
cd /var/www/vhosts/davidsodre.com/resumai.davidsodre.com
git pull origin main
```

### Passo 2: Executar Deploy

```bash
sudo ./deploy.sh
```

O script irá:
- ✅ Atualizar código do GitHub
- ✅ Instalar dependências com pnpm
- ✅ Executar migrações do banco
- ✅ Compilar projeto
- ✅ Reiniciar aplicação com PM2

## 🔄 Deploy Manual (se o script falhar)

```bash
cd /var/www/vhosts/davidsodre.com/resumai.davidsodre.com

# 1. Atualizar código
git pull origin main

# 2. Instalar dependências (USAR PNPM, NÃO NPM!)
pnpm install --prod=false

# 3. Executar migrações
pnpm db:push

# 4. Compilar
pnpm build

# 5. Reiniciar com PM2
pm2 restart resumai
# OU se for primeira vez:
pm2 start dist/index.js --name resumai
pm2 save
```

## 🐛 Troubleshooting

### Erro: "pnpm: command not found"

```bash
npm install -g pnpm@latest
```

### Erro: "Permission denied" ao executar deploy.sh

```bash
chmod +x deploy.sh
sudo ./deploy.sh
```

### Erro: Dependências ainda dando conflito

```bash
# Limpar cache e reinstalar
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install --prod=false
```

### Erro: "Port 3000 already in use"

```bash
# Ver processos
pm2 list

# Parar processo antigo
pm2 stop resumai
pm2 delete resumai

# Iniciar novamente
pm2 start dist/index.js --name resumai
pm2 save
```

## 📊 Verificar Deploy

```bash
# Ver status
pm2 status

# Ver logs
pm2 logs resumai

# Testar aplicação
curl http://localhost:3000
```

## 🔍 Diferenças: Manus vs VPS

| Aspecto | Manus (Produção Atual) | VPS (Seu Servidor) |
|---------|------------------------|---------------------|
| Deploy | Botão "Publish" | Script deploy.sh |
| Gerenciador | Automático | PM2 manual |
| Banco de Dados | Gerenciado | MySQL próprio |
| SSL/HTTPS | Automático | Nginx + Certbot |
| Domínio | Configurado no painel | DNS manual |
| Backup | Checkpoints | Manual |

## 💡 Recomendação

Para **produção**, recomendo continuar usando o **Manus** (mais simples e confiável).

Para **desenvolvimento/testes** no VPS, use o script `deploy.sh` criado.

## 📞 Suporte

Se continuar com problemas:
1. Verifique os logs: `pm2 logs resumai`
2. Verifique o arquivo .env
3. Entre em contato: news@resumai.davidsodre.com
