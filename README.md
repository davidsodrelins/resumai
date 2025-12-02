# 🎯 Gerador de Currículos IA - V6.0

> **Plataforma completa para geração, otimização e análise de currículos profissionais powered by Llama AI**

Uma ferramenta avançada que transforma dados do LinkedIn, currículos anteriores e prompts do usuário em currículos profissionais otimizados para ATS (Applicant Tracking Systems), disponíveis em **3 idiomas** (Português, Inglês, Espanhol) e **3 formatos** (Reduzido, Misto, Completo), com **5 templates visuais** e **análise inteligente de compatibilidade**.

---

## ✨ Funcionalidades Principais

### 📝 Geração de Currículos
- **Processamento Inteligente com Llama IA**: Extrai e consolida informações do LinkedIn, currículos anexados (PDF/DOCX) e prompts do usuário
- **3 Modelos de Currículo**:
  - **Reduzido**: Informações essenciais e concisas
  - **Misto**: Detalhes completos das 2 últimas experiências
  - **Completo**: Todas as informações disponíveis
- **3 Idiomas**: Português, Inglês e Espanhol com tradução automática
- **5 Templates Visuais Profissionais**:
  - Clássico (elegante e tradicional)
  - Moderno (cores vibrantes e dinâmico)
  - Minimalista (clean e simples)
  - Executivo (formal e corporativo)
  - Criativo (elementos visuais diferenciados)

### ✏️ Editor Interativo
- **Edição Inline**: Edite qualquer campo diretamente no preview
- **Gerenciamento de Seções**: Adicione, remova ou reordene seções com drag-and-drop
- **Seções Customizadas**: Templates pré-definidos (Projetos, Publicações, Voluntariado)
- **Preview em Tempo Real**: Visualize mudanças instantaneamente

### 📊 Análise e Otimização Inteligente (V6.0 - NOVO!)
- **Pontuação ATS (0-100)**: Análise completa de compatibilidade com sistemas de rastreamento
  - Breakdown detalhado: Formatação, Palavras-chave, Verbos de Ação, Quantificação
  - Sugestões categorizadas (Críticas, Importantes, Opcionais)
  - Indicador visual de impacto de cada sugestão
- **Sugestões de Melhorias via IA**: Análise inteligente com Llama para otimizar conteúdo
  - Substituição de verbos de ação por mais fortes
  - Detecção de oportunidades de quantificação
  - Otimização de bullet points
  - Preview antes/depois de cada sugestão
  - Aplicação individual ou em lote
- **Análise de Palavras-Chave Vaga vs Currículo**: Compare seu currículo com descrições de vagas
  - Extração automática de keywords da vaga
  - Percentual de match calculado
  - Destacamento visual (verde para presentes, vermelho para ausentes)
  - Sugestões contextuais de onde inserir termos
  - Priorização de keywords por importância

### 💾 Sistema de Histórico e Auto-Save
- **Auto-Save Inteligente**: Salvamento automático a cada 30 segundos
- **Indicador Visual**: Feedback em tempo real ("Salvando...", "Salvo com sucesso")
- **Backup Local**: Fallback com localStorage para segurança extra
- **Histórico Completo**: Visualize e recupere todos os currículos gerados
- **Comparação de Versões**: Compare duas versões lado a lado com diff visual colorido

### 📄 Geração de Cartas de Apresentação
- **Geração Inteligente**: Cria cartas personalizadas baseadas no currículo e vaga
- **3 Idiomas**: Português, Inglês e Espanhol
- **Editor Inline**: Ajuste a carta conforme necessário
- **Integração com Currículo**: Usa dados do currículo automaticamente

### 📥 Exportação
- **Formato DOCX**: Editável no Microsoft Word
- **Formato PDF**: Design profissional e pronto para envio
- **Otimizado para ATS**: Estrutura e formatação compatíveis com sistemas automáticos

---

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js + Express**: Servidor robusto e escalável
- **tRPC**: Type-safe API com inferência automática de tipos
- **Drizzle ORM**: ORM moderno para MySQL/TiDB
- **Llama IA**: Processamento de linguagem natural e geração de conteúdo
- **PDFKit**: Geração de PDFs profissionais
- **Docx**: Criação de documentos Word
- **pdf2json**: Extração de texto de PDFs
- **Mammoth**: Extração de texto de arquivos DOCX

### Frontend
- **React 19**: Framework moderno e performático
- **TypeScript**: Type safety em todo o código
- **Tailwind CSS 4**: Estilização utility-first
- **shadcn/ui**: Componentes acessíveis e customizáveis
- **Wouter**: Roteamento leve e eficiente
- **TanStack Query**: Gerenciamento de estado assíncrono
- **Sonner**: Notificações toast elegantes

### Infraestrutura
- **MySQL/TiDB**: Banco de dados relacional
- **S3**: Armazenamento de arquivos
- **Manus OAuth**: Autenticação segura
- **Vitest**: Framework de testes unitários

---

## 📋 Como Usar

### 1. Criar Currículo
1. Faça login na plataforma
2. Clique em "Criar Currículo"
3. Preencha as informações:
   - **Prompt**: Descreva sua experiência e objetivos
   - **LinkedIn URL** (opcional): Link do seu perfil
   - **Currículos Anteriores** (opcional): Upload de PDFs ou DOCX
4. Selecione:
   - **Modelo**: Reduzido, Misto ou Completo
   - **Idioma**: Português, Inglês ou Espanhol
   - **Template Visual**: Clássico, Moderno, Minimalista, Executivo ou Criativo
5. Clique em "Processar Informações" e depois "Gerar Currículo"

### 2. Editar Currículo
- Clique no ícone de lápis em qualquer seção para editar
- Adicione novas seções com o botão "+"
- Reordene seções arrastando e soltando
- Remova seções com o ícone de lixeira

### 3. Analisar e Otimizar (NOVO!)
1. Acesse "Analisar e Otimizar" no menu
2. Carregue seu currículo
3. Escolha o tipo de análise:
   - **Análise ATS**: Veja sua pontuação e sugestões de melhoria
   - **Sugestões IA**: Gere melhorias inteligentes para o conteúdo
   - **Palavras-Chave**: Compare com a descrição de uma vaga específica

### 4. Gerar Carta de Apresentação
1. Acesse "Gerar Carta de Apresentação"
2. Preencha:
   - Nome da empresa
   - Cargo desejado
   - Descrição da vaga
3. Selecione o idioma
4. Clique em "Gerar Carta"
5. Edite conforme necessário e exporte

### 5. Histórico e Comparação
- Acesse "Histórico" para ver todos os currículos salvos
- Clique em "Comparar" para ver diferenças entre versões
- Restaure versões anteriores com um clique

---

## 🧪 Testes

A aplicação possui **48 testes automatizados** cobrindo:
- Autenticação e logout
- Processamento de currículos
- Geração em múltiplos idiomas
- Análise ATS
- Extração e matching de keywords
- Sugestões de melhorias via IA
- Histórico e salvamento
- Exportação DOCX e PDF

Execute os testes:
```bash
pnpm test
```

---

## 🎨 Design e UX

### Princípios de Design
- **Clássico e Elegante**: Tipografia serif (Playfair Display + Lora), paleta de cores sofisticada
- **Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Acessível**: Componentes seguem padrões WCAG
- **Feedback Visual**: Indicadores de loading, toasts informativos, animações suaves

### Otimização para ATS
- Estrutura hierárquica clara
- Formatação consistente
- Sem elementos visuais complexos (tabelas, gráficos, colunas)
- Palavras-chave estrategicamente posicionadas
- Verbos de ação fortes
- Resultados quantificados

---

## 📊 Estatísticas do Projeto

- **48 testes automatizados** (100% passando)
- **5 templates visuais** profissionais
- **3 idiomas** suportados
- **3 modelos** de currículo
- **6 módulos** de análise e otimização
- **2 formatos** de exportação (DOCX + PDF)

---

## 👨‍💻 Histórico de Versões

### V6.0 (Atual) - Análise e Otimização Inteligente
- ✨ **Pontuação ATS (0-100)** com breakdown detalhado
- ✨ **Sugestões de melhorias via IA** com preview antes/depois
- ✨ **Análise de palavras-chave** vaga vs currículo
- ✨ Interface visual para análise com tabs
- ✅ 48 testes automatizados passando (100%)
- 🐛 Correções e melhorias de performance

### V5.0 - Auto-Save e Comparação de Versões
- Auto-save inteligente com debounce de 30 segundos
- Comparação de versões lado a lado com diff visual
- Backup automático com localStorage
- 36 testes automatizados

### V4.0 - Interface de Cartas e Correções
- Interface completa para cartas de apresentação
- Correções de bugs na renderização
- 30 testes automatizados

### V3.0 - Sistema de Histórico e Cartas
- Sistema de histórico de currículos
- Geração de cartas com IA
- 27 testes automatizados

### V2.0 - Editor e Templates
- Editor interativo completo
- 5 templates visuais profissionais
- 12 testes automatizados

### V1.0 - Base
- Geração de currículos em 3 idiomas e 3 modelos
- Processamento com Llama AI
- Exportação DOCX e PDF

---

## 🔒 Segurança e Privacidade

- **Autenticação OAuth**: Login seguro via Manus
- **Dados Criptografados**: Comunicação HTTPS
- **Armazenamento Seguro**: S3 com controle de acesso
- **Backup Automático**: localStorage como fallback
- **Sem Rastreamento**: Seus dados permanecem privados

---

## 🚧 Roadmap Futuro

### Funcionalidades Planejadas
- [ ] Integração OAuth oficial com LinkedIn (aguardando aprovação de parceiro)
- [ ] Análise de compatibilidade com vagas específicas
- [ ] Sugestões de networking baseadas no currículo
- [ ] Exportação para LaTeX
- [ ] Templates customizáveis pelo usuário
- [ ] Análise de mercado e salários
- [ ] Integração com plataformas de emprego

---

## 📞 Suporte

Para dúvidas, sugestões ou reportar problemas, entre em contato através do [portal de ajuda](https://help.manus.im).

---

## 📄 Licença

MIT License - Veja o arquivo LICENSE para mais detalhes.

---

**Desenvolvido com ❤️ usando Llama IA e Manus Platform**

**Versão**: 6.0.0  
**Última Atualização**: Dezembro 2025  
**Status**: ✅ Produção
