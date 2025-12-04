# ResumAI 🚀

**Plataforma inteligente de geração de currículos profissionais com IA**

ResumAI é uma plataforma completa que transforma a criação de currículos em uma experiência rápida, inteligente e profissional. Utilizando inteligência artificial (Llama), a plataforma gera currículos otimizados para ATS (Applicant Tracking Systems) em 3 idiomas, com múltiplos templates visuais e recursos avançados de análise e otimização.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB)](https://react.dev/)
[![tRPC](https://img.shields.io/badge/tRPC-11-2596BE)](https://trpc.io/)
[![Tests](https://img.shields.io/badge/tests-50%2F50-success)](https://vitest.dev/)

---

## ✨ Principais Funcionalidades

### 🤖 Geração Inteligente de Currículos
- **3 modelos de currículo**: Reduzido, Misto, Completo
- **3 idiomas**: Português, Inglês, Espanhol
- **5 templates visuais**: Clássico, Moderno, Minimalista, Executivo, Criativo
- **Processamento via IA**: Llama AI para geração contextual
- **Importação flexível**: Upload de PDF/DOCX ou URL do LinkedIn

### 📊 Análise e Otimização ATS
- **Pontuação ATS (0-100)**: Análise detalhada de compatibilidade
- **Sugestões inteligentes**: Melhorias automáticas via IA
- **Análise de palavras-chave**: Match com descrição de vagas
- **Badge em tempo real**: Pontuação visível durante edição
- **Aplicação em lote**: Otimize todo o currículo com um clique

### 🎨 Editor Interativo
- **Edição inline**: Modifique qualquer campo diretamente
- **Drag-and-drop**: Reordene seções facilmente
- **Seções customizadas**: Adicione Projetos, Publicações, Voluntariado
- **Auto-save inteligente**: Salvamento automático a cada 30 segundos
- **Preview em tempo real**: Veja mudanças instantaneamente

### 📄 Exportação Multi-formato
- **PDF colorido**: Preserva cores do template selecionado
- **DOCX editável**: Compatível com Microsoft Word
- **LaTeX**: Para submissões acadêmicas e técnicas
- **Metadados ocultos**: Otimizados para leitura por IA

### 🌐 Portfolio Web Automático
- **3 templates responsivos**: Moderno, Minimalista, Profissional
- **Biografia gerada por IA**: Seção "Sobre Mim" automática
- **Hospedagem incluída**: URL pública no S3
- **SEO otimizado**: Meta tags, Open Graph, Twitter Cards

### 💌 Cartas de Apresentação
- **Geração personalizada**: Baseada em dados do currículo
- **3 idiomas suportados**: PT, EN, ES
- **Campos customizáveis**: Empresa, cargo, descrição da vaga
- **Editor inline**: Ajustes rápidos antes de exportar

### 📈 Dashboard e Estatísticas
- **Métricas de uso**: Total de currículos, média mensal
- **Gráficos interativos**: Distribuição por template e idioma
- **Score ATS médio**: Acompanhe evolução da qualidade
- **Atividade recente**: Últimos 5 currículos criados

### 🔍 Análise de Soft Skills
- **Detecção automática**: Identifica soft skills no currículo
- **Banco de dados por cargo**: Developer, Manager, Designer, Sales, Marketing
- **Sugestões contextualizadas**: Exemplos específicos via IA
- **Coverage score**: Percentual de skills relevantes presentes

### 🔄 Histórico e Comparação
- **Histórico completo**: Todos os currículos salvos
- **Busca e filtros**: Por template, idioma, modelo
- **Comparação lado a lado**: Visualize diferenças entre versões
- **Restauração fácil**: Volte para versões anteriores

### 💰 Sistema de Doações e Limites
- **Tier gratuito**: 5 currículos por mês
- **Apoiadores**: Currículos ilimitados + badge especial
- **Doações temáticas**:
  - ☕ Me pague um café (R$ 5)
  - 🍫 Chocolate pra Luluzinha (R$ 10)
  - 🥪 Me pague um sanduíche (R$ 15)
  - 💝 Valor personalizado
- **Integração Stripe**: Pagamentos seguros

---

## 🛠️ Stack Tecnológico

### Backend
- **Node.js 22** + **TypeScript**
- **tRPC 11**: Type-safe API
- **Express 4**: Servidor HTTP
- **Drizzle ORM**: Type-safe database queries
- **MySQL/TiDB**: Banco de dados relacional
- **Llama AI (Groq)**: Processamento de linguagem natural
- **Stripe**: Pagamentos e doações
- **JWT + OAuth**: Autenticação dual

### Frontend
- **React 19** + **TypeScript**
- **Tailwind CSS 4**: Estilização utility-first
- **shadcn/ui**: Componentes acessíveis
- **Wouter**: Roteamento leve
- **TanStack Query**: Cache e sincronização
- **Chart.js**: Gráficos interativos
- **React Joyride**: Tour guiado

---

## 📦 Instalação

### Pré-requisitos

- **Node.js 22+**
- **pnpm 9+**
- **MySQL 8+** ou **TiDB**
- **Conta Stripe** (para doações)
- **Conta Groq** (para Llama AI)

### 1. Clone o Repositório

```bash
git clone https://github.com/davidsodrelins/resumai.git
cd resumai
```

### 2. Instale as Dependências

```bash
pnpm install
```

### 3. Configure as Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Banco de Dados
DATABASE_URL="mysql://usuario:senha@localhost:3306/resumai"

# Autenticação JWT
JWT_SECRET="seu_secret_super_seguro_aqui_min_32_caracteres"

# Stripe (Pagamentos)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
VITE_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Llama AI (Groq)
GROQ_API_KEY="gsk_..."

# OAuth Manus (Opcional)
VITE_APP_ID="seu_app_id"
OAUTH_SERVER_URL="https://api.manus.im"
VITE_OAUTH_PORTAL_URL="https://portal.manus.im"
OWNER_OPEN_ID="seu_open_id"
OWNER_NAME="Seu Nome"

# Storage S3 (Opcional)
BUILT_IN_FORGE_API_URL="https://api.manus.im"
BUILT_IN_FORGE_API_KEY="sua_api_key"
VITE_FRONTEND_FORGE_API_KEY="sua_frontend_api_key"
VITE_FRONTEND_FORGE_API_URL="https://api.manus.im"

# App Config
VITE_APP_TITLE="ResumAI"
VITE_APP_LOGO="/logo.svg"
```

### 4. Configure o Banco de Dados

```bash
pnpm db:push
```

### 5. Configure o Webhook do Stripe

**Para desenvolvimento local**, use o [Stripe CLI](https://stripe.com/docs/stripe-cli):

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

**Para produção**, configure no [Stripe Dashboard](https://dashboard.stripe.com/webhooks):
- URL: `https://seu-dominio.com/api/stripe/webhook`
- Eventos: `checkout.session.completed`

### 6. Inicie o Servidor

```bash
pnpm dev
```

Acesse: **http://localhost:3000**

---

## 🧪 Testes

```bash
pnpm test              # Executar todos os testes
pnpm test:watch        # Modo watch
pnpm test:coverage     # Cobertura de código
```

**Testes implementados** (50+ testes):
- ✅ Autenticação (signup, login, JWT)
- ✅ Geração de currículos
- ✅ Análise ATS
- ✅ Soft skills
- ✅ Histórico e salvamento
- ✅ Exportação (PDF, DOCX, LaTeX)
- ✅ Doações e limites de uso

---

## 📚 Documentação da API

### Autenticação

#### POST `/api/trpc/auth.signup`
```typescript
// Input
{
  email: string;
  password: string;
  name: string;
}

// Output
{
  success: boolean;
  token: string;
  user: { id, email, name }
}
```

#### POST `/api/trpc/auth.login`
```typescript
// Input
{
  email: string;
  password: string;
}

// Output
{
  success: boolean;
  token: string;
  user: { id, email, name, isDonor }
}
```

### Currículos

#### POST `/api/trpc/resume.generateResume`
```typescript
// Input
{
  prompt?: string;
  linkedinUrl?: string;
  fileUrl?: string;
  model: "reduced" | "mixed" | "complete";
  language: "pt" | "en" | "es";
}

// Output
{
  success: boolean;
  resume: ResumeData;
  message: string;
}
```

### Análise ATS

#### POST `/api/trpc/analysis.atsScore`
```typescript
// Input
{
  resumeData: ResumeData;
}

// Output
{
  score: number; // 0-100
  breakdown: {
    formatting: number;
    keywords: number;
    actionVerbs: number;
    quantification: number;
  };
  suggestions: Array<Suggestion>;
}
```

### Doações

#### POST `/api/trpc/donation.createCheckout`
```typescript
// Input
{
  amount: number; // em centavos
}

// Output
{
  sessionId: string;
  url: string; // URL de checkout
}
```

---

## 🗂️ Estrutura do Projeto

```
resumai/
├── client/                    # Frontend React
│   ├── public/               # Assets estáticos
│   └── src/
│       ├── components/       # Componentes reutilizáveis
│       │   ├── ui/          # shadcn/ui components
│       │   ├── GlobalNavigation.tsx
│       │   ├── DonationModal.tsx
│       │   └── LimitReachedModal.tsx
│       ├── pages/           # Páginas da aplicação
│       │   ├── Home.tsx
│       │   ├── PublicHome.tsx
│       │   ├── Login.tsx
│       │   ├── Signup.tsx
│       │   ├── Generator.tsx
│       │   ├── History.tsx
│       │   ├── Analysis.tsx
│       │   ├── Dashboard.tsx
│       │   ├── Profile.tsx
│       │   └── ...
│       ├── lib/
│       │   └── trpc.ts      # Cliente tRPC
│       └── App.tsx          # Rotas
│
├── server/                   # Backend Node.js
│   ├── auth/
│   │   └── publicAuth.ts    # Autenticação JWT
│   ├── modules/
│   │   ├── donations.ts     # Stripe
│   │   └── usageLimits.ts   # Limites
│   ├── services/
│   │   └── portfolioGenerator.ts
│   ├── routers.ts           # Endpoints tRPC
│   └── *.test.ts            # Testes
│
├── drizzle/                 # Migrações
│   └── schema.ts            # Schema do banco
│
├── .env                     # Variáveis (não commitar!)
├── CHANGELOG.md
└── README.md
```

---

## 🎯 Fluxos Principais

### 1. Cadastro e Login
```
Visitante → Landing Page → Criar Conta
  ↓
Signup → JWT token → Cookie → Dashboard
```

### 2. Geração de Currículo
```
Dashboard → Criar → Upload/LinkedIn
  ↓
Llama AI processa → Gera estrutura
  ↓
Preview → Editor → Auto-save → Exportar
```

### 3. Doação
```
Botão "Apoiar" → Modal → Stripe Checkout
  ↓
Webhook confirma → isDonor = true
  ↓
Badge "Apoiador ⭐" + Ilimitado
```

---

## 🔐 Segurança

- **Senhas**: Hash com bcrypt (10 rounds)
- **JWT**: Tokens assinados, expiram em 7 dias
- **Cookies**: HttpOnly, Secure (prod), SameSite=Lax
- **Stripe**: PCI-compliant, webhook signature validation
- **SQL**: Prepared statements via Drizzle ORM

---

## 🐛 Troubleshooting

### "Cannot connect to database"
Verifique se MySQL está rodando e `DATABASE_URL` está correta.

### "Stripe webhook signature failed"
Use Stripe CLI em dev: `stripe listen --forward-to localhost:3000/api/stripe/webhook`

### "Llama AI request failed"
Verifique `GROQ_API_KEY` e créditos disponíveis.

---

## 🤝 Contribuindo

1. Fork o repositório
2. Crie uma branch: `git checkout -b feature/MinhaFeature`
3. Commit: `git commit -m 'Adiciona MinhaFeature'`
4. Push: `git push origin feature/MinhaFeature`
5. Abra um Pull Request

---

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

---

## 👨‍💻 Autor

**David Sodré**

- GitHub: [@davidsodrelins](https://github.com/davidsodrelins)
- Email: contato@resumai.com.br

---

## 📊 Estatísticas

- **Linhas de código**: ~15.000
- **Componentes React**: 45+
- **Endpoints tRPC**: 30+
- **Testes automatizados**: 50+
- **Idiomas suportados**: 3
- **Templates visuais**: 5
- **Formatos de exportação**: 3

---

## 🗺️ Roadmap

### V10.1 (Próxima)
- [ ] Email de boas-vindas após signup
- [ ] Recuperação de senha
- [ ] Verificação de email
- [ ] Admin dashboard

### V10.2
- [ ] Integração com job boards
- [ ] Aplicação automática em vagas
- [ ] Notificações de vagas

### V11.0
- [ ] Currículo em vídeo
- [ ] Entrevistas simuladas com IA
- [ ] Feedback de recrutadores

---

**Feito com ❤️ e ☕ por David Sodré**
