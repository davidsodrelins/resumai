# 📄 Gerador de Currículos IA

> Transforme seu perfil profissional em currículos otimizados para ATS, disponíveis em três idiomas e três formatos, com inteligência artificial de última geração.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB)](https://react.dev/)
[![tRPC](https://img.shields.io/badge/tRPC-11-2596BE)](https://trpc.io/)
[![Tests](https://img.shields.io/badge/tests-50%2F50-success)](https://vitest.dev/)

---

## 🎯 Visão Geral

O **Gerador de Currículos IA** é uma plataforma completa que utiliza inteligência artificial para criar currículos profissionais otimizados para sistemas ATS (Applicant Tracking Systems). A ferramenta oferece análise de compatibilidade, geração de cartas de apresentação, criação de portfolios web e muito mais.

### Principais Diferenciais

A plataforma se destaca por combinar processamento de linguagem natural avançado com uma interface intuitiva, permitindo que profissionais de qualquer área criem documentos de candidatura de alta qualidade em minutos. O sistema analisa automaticamente a descrição da vaga, identifica palavras-chave relevantes e sugere melhorias específicas para aumentar as chances de aprovação em triagens automatizadas.

---

## ✨ Funcionalidades Principais

### 1. Geração Inteligente de Currículos

O sistema processa currículos existentes (PDF ou DOCX) ou informações fornecidas manualmente, utilizando o modelo de linguagem Llama para estruturar e otimizar o conteúdo. O processamento inclui extração automática de experiências profissionais, formação acadêmica, habilidades técnicas e soft skills, organizando tudo em um formato padronizado e profissional.

**Recursos incluídos:**
- Upload de currículos existentes com extração automática de texto
- Processamento via IA para estruturação de dados
- Suporte para múltiplos formatos de entrada (PDF, DOCX)
- Validação e normalização de informações
- Geração de resumo profissional personalizado

### 2. Templates Profissionais

A plataforma oferece cinco templates visuais cuidadosamente projetados para diferentes perfis profissionais e indústrias. Cada template foi desenvolvido considerando as melhores práticas de design de currículos e as expectativas de recrutadores em diferentes setores.

| Template | Descrição | Ideal Para |
|----------|-----------|------------|
| **Clássico** | Design tradicional e formal com tipografia serif | Setores conservadores (direito, finanças, governo) |
| **Moderno** | Gradientes vibrantes e layout dinâmico | Startups, tecnologia, marketing digital |
| **Minimalista** | Layout limpo com foco no conteúdo | Design, arquitetura, consultoria |
| **Executivo** | Design corporativo sofisticado | Cargos de liderança, C-level |
| **Criativo** | Cores ousadas e layouts inovadores | Publicidade, artes, moda |

Todos os templates são totalmente responsivos e otimizados para impressão, garantindo que o currículo tenha uma apresentação impecável tanto em tela quanto em papel.

### 3. Suporte Multilíngue

O sistema oferece geração de currículos em três idiomas com tradução automática inteligente que preserva o contexto profissional e adapta terminologias específicas de cada mercado.

**Idiomas suportados:**
- **Português (Brasil)**: Adaptado para o mercado brasileiro com terminologia local
- **Inglês (Internacional)**: Formato adequado para mercados globais
- **Espanhol (América Latina)**: Otimizado para países de língua espanhola

A tradução não é apenas literal, mas considera nuances culturais e expectativas específicas de cada mercado, ajustando títulos de cargos, descrições de responsabilidades e formatação de datas conforme as convenções locais.

### 4. Análise ATS Avançada

O módulo de análise ATS é uma das funcionalidades mais poderosas da plataforma, oferecendo insights detalhados sobre a compatibilidade do currículo com descrições de vagas específicas.

**Componentes da análise:**

O sistema atribui uma pontuação de 0 a 100 baseada em múltiplos fatores, incluindo presença de palavras-chave, densidade de termos técnicos, estrutura do documento e completude das informações. A análise identifica automaticamente hard skills (tecnologias, ferramentas, certificações) e soft skills (liderança, comunicação, trabalho em equipe) mencionadas na descrição da vaga.

**Sugestões automáticas:**

Para cada gap identificado, o sistema gera sugestões específicas de melhoria que podem ser aplicadas com um único clique. As sugestões incluem adição de palavras-chave ausentes, reformulação de descrições de experiências, destaque de habilidades relevantes e ajustes estruturais para melhor legibilidade por sistemas ATS.

**Comparação de versões:**

A funcionalidade de comparação lado a lado permite visualizar diferenças entre versões do currículo, destacando em verde as adições e em vermelho as remoções, facilitando a tomada de decisão sobre quais mudanças manter.

### 5. Gerador de Cartas de Apresentação

O sistema gera cartas de apresentação personalizadas que complementam o currículo, destacando experiências relevantes e demonstrando interesse genuíno na posição.

**Processo de geração:**

A IA analisa o currículo e a descrição da vaga para criar uma narrativa coesa que conecta a experiência do candidato com os requisitos da posição. A carta é estruturada em três partes principais: introdução com gancho de interesse, desenvolvimento com evidências de qualificação e conclusão com call-to-action.

**Templates disponíveis:**

Três estilos visuais estão disponíveis (Clássico, Moderno, Executivo), cada um com formatação apropriada para diferentes contextos profissionais. As cartas podem ser exportadas em DOCX para edição adicional ou em PDF para envio direto.

### 6. Portfolio Web Automático

Uma funcionalidade inovadora que transforma o currículo em um site profissional responsivo, ideal para profissionais de tecnologia, design e áreas criativas.

**Características técnicas:**

O portfolio gerado inclui seções interativas para experiências profissionais (com timeline visual), projetos (com cards e links), habilidades (com visualização gráfica) e informações de contato. A biografia é enriquecida automaticamente pela IA, expandindo o resumo profissional em um texto mais envolvente e detalhado.

**Otimização e hospedagem:**

Cada portfolio é otimizado para SEO com meta tags Open Graph, Twitter Cards e structured data para mecanismos de busca. O site é hospedado automaticamente no S3 com URL pública, pronto para ser compartilhado em candidaturas ou redes sociais profissionais.

**Templates de portfolio:**

Três designs estão disponíveis (Moderno, Minimalista, Profissional), cada um com animações suaves, modo claro/escuro configurável e responsividade completa para dispositivos móveis.

### 7. Sistema de Histórico e Versionamento

O sistema mantém um histórico completo de todas as versões de currículos gerados, permitindo recuperação e comparação a qualquer momento.

**Funcionalidades de versionamento:**

Cada versão é salva automaticamente a cada 30 segundos durante a edição, com timestamp e metadados (idioma, template, pontuação ATS). O sistema também mantém um backup no localStorage do navegador para recuperação em caso de fechamento acidental da página.

**Gerenciamento de versões:**

A interface de histórico apresenta cards visuais com preview em miniatura de cada versão, permitindo filtrar por data, idioma ou template. Ações disponíveis incluem visualizar, editar, exportar, comparar e deletar versões.

### 8. Exportação Multi-formato

O sistema oferece exportação em três formatos profissionais, cada um otimizado para diferentes casos de uso.

| Formato | Características | Melhor Para |
|---------|----------------|-------------|
| **PDF** | Formatação preservada, não editável | Envio final para candidaturas |
| **DOCX** | Editável, compatível com Word | Ajustes manuais e personalizações |
| **LaTeX** | Código fonte para edição avançada | Acadêmicos e usuários técnicos |

A exportação para LaTeX é particularmente útil para profissionais acadêmicos que desejam controle total sobre a formatação e podem utilizar o código gerado em editores como Overleaf.

---

## 🏗️ Arquitetura Técnica

### Stack Tecnológico

A aplicação foi construída utilizando tecnologias modernas que garantem performance, escalabilidade e experiência de desenvolvimento otimizada.

**Frontend:**
- React 19 com TypeScript para type safety completo
- Tailwind CSS 4 para estilização responsiva e consistente
- shadcn/ui para componentes de interface acessíveis
- Wouter para roteamento client-side leve
- TanStack Query para gerenciamento de estado assíncrono

**Backend:**
- Express 4 como servidor HTTP
- tRPC 11 para APIs type-safe sem necessidade de geração de código
- Drizzle ORM para acesso ao banco de dados com queries type-safe
- Superjson para serialização de tipos complexos (Date, Map, Set)

**Infraestrutura:**
- MySQL/TiDB como banco de dados relacional
- S3 para armazenamento de arquivos e portfolios
- Manus OAuth para autenticação segura
- Integração com Llama (LLM) para processamento de linguagem natural

### Estrutura de Diretórios

O projeto segue uma estrutura organizada que separa claramente responsabilidades e facilita a manutenção.

```
curriculum_generator/
├── client/                 # Frontend React
│   ├── public/            # Assets estáticos
│   └── src/
│       ├── components/    # Componentes reutilizáveis
│       ├── pages/         # Páginas da aplicação
│       ├── lib/           # Utilitários e configurações
│       └── hooks/         # Custom React hooks
├── server/                # Backend Express + tRPC
│   ├── routers.ts         # Definição de endpoints tRPC
│   ├── db.ts              # Query helpers
│   ├── services/          # Lógica de negócio
│   └── _core/             # Infraestrutura (auth, LLM, storage)
├── drizzle/               # Schema e migrações do banco
├── shared/                # Tipos e constantes compartilhadas
└── storage/               # Helpers para S3
```

### Fluxo de Dados

O sistema utiliza tRPC para comunicação type-safe entre frontend e backend, eliminando a necessidade de validação manual de tipos e reduzindo significativamente a possibilidade de erros em runtime.

**Exemplo de fluxo:**

1. Usuário faz upload de PDF no frontend
2. Arquivo é convertido para base64 e enviado via `trpc.resume.uploadFile.mutate()`
3. Backend extrai texto do PDF usando pdf2json
4. Texto é enviado para o LLM Llama para estruturação
5. Dados estruturados são retornados ao frontend com tipos garantidos
6. Interface atualiza automaticamente com os dados processados

### Segurança e Autenticação

A autenticação é gerenciada pelo Manus OAuth, que fornece login seguro sem necessidade de gerenciar senhas. Cada requisição ao backend inclui um cookie de sessão que é validado automaticamente pelo middleware de contexto do tRPC.

**Proteção de rotas:**

Endpoints sensíveis utilizam `protectedProcedure` que garante que apenas usuários autenticados possam acessar. O sistema redireciona automaticamente para a página de login quando detecta requisições não autorizadas.

---

## 🚀 Instalação e Desenvolvimento

### Pré-requisitos

Antes de iniciar, certifique-se de ter as seguintes ferramentas instaladas em seu ambiente de desenvolvimento:

- Node.js 22.x ou superior
- pnpm 9.x (gerenciador de pacotes recomendado)
- MySQL 8.x ou TiDB (banco de dados)
- Conta no Manus para OAuth e serviços de IA

### Configuração do Ambiente

Clone o repositório e instale as dependências utilizando pnpm para garantir consistência com o lockfile do projeto.

```bash
git clone https://github.com/davidsodrelins/resumai.git
cd resumai
pnpm install
```

### Variáveis de Ambiente

O sistema utiliza variáveis de ambiente pré-configuradas pelo Manus que são injetadas automaticamente em produção. Para desenvolvimento local, as seguintes variáveis são necessárias:

```env
DATABASE_URL=mysql://user:password@localhost:3306/curriculum_db
JWT_SECRET=your-secret-key
VITE_APP_ID=your-manus-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
BUILT_IN_FORGE_API_URL=https://forge.manus.im
BUILT_IN_FORGE_API_KEY=your-api-key
```

**Nota importante:** Nunca commite arquivos `.env` no repositório. Utilize `.env.example` como template e mantenha credenciais sensíveis fora do controle de versão.

### Migrações do Banco de Dados

Execute as migrações para criar as tabelas necessárias no banco de dados.

```bash
pnpm db:push
```

Este comando utiliza o Drizzle Kit para sincronizar o schema definido em `drizzle/schema.ts` com o banco de dados, criando ou atualizando tabelas conforme necessário.

### Executando em Desenvolvimento

Inicie o servidor de desenvolvimento que inclui hot-reload tanto para frontend quanto backend.

```bash
pnpm dev
```

O servidor estará disponível em `http://localhost:3000`. Mudanças no código são refletidas automaticamente sem necessidade de reiniciar o servidor.

### Build para Produção

Gere a versão otimizada para produção com os seguintes comandos:

```bash
pnpm build        # Compila TypeScript e gera bundle otimizado
pnpm start        # Inicia servidor de produção
```

O build de produção inclui minificação de código, tree-shaking para remover código não utilizado e otimizações de performance.

### Testes

Execute a suite de testes automatizados para garantir que todas as funcionalidades estão operando corretamente.

```bash
pnpm test         # Executa todos os testes
pnpm test:watch   # Modo watch para desenvolvimento
```

O projeto utiliza Vitest para testes unitários e de integração, com cobertura de código automaticamente calculada.

---

## 📚 Uso da API

### Endpoints Principais

A API é organizada em namespaces lógicos que agrupam funcionalidades relacionadas.

#### Resume (Geração de Currículos)

```typescript
// Upload e extração de texto de arquivo
const result = await trpc.resume.uploadFile.mutate({
  fileUrl: 'data:application/pdf;base64,...',
  mimeType: 'application/pdf'
});

// Processar inputs e gerar estrutura de dados
const resumeData = await trpc.resume.processInputs.mutate({
  userPrompt: 'Sou desenvolvedor full-stack com 5 anos de experiência...',
  uploadedFilesText: ['texto extraído do PDF'],
  language: 'pt',
  jobDescription: 'Vaga para desenvolvedor sênior...'
});

// Gerar currículo final
const resume = await trpc.resume.generateResume.mutate({
  resumeData,
  template: 'modern',
  language: 'pt'
});

// Exportar para PDF
const pdfBlob = await trpc.resume.exportPDF.mutate({
  resumeData,
  template: 'modern',
  language: 'pt'
});
```

#### Analysis (Análise ATS)

```typescript
// Analisar compatibilidade com vaga
const analysis = await trpc.analysis.analyzeResume.mutate({
  resumeData,
  jobDescription: 'Descrição completa da vaga...'
});

// Aplicar sugestões automaticamente
const improvedResume = await trpc.analysis.applySuggestions.mutate({
  resumeData,
  suggestions: analysis.suggestions
});

// Comparar duas versões
const comparison = await trpc.analysis.compareVersions.mutate({
  version1: resumeDataV1,
  version2: resumeDataV2
});
```

#### Portfolio (Geração de Sites)

```typescript
// Gerar e hospedar portfolio
const portfolio = await trpc.portfolio.generate.mutate({
  resumeData,
  template: 'modern',
  theme: 'dark',
  primaryColor: '#3b82f6'
});

// Preview sem salvar
const preview = await trpc.portfolio.preview.query({
  resumeData,
  template: 'minimalist',
  theme: 'light'
});
```

#### History (Versionamento)

```typescript
// Salvar versão
await trpc.history.saveResume.mutate({
  resumeData,
  metadata: { template: 'modern', language: 'pt' }
});

// Recuperar histórico
const history = await trpc.history.getHistory.query();

// Recuperar versão específica
const version = await trpc.history.getVersion.query({
  versionId: 'abc123'
});

// Deletar versão
await trpc.history.deleteVersion.mutate({
  versionId: 'abc123'
});
```

### Tratamento de Erros

O tRPC fornece tratamento de erros tipado que facilita a implementação de lógica de recuperação no frontend.

```typescript
try {
  const result = await trpc.resume.generateResume.mutate(input);
} catch (error) {
  if (error instanceof TRPCClientError) {
    if (error.message === 'UNAUTHORIZED') {
      // Redirecionar para login
      window.location.href = getLoginUrl();
    } else {
      // Exibir mensagem de erro ao usuário
      toast.error(error.message);
    }
  }
}
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas e ajudam a melhorar a plataforma para toda a comunidade. Antes de contribuir, por favor leia as diretrizes abaixo.

### Processo de Contribuição

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request descrevendo suas mudanças

### Diretrizes de Código

O projeto segue padrões rigorosos de qualidade de código para manter a consistência e facilitar a manutenção.

**TypeScript:**
- Utilize tipos explícitos sempre que possível
- Evite `any`, prefira `unknown` quando o tipo for realmente desconhecido
- Documente interfaces e tipos complexos com comentários JSDoc

**React:**
- Componentes funcionais com hooks
- Extraia lógica complexa em custom hooks
- Utilize `useMemo` e `useCallback` para otimizar re-renders

**Estilo:**
- Siga as configurações do ESLint e Prettier
- Execute `pnpm lint` antes de commitar
- Mantenha componentes pequenos e focados (< 200 linhas)

### Reportando Bugs

Ao reportar bugs, inclua o máximo de informações possível para facilitar a reprodução e correção:

- Descrição clara do problema
- Passos para reproduzir
- Comportamento esperado vs. comportamento atual
- Screenshots ou vídeos quando aplicável
- Informações do ambiente (navegador, sistema operacional)

---

## 📝 Licença

Este projeto está licenciado sob a Licença MIT, o que significa que você é livre para usar, copiar, modificar, mesclar, publicar, distribuir, sublicenciar e/ou vender cópias do software, sujeito às condições da licença.

Veja o arquivo [LICENSE](LICENSE) para mais detalhes sobre os termos e condições.

---

## 👥 Autores

**David Sodré Lins**
- GitHub: [@davidsodrelins](https://github.com/davidsodrelins)
- Email: davidsodrelins@outlook.com

**Desenvolvido com assistência de Manus AI**
- Website: [manus.im](https://manus.im)

---

## 🙏 Agradecimentos

Agradecimentos especiais às seguintes tecnologias e projetos que tornaram esta plataforma possível:

- **React Team** pela biblioteca revolucionária que mudou o desenvolvimento web
- **Vercel** pelo tRPC que simplifica drasticamente a comunicação cliente-servidor
- **Tailwind Labs** pelo framework CSS que acelera o desenvolvimento de interfaces
- **Drizzle Team** pelo ORM type-safe que torna o trabalho com bancos de dados mais seguro
- **shadcn** pelos componentes de UI acessíveis e customizáveis
- **Manus** pela infraestrutura de IA e hospedagem que viabiliza o projeto

---

## 📞 Suporte

Para questões, sugestões ou suporte, utilize os seguintes canais:

- **Issues do GitHub**: Para bugs e solicitações de features
- **Discussions**: Para perguntas gerais e discussões sobre o projeto
- **Email**: davidsodrelins@outlook.com

---

## 🗺️ Roadmap

### Próximas Funcionalidades

**Fase 10 - Job Board e Automação (Q1 2025)**
- Scraper automático de vagas do LinkedIn, Indeed e Glassdoor
- Algoritmo de matching inteligente entre currículo e vagas
- Sistema de notificações por email com vagas recomendadas
- Dashboard de métricas de candidaturas

**Fase 11 - Integrações (Q2 2025)**
- Integração com LinkedIn para importação automática de perfil
- Sincronização com Google Drive para backup de currículos
- API pública para integrações de terceiros
- Webhooks para notificações em tempo real

**Fase 12 - Recursos Avançados (Q3 2025)**
- Editor de currículo WYSIWYG com drag-and-drop
- Geração de vídeo-currículo automatizado
- Análise de mercado salarial baseada em IA
- Simulador de entrevistas com feedback em tempo real

---

## 📊 Estatísticas do Projeto

- **Versão atual**: 9.1.1
- **Linhas de código**: ~15.000
- **Componentes React**: 45+
- **Endpoints tRPC**: 30+
- **Templates visuais**: 8 (5 currículos + 3 portfolios)
- **Idiomas suportados**: 3
- **Formatos de exportação**: 3
- **Cobertura de testes**: 85%+
- **Testes automatizados**: 50/50 passando (100%)

---

**Desenvolvido com ❤️ por David Sodré Lins e Manus AI**

**Última atualização**: Dezembro 2024
