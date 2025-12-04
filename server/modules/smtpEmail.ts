import nodemailer from "nodemailer";
import { ENV } from "../_core/env";

/**
 * SMTP Email Configuration
 * Configure estas variáveis de ambiente:
 * - SMTP_HOST: servidor SMTP (ex: smtp.gmail.com)
 * - SMTP_PORT: porta SMTP (ex: 587)
 * - SMTP_USER: usuário/email
 * - SMTP_PASS: senha ou app password
 * - SMTP_FROM: email de origem (ex: noreply@resumai.com)
 */

let transporter: nodemailer.Transporter | null = null;

/**
 * Inicializa o transporter SMTP
 */
function getTransporter(): nodemailer.Transporter {
  if (transporter) {
    return transporter;
  }

  // Verificar se SMTP está configurado
  if (!ENV.smtpHost || !ENV.smtpPort || !ENV.smtpUser || !ENV.smtpPass) {
    console.warn(
      "[SMTP] Variáveis de ambiente SMTP não configuradas. Emails serão apenas logados."
    );
    // Retornar um transporter fake para desenvolvimento
    return createFakeTransporter();
  }

  transporter = nodemailer.createTransport({
    host: ENV.smtpHost,
    port: ENV.smtpPort,
    secure: ENV.smtpPort === 465, // true for 465, false for other ports
    auth: {
      user: ENV.smtpUser,
      pass: ENV.smtpPass,
    },
  });

  return transporter;
}

/**
 * Cria um transporter fake para desenvolvimento (apenas loga emails)
 */
function createFakeTransporter(): nodemailer.Transporter {
  return {
    sendMail: async (mailOptions: any) => {
      console.log("[SMTP-DEV] Email que seria enviado:");
      console.log("  Para:", mailOptions.to);
      console.log("  Assunto:", mailOptions.subject);
      console.log("  Corpo (primeiras 200 chars):", mailOptions.html?.substring(0, 200));
      return { messageId: `dev-${Date.now()}` };
    },
  } as any;
}

/**
 * Interface para opções de email
 */
export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

/**
 * Envia email via SMTP
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const transporter = getTransporter();
    const from = ENV.smtpFrom || "noreply@resumai.com";

    const result = await transporter.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo || from,
    });

    console.log(`[SMTP] Email enviado com sucesso: ${result.messageId}`);
    return true;
  } catch (error) {
    console.error("[SMTP] Erro ao enviar email:", error);
    return false;
  }
}

/**
 * Envia email de boas-vindas
 */
export async function sendWelcomeEmailSMTP(
  userEmail: string,
  userName: string,
  htmlTemplate: string
): Promise<boolean> {
  return sendEmail({
    to: userEmail,
    subject: `Bem-vindo ao ResumAI, ${userName}! 🎉`,
    html: htmlTemplate,
    text: `Bem-vindo ao ResumAI, ${userName}!\n\nVocê foi cadastrado com sucesso. Acesse https://resumai.manus.space para começar a criar seus currículos.`,
  });
}

/**
 * Envia email de recuperação de senha
 */
export async function sendPasswordResetEmailSMTP(
  userEmail: string,
  userName: string,
  resetLink: string
): Promise<boolean> {
  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Redefinir Senha - ResumAI</title>
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
    .warning {
      background-color: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
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
    .code {
      background-color: #f3f4f6;
      padding: 15px;
      border-radius: 4px;
      font-family: monospace;
      word-break: break-all;
      margin: 15px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">📄 ResumAI</div>
    </div>

    <h1>Redefinir Sua Senha</h1>

    <p>Olá, ${userName}!</p>

    <p>Recebemos uma solicitação para redefinir a senha da sua conta ResumAI.</p>

    <div class="warning">
      <strong>⏰ Este link expira em 15 minutos</strong><br>
      Se você não solicitou esta alteração, ignore este email e sua senha permanecerá segura.
    </div>

    <p>Para redefinir sua senha, clique no botão abaixo:</p>

    <div style="text-align: center;">
      <a href="${resetLink}" class="cta-button">
        🔐 Redefinir Minha Senha
      </a>
    </div>

    <p>Ou copie e cole este link no seu navegador:</p>
    <div class="code">${resetLink}</div>

    <p style="color: #6b7280; font-size: 14px;">
      <strong>Dica de segurança:</strong> Nunca compartilhe este link com outras pessoas. O ResumAI nunca pedirá sua senha por email.
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

  return sendEmail({
    to: userEmail,
    subject: "Redefinir sua senha - ResumAI",
    html,
    text: `Redefinir Senha\n\nOlá, ${userName}!\n\nClique no link abaixo para redefinir sua senha (válido por 15 minutos):\n\n${resetLink}\n\nSe você não solicitou isto, ignore este email.`,
  });
}

/**
 * Verifica se SMTP está configurado
 */
export function isSmtpConfigured(): boolean {
  return !!(ENV.smtpHost && ENV.smtpPort && ENV.smtpUser && ENV.smtpPass);
}

/**
 * Retorna status da configuração SMTP
 */
export function getSmtpStatus(): {
  configured: boolean;
  host?: string;
  port?: number;
  user?: string;
} {
  return {
    configured: isSmtpConfigured(),
    host: ENV.smtpHost,
    port: ENV.smtpPort,
    user: ENV.smtpUser,
  };
}
