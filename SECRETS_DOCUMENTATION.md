# Documentação de Secrets e Variáveis de Ambiente - ResumAI

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [SMTP (Email)](#smtp-email)
3. [Stripe (Pagamentos)](#stripe-pagamentos)
4. [Google Analytics](#google-analytics)
5. [Configurações da Aplicação](#configurações-da-aplicação)
6. [Variáveis Automáticas do Manus](#variáveis-automáticas-do-manus)
7. [Configuração de Webhooks](#configuração-de-webhooks)
8. [Segurança e Boas Práticas](#segurança-e-boas-práticas)

---

## Visão Geral

Este documento contém todas as informações sobre as variáveis de ambiente e secrets necessários para o funcionamento completo do **ResumAI**.

### ⚠️ IMPORTANTE

- **NUNCA** commitar o arquivo `.env` real com valores sensíveis no repositório
- Use o arquivo `.env.example` como template
- Configure os secrets no painel do Manus em `Settings → Secrets`
- Para deploy em VPS/servidor próprio, configure as variáveis no arquivo `.env`

---

## SMTP (Email)

Configurações para envio de emails (boas-vindas, notificações, level-up, etc).

### Variáveis

| Variável | Valor | Descrição |
|----------|-------|-----------|
| `SMTP_HOST` | `resumai.davidsodre.com` | Servidor SMTP |
| `SMTP_PORT` | `465` | Porta SMTP (SSL) |
| `SMTP_USER` | `news@resumai.davidsodre.com` | Usuário de autenticação |
| `SMTP_PASS` | `Intel23!!` | Senha de autenticação |
| `SMTP_FROM` | `news@resumai.davidsodre.com` | Email remetente |

### Testes

Para testar a configuração SMTP, use o endpoint de teste ou envie um email de boas-vindas após cadastro.

### Troubleshooting

- **Erro de conexão**: Verifique firewall e se a porta 465 está aberta
- **Autenticação falha**: Confirme usuário e senha
- **Emails não chegam**: Verifique spam e configurações SPF/DKIM do domínio

---

## Stripe (Pagamentos)

Configurações para processar doações e pagamentos via Stripe.

### Variáveis de Produção

| Variável | Formato | Descrição |
|----------|---------|-----------|
| `STRIPE_SECRET_KEY` | `sk_live_...` | Chave secreta de produção |
| `STRIPE_PUBLISHABLE_KEY` | `pk_live_...` | Chave pública de produção |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Secret do webhook |

### Variáveis de Teste (Desenvolvimento)

| Variável | Formato | Descrição |
|----------|---------|-----------|
| `STRIPE_SECRET_KEY` | `sk_test_...` | Chave secreta de teste |
| `STRIPE_PUBLISHABLE_KEY` | `pk_test_...` | Chave pública de teste |
| `STRIPE_WEBHOOK_SECRET` | `whsec_test_...` | Secret do webhook de teste |

### Cartões de Teste

Para testar pagamentos em modo de desenvolvimento:

- **Sucesso**: `4242 4242 4242 4242`
- **Falha**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0027 6000 3184`

Qualquer data futura e qualquer CVC funcionam para testes.

### Onde Obter as Chaves

1. Acesse [Dashboard do Stripe](https://dashboard.stripe.com/)
2. Clique em **Developers → API keys**
3. Copie as chaves de produção ou teste
4. Configure no Manus em `Settings → Secrets`

---

## Google Analytics

Configuração para rastreamento de analytics.

### Variáveis

| Variável | Formato | Descrição |
|----------|---------|-----------|
| `VITE_ANALYTICS_ID` | `G-XXXXXXXXXX` | ID do Google Analytics 4 |

### Como Obter

1. Acesse [Google Analytics](https://analytics.google.com/)
2. Crie uma propriedade GA4
3. Copie o ID de medição (formato `G-XXXXXXXXXX`)
4. Configure no Manus

---

## Configurações da Aplicação

Configurações gerais da aplicação.

### Variáveis

| Variável | Valor | Descrição |
|----------|-------|-----------|
| `VITE_APP_TITLE` | `ResumAI` | Título da aplicação |
| `VITE_APP_LOGO` | `/logo.png` | Caminho do logo |

---

## Variáveis Automáticas do Manus

As seguintes variáveis são **injetadas automaticamente** pelo Manus e **NÃO devem ser configuradas manualmente**:

### Banco de Dados

- `DATABASE_URL`: URL de conexão com o banco de dados MySQL/TiDB

### Autenticação

- `JWT_SECRET`: Segredo para geração de tokens JWT
- `OAUTH_*`: Variáveis de configuração OAuth (Google, GitHub, etc)

### Outras

O Manus injeta automaticamente outras variáveis necessárias para o funcionamento do sistema de autenticação e banco de dados.

---

## Configuração de Webhooks

### Webhook do Stripe

O webhook é necessário para processar eventos de pagamento em tempo real.

#### Passo a Passo

1. **Acesse o Dashboard do Stripe**
   - URL: https://dashboard.stripe.com/webhooks

2. **Adicione um novo endpoint**
   - Clique em **Add endpoint**

3. **Configure a URL**
   - URL do webhook: `https://SEU_DOMINIO.manus.space/api/stripe/webhook`
   - Ou se usar domínio customizado: `https://seu-dominio.com/api/stripe/webhook`

4. **Selecione os eventos**
   - `checkout.session.completed`
   - `payment_intent.succeeded`

5. **Copie o Signing Secret**
   - Após criar o webhook, copie o **Signing secret** (formato `whsec_...`)
   - Configure no Manus como `STRIPE_WEBHOOK_SECRET`

#### Testando o Webhook

Use o Stripe CLI para testar localmente:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
stripe trigger checkout.session.completed
```

---

## Segurança e Boas Práticas

### ✅ Faça

- Use variáveis de ambiente para todos os valores sensíveis
- Mantenha o arquivo `.env.example` atualizado (sem valores reais)
- Use chaves de teste durante o desenvolvimento
- Rotacione secrets regularmente
- Configure HTTPS em produção
- Use secrets do Manus para deploy na plataforma

### ❌ Não Faça

- **NUNCA** commitar o arquivo `.env` real no Git
- **NUNCA** compartilhar secrets publicamente
- **NUNCA** usar chaves de produção em desenvolvimento
- **NUNCA** hardcodar valores sensíveis no código
- **NUNCA** expor secrets em logs ou mensagens de erro

### Arquivo .gitignore

Certifique-se de que o `.gitignore` contém:

```
.env
.env.local
.env.production
.env.development
*.key
*.pem
```

### Rotação de Secrets

Recomenda-se rotacionar os seguintes secrets periodicamente:

- **JWT_SECRET**: A cada 6 meses
- **SMTP_PASS**: A cada 3 meses
- **STRIPE_SECRET_KEY**: Apenas se comprometida
- **Webhook Secrets**: Apenas se comprometidos

### Backup de Secrets

Mantenha um backup seguro dos secrets em:

- Gerenciador de senhas (1Password, LastPass, Bitwarden)
- Vault corporativo
- Documentação criptografada

**NUNCA** armazene em:

- Email
- Mensagens de chat
- Documentos não criptografados
- Repositórios Git

---

## Checklist de Configuração

Use este checklist ao configurar um novo ambiente:

### Desenvolvimento

- [ ] Copiar `.env.example` para `.env`
- [ ] Configurar SMTP (pode usar Mailtrap para testes)
- [ ] Configurar Stripe com chaves de teste
- [ ] Configurar Google Analytics (opcional em dev)
- [ ] Testar envio de emails
- [ ] Testar pagamentos com cartão de teste

### Produção

- [ ] Configurar todas as variáveis no Manus `Settings → Secrets`
- [ ] Usar chaves de produção do Stripe
- [ ] Configurar webhook do Stripe
- [ ] Configurar Google Analytics
- [ ] Testar envio de emails reais
- [ ] Testar pagamento real (valor mínimo)
- [ ] Configurar domínio customizado
- [ ] Habilitar HTTPS
- [ ] Verificar logs de erro

---

## Suporte

Se encontrar problemas com a configuração:

1. Verifique os logs no terminal do projeto
2. Consulte a documentação em `docs/`
3. Verifique o arquivo `CHANGELOG.md` para mudanças recentes
4. Contate o suporte do Manus: https://help.manus.im

---

**Última atualização**: 30 de Dezembro de 2025  
**Versão**: 1.0.0  
**Autor**: David Sodré
