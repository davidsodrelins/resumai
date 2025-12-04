# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [9.7.3] - 2024-12-03

### Corrigido
- **Bug Crítico**: Análise ATS não executava após seleção de currículo (Erro 414 URI Too Long)
  - Causa: `useQuery` enviava `resumeData` completo como query parameter na URL (GET)
  - Currículos grandes (>8KB) excediam limite de tamanho da URL
  - Navegador retornava erro 414 (Request-URI Too Large)
  - Análise iniciava ("Analisando...") mas falhava silenciosamente
  - Solução: Migrado `atsScore` de `query` para `mutation` no backend
  - Frontend atualizado para usar `useMutation` (POST envia dados no body)
  - Trigger automático via `useEffect` quando currículo é carregado
  - Resultado: Análise funciona perfeitamente com currículos de qualquer tamanho

### Modificado
- **Backend**: `server/routers.ts`
  - `analysis.atsScore` mudado de `.query()` para `.mutation()`
  - Mantida mesma lógica de análise (analyzeATSCompatibility)
  - Input schema permanece o mesmo: `{ resumeData: z.any() }`

- **Frontend**: `client/src/pages/Analysis.tsx`
  - Substituído `useQuery` por `useMutation` para atsScore
  - Criado handler `handleAnalyzeATS()` para executar análise
  - Adicionado `useEffect` para trigger automático quando currículo é carregado
  - Estado local `atsScore` para armazenar resultado
  - Substituído `atsLoading` por `atsScoreMutation.isPending`
  - Corrigidos tipos TypeScript: `suggestion: any, index: number`

- **Frontend**: `client/src/components/ATSScoreBadge.tsx`
  - Substituído `useQuery` por `useMutation`
  - Execução automática via `useEffect` ao montar componente
  - Loading state gerenciado com `atsScoreMutation.isPending`

### Técnico
- Problema: HTTP GET tem limite de ~8KB para URL (varia por navegador/servidor)
- Solução: HTTP POST envia dados no body, sem limite prático de tamanho
- Benefício: Suporta currículos com 100+ experiências, projetos e habilidades
- TypeScript: 0 erros de compilação
- Teste manual: Pontuação 59/100, breakdown detalhado, 6 sugestões exibidas

---

## [9.7.2] - 2024-12-03

### Corrigido
- **Bug Crítico**: Currículos não estavam sendo salvos automaticamente no histórico
  - Causa: Metadados (`selectedModel`, `selectedLanguage`, `selectedTemplate`) não eram salvos/restaurados do localStorage
  - Quando rascunho era carregado, apenas `generatedResume` era restaurado, mas metadados ficavam com valores padrão
  - Auto-save tentava salvar com metadados incorretos, causando falha silenciosa
  - Solução: Adicionado `useLocalStorage` para `draftMetadata` separado
  - Metadados agora são salvos quando currículo é gerado ou editado
  - Metadados são restaurados automaticamente ao carregar rascunho
  - Resultado: Auto-save funciona corretamente após 30 segundos de edição

### Técnico
- Adicionado `useLocalStorage` para `resume-draft-metadata`
- Salvamento de metadados em `handleGenerateResume` (após geração)
- Salvamento de metadados em `onUpdate` do `ResumeEditor` (durante edição)
- Restauração de metadados no `useEffect` de carregamento do rascunho
- Estrutura de metadados: `{ model, language, template }`
- TypeScript: 0 erros de compilação

---

## [9.7.1] - 2024-12-03

### Adicionado
- **Botão de Exportação LaTeX no Generator**
  - Criado handler `handleExportLatex` que gera arquivo .tex via tRPC
  - Botão "Baixar LaTeX" adicionado ao lado de PDF e DOCX
  - Download automático via Blob com nome do arquivo baseado no nome completo
  - Loading state durante geração com spinner
  - Toast de feedback (sucesso/erro)
  - Integrado com procedure `exportLatex` existente no backend

### Corrigido
- **Bug Crítico**: Botão de exportação LaTeX não existia no frontend
  - Causa: Procedure `exportLatex` existia no backend mas não tinha botão na UI
  - Solução: Adicionada mutation `exportLatexMutation` e botão completo
  - Resultado: Usuários agora podem baixar currículos em formato LaTeX (.tex)

### Técnico
- Adicionada mutation `trpc.resume.exportLatex.useMutation()` no Generator
- Criado handler `handleExportLatex` com lógica de download via Blob API
- Nome do arquivo: `{Nome_Completo}_resume.tex` (espaços substituídos por _)
- Botão com estados: normal, loading (spinner), disabled
- Integração com idioma selecionado (`selectedLanguage`)
- TypeScript: 0 erros de compilação

---

## [9.7.0] - 2024-12-03

### Adicionado
- **Navegação Global Persistente em Todas as Páginas**
  - Criado componente `GlobalNavigation.tsx` reutilizável
  - Menu sticky no topo com backdrop blur e sombra sutil
  - Links principais: Início, Criar, Recursos, Dashboard
  - Destaque visual da página atual (botão azul)
  - Informações do usuário: "Olá, {nome}" + botão Sair
  - Botão de logout integrado com confirmação via toast
  - Responsividade mobile: menu horizontal scrollável abaixo do header
  - Logo clicavel que retorna para home
  - Integrado em 9 páginas: Generator, History, Analysis, Dashboard, Resources, Compare, CoverLetter, Portfolio, SoftSkills

### Modificado
- **Removido Headers Individuais de Todas as Páginas**
  - Generator: removido header com botão "Voltar"
  - History: removido header com logo e botões de ação
  - Analysis: convertido header para page header simples
  - Dashboard: removido header com botão "Voltar"
  - Resources: convertido header para page header simples
  - Compare: removido botão "Voltar" do header interno
  - CoverLetter: removido header completo com logo e botões
  - Portfolio: adicionado wrapper com background gradient
  - SoftSkills: removido header com logo e informações do usuário

### Melhorado
- **Consistência Visual e UX**
  - Todas as páginas agora compartilham o mesmo header
  - Navegação instantânea entre seções principais
  - Usuário sempre sabe onde está (highlight da página atual)
  - Logout acessível de qualquer página
  - Experiência mobile otimizada com menu adaptativo
  - Redução de código duplicado (headers individuais)

### Técnico
- Criado `client/src/components/GlobalNavigation.tsx` (120 linhas)
- Modificado 9 arquivos de páginas para integrar GlobalNavigation
- Implementado lógica de detecção de página ativa com `useLocation()`
- Adicionado mutação tRPC de logout com feedback via toast
- Responsividade: `md:flex` para desktop, scroll horizontal para mobile
- Classes Tailwind: `sticky top-0 z-50` para header fixo
- Atualizado `todo.md` com 9 tarefas concluídas

---

## [9.6.3] - 2024-12-02

### Corrigido
- **Bug Crítico**: Itens do menu "Recursos" e "Dashboard" não apareciam no header
  - Causa: Links de navegação não estavam implementados no header do Home.tsx
  - Adicionado botões "Recursos" e "Dashboard" com variant="ghost" no header
  - Criado arquivo Dashboard.tsx (estava faltando após rollback do Git)
  - Adicionado imports e rotas /resources e /dashboard no App.tsx
  - Navegação completa restaurada e testada

### Adicionado
- **Página Dashboard Completa**
  - Estatísticas gerais: Total de currículos, currículos este mês
  - Template favorito e idioma principal (mais utilizados)
  - Gráficos de distribuição por template, idioma e modelo
  - Atividade recente: últimos 5 currículos criados
  - Cards de ações rápidas: Criar, Histórico, Análise
  - Design responsivo com gradientes e ícones
  - Integração completa com tRPC para dados em tempo real

### Técnico
- Criado `client/src/pages/Dashboard.tsx` (450+ linhas)
- Modificado `client/src/pages/Home.tsx`: adicionado links de navegação no header
- Modificado `client/src/App.tsx`: imports e rotas para Resources e Dashboard
- Atualizado `todo.md` com 6 bugs corrigidos

---

## [9.6.2] - 2024-12-02

### Corrigido
- **Bug Crítico**: Página Resources.tsx desapareceu após rollback do Git
  - Arquivo foi perdido durante resolução de conflitos de merge
  - Recriado completamente com todas as 10 funcionalidades catalogadas
  - Links de navegação "Recursos" e "Dashboard" restaurados no header
  - Servidor reiniciado para reconhecer novo arquivo

### Técnico
- Recriado `client/src/pages/Resources.tsx` (280 linhas)
- Mantida estrutura original com filtros por categoria
- 10 recursos documentados: Gerador, ATS, Soft Skills, Multilíngue, Exportação, Histórico, Comparação, Cartas, Portfolio, Sugestões
- Atualizado `todo.md` com bug corrigido

---

## [9.6.1] - 2024-12-02

### Corrigido
- **Bug Crítico**: Botões de exportação (PDF/DOCX) redirecionando para /generator em vez de fazer download
  - Adicionado `type="button"` nos botões para evitar submit do formulário
  - Handlers de exportação agora funcionam corretamente
  - Testado em todas as páginas (Generator, History, Compare)

- **Bug Crítico**: Página de Análise não carregava currículos
  - Substituído carregamento do localStorage por query do histórico
  - Carregamento automático do currículo mais recente ao abrir a página
  - Dropdown de seleção de currículos no header e no empty state
  - Mensagem de toast informando carregamento automático

### Melhorado
- Interface da página de Análise com dropdown de seleção
- Empty state com link para criar primeiro currículo
- Loading states durante carregamento de currículos

### Técnico
- Modificado `client/src/pages/Generator.tsx`: type="button" nos botões de exportação
- Modificado `client/src/pages/Analysis.tsx`: carregamento automático do histórico
- Adicionado imports: useEffect, Select components
- Atualizado `todo.md` com 7 bugs corrigidos

---

## [9.6.0] - 2024-12-02

### Adicionado
- **Modal Customizado de Confirmação de Exclusão**
  - Componente `DeleteConfirmationModal` usando shadcn/ui Dialog
  - Preview detalhado do currículo antes de excluir (título, template, idioma, modelo, data)
  - Checkbox "Não mostrar novamente" com persistência em localStorage
  - Ícones informativos e badges de status (Rascunho)
  - Animações de transição suaves
  - Loading state durante exclusão
  - Integrado no Dashboard e página de Histórico

### Melhorado
- **Responsividade Mobile dos Portfolios**
  - Template Modern: word-wrap, overflow-wrap e fontes menores em mobile
  - Template Minimalist: word-wrap, overflow-wrap e fontes menores em mobile
  - Ajustes de padding e margens para telas pequenas
  - Correção de quebra de layout em dispositivos móveis

- **Sistema de Exclusão**
  - Substituído `window.confirm()` por modal customizado no Dashboard
  - Substituído `window.confirm()` por modal customizado no Histórico
  - Dropdown de ações com ícone MoreVertical
  - Item de exclusão estilizado com cores vermelhas e hover vermelho
  - Toast notifications para feedback de sucesso/erro

### Técnico
- Criado `client/src/components/DeleteConfirmationModal.tsx` (170 linhas)
- Modificado `client/src/pages/History.tsx`: integração com modal
- Modificado `client/src/pages/Dashboard.tsx`: integração com modal
- Modificado `server/services/portfolioGenerator.ts`: media queries mobile
- Atualizado `todo.md` com 18 tarefas concluídas da V9.6.0

---

## [9.1.1] - 2024-12-02

### Corrigido
- Erro "Cannot read properties of undefined (reading 'join')" no mobile
- Validação de arrays antes de usar `.join()` em Generator.tsx, ResumePreview.tsx e Analysis.tsx
- Proteção contra dados undefined em skill.items, project.technologies e keyword.locations

---

## [9.1.0] - 2024-12-02

### Corrigido
- **Bug Crítico**: Erro "Erro ao processar ResumeDavid.pdf" ao fazer upload de arquivos
- Loading infinito ao clicar em "Processar" após upload de PDF
- Frontend agora converte arquivos para base64 antes de enviar ao backend
- Backend detecta e processa data URLs corretamente

### Adicionado
- Suporte para data URLs (base64) no endpoint `uploadFile`
- Testes automatizados para validação de processamento de arquivos
- Validação de formato base64 data URL

### Técnico
- Modificado `client/src/pages/Generator.tsx`: conversão de arquivo para base64
- Modificado `server/routers.ts`: detecção e parsing de data URLs
- Adicionado `server/fileProcessor.test.ts`: 2 testes automatizados

---

## [9.0.0] - 2024-12-01

### Adicionado
- **Gerador de Portfolio Web Automático**
  - Transforma currículos em sites profissionais responsivos
  - 3 templates de portfolio (Moderno, Minimalista, Profissional)
  - Biografia profissional gerada por IA (Llama)
  - Hospedagem automática no S3 (Manus Space)
  - Preview em tempo real antes de publicar
  - Configuração de tema (claro/escuro) e cor primária
  - Otimização SEO completa (Open Graph, Twitter Cards, Structured Data)
  - Animações suaves com Intersection Observer
  - Navegação responsiva com menu mobile
  - Timeline interativo de experiências
  - Grid de habilidades com hover effects
  - Seção de contato com links funcionais
  - Compartilhamento via URL ou Web Share API

### Técnico
- Criado `server/services/portfolioGenerator.ts` (1.700+ linhas)
- Criado `client/src/pages/Portfolio.tsx` (interface de gerenciamento)
- Endpoints tRPC: portfolio.generate, portfolio.preview
- Rota /portfolio adicionada no App.tsx
- Card destacado na home com badge "NOVO"

---

[Versões anteriores omitidas para brevidade]
