# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

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
