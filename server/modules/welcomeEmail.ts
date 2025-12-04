import { notifyOwner } from "../_core/notification";

/**
 * Escape HTML special characters to prevent XSS
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Template HTML para email de boas-vindas
 */
function getWelcomeEmailTemplate(userName: string): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bem-vindo ao ResumAI</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 40px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 32px;
      font-weight: bold;
      color: #2563eb;
      margin-bottom: 10px;
    }
    h1 {
      color: #1f2937;
      font-size: 24px;
      margin-bottom: 20px;
    }
    .highlight {
      background-color: #eff6ff;
      border-left: 4px solid #2563eb;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .features {
      margin: 25px 0;
    }
    .feature-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 15px;
    }
    .feature-icon {
      font-size: 20px;
      margin-right: 10px;
      min-width: 30px;
    }
    .cta-button {
      display: inline-block;
      background-color: #2563eb;
      color: #ffffff;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 6px;
      font-weight: 600;
      text-align: center;
      margin: 25px 0;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      font-size: 14px;
      color: #6b7280;
    }
    .support-info {
      background-color: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">📄 ResumAI</div>
      <p style="color: #6b7280; margin: 0;">Gerador de Currículos com Inteligência Artificial</p>
    </div>

    <h1>Olá, ${escapeHtml(userName)}! 👋</h1>

    <p>Seja muito bem-vindo(a) ao <strong>ResumAI</strong>! Estamos muito felizes em ter você conosco.</p>

    <p>Você acabou de dar o primeiro passo para criar currículos profissionais que se destacam. Nossa plataforma usa inteligência artificial para transformar suas experiências em documentos otimizados que passam pelos sistemas ATS (Applicant Tracking Systems) das empresas.</p>

    <div class="highlight">
      <strong>🎁 Seu Plano Gratuito Inclui:</strong>
      <ul style="margin: 10px 0; padding-left: 20px;">
        <li><strong>5 currículos por mês</strong> - Renova automaticamente a cada 30 dias</li>
        <li><strong>3 idiomas</strong> - Português, Inglês e Espanhol</li>
        <li><strong>5 templates visuais</strong> - Clássico, Moderno, Minimalista, Executivo, Criativo</li>
        <li><strong>Análise ATS</strong> - Pontuação de compatibilidade com sistemas de recrutamento</li>
        <li><strong>Sugestões de IA</strong> - Melhorias automáticas para aumentar suas chances</li>
        <li><strong>Exportação múltipla</strong> - PDF, DOCX e LaTeX</li>
      </ul>
    </div>

    <div class="features">
      <h3 style="color: #1f2937; margin-bottom: 15px;">O que você pode fazer agora:</h3>
      
      <div class="feature-item">
        <span class="feature-icon">🚀</span>
        <div>
          <strong>Criar seu primeiro currículo</strong><br>
          <span style="color: #6b7280; font-size: 14px;">Faça upload de um currículo existente ou insira suas informações manualmente</span>
        </div>
      </div>

      <div class="feature-item">
        <span class="feature-icon">📊</span>
        <div>
          <strong>Analisar compatibilidade ATS</strong><br>
          <span style="color: #6b7280; font-size: 14px;">Veja sua pontuação de 0-100 e receba sugestões específicas de melhoria</span>
        </div>
      </div>

      <div class="feature-item">
        <span class="feature-icon">🌐</span>
        <div>
          <strong>Gerar portfolio web</strong><br>
          <span style="color: #6b7280; font-size: 14px;">Transforme seu currículo em um site profissional hospedado gratuitamente</span>
        </div>
      </div>

      <div class="feature-item">
        <span class="feature-icon">💌</span>
        <div>
          <strong>Criar cartas de apresentação</strong><br>
          <span style="color: #6b7280; font-size: 14px;">Gere cartas personalizadas para cada vaga com base no seu currículo</span>
        </div>
      </div>
    </div>

    <div style="text-align: center;">
      <a href="https://resumai.manus.space/generator" class="cta-button">
        ✨ Criar Meu Primeiro Currículo
      </a>
    </div>

    <div class="support-info">
      <strong>💝 Quer currículos ilimitados?</strong><br>
      Apoie o projeto com uma doação a partir de R$ 5 e ganhe acesso ilimitado + badge especial de apoiador!
    </div>

    <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
      <strong>Dica:</strong> Comece fazendo upload de um currículo existente (PDF ou DOCX) para que a IA extraia automaticamente suas informações. Depois, você pode editar e melhorar tudo diretamente na plataforma.
    </p>

    <div class="footer">
      <p>Precisa de ajuda? Visite nossa <a href="https://resumai.manus.space/resources" style="color: #2563eb;">página de recursos</a></p>
      <p style="margin-top: 10px;">
        Feito com ❤️ e ☕ por David Sodré<br>
        <a href="https://github.com/davidsodrelins/resumai" style="color: #2563eb;">GitHub</a> • 
        <a href="https://resumai.manus.space" style="color: #2563eb;">ResumAI</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Envia email de boas-vindas para novo usuário
 * Usa o sistema de notificações do Manus para enviar para o owner
 * (Em produção, isso seria substituído por um serviço de email real)
 */
export async function sendWelcomeEmail(userName: string, userEmail: string): Promise<boolean> {
  try {
    const emailContent = getWelcomeEmailTemplate(userName);
    
    // Por enquanto, notifica o owner sobre novo signup
    // Em produção, isso seria substituído por SendGrid, AWS SES, etc.
    const success = await notifyOwner({
      title: `🎉 Novo usuário cadastrado: ${userName}`,
      content: `
**Email:** ${userEmail}
**Nome:** ${userName}
**Data:** ${new Date().toLocaleString('pt-BR')}

Um email de boas-vindas foi preparado para o usuário.

---

**Preview do Email:**

${emailContent.substring(0, 500)}...

---

**Próximos passos:**
1. Integrar com serviço de email real (SendGrid, AWS SES, etc.)
2. Configurar templates de email no serviço escolhido
3. Adicionar tracking de abertura e cliques
      `.trim(),
    });

    if (success) {
      console.log(`[WelcomeEmail] Notificação de novo usuário enviada: ${userEmail}`);
    } else {
      console.warn(`[WelcomeEmail] Falha ao enviar notificação para: ${userEmail}`);
    }

    return success;
  } catch (error) {
    console.error("[WelcomeEmail] Erro ao enviar email de boas-vindas:", error);
    return false;
  }
}

/**
 * Prepara dados do email de boas-vindas (para testes ou preview)
 */
export function getWelcomeEmailData(userName: string) {
  return {
    subject: `Bem-vindo ao ResumAI, ${userName}! 🎉`,
    html: getWelcomeEmailTemplate(userName),
    text: `
Olá, ${userName}!

Seja muito bem-vindo(a) ao ResumAI!

Você acabou de dar o primeiro passo para criar currículos profissionais que se destacam.

SEU PLANO GRATUITO INCLUI:
- 5 currículos por mês (renova automaticamente)
- 3 idiomas (Português, Inglês, Espanhol)
- 5 templates visuais
- Análise ATS com pontuação
- Sugestões de IA
- Exportação em PDF, DOCX e LaTeX

COMECE AGORA:
1. Criar seu primeiro currículo
2. Analisar compatibilidade ATS
3. Gerar portfolio web
4. Criar cartas de apresentação

Acesse: https://resumai.manus.space/generator

Precisa de ajuda? Visite: https://resumai.manus.space/resources

Feito com ❤️ e ☕ por David Sodré
    `.trim(),
  };
}
