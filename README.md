# 🎓 Gerador de Currículos IA

Uma plataforma web completa para geração de currículos profissionais otimizados, powered by Llama AI. Crie currículos em três idiomas (Português, Inglês e Espanhol) e três formatos diferentes (Reduzido, Misto e Completo), todos otimizados para ATS (Applicant Tracking Systems) e sistemas de IA de recrutamento.

## ✨ Funcionalidades

### 💾 Sistema de Histórico e Gerenciamento (V3.0 - NOVO!)
- **Histórico Completo**: Visualize todos os seus currículos salvos em uma galeria organizada
- **Gerenciamento de Rascunhos**: Salve versões em progresso e finalize quando estiver pronto
- **Recuperação Rápida**: Carregue currículos anteriores para editar ou duplicar
- **Organização Inteligente**: Ordenação automática por data de atualização
- **Exclusão Segura**: Remova currículos que não precisa mais

### ✉️ Geração de Cartas de Apresentação (V3.0 - NOVO!)
- **Geração Personalizada com IA**: Crie cartas customizadas para cada vaga usando Llama AI
- **Integração com Currículo**: Usa automaticamente os dados do seu currículo
- **Informações da Vaga**: Adicione empresa, cargo e descrição para personalização máxima
- **3 Idiomas**: Gere cartas em Português, Inglês ou Espanhol
- **Otimização ATS**: Cartas com palavras-chave da descrição da vaga
- **Exportação**: Baixe em DOCX ou PDF

### 🎨 Editor Interativo (V2.0)
- **Edição Inline**: Edite qualquer campo diretamente no preview
- **Gerenciamento de Seções**: Adicione, remova ou reordene seções
- **Templates Pré-definidos**: Projetos, Publicações, Voluntáriado e mais
- **Drag-and-Drop**: Reordene seções facilmente
- **Validação em Tempo Real**: Feedback instantâneo durante edição

### 🎨 5 Templates Visuais Profissionais (V2.0)
- **Clássico**: Design tradicional e atemporal
- **Moderno**: Cores vibrantes para startups e tech
- **Minimalista**: Clean e focado no conteúdo
- **Executivo**: Formal e sofisticado para liderança
- **Criativo**: Design ousado para profissionais criativos

### 🤖 Processamento Inteligente com IA
- **Extração Automática**: Processa informações de currículos anteriores (PDF/DOCX) e perfis do LinkedIn
- **Análise com Llama AI**: Utiliza inteligência artificial para estruturar e organizar dados profissionais
- **Otimização ATS**: Currículos formatados para máxima compatibilidade com sistemas de rastreamento

### 🌍 Suporte Multilíngue
- **Português**: Tradução natural e profissional
- **English**: Professional translation and formatting
- **Español**: Traducción profesional y natural

### 📄 Três Modelos de Currículo

#### 1. Reduzido
- Informações essenciais
- Formato de 1 página
- Ideal para candidaturas rápidas e networking

#### 2. Misto
- Últimas 2 experiências com detalhes completos
- Outras experiências resumidas
- 1-2 páginas
- Balanceado entre detalhes e concisão

#### 3. Completo
- Todas as experiências detalhadas
- Histórico educacional completo
- Projetos, certificações e seções adicionais
- 2-3 páginas
- Ideal para posições seniores

### 📥 Exportação Profissional
- **DOCX**: Formato editável para ajustes finais
- **PDF**: Pronto para envio imediato

### 🎨 Design Clássico e Elegante
- Interface moderna e intuitiva
- Tipografia profissional (Playfair Display + Inter)
- Preview em tempo real
- Responsivo para todos os dispositivos

## 🚀 Como Usar

### 1. Forneça suas Informações
- Escreva um prompt descrevendo sua experiência profissional
- Cole a URL do seu perfil do LinkedIn (opcional)
- Faça upload de currículos anteriores em PDF ou DOCX (opcional)

### 2. Processamento Inteligente
- A IA analisa todas as informações fornecidas
- Extrai dados relevantes automaticamente
- Estrutura seu histórico profissional de forma otimizada

### 3. Escolha Modelo e Idioma
- Selecione entre Reduzido, Misto ou Completo
- Escolha o idioma: Português, Inglês ou Espanhol
- Gere o currículo com um clique

### 4. Preview e Exportação
- Visualize o currículo gerado
- Faça ajustes se necessário
- Exporte em DOCX ou PDF

## 👨‍💻 Histórico de Versões

### V4.0 (Atual) - Interface de Cartas e Correções
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

## 🛠️ Tecnologias

### Backend
- **Node.js + Express**: Servidor robusto e escalável
- **tRPC**: Type-safe API com TypeScript end-to-end
- **Llama AI**: Processamento de linguagem natural
- **Drizzle ORM**: Gerenciamento de banco de dados
- **MySQL/TiDB**: Armazenamento de dados

### Frontend
- **React 19**: Interface moderna e reativa
- **TypeScript**: Type safety em todo o código
- **Tailwind CSS 4**: Estilização elegante e responsiva
- **Wouter**: Roteamento leve e eficiente
- **shadcn/ui**: Componentes UI de alta qualidade

### Processamento de Documentos
- **pdf2json**: Extração de texto de PDFs
- **mammoth**: Extração de texto de DOCX
- **docx**: Geração de arquivos DOCX
- **pdfkit**: Geração de arquivos PDF

### Infraestrutura
- **AWS S3**: Armazenamento de arquivos
- **Manus OAuth**: Autenticação segura
- **Vitest**: Testes automatizados

## 📋 Estrutura do Projeto

```
curriculum_generator/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── pages/         # Páginas da aplicação
│   │   │   ├── Home.tsx   # Landing page
│   │   │   └── Generator.tsx  # Gerador de currículos
│   │   ├── components/    # Componentes reutilizáveis
│   │   └── lib/          # Utilitários e configurações
├── server/                # Backend Node.js
│   ├── routers.ts        # Endpoints tRPC
│   ├── resumeProcessor.ts # Processamento com IA
│   ├── fileProcessor.ts  # Extração de texto
│   ├── documentExporter.ts # Geração de documentos
│   └── *.test.ts         # Testes automatizados
├── drizzle/              # Schema e migrações do DB
└── shared/               # Tipos e constantes compartilhadas
```

## 🎯 Otimização para ATS

Os currículos gerados seguem as melhores práticas para compatibilidade com ATS:

- ✅ Estrutura clara e hierárquica
- ✅ Seções com nomes padronizados
- ✅ Formatação simples e legível
- ✅ Palavras-chave relevantes
- ✅ Datas em formato consistente
- ✅ Sem elementos gráficos complexos
- ✅ Fonte legível e profissional

## 🔒 Segurança e Privacidade

- Autenticação via OAuth
- Dados processados de forma segura
- Arquivos armazenados temporariamente
- Sem persistência de dados sensíveis em longo prazo

## 🧪 Testes

Execute os testes automatizados:

```bash
pnpm test
```

## 📝 Licença

MIT License - Sinta-se livre para usar e modificar este projeto.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## 💡 Sobre

Desenvolvido com ❤️ usando Llama AI e as melhores práticas de desenvolvimento web moderno.

---

**Powered by Llama AI** 🦙
