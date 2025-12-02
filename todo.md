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
- [ ] Implementar editor interativo de seções
- [ ] Adicionar funcionalidade de adicionar/remover seções customizadas
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
- [ ] Implementar auto-save de rascunhos
- [ ] Adicionar histórico de currículos gerados
- [x] Melhorar mensagens de erro e validação
