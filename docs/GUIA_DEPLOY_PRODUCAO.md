# Guia Completo de Deploy em Produção - ResumAI

**Autor:** Manus AI  
**Data:** 05 de dezembro de 2024  
**Versão:** 1.0

---

## Sumário Executivo

Este documento fornece instruções detalhadas para realizar o deploy do **ResumAI** em um servidor Ubuntu utilizando **Plesk** e **PM2**. O guia cobre todas as configurações necessárias de serviços externos (Google Analytics, Stripe, SMTP) e boas práticas para ambiente de produção.

---

## 1. Preparação do Ambiente no Plesk

### 1.1 Requisitos do Servidor

O servidor Ubuntu deve atender aos seguintes requisitos mínimos para executar o ResumAI de forma estável:

| Componente | Requisito Mínimo | Recomendado |
|------------|------------------|-------------|
| **Sistema Operacional** | Ubuntu 20.04 LTS | Ubuntu 22.04 LTS |
| **Node.js** | v18.x | v22.x |
| **RAM** | 2 GB | 4 GB ou mais |
| **Espaço em Disco** | 10 GB | 20 GB ou mais |
| **CPU** | 2 cores | 4 cores ou mais |
| **MySQL/MariaDB** | 5.7+ | 8.0+ |

### 1.2 Instalação do Node.js via Plesk

Acesse o painel do Plesk e siga os passos abaixo para configurar o ambiente Node.js:

1. Navegue até **Websites & Domains** → selecione seu domínio
2. Clique em **Node.js** no menu lateral
3. Selecione a versão **Node.js 22.x** (mais recente disponível)
4. Habilite a opção **"Enable Node.js"**
5. Configure o **Application Mode** como **Production**
6. Defina o **Document Root** como `/httpdocs`
7. Clique em **Apply** para salvar as configurações

### 1.3 Instalação do PM2 Globalmente

O PM2 é um gerenciador de processos para aplicações Node.js que garante alta disponibilidade e facilita o monitoramento. Para instalá-lo globalmente no servidor, execute via SSH:

```bash
npm install -g pm2
pm2 startup
```

O comando `pm2 startup` gerará um comando específico para seu sistema. Execute o comando gerado para configurar o PM2 para iniciar automaticamente após reinicializações do servidor.

---

## 2. Deploy do Código no Servidor

### 2.1 Upload dos Arquivos via Git

A forma mais eficiente de fazer deploy é utilizando Git. Configure o repositório no servidor:

```bash
cd /var/www/vhosts/seudominio.com/httpdocs
git clone https://github.com/davidsodrelins/resumai.git .
```

**Importante:** O ponto (`.`) no final do comando `git clone` garante que os arquivos sejam extraídos diretamente no diretório atual, sem criar uma subpasta adicional.

### 2.2 Instalação das Dependências

Após clonar o repositório, instale todas as dependências do projeto:

```bash
npm install --production
```

A flag `--production` evita a instalação de dependências de desenvolvimento, reduzindo o tamanho da instalação e melhorando a segurança.

### 2.3 Build do Frontend

Compile o frontend React para produção:

```bash
npm run build
```

Este comando executará o Vite para gerar os arquivos otimizados na pasta `dist/`, que serão servidos pelo servidor Express.

---

## 3. Configuração das Variáveis de Ambiente

### 3.1 Criar Arquivo .env

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis. **Nunca commite este arquivo no Git** - ele deve conter informações sensíveis.

```bash
# Database
DATABASE_URL=mysql://usuario:senha@localhost:3306/resumai_production

# JWT
JWT_SECRET=sua_chave_secreta_muito_longa_e_aleatoria_aqui

# Manus API (já configuradas automaticamente pelo Manus)
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua_chave_manus
VITE_FRONTEND_FORGE_API_KEY=sua_chave_frontend_manus
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im

# OAuth (Manus)
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
VITE_APP_ID=seu_app_id_manus
OWNER_OPEN_ID=seu_open_id
OWNER_NAME=David Sodré

# Stripe (PRODUÇÃO)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...

# SMTP (para envio de emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_de_app

# Google Analytics
VITE_ANALYTICS_WEBSITE_ID=seu_website_id
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im

# App Config
VITE_APP_TITLE=ResumAI
VITE_APP_LOGO=https://seu-dominio.com/logo.png
NODE_ENV=production
PORT=3000
```

### 3.2 Gerar JWT_SECRET Seguro

Para gerar uma chave JWT segura, execute:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copie o resultado e cole no campo `JWT_SECRET` do arquivo `.env`.

---

## 4. Configuração do Banco de Dados

### 4.1 Criar Database MySQL via Plesk

1. No Plesk, navegue até **Databases** → **Add Database**
2. Defina o nome: `resumai_production`
3. Crie um usuário com senha forte
4. Anote as credenciais (host, usuário, senha, database)
5. Configure permissões completas para o usuário

### 4.2 Executar Migrações

Com o banco de dados criado e a `DATABASE_URL` configurada no `.env`, execute as migrações para criar as tabelas:

```bash
npm run db:push
```

Este comando utiliza o Drizzle ORM para sincronizar o schema do banco de dados com as definições em `drizzle/schema.ts`.

### 4.3 Seed de Dados Iniciais (Opcional)

Se você tiver dados iniciais (posts do blog, templates, etc.), pode criar um script de seed:

```bash
node scripts/seed.mjs
```

---

## 5. Configuração do Google Analytics

### 5.1 Criar Propriedade no Google Analytics 4

O Google Analytics 4 (GA4) é a versão mais recente da plataforma de análise do Google e oferece recursos avançados de rastreamento de eventos.

**Passo a passo:**

1. Acesse [Google Analytics](https://analytics.google.com/)
2. Clique em **Admin** (ícone de engrenagem no canto inferior esquerdo)
3. Na coluna **Account**, clique em **Create Account**
4. Preencha os dados:
   - **Account name:** ResumAI
   - **Account data sharing:** Marque as opções conforme preferência
5. Clique em **Next**
6. Configure a propriedade:
   - **Property name:** ResumAI Production
   - **Reporting time zone:** (GMT-03:00) Brasília
   - **Currency:** Brazilian Real (R$)
7. Clique em **Next**
8. Preencha as informações do negócio:
   - **Industry category:** Technology / Software
   - **Business size:** Small (1-10 employees)
9. Clique em **Create** e aceite os termos de serviço

### 5.2 Configurar Data Stream

Após criar a propriedade, você precisa configurar um **Data Stream** para coletar dados do site:

1. Na tela de configuração, clique em **Web**
2. Preencha:
   - **Website URL:** `https://seudominio.com`
   - **Stream name:** ResumAI Website
3. Clique em **Create stream**
4. **Copie o Measurement ID** (formato: `G-XXXXXXXXXX`)

### 5.3 Configurar Enhanced Measurement

O GA4 oferece rastreamento automático de eventos comuns. Habilite as seguintes opções:

- ✅ **Page views** (visualizações de página)
- ✅ **Scrolls** (rolagem de página)
- ✅ **Outbound clicks** (cliques em links externos)
- ✅ **Site search** (pesquisas no site)
- ✅ **Form interactions** (interações com formulários)
- ✅ **File downloads** (downloads de arquivos)

### 5.4 Adicionar Measurement ID ao .env

Adicione o Measurement ID copiado ao arquivo `.env`:

```bash
VITE_ANALYTICS_WEBSITE_ID=G-XXXXXXXXXX
```

**Nota:** O ResumAI já possui integração com Google Analytics via Manus Analytics. Se você estiver usando o endpoint do Manus (`VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im`), os eventos serão enviados através do proxy do Manus, garantindo privacidade e evitando bloqueadores de anúncios.

### 5.5 Verificar Rastreamento

Após o deploy, verifique se os eventos estão sendo rastreados:

1. No Google Analytics, vá para **Reports** → **Realtime**
2. Acesse seu site em uma aba anônima
3. Navegue por algumas páginas
4. Verifique se as visualizações aparecem no relatório em tempo real

---

## 6. Configuração do Stripe (Pagamentos)

### 6.1 Criar Conta Stripe

Se ainda não possui uma conta Stripe, crie uma em [stripe.com](https://stripe.com/). A Stripe é a plataforma de pagamentos mais utilizada globalmente e oferece suporte completo para o Brasil.

### 6.2 Ativar Modo Live

Por padrão, a conta Stripe inicia em **Test Mode**. Para aceitar pagamentos reais, você precisa ativar o **Live Mode**:

1. Acesse o [Dashboard da Stripe](https://dashboard.stripe.com/)
2. Clique no toggle **Test mode** no canto superior direito para desativá-lo
3. Complete o processo de verificação da conta:
   - Informações da empresa
   - Documentos fiscais (CNPJ ou CPF)
   - Dados bancários para recebimento

### 6.3 Obter API Keys de Produção

Após ativar o modo Live, obtenha as chaves de API:

1. No Dashboard, vá para **Developers** → **API keys**
2. Copie as seguintes chaves:
   - **Publishable key** (começa com `pk_live_...`)
   - **Secret key** (começa com `sk_live_...`)

**Importante:** A **Secret key** nunca deve ser exposta no frontend. Ela deve ficar apenas no arquivo `.env` do servidor.

### 6.4 Configurar Webhook

Webhooks permitem que a Stripe notifique seu servidor sobre eventos de pagamento (pagamento aprovado, falhou, reembolso, etc.).

**Passo a passo:**

1. No Dashboard da Stripe, vá para **Developers** → **Webhooks**
2. Clique em **Add endpoint**
3. Configure:
   - **Endpoint URL:** `https://seudominio.com/api/payments/webhook`
   - **Description:** ResumAI Webhook
4. Selecione os eventos a serem ouvidos:
   - ✅ `checkout.session.completed`
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
5. Clique em **Add endpoint**
6. **Copie o Webhook Secret** (começa com `whsec_...`)

### 6.5 Adicionar Chaves ao .env

Adicione as chaves da Stripe ao arquivo `.env`:

```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### 6.6 Configurar Produtos e Preços

O ResumAI possui um sistema de doações. Configure os produtos no Dashboard da Stripe:

1. Vá para **Products** → **Add product**
2. Crie produtos para cada valor de doação:
   - **Nome:** Doação R$ 5,00
   - **Descrição:** Apoie o desenvolvimento do ResumAI
   - **Preço:** R$ 5,00 (BRL)
   - **Tipo:** One-time payment
3. Repita para os valores: R$ 10, R$ 20, R$ 50, R$ 100
4. Copie os **Price IDs** (começam com `price_...`)

**Nota:** O código do ResumAI já possui os valores de doação hardcoded em `server/donations.ts`. Se você quiser usar os Price IDs da Stripe, será necessário atualizar o código.

### 6.7 Testar Pagamentos

Antes de ir para produção, teste o fluxo de pagamento:

1. Utilize cartões de teste da Stripe:
   - **Sucesso:** `4242 4242 4242 4242`
   - **Falha:** `4000 0000 0000 0002`
   - **3D Secure:** `4000 0027 6000 3184`
2. Verifique se os webhooks estão sendo recebidos corretamente
3. Confirme que as doações são registradas no banco de dados

---

## 7. Configuração do SMTP (Envio de Emails)

### 7.1 Opções de Provedor SMTP

O ResumAI envia emails para recuperação de senha, notificações e boas-vindas. Você pode utilizar diversos provedores SMTP:

| Provedor | Custo | Limite Gratuito | Recomendação |
|----------|-------|-----------------|--------------|
| **Gmail** | Gratuito | 500 emails/dia | Ideal para testes e pequeno volume |
| **SendGrid** | Gratuito/Pago | 100 emails/dia | Ótimo para produção |
| **Mailgun** | Gratuito/Pago | 5.000 emails/mês (trial) | Excelente para produção |
| **Amazon SES** | Pago | 62.000 emails/mês (free tier) | Melhor custo-benefício |

### 7.2 Configurar Gmail SMTP

Se optar por usar Gmail (recomendado para começar), siga os passos:

1. Acesse [Google Account](https://myaccount.google.com/)
2. Vá para **Security** → **2-Step Verification** (habilite se ainda não tiver)
3. Role até **App passwords** e clique
4. Selecione:
   - **App:** Mail
   - **Device:** Other (Custom name) → "ResumAI"
5. Clique em **Generate**
6. **Copie a senha de 16 caracteres** gerada

### 7.3 Adicionar Credenciais SMTP ao .env

Adicione as credenciais ao arquivo `.env`:

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=senha_de_app_16_caracteres
```

### 7.4 Configurar SendGrid (Alternativa Recomendada)

Para produção com maior volume, recomenda-se usar SendGrid:

1. Crie uma conta em [sendgrid.com](https://sendgrid.com/)
2. Verifique seu domínio (Settings → Sender Authentication)
3. Crie uma API Key (Settings → API Keys)
4. Configure no `.env`:

```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=sua_api_key_sendgrid
```

### 7.5 Testar Envio de Email

Teste o envio de email utilizando a funcionalidade de recuperação de senha:

1. Acesse `https://seudominio.com/forgot-password`
2. Digite seu email e solicite recuperação
3. Verifique se o email foi recebido
4. Clique no link e redefina a senha

---

## 8. Configuração do PM2

### 8.1 Criar Arquivo ecosystem.config.js

Crie um arquivo `ecosystem.config.js` na raiz do projeto para configurar o PM2:

```javascript
module.exports = {
  apps: [{
    name: 'resumai',
    script: 'server/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '1G',
    autorestart: true,
    watch: false,
    ignore_watch: ['node_modules', 'logs', 'dist'],
    max_restarts: 10,
    min_uptime: '10s',
    listen_timeout: 10000,
    kill_timeout: 5000
  }]
};
```

### 8.2 Iniciar Aplicação com PM2

Execute os seguintes comandos para iniciar a aplicação:

```bash
# Criar pasta de logs
mkdir -p logs

# Iniciar aplicação
pm2 start ecosystem.config.js

# Salvar configuração para reiniciar após reboot
pm2 save

# Ver status
pm2 status

# Ver logs em tempo real
pm2 logs resumai
```

### 8.3 Comandos Úteis do PM2

| Comando | Descrição |
|---------|-----------|
| `pm2 list` | Listar todas as aplicações |
| `pm2 restart resumai` | Reiniciar aplicação |
| `pm2 stop resumai` | Parar aplicação |
| `pm2 delete resumai` | Remover aplicação do PM2 |
| `pm2 logs resumai` | Ver logs em tempo real |
| `pm2 logs resumai --lines 100` | Ver últimas 100 linhas de log |
| `pm2 monit` | Monitor interativo de CPU/memória |
| `pm2 flush` | Limpar todos os logs |

### 8.4 Configurar Logs Rotativos

Para evitar que os logs cresçam indefinidamente, instale o módulo de rotação:

```bash
pm2 install pm2-logrotate

# Configurar rotação
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true
```

---

## 9. Configuração do Nginx/Apache (Reverse Proxy)

### 9.1 Configurar Nginx via Plesk

O Plesk geralmente usa Nginx como reverse proxy. Configure as diretivas adicionais:

1. No Plesk, vá para **Websites & Domains** → seu domínio
2. Clique em **Apache & nginx Settings**
3. Na seção **Additional nginx directives**, adicione:

```nginx
location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
    proxy_read_timeout 300s;
    proxy_connect_timeout 75s;
}

location /api {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_read_timeout 300s;
    proxy_connect_timeout 75s;
}
```

4. Clique em **OK** para aplicar

### 9.2 Configurar SSL/HTTPS

O Plesk facilita a configuração de SSL com Let's Encrypt:

1. Vá para **SSL/TLS Certificates**
2. Clique em **Install** na seção **Let's Encrypt**
3. Marque as opções:
   - ✅ Secure the domain
   - ✅ Secure the www subdomain
   - ✅ Assign the certificate to the mail domain
4. Digite seu email para notificações
5. Clique em **Get it free**

O certificado será renovado automaticamente pelo Plesk.

---

## 10. Configuração de Domínio Customizado

### 10.1 Configurar DNS

Para apontar seu domínio para o servidor, configure os registros DNS:

| Tipo | Nome | Valor | TTL |
|------|------|-------|-----|
| **A** | @ | IP_DO_SERVIDOR | 3600 |
| **A** | www | IP_DO_SERVIDOR | 3600 |
| **CNAME** | api | seudominio.com | 3600 |

**Nota:** O tempo de propagação DNS pode levar de 1 a 48 horas.

### 10.2 Atualizar Variáveis de Ambiente

Após configurar o domínio, atualize o `.env`:

```bash
VITE_APP_LOGO=https://seudominio.com/logo.png
```

### 10.3 Configurar Redirecionamento www

No Plesk, configure o redirecionamento de `www` para o domínio principal:

1. Vá para **Hosting Settings**
2. Na seção **Preferred domain**, selecione:
   - **Redirect from www to non-www** (ou vice-versa)
3. Clique em **OK**

---

## 11. Monitoramento e Manutenção

### 11.1 Configurar Monitoramento PM2

Instale o PM2 Plus para monitoramento avançado (opcional):

```bash
pm2 link <secret_key> <public_key>
```

Obtenha as chaves em [pm2.io](https://pm2.io/).

### 11.2 Backup do Banco de Dados

Configure backups automáticos do MySQL via Plesk:

1. Vá para **Tools & Settings** → **Backup Manager**
2. Clique em **Schedule**
3. Configure:
   - **Frequency:** Daily
   - **Time:** 03:00 AM
   - **Full backup:** Yes
   - **Store backups on:** Server repository
   - **Retention:** 7 backups
4. Clique em **OK**

### 11.3 Monitorar Logs de Erro

Configure alertas para erros críticos:

```bash
# Ver erros em tempo real
pm2 logs resumai --err

# Filtrar erros específicos
pm2 logs resumai --err | grep "ERROR"
```

### 11.4 Atualizar Aplicação

Para atualizar o código em produção:

```bash
# Parar aplicação
pm2 stop resumai

# Atualizar código
git pull origin main

# Instalar novas dependências
npm install --production

# Rebuild frontend
npm run build

# Executar migrações (se houver)
npm run db:push

# Reiniciar aplicação
pm2 restart resumai

# Verificar logs
pm2 logs resumai --lines 50
```

---

## 12. Checklist Final de Deploy

Antes de considerar o deploy concluído, verifique todos os itens:

### 12.1 Ambiente

- [ ] Node.js 22.x instalado
- [ ] PM2 instalado globalmente
- [ ] Dependências instaladas (`npm install --production`)
- [ ] Frontend compilado (`npm run build`)
- [ ] Arquivo `.env` configurado com todas as variáveis
- [ ] Permissões de arquivo corretas (owner: usuário do Plesk)

### 12.2 Banco de Dados

- [ ] Database MySQL criada
- [ ] Usuário com permissões configurado
- [ ] `DATABASE_URL` no `.env` correta
- [ ] Migrações executadas (`npm run db:push`)
- [ ] Backup automático configurado

### 12.3 Serviços Externos

- [ ] Google Analytics configurado e rastreando
- [ ] Stripe em modo Live com webhook configurado
- [ ] SMTP configurado e testado
- [ ] Domínio DNS apontando para o servidor
- [ ] SSL/HTTPS ativo (Let's Encrypt)

### 12.4 PM2 e Servidor

- [ ] Aplicação rodando via PM2
- [ ] PM2 configurado para iniciar no boot (`pm2 startup`)
- [ ] Logs rotativos configurados
- [ ] Nginx/Apache configurado como reverse proxy
- [ ] Firewall permitindo portas 80 e 443

### 12.5 Testes Finais

- [ ] Página inicial carrega corretamente
- [ ] Login/Signup funcionando
- [ ] Geração de currículo funcionando
- [ ] Upload de arquivos funcionando
- [ ] Pagamentos Stripe funcionando
- [ ] Envio de emails funcionando
- [ ] Google Analytics rastreando eventos
- [ ] Responsividade mobile OK

---

## 13. Solução de Problemas Comuns

### 13.1 Aplicação Não Inicia

**Sintoma:** PM2 mostra status "errored" ou "stopped"

**Soluções:**

1. Verifique os logs de erro:
   ```bash
   pm2 logs resumai --err --lines 50
   ```

2. Verifique se todas as variáveis de ambiente estão configuradas:
   ```bash
   cat .env | grep -v "^#" | grep -v "^$"
   ```

3. Verifique se a porta 3000 está disponível:
   ```bash
   netstat -tuln | grep 3000
   ```

4. Tente iniciar manualmente para ver erros:
   ```bash
   NODE_ENV=production node server/index.js
   ```

### 13.2 Erro de Conexão com Banco de Dados

**Sintoma:** "Error: connect ECONNREFUSED" ou "Access denied for user"

**Soluções:**

1. Verifique se o MySQL está rodando:
   ```bash
   systemctl status mysql
   ```

2. Teste a conexão manualmente:
   ```bash
   mysql -h localhost -u usuario -p resumai_production
   ```

3. Verifique a `DATABASE_URL` no `.env`:
   ```bash
   echo $DATABASE_URL
   ```

4. Verifique as permissões do usuário no MySQL:
   ```sql
   SHOW GRANTS FOR 'usuario'@'localhost';
   ```

### 13.3 Stripe Webhook Não Recebe Eventos

**Sintoma:** Pagamentos não são registrados no banco de dados

**Soluções:**

1. Verifique se o endpoint está acessível:
   ```bash
   curl -X POST https://seudominio.com/api/payments/webhook
   ```

2. Verifique os logs do Stripe Dashboard:
   - Vá para **Developers** → **Webhooks**
   - Clique no endpoint configurado
   - Veja a seção **Recent deliveries**

3. Verifique se o `STRIPE_WEBHOOK_SECRET` está correto no `.env`

4. Teste localmente com Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/payments/webhook
   ```

### 13.4 Emails Não São Enviados

**Sintoma:** Erro "Connection timeout" ou "Authentication failed"

**Soluções:**

1. Verifique as credenciais SMTP no `.env`

2. Teste a conexão SMTP manualmente:
   ```bash
   telnet smtp.gmail.com 587
   ```

3. Se usar Gmail, verifique se a senha de app está correta

4. Verifique se o firewall permite conexões na porta 587:
   ```bash
   sudo ufw status
   ```

5. Tente usar porta 465 (SSL) ao invés de 587 (TLS):
   ```bash
   SMTP_PORT=465
   ```

### 13.5 Google Analytics Não Rastreia

**Sintoma:** Relatórios do GA4 vazios

**Soluções:**

1. Verifique se o `VITE_ANALYTICS_WEBSITE_ID` está correto

2. Abra o site em modo anônimo e verifique o console do navegador:
   - Pressione F12
   - Vá para a aba **Network**
   - Filtre por "analytics" ou "collect"
   - Verifique se há requisições sendo enviadas

3. Verifique se o bloqueador de anúncios está desabilitado

4. Use a extensão **Google Analytics Debugger** para Chrome

---

## 14. Próximos Passos e Melhorias

Após o deploy bem-sucedido, considere implementar as seguintes melhorias:

### 14.1 Performance

- Configurar CDN (Cloudflare) para assets estáticos
- Implementar cache Redis para sessões
- Otimizar imagens com compressão automática
- Habilitar HTTP/2 no Nginx

### 14.2 Segurança

- Implementar rate limiting para APIs
- Configurar WAF (Web Application Firewall)
- Habilitar CORS apenas para domínios permitidos
- Implementar CSP (Content Security Policy)
- Configurar HSTS (HTTP Strict Transport Security)

### 14.3 Monitoramento

- Integrar com Sentry para rastreamento de erros
- Configurar alertas de uptime (UptimeRobot, Pingdom)
- Implementar APM (Application Performance Monitoring)
- Configurar dashboards de métricas (Grafana)

### 14.4 SEO e Marketing

- Configurar Google Search Console
- Implementar sitemap.xml dinâmico
- Adicionar meta tags Open Graph
- Configurar Twitter Cards
- Implementar schema.org markup

---

## 15. Contato e Suporte

Para dúvidas ou problemas durante o deploy, entre em contato:

- **Email:** davidsodre_ba@hotmail.com
- **GitHub:** [github.com/davidsodrelins/resumai](https://github.com/davidsodrelins/resumai)

---

**Documento criado por:** Manus AI  
**Última atualização:** 05 de dezembro de 2024  
**Versão do ResumAI:** 1.0.0
