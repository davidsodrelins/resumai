# 🎓 Gerador de Currículos IA

Uma plataforma web completa para geração de currículos profissionais otimizados, powered by Llama AI. Crie currículos em três idiomas (Português, Inglês e Espanhol) e três formatos diferentes (Reduzido, Misto e Completo), todos otimizados para ATS (Applicant Tracking Systems) e sistemas de IA de recrutamento.

## ✨ Funcionalidades

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
