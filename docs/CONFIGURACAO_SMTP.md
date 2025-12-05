# Configuração SMTP - ResumAI

**Servidor:** resumai.davidsodre.com  
**Data:** 05 de dezembro de 2024

---

## Credenciais do Servidor de Email

Seu servidor Plesk já possui um servidor de email configurado. Use as seguintes credenciais:

| Parâmetro | Valor |
|-----------|-------|
| **Host SMTP** | `resumai.davidsodre.com` |
| **Porta SMTP** | `465` (SSL/TLS) |
| **Usuário** | `news@resumai.davidsodre.com` |
| **Senha** | `Intel23!!` |
| **Protocolo** | SSL/TLS (porta 465) |
| **Nome do Remetente** | ResumAI |
| **Email do Remetente** | news@resumai.davidsodre.com |

---

## Configuração no .env

Adicione as seguintes linhas ao arquivo `.env` na raiz do projeto:

```bash
# SMTP Configuration
SMTP_HOST=resumai.davidsodre.com
SMTP_PORT=465
SMTP_USER=news@resumai.davidsodre.com
SMTP_PASS=Intel23!!
SMTP_SECURE=true
SMTP_FROM_NAME=ResumAI
SMTP_FROM_EMAIL=news@resumai.davidsodre.com
```

---

## Diferença entre Portas SMTP

| Porta | Protocolo | Quando Usar | Configuração |
|-------|-----------|-------------|--------------|
| **465** | SSL/TLS | Recomendado para produção | `SMTP_SECURE=true` |
| **587** | STARTTLS | Alternativa (Gmail, SendGrid) | `SMTP_SECURE=false` |
| **25** | Sem criptografia | **NÃO USE** (inseguro) | - |

**Recomendação:** Use porta **465** com `SMTP_SECURE=true` para máxima segurança.

---

## Testar Configuração SMTP

### Opção 1: Via Node.js (Recomendado)

Crie um arquivo `test-smtp.mjs` na raiz do projeto:

```javascript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  host: 'resumai.davidsodre.com',
  port: 465,
  secure: true, // SSL/TLS
  auth: {
    user: 'news@resumai.davidsodre.com',
    pass: 'Intel23!!'
  }
});

async function testEmail() {
  try {
    const info = await transporter.sendMail({
      from: '"ResumAI" <news@resumai.davidsodre.com>',
      to: 'davidsodre_ba@hotmail.com', // Seu email pessoal
      subject: 'Teste de Configuração SMTP',
      text: 'Se você recebeu este email, o SMTP está configurado corretamente!',
      html: '<b>Se você recebeu este email, o SMTP está configurado corretamente!</b>'
    });

    console.log('✅ Email enviado com sucesso!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
  }
}

testEmail();
```

Execute o teste:

```bash
node test-smtp.mjs
```

### Opção 2: Via Telnet (Avançado)

```bash
# Testar conexão na porta 465
telnet resumai.davidsodre.com 465

# Se conectar com sucesso, pressione Ctrl+C para sair
```

### Opção 3: Via Aplicação

Após configurar o `.env`, teste usando a funcionalidade de recuperação de senha:

1. Acesse `https://resumai.davidsodre.com/forgot-password`
2. Digite seu email: `davidsodre_ba@hotmail.com`
3. Clique em "Enviar Link de Redefinição"
4. Verifique sua caixa de entrada

---

## Solução de Problemas Comuns

### Erro: "Connection timeout"

**Causa:** Firewall bloqueando porta 465

**Solução:**
```bash
# Verificar se a porta está aberta
sudo ufw status

# Permitir porta 465 (se necessário)
sudo ufw allow 465/tcp
```

### Erro: "Authentication failed"

**Causa:** Credenciais incorretas ou conta de email não existe

**Solução:**
1. Verifique se o email `news@resumai.davidsodre.com` existe no Plesk
2. Confirme a senha: `Intel23!!`
3. Verifique se não há espaços extras no `.env`

### Erro: "Certificate error" ou "SSL error"

**Causa:** Certificado SSL do servidor de email inválido

**Solução:**
Adicione ao código do nodemailer:

```javascript
const transporter = nodemailer.createTransporter({
  host: 'resumai.davidsodre.com',
  port: 465,
  secure: true,
  auth: {
    user: 'news@resumai.davidsodre.com',
    pass: 'Intel23!!'
  },
  tls: {
    rejectUnauthorized: false // Apenas para desenvolvimento
  }
});
```

**Nota:** Em produção, é melhor corrigir o certificado SSL ao invés de desabilitar a verificação.

### Emails caem na pasta de SPAM

**Causa:** Falta de registros SPF, DKIM e DMARC

**Solução:**

1. **Configurar SPF** (no DNS do domínio):
```
Tipo: TXT
Nome: @
Valor: v=spf1 a mx ip4:SEU_IP_SERVIDOR ~all
```

2. **Configurar DKIM** (no Plesk):
   - Vá para **Mail Settings** → **DKIM**
   - Clique em **Enable**
   - Copie o registro TXT gerado e adicione ao DNS

3. **Configurar DMARC** (no DNS do domínio):
```
Tipo: TXT
Nome: _dmarc
Valor: v=DMARC1; p=quarantine; rua=mailto:news@resumai.davidsodre.com
```

---

## Verificar Logs de Email no Plesk

Para debugar problemas de envio:

1. Acesse o Plesk
2. Vá para **Tools & Settings** → **Logs**
3. Selecione **Mail Log**
4. Filtre por data/hora do teste
5. Procure por erros ou mensagens relacionadas

---

## Alternativas ao Servidor Próprio

Se o servidor de email do Plesk apresentar problemas, considere usar serviços externos:

### SendGrid (Recomendado para Produção)

**Vantagens:**
- 100 emails/dia gratuitos
- Alta deliverability
- Dashboard com métricas

**Configuração:**
```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SUA_API_KEY_SENDGRID
SMTP_SECURE=false
```

### Gmail (Apenas para Testes)

**Vantagens:**
- Fácil de configurar
- 500 emails/dia

**Configuração:**
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=senha_de_app_16_caracteres
SMTP_SECURE=false
```

**Nota:** Requer habilitar "App Passwords" no Google Account.

### Amazon SES (Melhor Custo-Benefício)

**Vantagens:**
- 62.000 emails/mês gratuitos (primeiro ano)
- Muito barato após free tier
- Alta confiabilidade

**Configuração:**
```bash
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=SEU_SMTP_USERNAME
SMTP_PASS=SEU_SMTP_PASSWORD
SMTP_SECURE=false
```

---

## Checklist de Configuração

Antes de considerar o SMTP configurado, verifique:

- [ ] Credenciais adicionadas ao `.env`
- [ ] Porta 465 aberta no firewall
- [ ] Email de teste enviado com sucesso
- [ ] Email de teste recebido (verifique SPAM)
- [ ] Funcionalidade de recuperação de senha testada
- [ ] Registros SPF/DKIM/DMARC configurados (opcional mas recomendado)
- [ ] Logs do Plesk verificados (sem erros)

---

## Próximos Passos

Após configurar o SMTP:

1. **Testar todos os fluxos de email:**
   - Recuperação de senha
   - Email de boas-vindas (signup)
   - Notificações de doação
   - Emails administrativos

2. **Monitorar deliverability:**
   - Verificar taxa de entrega
   - Monitorar emails que caem em SPAM
   - Ajustar SPF/DKIM/DMARC se necessário

3. **Configurar templates de email:**
   - Personalizar design dos emails
   - Adicionar logo da empresa
   - Incluir links de redes sociais

---

**Documento criado por:** Manus AI  
**Última atualização:** 05 de dezembro de 2024
