# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [9.1.1] - 2024-12-02

### Corrigido
- Erro "Cannot read properties of undefined (reading 'join')" no mobile
- Validação de arrays antes de usar `.join()` em Generator.tsx, ResumePreview.tsx e Analysis.tsx
- Proteção contra dados undefined em skill.items, project.technologies e keyword.locations

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
  - Responsivo para mobile, tablet e desktop

### Endpoints
- `portfolio.generate`: Gera e hospeda portfolio no S3
- `portfolio.preview`: Preview em tempo real sem salvar

### Interface
- Nova página `/portfolio` para gerenciamento de portfolios
- Card destacado na home com badge "NOVO"
- Seleção de currículo do histórico
- Compartilhamento via copiar URL ou Web Share API

---

## [8.5.0] - 2024-11-30

### Adicionado
- **Exportação para LaTeX**
  - Geração de código LaTeX profissional
  - Suporte para templates acadêmicos e corporativos
  - Download direto do arquivo .tex
  - Compatível com Overleaf e editores LaTeX locais

### Melhorado
- Interface de exportação com abas para diferentes formatos
- Feedback visual durante geração de LaTeX

---

## [8.0.0] - 2024-11-29

### Adicionado
- **Sistema de Análise ATS Avançado**
  - Pontuação de compatibilidade (0-100)
  - Análise de palavras-chave da descrição da vaga
  - Detecção de soft skills e hard skills
  - Sugestões de melhoria com aplicação automática
  - Comparação de versões lado a lado
  - Destaque visual de diferenças (verde/vermelho)

### Endpoints
- `analysis.analyzeResume`: Análise completa de compatibilidade ATS
- `analysis.applySuggestions`: Aplica sugestões automaticamente
- `analysis.compareVersions`: Compara duas versões de currículo

### Interface
- Nova página `/analysis` para análise ATS
- Visualização de score com gráfico circular
- Lista de palavras-chave encontradas/ausentes
- Botão "Aplicar Todas as Sugestões"
- Página `/compare` para comparação de versões

---

## [7.0.0] - 2024-11-28

### Adicionado
- **Gerador de Cartas de Apresentação**
  - Geração automática baseada no currículo e vaga
  - 3 templates visuais (Clássico, Moderno, Executivo)
  - Exportação em DOCX e PDF
  - Interface de edição interativa
  - Integração com histórico de currículos

### Endpoints
- `coverLetter.generate`: Gera carta de apresentação
- `coverLetter.exportDOCX`: Exporta para DOCX
- `coverLetter.exportPDF`: Exporta para PDF

### Interface
- Nova página `/cover-letter` para geração de cartas
- Editor de texto com formatação
- Preview em tempo real
- Seleção de template visual

---

## [6.0.0] - 2024-11-27

### Adicionado
- **Sistema de Histórico e Versionamento**
  - Salvamento automático a cada 30 segundos
  - Histórico completo de currículos gerados
  - Versionamento com timestamps
  - Recuperação de rascunhos do localStorage
  - Indicador visual "Salvando..." / "Salvo"

### Endpoints
- `history.saveResume`: Salva versão do currículo
- `history.getHistory`: Recupera histórico completo
- `history.getVersion`: Recupera versão específica
- `history.deleteVersion`: Remove versão do histórico

### Interface
- Nova página `/history` para gerenciamento de versões
- Cards de preview com miniatura
- Filtros por data e idioma
- Ações: visualizar, editar, exportar, deletar
- Debounce de 5 segundos para auto-save

---

## [5.0.0] - 2024-11-26

### Adicionado
- **Editor Interativo de Seções**
  - Adicionar/remover seções customizadas
  - Reordenação por drag-and-drop
  - Edição inline de conteúdo
  - Seções pré-definidas: Projetos, Certificações, Idiomas, Voluntariado
  - Validação de campos obrigatórios

### Melhorado
- Interface de edição mais intuitiva
- Feedback visual durante edição
- Validação em tempo real

---

## [4.0.0] - 2024-11-25

### Adicionado
- **Suporte Multilíngue**
  - Geração de currículos em 3 idiomas: Português, Inglês, Espanhol
  - Tradução automática de conteúdo via IA
  - Seletor de idioma na interface
  - Templates adaptados para cada idioma

### Melhorado
- Processamento de entrada com detecção automática de idioma
- Preview atualizado em tempo real ao trocar idioma

---

## [3.0.0] - 2024-11-24

### Adicionado
- **5 Templates Profissionais**
  - Clássico: Design tradicional e formal
  - Moderno: Gradientes e cores vibrantes
  - Minimalista: Layout limpo e focado
  - Executivo: Design corporativo sofisticado
  - Criativo: Cores e layouts ousados

### Melhorado
- Sistema de preview em tempo real
- Seletor visual de templates
- Estilos responsivos para todos os templates

---

## [2.0.0] - 2024-11-23

### Adicionado
- **Exportação Multi-formato**
  - Exportação para PDF com formatação profissional
  - Exportação para DOCX editável
  - Preservação de estilos e formatação
  - Download direto no navegador

### Endpoints
- `resume.exportPDF`: Gera PDF do currículo
- `resume.exportDOCX`: Gera DOCX do currículo

### Técnico
- Integração com bibliotecas de geração de documentos
- Renderização server-side para melhor qualidade

---

## [1.0.0] - 2024-11-22

### Adicionado
- **Geração Inicial de Currículos**
  - Upload de currículos existentes (PDF, DOCX)
  - Extração automática de texto
  - Processamento via IA (Llama) para estruturação
  - Geração de currículo otimizado para ATS
  - Interface de 3 etapas: Upload → Processar → Revisar

### Endpoints
- `resume.uploadFile`: Upload e extração de texto
- `resume.processInputs`: Processamento via IA
- `resume.generateResume`: Geração final do currículo

### Interface
- Página inicial com hero section
- Página `/generator` para criação de currículos
- Sistema de autenticação via Manus OAuth
- Dashboard com navegação lateral

### Técnico
- Stack: React 19 + Tailwind 4 + Express 4 + tRPC 11
- Banco de dados: MySQL/TiDB via Drizzle ORM
- Autenticação: Manus OAuth
- Integração com LLM (Llama) para processamento de texto
- Storage: S3 para arquivos

---

## [0.1.0] - 2024-11-21

### Adicionado
- Estrutura inicial do projeto
- Configuração de desenvolvimento
- Sistema de build e deploy
- Documentação básica

---

## Tipos de Mudanças

- **Adicionado**: para novas funcionalidades
- **Modificado**: para mudanças em funcionalidades existentes
- **Descontinuado**: para funcionalidades que serão removidas
- **Removido**: para funcionalidades removidas
- **Corrigido**: para correção de bugs
- **Segurança**: para correções de vulnerabilidades

---

## Links de Versões

- [9.1.1] - Correção de erro mobile (join undefined)
- [9.1.0] - Correção de bug crítico de upload
- [9.0.0] - Gerador de Portfolio Web
- [8.5.0] - Exportação LaTeX
- [8.0.0] - Análise ATS Avançada
- [7.0.0] - Gerador de Cartas de Apresentação
- [6.0.0] - Sistema de Histórico
- [5.0.0] - Editor Interativo
- [4.0.0] - Suporte Multilíngue
- [3.0.0] - Templates Profissionais
- [2.0.0] - Exportação Multi-formato
- [1.0.0] - Release Inicial
- [0.1.0] - Estrutura Inicial
