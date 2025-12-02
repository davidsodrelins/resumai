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
- [ ] Testar editor interativo
- [x] Validar responsividade em diferentes dispositivos

## Documentação e Deploy
- [ ] Criar checkpoint para publicação
- [ ] Preparar README.md detalhado
- [ ] Publicar no repositório GitHub
- [ ] Documentar API endpoints
