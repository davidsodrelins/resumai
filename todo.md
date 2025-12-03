# Gerador de Currículos IA - TODO

## Backend e Infraestrutura
- [x] Configurar schema do banco de dados para armazenar sessões de geração
- [x] Implementar endpoint tRPC para upload de arquivos (PDF/DOCX)
- [x] Implementar extração de texto de PDFs e DOCX
- [x] Integrar API do Llama para processamento de dados
- [x] Criar procedimento para extrair dados do LinkedIn via URL
- [x] Implementar geração de currículo modelo Reduzido
- [x] Implementar geração de currículo modelo Misto
- [x] Implementar geração de currículo modelo Completo
- [x] Implementar tradução automática para os 3 idiomas (PT, EN, ES)
- [x] Criar endpoint para exportação em DOCX
- [x] Criar endpoint para exportação em PDF
- [x] Otimizar output para compatibilidade com ATS

## Frontend
- [x] Criar página inicial com apresentação da ferramenta
- [x] Implementar formulário de entrada de dados (prompt, LinkedIn URL, upload)
- [x] Criar interface de seleção de modelo e idioma
- [x] Desenvolver preview em tempo real do currículo
- [x] Implementar editor interativo de seções
- [x] Adicionar funcionalidade de adicionar/remover seções customizadas
- [x] Criar botões de exportação DOCX e PDF
- [x] Implementar design clássico e elegante com Tailwind
- [x] Garantir responsividade mobile
- [x] Adicionar estados de loading durante processamento IA

## Testes e Qualidade
- [x] Testar upload de diferentes formatos de arquivo
- [x] Validar extração de dados do LinkedIn
- [x] Testar geração nos 3 modelos
- [x] Validar tradução nos 3 idiomas
- [x] Testar exportação DOCX e PDF
- [x] Verificar compatibilidade ATS dos currículos gerados
- [x] Testar editor interativo
- [x] Validar responsividade em diferentes dispositivos
- [x] Testar sistema de histórico de currículos
- [x] Testar geração de cartas de apresentação

## Documentação e Deploy
- [x] Criar checkpoint para publicação
- [x] Preparar README.md detalhado
- [ ] Publicar no repositório GitHub
- [x] Documentar API endpoints

## Melhorias e Novas Funcionalidades (Fase 2)

### Editor Interativo
- [x] Implementar edição inline de campos de texto
- [x] Adicionar botões de editar/salvar em cada seção
- [x] Criar modal para edição de experiências profissionais
- [x] Implementar validação de campos obrigatórios
- [x] Adicionar feedback visual durante edição

### Gerenciamento de Seções
- [x] Adicionar botão para criar nova seção customizada
- [x] Implementar funcionalidade de remover seções
- [x] Criar drag-and-drop para reordenar seções
- [x] Adicionar templates de seções pré-definidas (Projetos, Publicações, Voluntariado)

### Templates Visuais
- [x] Criar template "Moderno" com cores vibrantes
- [x] Criar template "Minimalista" clean e simples
- [x] Criar template "Executivo" formal e tradicional
- [x] Criar template "Criativo" com elementos visuais
- [x] Implementar seletor de templates na interface
- [x] Adicionar preview dos templates

### Melhorias de UX
- [x] Melhorar preview em tempo real com atualização instantânea
- [x] Adicionar indicador de progresso durante geração
- [x] Implementar auto-save de rascunhos
- [x] Adicionar histórico de currículos gerados
- [x] Melhorar mensagens de erro e validação

## Novas Funcionalidades (Fase 3)

### Sistema de Auto-Save e Histórico
- [x] Criar tabela no banco de dados para armazenar rascunhos
- [x] Implementar auto-save a cada 30 segundos
- [x] Criar página de histórico de currículos gerados
- [x] Adicionar funcionalidade de recuperar versão anterior
- [x] Implementar comparação entre versões
- [x] Adicionar opção de duplicar currículo existente

### Geração de Cartas de Apresentação
- [x] Criar schema para cartas de apresentação
- [x] Implementar geração via Llama IA
- [x] Adicionar campos para informações da vaga (empresa, cargo, descrição)
- [x] Gerar cartas nos 3 idiomas (PT, EN, ES)
- [x] Aplicar templates visuais nas cartas
- [x] Exportar cartas em DOCX e PDF
- [x] Criar interface para edição de cartas
- [x] Integrar com dados do currículo

### Integração OAuth LinkedIn
- [ ] Configurar OAuth app no LinkedIn
- [ ] Implementar fluxo de autenticação OAuth
- [ ] Criar endpoint para callback do LinkedIn
- [ ] Extrair dados completos do perfil
- [ ] Mapear dados do LinkedIn para estrutura do currículo
- [ ] Adicionar botão "Importar do LinkedIn" na interface
- [ ] Tratar erros de autenticação e permissões

## Novas Funcionalidades (Fase 4)

### Interface de Cartas de Apresentação
- [x] Criar página dedicada para cartas (/cover-letter)
- [x] Implementar formulário com campos: empresa, cargo, descrição da vaga
- [x] Adicionar seletor de idioma (PT, EN, ES)
- [x] Criar preview da carta gerada
- [x] Implementar editor inline para ajustes na carta
- [x] Adicionar botões de exportação DOCX e PDF
- [x] Integrar com sistema de histórico
- [x] Adicionar link na navegação

### Auto-Save Inteligente
- [x] Implementar salvamento automático a cada 30 segundos
- [x] Adicionar indicador visual "Salvando..."
- [x] Mostrar notificação "Salvo com sucesso"
- [x] Implementar debounce para evitar salvamentos excessivos
- [x] Salvar estado de edição no localStorage como backup
- [x] Recuperar rascunho ao reabrir página

### Comparação de Versões
- [x] Criar página de comparação (/compare)
- [x] Implementar seletor de duas versões para comparar
- [x] Mostrar currículos lado a lado
- [x] Destacar diferenças em cores (verde/vermelho)
- [x] Adicionar navegação entre diferenças
- [x] Permitir exportar versão escolhida

### Testes e Validação
- [x] Testar geração de currículo completo
- [x] Testar upload de arquivos PDF e DOCX
- [x] Testar geração de carta de apresentação
- [x] Testar salvamento e recuperação de histórico
- [ ] Testar auto-save em diferentes cenários
- [ ] Testar comparação de versões
- [x] Validar exportação DOCX e PDF
- [x] Testar responsividade mobile

## Novas Funcionalidades (Fase 5)

### Auto-Save Inteligente
- [x] Implementar hook useAutoSave com debounce de 30 segundos
- [x] Adicionar indicador visual "Salvando..." durante auto-save
- [x] Mostrar notificação "Salvo com sucesso" após conclusão
- [x] Implementar fallback com localStorage como backup
- [x] Recuperar rascunho do localStorage ao reabrir página
- [x] Adicionar timestamp de última modificação
- [ ] Testar auto-save em diferentes cenários de edição

### Comparação de Versões
- [x] Criar página /compare para comparação lado a lado
- [x] Implementar seletor de duas versões para comparar
- [x] Criar componente de diff visual com cores
- [x] Destacar adições em verde e remoções em vermelho
- [x] Adicionar navegação entre diferenças encontradas
- [x] Implementar exportação da versão escolhida
- [x] Adicionar botão "Comparar" na página de histórico

### Integração OAuth LinkedIn
- [ ] Pesquisar documentação da API do LinkedIn
- [ ] Configurar OAuth app no LinkedIn Developer Portal
- [ ] Implementar fluxo de autenticação OAuth 2.0
- [ ] Criar endpoint /api/linkedin/callback
- [ ] Extrair dados completos do perfil (experiência, educação, skills)
- [ ] Mapear dados do LinkedIn para estrutura ResumeData
- [ ] Adicionar botão "Importar do LinkedIn" na interface
- [ ] Implementar tratamento de erros e permissões
- [ ] Adicionar loading state durante importação
- [ ] Testar fluxo completo de importação

### Testes e Validação
- [ ] Testar auto-save em edição contínua
- [ ] Testar recuperação de rascunho do localStorage
- [ ] Testar comparação entre 2 versões diferentes
- [ ] Testar navegação entre diferenças
- [ ] Testar fluxo OAuth do LinkedIn
- [ ] Validar mapeamento de dados do LinkedIn
- [ ] Testar tratamento de erros de autenticação
- [ ] Criar testes automatizados para novas funcionalidades


## Novas Funcionalidades (Fase 6) - Análise e Otimização Inteligente

### Análise de Compatibilidade ATS
- [x] Criar algoritmo de pontuação ATS (0-100)
- [x] Implementar verificação de formatação (seções padrão, hierarquia)
- [x] Analisar densidade de palavras-chave
- [x] Verificar uso de verbos de ação
- [x] Detectar problemas de formatação (tabelas, gráficos, colunas)
- [x] Gerar relatório detalhado com sugestões específicas
- [x] Criar interface visual com gráfico de pontuação
- [x] Adicionar badge de pontuação no preview do currículo
- [x] Implementar sugestões categorizadas (críticas, importantes, opcionais)

### Sugestões de Melhorias via IA
- [x] Criar endpoint para análise via Llama IA
- [x] Implementar análise de verbos de ação (substituir por mais fortes)
- [x] Detectar oportunidades de quantificação de resultados
- [x] Sugerir otimização de bullet points
- [x] Analisar densidade de informação por seção
- [x] Gerar preview antes/depois para cada sugestão
- [x] Criar interface com lista de sugestões aplicáveis
- [x] Implementar botão "Aplicar Sugestão" com preview
- [x] Adicionar opção "Aplicar Todas as Sugestões"

### Análise de Palavras-Chave Vaga vs Currículo
- [x] Criar parser de descrição de vaga
- [x] Extrair palavras-chave relevantes da vaga
- [x] Comparar com palavras-chave do currículo
- [x] Calcular percentual de match
- [x] Destacar palavras-chave presentes (verde)
- [x] Destacar palavras-chave ausentes (vermelho)
- [x] Sugerir onde adicionar palavras-chave ausentes
- [x] Criar interface de comparação lado a lado
- [x] Implementar gráfico de compatibilidade
- [x] Adicionar sugestões contextuais de onde inserir termos

## Testes e Validação
- [ ] Testar scanner ATS com diferentes currículos
- [ ] Validar sugestões de IA com casos reais
- [ ] Testar análise de palavras-chave com vagas reais
- [ ] Verificar precisão das pontuações
- [ ] Validar aplicação de sugestões
- [x] Testar responsividade das novas interfaces


## Novas Melhorias (Fase 7) - Refinamentos Finais

### Badge de Pontuação ATS no Preview
- [x] Adicionar componente ATSScoreBadge
- [x] Integrar badge no canto superior direito do preview
- [x] Mostrar pontuação em tempo real conforme edições
- [x] Adicionar tooltip com breakdown detalhado
- [x] Implementar animação de atualização suave

### Aplicação em Lote de Sugestões
- [x] Criar botão "Aplicar Todas as Sugestões de Alto Impacto"
- [x] Implementar lógica de aplicação sequencial
- [ ] Adicionar preview antes de aplicar
- [x] Mostrar progresso durante aplicação
- [ ] Implementar undo para reverter todas as mudanças
- [ ] Adicionar confirmação antes de aplica### Exportação LaTeX
- [x] Criar módulo latexExporter.ts
- [x] Implementar geração de documento LaTeX completo
- [x] Adicionar metadados ocultos em comentários LaTeX
- [x] Incluir palavras-chave otimizadas para IA
- [x] Adicionar frases de impacto nos metadados
- [x] Criar endpoint tRPC para exportação LaTeX
- [x] Adicionar botão de download LaTeX na interface
- [x] Testar compilação do LaTeX gerado

## Testes e Validação
- [ ] Testar badge ATS em diferentes resoluções
- [ ] Validar aplicação em lote com múltiplas sugestões
- [ ] Testar compilação de arquivos LaTeX gerados
- [ ] Verificar metadados ocultos no LaTeX
- [ ] Criar testes automatizados para novas funcionalidades


## Novas Funcionalidades Avançadas (Fase 8)

### Análise de Soft Skills com IA
- [x] Criar módulo softSkillsAnalyzer.ts
- [x] Implementar identificação de soft skills presentes no currículo
- [x] Criar banco de dados de soft skills por cargo/área
- [x] Gerar sugestões de soft skills relevantes para o cargo desejado
- [x] Criar exemplos contextualizados de como demonstrar cada skill
- [x] Implementar endpoint tRPC para análise de soft skills
- [x] Criar página dedicada /soft-skills para análise
- [x] Implementar gráfico de coverage score (0-100)
- [x] Criar cards expansíveis para cada sugestão
- [x] Mostrar preview do exemplo contextualizado
- [x] Adicionar botão "Aplicar Soft Skill" que insere exemplo na seção apropriada
- [x] Implementar feedback visual após aplicação

### Geração de Portfolio Web Automático
- [ ] Criar módulo portfolioGenerator.ts
- [ ] Implementar geração de HTML/CSS responsivo a partir do currículo
- [ ] Criar 3 templates de portfolio (Moderno, Minimalista, Profissional)
- [ ] Adicionar seção de projetos com links e descrições
- [ ] Implementar otimização SEO (meta tags, structured data)
- [ ] Gerar domínio personalizado (nome-sobrenome.manus.space)
- [ ] Hospedar portfolio no Manus Space
- [ ] Criar página de gerenciamento de portfolio
- [ ] Adicionar analytics de visualizações
- [ ] Implementar botão "Compartilhar Portfolio" com QR code

### Integração com Job Boards
- [ ] Pesquisar APIs disponíveis (LinkedIn Jobs, Indeed, Glassdoor)
- [ ] Implementar scraper para vagas (se APIs não disponíveis)
- [ ] Criar módulo jobMatcher.ts para matching de vagas
- [ ] Implementar cálculo de compatibilidade (ATS score + keywords)
- [ ] Criar sistema de filtros (localização, salário, remoto, etc.)
- [ ] Implementar aplicação automática em vagas compatíveis
- [ ] Criar relatório de candidaturas enviadas
- [ ] Adicionar notificações de novas vagas compatíveis
- [ ] Implementar cron job para busca periódica (a cada 30 min)
- [ ] Enviar email com vagas encontradas para davidsodre_ba@hotmail.com

## Testes e Validação
- [ ] Testar análise de soft skills com diferentes perfis
- [ ] Validar geração de portfolio em diferentes resoluções
- [ ] Testar matching de vagas com currículos reais
- [ ] Verificar aplicação automática em job boards
- [ ] Validar envio de emails com vagas
- [ ] Testar SEO do portfolio gerado


## Novas Funcionalidades Avançadas (Fase 9) - Próximas Implementações

### Gerador de Portfolio Web Automático
- [x] Criar módulo portfolioGenerator.ts para transformar currículo em site
- [x] Implementar geração de HTML/CSS/JS responsivo a partir dos dados do currículo
- [x] Criar 3 templates de portfolio (Moderno, Minimalista, Profissional)
- [x] Adicionar seção "Sobre Mim" com biografia gerada por IA
- [x] Implementar seção de experiências com timeline interativo
- [x] Criar seção de projetos (integrado nos templates)
- [x] Adicionar seção de habilidades com gráficos visuais
- [x] Implementar seção de educação e certificações
- [x] Adicionar links de contato funcionais
- [x] Implementar otimização SEO (meta tags, Open Graph, structured data)
- [x] Hospedar portfolio automaticamente no S3 (Manus Space)
- [x] Criar página de gerenciamento de portfolio (/portfolio)
- [x] Implementar preview em tempo real do portfolio
- [x] Adicionar botão "Compartilhar Portfolio" com copiar URL
- [x] Adicionar modo escuro/claro para o portfolio
- [x] Implementar animações suaves e transições
- [x] Criar endpoints tRPC (generate, preview)
- [x] Integrar com histórico de currículos
- [ ] Adicionar analytics de visualizações e visitantes
- [ ] Gerar domínio personalizado (nome-sobrenome.manus.space)
- [ ] Garantir acessibilidade (WCAG 2.1 AA)
- [ ] Otimizar performance (Lighthouse score > 90)

### Job Board Scraper com Matching Inteligente
- [ ] Pesquisar APIs disponíveis (LinkedIn Jobs API, Indeed API, Glassdoor API)
- [ ] Implementar scraper para LinkedIn Jobs (se API não disponível)
- [ ] Implementar scraper para Indeed
- [ ] Implementar scraper para Glassdoor
- [ ] Criar módulo jobMatcher.ts para calcular compatibilidade
- [ ] Implementar algoritmo de matching (ATS score + keywords + soft skills)
- [ ] Criar sistema de filtros (localização, salário, remoto, híbrido, presencial)
- [ ] Adicionar filtro por nível de senioridade (júnior, pleno, sênior, lead)
- [ ] Implementar filtro por área (frontend, backend, fullstack, devops, etc.)
- [ ] Criar score de compatibilidade (0-100) para cada vaga
- [ ] Ordenar vagas por score de compatibilidade
- [ ] Adicionar página de vagas recomendadas (/jobs)
- [ ] Implementar visualização de vaga com detalhes completos
- [ ] Adicionar botão "Aplicar" que redireciona para a vaga original
- [ ] Criar histórico de vagas visualizadas e aplicadas

### Sistema de Cron Job e Notificações
- [ ] Configurar cron job para buscar vagas a cada 30 minutos
- [ ] Implementar sistema de notificações por email
- [ ] Criar template de email com vagas recomendadas
- [ ] Adicionar resumo diário de novas vagas (envio às 9h)
- [ ] Implementar resumo semanal com estatísticas (envio às segundas 9h)
- [ ] Adicionar botão "Desativar notificações" no email
- [ ] Criar painel de configurações de notificações
- [ ] Permitir escolher frequência (tempo real, diária, semanal)
- [ ] Adicionar filtros personalizados para notificações
- [ ] Implementar notificações push no navegador (opcional)
- [ ] Enviar emails para davidsodre_ba@hotmail.com

### Dashboard de Métricas de Candidatura
- [ ] Criar página de dashboard (/dashboard)
- [ ] Implementar rastreamento de candidaturas enviadas
- [ ] Adicionar gráfico de candidaturas por semana/mês
- [ ] Mostrar taxa de resposta (respostas / candidaturas)
- [ ] Implementar gráfico de funil (enviado → visualizado → entrevista → oferta)
- [ ] Adicionar estatísticas de tempo médio de resposta
- [ ] Mostrar empresas que mais respondem
- [ ] Implementar análise de padrões de sucesso
- [ ] Adicionar insights via IA (ex: "Vagas remotas têm 30% mais resposta")
- [ ] Criar gráfico de evolução do ATS score ao longo do tempo
- [ ] Mostrar palavras-chave mais efetivas
- [ ] Adicionar comparação com mercado (benchmarks)
- [ ] Implementar exportação de relatórios em PDF
- [ ] Criar visualização de mapa de calor de candidaturas por região

## Testes e Validação (Fase 9)
- [ ] Testar geração de portfolio com diferentes currículos
- [ ] Validar responsividade do portfolio em mobile/tablet/desktop
- [ ] Testar SEO do portfolio gerado (Google Search Console)
- [ ] Verificar acessibilidade com ferramentas automáticas
- [ ] Testar scraping de vagas em diferentes job boards
- [ ] Validar algoritmo de matching com casos reais
- [ ] Testar envio de emails de notificação
- [ ] Verificar cron job em produção
- [ ] Testar dashboard com dados reais de candidaturas
- [ ] Validar insights de IA com estatísticas reais
- [ ] Criar testes automatizados para novas funcionalidades
- [ ] Testar integração completa do fluxo: currículo → portfolio → vagas → candidatura → métricas

## Melhorias de Qualidade e Performance
- [ ] Implementar cache de resultados de IA (Redis)
- [ ] Otimizar queries do banco de dados
- [ ] Adicionar índices nas tabelas mais consultadas
- [ ] Implementar lazy loading de imagens
- [ ] Comprimir assets (JS, CSS, imagens)
- [ ] Adicionar service worker para PWA
- [ ] Implementar offline mode para editor
- [ ] Adicionar testes E2E com Playwright
- [ ] Aumentar cobertura de testes para > 80%
- [ ] Implementar CI/CD com GitHub Actions
- [ ] Adicionar monitoramento de erros (Sentry)
- [ ] Implementar analytics de uso (Plausible ou similar)


## Bugs Reportados (Dezembro 2024)

### Bug Crítico: Processamento de PDF Falhando
- [x] Investigar erro "Erro ao processar ResumeDavid.pdf"
- [x] Corrigir loading infinito ao clicar em "Processar"
- [x] Implementar conversão de arquivo para base64 no frontend
- [x] Atualizar endpoint uploadFile para aceitar data URLs
- [x] Criar testes automatizados para validação
- [x] Validar correção com testes unitários


### Novas Tarefas (Dezembro 2024)
- [x] Corrigir erro "Cannot read properties of undefined (reading 'join')" no mobile
- [x] Criar CHANGELOG.md com histórico completo de versões
- [x] Criar README.md profissional com documentação de todas as funcionalidades
- [x] Adicionar badges no README (build status, license, etc)
- [x] Documentar instruções de instalação e desenvolvimento
- [x] Adicionar validação de arrays em Generator.tsx, ResumePreview.tsx e Analysis.tsx


## Bug Reportado - PDF Preto e Branco (Dezembro 2024)

### Exportação de PDF sem cores
- [x] Investigar código de exportação de PDF (routers.ts e pdfGenerator)
- [x] Identificar por que cores dos templates não são aplicadas
- [x] Corrigir geração de PDF para incluir cores de cabeçalho
- [x] Corrigir cores de títulos de seção
- [x] Corrigir cores de acentos e destaques
- [x] Adicionar parâmetro template ao endpoint exportPDF
- [x] Definir paletas de cores para os 5 templates
- [x] Aplicar fillColor() em todos os elementos do PDF
- [x] Atualizar frontend para enviar template ao exportar
- [ ] Testar exportação com template Classic
- [ ] Testar exportação com template Modern
- [ ] Testar exportação com template Minimal
- [ ] Testar exportação com template Executive
- [ ] Testar exportação com template Creative
- [ ] Validar que preview e PDF têm as mesmas cores


## Bugs Reportados - PDF V9.2.0 (Dezembro 2024)

### Cabeçalho sobrepondo título
- [x] Corrigir ordem de desenho (rect primeiro, texto depois)
- [x] Ajustar posicionamento do texto no cabeçalho
- [x] Garantir que o texto apareça sobre o fundo colorido
- [x] Usar .fill() em vez de .fillColor().fill() para o retângulo

### Cores diferentes do preview
- [x] Comparar cores do ResumePreview.tsx com documentExporter.ts
- [x] Ajustar paleta Classic para corresponder ao preview (slate-100, slate-900)
- [x] Ajustar paleta Modern para corresponder ao preview (blue-500, blue-600)
- [x] Ajustar paleta Minimal para corresponder ao preview (white, slate-800)
- [x] Ajustar paleta Executive para corresponder ao preview (slate-800, amber-600)
- [x] Ajustar paleta Creative para corresponder ao preview (pink-500, purple-500)
- [x] Validar cores hex extraídas do Tailwind CSS
- [x] Adicionar campo headerText separado para cor do texto do cabeçalho


## Melhorias Visuais PDF (Dezembro 2024)

### Adicionar linhas decorativas nos títulos
- [x] Implementar linhas horizontais coloridas abaixo dos títulos de seção
- [x] Usar cor de acento de cada template
- [x] Ajustar espessura da linha (2px)
- [x] Posicionar linha 5px abaixo do texto do título
- [x] Aplicar em todas as seções (Summary, Experience, Education, Skills, Languages, Certifications, Projects, Additional)

### Funcionalidades ausentes na UI
- [ ] Identificar recursos documentados no README/CHANGELOG
- [ ] Verificar quais não estão visíveis ou acessíveis na interface
- [ ] Criar lista de funcionalidades para implementar ou documentar melhor


## Novas Funcionalidades - Descoberta e Engajamento (Dezembro 2024)

### Página de Recursos (/recursos)
- [x] Criar componente Resources.tsx
- [x] Listar todas as funcionalidades disponíveis com descrições
- [x] Organizar em categorias (Geração, Análise, Otimização, Exportação, Gerenciamento)
- [x] Adicionar ícones para cada funcionalidade (Lucide icons)
- [x] Incluir links diretos para cada recurso
- [x] Adicionar badges "NOVO" para funcionalidades recentes (Portfolio)
- [x] Criar lista de benefícios para cada recurso
- [x] Adicionar filtros por categoria
- [x] Criar seção CTA no final da página

### Dashboard de Estatísticas (/dashboard)
- [x] Criar componente Dashboard.tsx
- [x] Mostrar total de currículos gerados
- [x] Exibir média semanal de criação
- [x] Gráfico de currículos por template (barra de progresso)
- [x] Gráfico de currículos por idioma (barra de progresso)
- [x] Template favorito (mais usado)
- [x] Idioma principal (mais usado)
- [x] Currículos mais recentes (últimos 5)
- [x] Adicionar cards com métricas principais (4 cards)
- [x] Implementar autenticação e redirect
- [ ] Adicionar gráficos avançados com Chart.js
- [ ] Implementar linha do tempo de atividade
- [ ] Adicionar score ATS médio

### Integração com Navegação
- [x] Adicionar link "Recursos" no menu principal (header Home.tsx)
- [x] Adicionar link "Dashboard" no menu do usuário (header Home.tsx)
- [x] Adicionar rotas no App.tsx (/resources, /dashboard)
- [x] Importar componentes no App.tsx
- [ ] Criar breadcrumbs para navegação
- [ ] Adicionar links em outras páginas


## Funcionalidades Avançadas - V9.4.0 (Dezembro 2024)

### Gráficos Avançados com Chart.js
- [x] Instalar react-chartjs-2 e chart.js
- [x] Criar gráfico de pizza para distribuição de templates
- [x] Criar gráfico de pizza para distribuição de idiomas
- [x] Adicionar cores personalizadas nos gráficos (azul, roxo, verde, laranja, rosa)
- [x] Implementar tooltips informativos (Chart.js built-in)
- [x] Tornar gráficos responsivos (maintainAspectRatio: false)
- [x] Registrar componentes do Chart.js (ArcElement, Tooltip, Legend)
- [ ] Criar gráfico de linha para atividade ao longo do tempo

### Score ATS Médio
- [x] Calcular score ATS médio dos currículos do usuário (mock data)
- [x] Criar card de métrica para score ATS médio
- [x] Adicionar indicador de tendência (subindo/descendo/estável)
- [x] Ícones dinâmicos (TrendingUp verde, TrendingDown vermelho)
- [x] Mostrar score no formato X/100
- [ ] Adicionar campo atsScore na tabela de histórico (persistência real)
- [ ] Implementar gráfico de linha mostrando evolução do score
- [ ] Mostrar comparação com média da plataforma

### Tour Guiado Interativo
- [x] Instalar biblioteca de tour (react-joyride)
- [x] Criar componente GuidedTour.tsx
- [x] Criar steps do tour (boas-vindas → criar currículo → recursos → dashboard)
- [x] Implementar detecção de primeiro acesso (localStorage hasSeenTour)
- [x] Adicionar highlights nos elementos importantes (targets)
- [x] Criar botões de navegação (próximo, voltar, pular, finalizar)
- [x] Salvar estado do tour no localStorage
- [x] Customizar estilos (cores azuis, bordas arredondadas)
- [x] Traduzir para português (locale)
- [x] Integrar no Home.tsx para usuários autenticados
- [ ] Adicionar opção "Refazer Tour" nas configurações


## Funcionalidades V9.5.0 (Dezembro 2024)

### Gráfico de Linha Temporal
- [x] Criar gráfico de linha mostrando atividade dos últimos 30 dias
- [x] Agrupar currículos por data de criação
- [x] Calcular contagem diária de currículos criados
- [x] Implementar gráfico com Chart.js LineElement
- [x] Adicionar cores e gradiente no gráfico (azul com fill)
- [x] Posicionar gráfico no Dashboard abaixo dos gráficos de pizza
- [x] Adicionar tooltips mostrando data e quantidade (com plural)
- [x] Implementar responsividade do gráfico (maintainAspectRatio: false)
- [x] Adicionar títulos nos eixos X e Y
- [x] Rotacionar labels do eixo X (45 graus)

### Persistência de Score ATS
- [x] Adicionar campo atsScore (int) na tabela savedResumes
- [x] Executar migração do banco de dados (pnpm db:push)
- [x] Atualizar cálculo de score ATS médio para usar dados reais
- [x] Remover mock data do Dashboard
- [x] Adicionar verificação hasAtsData para mostrar empty state
- [x] Mostrar "--" e "Sem análises ainda" quando não há dados
- [x] Filtrar scores null/undefined do cálculo
- [ ] Modificar endpoint de análise para salvar score (requer integração)
- [ ] Criar gráfico de evolução do score ATS ao longo do tempo
- [ ] Adicionar filtro de período (7 dias, 30 dias, todos)

### Botão Refazer Tour
- [x] Criar função para limpar localStorage (hasSeenTour)
- [x] Adicionar botão "Refazer Tour" no menu do usuário
- [x] Implementar dropdown no header com opções do usuário
- [x] Adicionar ícone de ajuda (HelpCircle) no botão
- [x] Adicionar ícone de usuário (User) no trigger
- [x] Adicionar opção "Sair" com ícone LogOut
- [x] Reexecutar tour após clicar no botão
- [x] Usar useState para controlar execução do tour
- [x] Importar componentes DropdownMenu do shadcn/ui
- [ ] Adicionar confirmação antes de iniciar tour novamente
- [ ] Testar funcionalidade em diferentes páginas
