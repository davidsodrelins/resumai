# 🎓 Gerador de Currículos IA V8.5

> Plataforma completa para criação, otimização e análise de currículos profissionais powered by Llama AI

## ✨ Funcionalidades Principais

### 🤖 Geração Inteligente de Currículos
A plataforma processa múltiplas fontes de dados simultaneamente, incluindo perfis do LinkedIn, currículos anteriores em PDF ou DOCX e prompts personalizados do usuário. O sistema oferece três modelos profissionais adaptados a diferentes necessidades: o modelo Reduzido para aplicações rápidas com informações essenciais, o modelo Misto que detalha completamente as duas últimas experiências profissionais e o modelo Completo que apresenta todo o histórico disponível. Todos os currículos são gerados em três idiomas (Português, Inglês e Espanhol) com tradução automática contextualizada e podem ser personalizados com cinco templates visuais distintos: Clássico, Moderno, Minimalista, Executivo e Criativo.

### 📊 Análise e Otimização ATS
O sistema implementa um scanner completo que analisa a compatibilidade do currículo com sistemas de rastreamento de candidatos (ATS), fornecendo uma pontuação de 0 a 100 baseada em múltiplos critérios técnicos. Um badge visual exibe a pontuação em tempo real durante a edição, permitindo que o usuário veja imediatamente o impacto de suas mudanças. As sugestões de melhoria são categorizadas em três níveis de prioridade (críticas, importantes e opcionais), cada uma com explicação detalhada do impacto esperado. A funcionalidade de otimização automática permite aplicar todas as sugestões de alto impacto com um único clique, transformando o currículo em minutos.

### 🎯 Análise de Soft Skills com IA
O módulo de soft skills utiliza processamento de linguagem natural para identificar automaticamente habilidades comportamentais presentes no currículo atual. Com base em um banco de dados especializado por cargo e área de atuação (desenvolvedor, gerente, designer, vendas, marketing), o sistema sugere soft skills relevantes que estão ausentes. Para cada sugestão, o Llama IA gera exemplos contextualizados específicos do perfil do usuário, demonstrando como evidenciar aquela habilidade nas experiências profissionais. A interface visual apresenta um gráfico de cobertura (coverage score de 0-100), cards expansíveis para cada sugestão com preview do texto e botões de aplicação que inserem o conteúdo diretamente nas seções apropriadas do currículo.

### 🔍 Análise de Palavras-Chave
A ferramenta compara a descrição de uma vaga específica com o conteúdo do currículo, extraindo palavras-chave relevantes de ambos os documentos. O sistema calcula um percentual de compatibilidade baseado na presença dessas palavras-chave e destaca visualmente quais termos estão presentes (verde) e quais estão ausentes (vermelho). Para cada palavra-chave ausente, o sistema sugere contextos específicos onde ela poderia ser inserida naturalmente, aumentando o match sem comprometer a autenticidade do documento.

### 🎨 Editor Interativo
O editor permite modificar qualquer campo do currículo diretamente no preview, com atualização instantânea das mudanças. O sistema de gerenciamento de seções suporta adicionar, remover e reordenar elementos através de drag-and-drop intuitivo. Templates pré-definidos facilitam a inclusão de seções especializadas como Projetos, Publicações, Voluntariado, Certificações e Prêmios. O preview em tempo real mostra exatamente como o currículo aparecerá no formato final, incluindo o badge de pontuação ATS que reflete o impacto de cada edição.

### 💾 Sistema de Histórico e Auto-Save
O sistema implementa salvamento automático a cada 30 segundos durante a edição, com indicador visual mostrando o status ("Salvando...", "Salvo com sucesso"). Um fallback com localStorage garante que nenhum trabalho seja perdido mesmo em caso de falha de conexão. A galeria de versões permite acessar todos os currículos gerados anteriormente, cada um com thumbnail, data de criação e metadados. A funcionalidade de comparação de versões exibe dois currículos lado a lado, destacando diferenças em cores (verde para adições, vermelho para remoções), permitindo rastrear a evolução do documento ao longo do tempo.

### 📄 Exportação Profissional Multi-Formato
O sistema oferece três formatos de exportação otimizados para diferentes casos de uso. O formato PDF fornece um documento universal com design profissional, ideal para envio direto a recrutadores. O formato DOCX permite edição posterior no Microsoft Word, útil quando o candidato precisa fazer ajustes manuais específicos. O formato LaTeX inclui metadados ocultos (palavras-chave, frases de impacto, anos de experiência) em comentários que são invisíveis na versão impressa mas podem ser lidos por sistemas de IA de recrutamento, maximizando as chances de aprovação em triagens automatizadas.

### ✉️ Cartas de Apresentação Inteligentes
O gerador de cartas utiliza os dados do currículo combinados com informações da vaga (empresa, cargo, descrição) para criar cartas personalizadas via Llama IA. As cartas são geradas nos três idiomas suportados (Português, Inglês, Espanhol) e podem ser editadas inline antes da exportação. O sistema mantém consistência visual com os templates do currículo e oferece exportação em PDF e DOCX. As cartas incluem automaticamente informações relevantes como disponibilidade para trabalho remoto, visto de nômade digital e experiência internacional quando aplicável.

## 🚀 Stack Tecnológica

A aplicação foi construída utilizando React 19 com Tailwind CSS 4 e componentes shadcn/ui no frontend, garantindo uma interface moderna e responsiva. O backend utiliza Express 4 com tRPC 11 para type-safety end-to-end, eliminando a necessidade de manter contratos de API separados. O Drizzle ORM gerencia as interações com o banco de dados MySQL/TiDB, enquanto a autenticação é realizada através do Manus OAuth. O armazenamento de arquivos utiliza AWS S3 e a geração de documentos é feita com pdfkit, docx e LaTeX. A inteligência artificial é fornecida pelo Llama através da Manus Forge API.

## 📈 Métricas do Projeto

O projeto conta com 48 testes automatizados passando com 100% de sucesso, garantindo a qualidade e estabilidade do código. Foram desenvolvidas 8 versões iterativas ao longo do processo de desenvolvimento, cada uma adicionando funcionalidades significativas. A plataforma oferece mais de 15 funcionalidades principais implementadas e testadas, com 3 formatos de exportação (PDF, DOCX, LaTeX), 5 templates visuais profissionais e suporte completo para 3 idiomas.

## 🎯 Casos de Uso Reais

Profissionais em transição de carreira podem criar currículos otimizados para novas áreas, utilizando a análise de soft skills para destacar habilidades transferíveis. Candidatos internacionais se beneficiam da geração automática em múltiplos idiomas, mantendo consistência profissional em todas as versões. A otimização para ATS aumenta significativamente as chances de passar por sistemas automáticos, especialmente importante em grandes empresas. Freelancers podem manter múltiplas versões otimizadas para diferentes tipos de cliente, alternando entre templates e modelos conforme necessário. Recém-formados conseguem destacar soft skills e projetos acadêmicos relevantes mesmo com pouca experiência profissional formal.

## 🔮 Roadmap de Desenvolvimento

### Em Desenvolvimento
- Gerador de portfolio web automático com hospedagem no Manus Space
- Job board scraper com matching inteligente e envio automático de vagas
- Sistema de notificações para novas oportunidades compatíveis

### Planejadas para Próximas Versões
- Aplicação automática em vagas compatíveis via integração com LinkedIn e Indeed
- Analytics de visualizações e engajamento do portfolio publicado
- Sistema de recomendação de vagas baseado em machine learning
- Integração com calendário para agendamento de entrevistas

## 📝 Guia de Uso Rápido

O fluxo de trabalho começa com a autenticação através da conta Manus. Após o login, clique em "Criar Currículo" e forneça suas informações através de texto livre, URL do LinkedIn ou upload de currículos anteriores. Escolha entre os modelos Reduzido, Misto ou Completo e selecione o idioma desejado. O sistema processará as informações e gerará o currículo automaticamente. Utilize a página de análise para ver a pontuação ATS e sugestões de melhorias, aplicando as recomendações conforme necessário. Acesse a análise de soft skills para identificar habilidades comportamentais que podem fortalecer seu perfil. Use o editor interativo para ajustes finais e personalizações específicas. Por fim, exporte o currículo no formato desejado (PDF, DOCX ou LaTeX) e, se necessário, gere uma carta de apresentação personalizada para a vaga.

## 🏆 Diferenciais Competitivos

A plataforma se destaca pela otimização completa para ATS, garantindo que os currículos gerados passem por sistemas automáticos de triagem. Os metadados ocultos no formato LaTeX incluem palavras-chave invisíveis especificamente projetadas para leitura por IA de recrutamento, aumentando as chances de seleção sem comprometer a estética do documento. As sugestões contextualizadas geradas por IA entendem o perfil específico do usuário e fornecem melhorias personalizadas, não genéricas. O sistema de auto-save garante que nenhum trabalho seja perdido, enquanto o histórico completo permite acessar e comparar todas as versões anteriores. A análise de soft skills com exemplos práticos ajuda a evidenciar habilidades comportamentais de forma concreta e convincente.

## 📊 Critérios de Qualidade

A pontuação ATS de 0 a 100 é calculada baseada em múltiplos critérios incluindo formatação adequada, presença de seções padrão, densidade de palavras-chave, uso de verbos de ação e ausência de elementos problemáticos como tabelas ou gráficos. O coverage de soft skills mede o percentual de habilidades comportamentais relevantes presentes no currículo comparado com o conjunto ideal para a área de atuação. O match de palavras-chave calcula a compatibilidade entre o currículo e a descrição de uma vaga específica, indicando a probabilidade de aprovação. A densidade de informação analisa o uso de verbos de ação fortes e quantificação de resultados, elementos que aumentam significativamente o impacto do documento.

## 🎓 Arquitetura e Boas Práticas

O projeto foi desenvolvido seguindo as melhores práticas de engenharia de software moderna. A arquitetura tRPC garante type-safety completo do backend ao frontend, eliminando erros de contrato de API em tempo de compilação. Os 48 testes automatizados com Vitest cobrem funcionalidades críticas e garantem que mudanças não introduzam regressões. O sistema de CI/CD com checkpoints versionados permite rollback seguro para qualquer versão anterior. O design system consistente baseado em shadcn/ui mantém coerência visual em toda a aplicação. Otimizações de performance incluem lazy loading de componentes, debounce em operações de salvamento e caching inteligente de resultados de análise.

---

**Versão**: 8.5  
**Status**: Em Desenvolvimento Ativo  
**Última Atualização**: Janeiro 2025  
**Testes**: 48/48 passando (100%)  
**Linhas de Código**: ~15.000+  
**Componentes React**: 25+  
**Endpoints tRPC**: 30+
