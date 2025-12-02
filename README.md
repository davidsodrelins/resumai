# 🎓 Gerador de Currículos IA V5.0

**Plataforma completa para geração de currículos profissionais powered by Llama AI**

Transforme seu perfil do LinkedIn, currículos anteriores e experiências em currículos otimizados para ATS (Applicant Tracking Systems) e sistemas de IA de recrutamento. Disponível em **3 idiomas** (Português, Inglês e Espanhol) e **3 formatos** (Reduzido, Misto e Completo), com exportação em DOCX e PDF.

---

## ✨ Funcionalidades Principais

### 🤖 Geração Inteligente de Currículos
- **Processamento via Llama IA**: Extrai e consolida informações do LinkedIn, currículos anexados (PDF/DOCX) e prompts do usuário
- **3 Modelos de Currículo**:
  - **Reduzido**: Informações essenciais e concisas
  - **Misto**: Detalhes completos das 2 últimas experiências
  - **Completo**: Todas as informações disponíveis
- **3 Idiomas**: Português, Inglês e Espanhol com tradução automática
- **5 Templates Visuais**: Clássico, Moderno, Minimalista, Executivo e Criativo
- **Otimização ATS**: Formato e estrutura compatíveis com sistemas de triagem automática

### ✏️ Editor Interativo
- **Edição Inline**: Modifique qualquer campo diretamente no preview
- **Gerenciamento de Seções**: Adicione, remova ou reordene seções via drag-and-drop
- **Templates de Seções**: Projetos, Publicações, Voluntariado e mais
- **Preview em Tempo Real**: Visualize mudanças instantaneamente

### 💾 Sistema de Histórico e Auto-Save (V5.0 - NOVO!)
- **Auto-Save Inteligente**: Salvamento automático a cada 30 segundos durante edição
- **Histórico Completo**: Acesse todos os currículos gerados anteriormente
- **Backup Local**: Fallback com localStorage para garantir que nenhum trabalho seja perdido
- **Recuperação de Rascunhos**: Continue de onde parou ao reabrir a página
- **Indicador Visual**: Feedback em tempo real do status de salvamento

### 🔄 Comparação de Versões (V5.0 - NOVO!)
- **Comparação Lado a Lado**: Compare duas versões de currículo simultaneamente
- **Diff Visual**: Diferenças destacadas em cores (verde para adições, vermelho para remoções)
- **Exportação Direta**: Exporte qualquer versão comparada em PDF
- **Análise Detalhada**: Compare informações pessoais, experiências, educação e habilidades

### 📝 Geração de Cartas de Apresentação
- **Personalização Inteligente**: Gera cartas baseadas no currículo e informações da vaga
- **3 Idiomas**: Português, Inglês e Espanhol
- **Editor Inline**: Ajuste o conteúdo conforme necessário
- **Exportação DOCX/PDF**: Baixe em formato editável ou pronto para envio

### 📤 Exportação Profissional
- **Formato DOCX**: Editável no Microsoft Word, Google Docs, etc.
- **Formato PDF**: Pronto para envio com design profissional
- **Upload Automático S3**: Armazenamento seguro na nuvem

---

## 🚀 Como Usar

### 1. Criar Novo Currículo
1. Clique em **"Criar Currículo"** no header
2. Preencha as informações:
   - **Instruções**: Descreva sua experiência e objetivos
   - **URL do LinkedIn** (opcional): Cole o link do seu perfil público
   - **Currículos Anteriores** (opcional): Anexe PDFs ou DOCX
3. Clique em **"Processar Informações"**
4. Selecione:
   - **Modelo**: Reduzido, Misto ou Completo
   - **Idioma**: Português, Inglês ou Espanhol
   - **Template Visual**: Clássico, Moderno, Minimalista, Executivo ou Criativo
5. Clique em **"Gerar Currículo"**

### 2. Editar Currículo
- **Editar Seções**: Clique no ícone de lápis em qualquer seção
- **Adicionar Seções**: Use o botão "Adicionar Seção Customizada"
- **Reordenar**: Arraste e solte seções para reorganizar
- **Preview**: Veja mudanças em tempo real no painel direito
- **Auto-Save**: Suas mudanças são salvas automaticamente a cada 30 segundos

### 3. Exportar Currículo
- **Baixar PDF**: Clique em "Baixar PDF" para formato pronto para envio
- **Baixar DOCX**: Clique em "Baixar DOCX" para formato editável

### 4. Gerenciar Histórico
1. Acesse **"Meus Currículos"** no header
2. Visualize todos os currículos salvos
3. Ações disponíveis:
   - **Visualizar**: Abra o currículo no editor
   - **Duplicar**: Crie uma cópia para editar
   - **Excluir**: Remova currículos antigos
   - **Comparar**: Compare duas versões

### 5. Comparar Versões
1. Acesse **"Meus Currículos"**
2. Clique em **"Comparar Versões"**
3. Selecione duas versões para comparar
4. Visualize diferenças destacadas em cores
5. Exporte a versão desejada diretamente

### 6. Gerar Carta de Apresentação
1. Clique em **"Carta de Apresentação"** no header
2. Preencha informações da vaga:
   - Nome da empresa
   - Cargo desejado
   - Descrição da vaga
3. Selecione o idioma
4. Clique em **"Gerar Carta"**
5. Edite conforme necessário
6. Exporte em DOCX ou PDF

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** + **Express** + **tRPC**: API type-safe
- **Llama IA**: Processamento de linguagem natural
- **Drizzle ORM** + **MySQL**: Banco de dados
- **PDFKit**: Geração de PDFs
- **Docx**: Geração de DOCX
- **PDF2JSON**: Extração de texto de PDFs
- **Mammoth**: Extração de texto de DOCX
- **AWS S3**: Armazenamento de arquivos

### Frontend
- **React 19** + **TypeScript**: Interface moderna
- **Tailwind CSS 4**: Design clássico e elegante
- **shadcn/ui**: Componentes de UI
- **Wouter**: Roteamento
- **TanStack Query**: Gerenciamento de estado
- **Framer Motion**: Animações suaves
- **Date-fns**: Formatação de datas

### Testes
- **Vitest**: Framework de testes
- **36 testes automatizados** com 100% de aprovação

---

## 📊 Estatísticas do Projeto

- **Linhas de Código**: ~15.000+
- **Componentes React**: 20+
- **Endpoints tRPC**: 15+
- **Testes Automatizados**: 36 (100% passando)
- **Templates Visuais**: 5
- **Idiomas Suportados**: 3
- **Formatos de Exportação**: 2 (PDF, DOCX)

---

## 👨‍💻 Histórico de Versões

### V5.0 (Atual) - Auto-Save e Comparação de Versões
- ✨ Auto-save inteligente com debounce de 30 segundos
- ✨ Indicador visual de status de salvamento
- ✨ Backup automático com localStorage
- ✨ Comparação de versões lado a lado
- ✨ Diff visual com cores (verde/vermelho)
- ✨ Exportação direta de versões comparadas
- ✅ 36 testes automatizados passando
- 🐛 Correções de bugs e melhorias de performance

### V4.0 - Interface de Cartas e Correções
- Interface completa para geração de cartas de apresentação
- Formulário com campos para empresa, cargo e descrição da vaga
- Preview e editor inline para cartas
- Exportação de cartas em DOCX e PDF
- Correções de bugs na renderização de skills
- 30 testes automatizados passando
- Validação manual completa do fluxo

### V3.0 - Sistema de Histórico e Cartas
- Sistema completo de histórico de currículos
- Geração de cartas de apresentação com IA
- Gerenciamento de rascunhos e versões finais
- Integração entre currículos e cartas

### V2.0 - Editor e Templates
- Editor interativo com edição inline
- 5 templates visuais profissionais
- Gerenciamento avançado de seções
- Preview em tempo real
- 12 testes automatizados

### V1.0 - Base
- Geração de currículos em 3 idiomas
- 3 modelos (Reduzido, Misto, Completo)
- Processamento com Llama AI
- Exportação DOCX e PDF
- Otimização ATS

---

## 🎨 Design e UX

### Princípios de Design
- **Clássico e Elegante**: Tipografia serif, espaçamento generoso, cores neutras
- **Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Acessível**: Foco visível, navegação por teclado, contraste adequado
- **Feedback Visual**: Indicadores de loading, notificações de sucesso/erro

### Temas Visuais
1. **Clássico**: Design tradicional com serifas e layout formal
2. **Moderno**: Cores vibrantes, tipografia sans-serif, layout dinâmico
3. **Minimalista**: Clean e simples, máximo de espaço em branco
4. **Executivo**: Formal e profissional, ideal para cargos seniores
5. **Criativo**: Elementos visuais únicos, ideal para áreas criativas

---

## 🔐 Segurança e Privacidade

- **Autenticação Manus OAuth**: Login seguro
- **Dados Privados**: Currículos salvos apenas para o usuário autenticado
- **Backup Local**: localStorage como fallback (não compartilhado)
- **Upload Seguro S3**: Arquivos armazenados com chaves únicas
- **Sem Armazenamento de Senhas**: OAuth elimina necessidade de senhas

---

## 📝 Roadmap Futuro

### Funcionalidades Planejadas
- [ ] Integração OAuth oficial com LinkedIn (requer aprovação de parceiro)
- [ ] Análise de compatibilidade ATS com pontuação
- [ ] Sugestões de melhorias via IA
- [ ] Mais templates visuais (10+ opções)
- [ ] Exportação em LaTeX
- [ ] Geração de portfólio online
- [ ] Integração com plataformas de vagas (LinkedIn, Indeed, etc.)
- [ ] Análise de palavras-chave da vaga vs currículo
- [ ] Modo colaborativo (compartilhar para revisão)
- [ ] Versionamento Git-style com branches

---

## 🧪 Testes

### Executar Testes
```bash
pnpm test
```

### Cobertura de Testes
- ✅ Autenticação e logout
- ✅ Processamento de currículos
- ✅ Geração de currículos (3 modelos, 3 idiomas)
- ✅ Exportação PDF e DOCX
- ✅ Histórico de currículos
- ✅ Geração de cartas de apresentação
- ✅ Editor de seções
- ✅ Comparação de versões
- ✅ Auto-save e recuperação
- ✅ Endpoints de API

**Total**: 36 testes | 100% passando ✅

---

## 📄 Licença

MIT License - Sinta-se livre para usar, modificar e distribuir.

---

## 👨‍💻 Desenvolvido por

**Manus AI** - Plataforma de Geração de Currículos Profissionais

Powered by **Llama AI** 🦙

---

## 🙏 Agradecimentos

- **Llama AI** pela tecnologia de processamento de linguagem natural
- **shadcn/ui** pelos componentes de UI elegantes
- **Manus Platform** pela infraestrutura e autenticação
- **Comunidade Open Source** pelas bibliotecas incríveis

---

**Versão**: 5.0.0  
**Última Atualização**: Dezembro 2025  
**Status**: ✅ Produção
