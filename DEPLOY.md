# 🚀 Guia de Publicação - ResumAI

Este documento contém instruções para publicar o ResumAI em produção no domínio **resumai.davidsodre.com**.

---

## 📋 Pré-requisitos

- Conta Manus com projeto criado
- Domínio customizado configurado (resumai.davidsodre.com)
- Conta Google Analytics 4 criada
- Stripe configurado (modo produção)

---

## 🔧 Configurações Necessárias

### 1. Google Analytics 4

1. Acesse [Google Analytics](https://analytics.google.com)
2. Crie uma propriedade GA4 para "ResumAI"
3. Copie o **ID de Medição** (formato: `G-XXXXXXXXXX`)
4. Edite o arquivo `client/index.html` (linha 9):
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   ```
5. Substitua também na linha 13:
   ```javascript
   gtag('config', 'G-XXXXXXXXXX');
   ```

### 2. Domínio Customizado

1. Acesse o painel Manus → Settings → Domains
2. Adicione o domínio `resumai.davidsodre.com`
3. Configure os registros DNS conforme instruções do painel:
   ```
   Tipo: CNAME
   Nome: resumai
   Valor: [fornecido pelo Manus]
   ```
4. Aguarde propagação DNS (até 48h)

### 3. Stripe (Produção)

1. Acesse [Stripe Dashboard](https://dashboard.stripe.com)
2. Ative o modo de produção
3. Copie as chaves de API de produção:
   - `STRIPE_SECRET_KEY` (sk_live_...)
   - `STRIPE_PUBLISHABLE_KEY` (pk_live_...)
4. Configure no painel Manus → Settings → Secrets

### 4. Variáveis de Ambiente

Certifique-se de que estas variáveis estão configuradas no painel Manus:

```env
# Título e Logo
VITE_APP_TITLE=ResumAI - Gerador de Currículos com IA
VITE_APP_LOGO=/logo.svg

# Stripe (Produção)
STRIPE_SECRET_KEY=sk_live_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Google Analytics
# (configurado diretamente no client/index.html)
```

---

## 📦 Processo de Deploy

### 1. Criar Checkpoint

1. Acesse o projeto no Manus
2. Clique em "Save Checkpoint"
3. Adicione descrição: "Versão 1.0 - Lançamento Público"

### 2. Publicar

1. Clique no botão **"Publish"** no header do painel
2. Aguarde o build e deploy (3-5 minutos)
3. Verifique a URL de produção: https://resumai.davidsodre.com

### 3. Verificar Funcionalidades

- [ ] Página inicial carrega corretamente
- [ ] Blog está acessível (/blog)
- [ ] Sistema de cadastro funciona
- [ ] Criação de currículo funciona
- [ ] Sistema de doação Stripe funciona
- [ ] Sistema de referral funciona
- [ ] Painel admin acessível (apenas para admins)
- [ ] Google Analytics rastreando eventos

---

## 🔍 SEO e Marketing

### Sitemap

O sitemap é gerado automaticamente em:
```
https://resumai.davidsodre.com/sitemap.xml
```

### Submeter aos Mecanismos de Busca

1. **Google Search Console**
   - Acesse [Google Search Console](https://search.google.com/search-console)
   - Adicione a propriedade `resumai.davidsodre.com`
   - Submeta o sitemap: `https://resumai.davidsodre.com/sitemap.xml`

2. **Bing Webmaster Tools**
   - Acesse [Bing Webmaster](https://www.bing.com/webmasters)
   - Adicione o site e submeta o sitemap

### Robots.txt

O arquivo `robots.txt` já está configurado em `/client/public/robots.txt`:
```
User-agent: *
Allow: /
Sitemap: https://resumai.davidsodre.com/sitemap.xml
```

---

## 📊 Monitoramento

### Google Analytics 4

Acesse o dashboard do GA4 para monitorar:
- **Eventos de Conversão:**
  - `sign_up` - Cadastros
  - `create_resume` - Currículos criados
  - `purchase` - Doações
  - `share` - Compartilhamentos de referral
  - `view_item` - Visualizações de posts do blog

### Métricas Importantes

- Taxa de conversão (visitantes → cadastros)
- Taxa de criação de currículos
- Taxa de doação
- Tráfego orgânico do blog
- Referrals bem-sucedidos

---

## 🎯 Estratégia de Crescimento

### 1. SEO (Curto Prazo)

- ✅ 5 artigos SEO publicados
- ✅ Sitemap configurado
- ✅ Meta tags otimizadas
- ⏳ Submeter ao Google Search Console
- ⏳ Criar backlinks (guest posts, fóruns)

### 2. Referral (Médio Prazo)

- ✅ Sistema de referral funcionando
- ✅ Recompensas automáticas (+2 currículos)
- ⏳ Campanha de email incentivando indicações
- ⏳ Posts nas redes sociais sobre o programa

### 3. Conteúdo (Longo Prazo)

- ⏳ Publicar 2-3 artigos novos por mês
- ⏳ Criar vídeos tutoriais (YouTube)
- ⏳ Webinars sobre currículos e carreira
- ⏳ Parcerias com influenciadores de RH

---

## 🛠️ Manutenção

### Backup

- Checkpoints são criados automaticamente
- Recomendado: criar checkpoint manual antes de grandes mudanças

### Atualizações

1. Faça mudanças no ambiente de desenvolvimento
2. Teste localmente
3. Crie checkpoint
4. Publique

### Rollback

Se algo der errado:
1. Acesse Management UI → Checkpoints
2. Selecione checkpoint anterior
3. Clique em "Rollback"

---

## 📞 Suporte

- **Documentação Manus:** https://docs.manus.im
- **Suporte Manus:** https://help.manus.im
- **Stripe Support:** https://support.stripe.com

---

## ✅ Checklist Final

Antes de lançar publicamente:

- [ ] Google Analytics ID configurado
- [ ] Domínio customizado funcionando
- [ ] Stripe em modo produção
- [ ] Todas as funcionalidades testadas
- [ ] Sitemap submetido ao Google
- [ ] Posts do blog revisados
- [ ] Sistema de referral testado
- [ ] Emails de notificação funcionando
- [ ] Performance otimizada (Lighthouse > 90)
- [ ] Responsividade mobile testada
- [ ] Backup (checkpoint) criado

---

**Boa sorte com o lançamento! 🚀**
