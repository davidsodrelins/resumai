import { randomBytes } from "crypto";
import { getDb } from "../db";
import { users, emailVerificationTokens } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { sendEmail } from "./smtpEmail";

/**
 * Gera um token único de verificação de email
 */
export function generateVerificationToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Cria um token de verificação para um usuário e envia email
 */
export async function createAndSendVerificationEmail(
  userId: number,
  email: string,
  name: string
): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) return false;

    // Gerar token
    const token = generateVerificationToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

    // Salvar token no banco
    await db.insert(emailVerificationTokens).values({
      userId,
      token,
      expiresAt,
    });

    // Construir URL de verificação
    const verificationUrl = `${process.env.FRONTEND_URL || "https://resumai.app"}/verify-email?token=${token}`;

    // Enviar email
    const emailSent = await sendEmail({
      to: email,
      subject: "ResumAI - Verifique seu Email",
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #2563eb;">Bem-vindo ao ResumAI! 🎉</h1>
              
              <p>Olá <strong>${name}</strong>,</p>
              
              <p>Obrigado por se cadastrar no ResumAI! Para completar seu cadastro, você precisa verificar seu endereço de email.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" style="display: inline-block; padding: 12px 30px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  Verificar Email
                </a>
              </div>
              
              <p>Ou copie e cole este link no seu navegador:</p>
              <p style="word-break: break-all; background-color: #f3f4f6; padding: 10px; border-radius: 5px;">
                ${verificationUrl}
              </p>
              
              <p style="color: #666; font-size: 12px;">
                Este link expira em 24 horas.
              </p>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
              
              <p style="color: #666; font-size: 12px;">
                Se você não se cadastrou no ResumAI, ignore este email.
              </p>
              
              <p style="color: #666; font-size: 12px;">
                ResumAI - Gerador de Currículos com IA<br>
                <a href="https://resumai.app" style="color: #2563eb;">https://resumai.app</a>
              </p>
            </div>
          </body>
        </html>
      `,
    });

    if (!emailSent) {
      console.error("[Email Verification] Falha ao enviar email de verificação");
      // Deletar token se o email não foi enviado
      await db.delete(emailVerificationTokens).where(eq(emailVerificationTokens.token, token));
      return false;
    }

    console.log("[Email Verification] Email de verificação enviado para:", email);
    return true;
  } catch (error) {
    console.error("[Email Verification] Erro ao criar token de verificação:", error);
    return false;
  }
}

/**
 * Valida um token de verificação e marca o email como verificado
 */
export async function verifyEmailToken(token: string): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) return false;

    // Buscar token
    const tokenRecord = await db
      .select()
      .from(emailVerificationTokens)
      .where(eq(emailVerificationTokens.token, token))
      .limit(1);

    if (!tokenRecord || tokenRecord.length === 0) {
      console.log("[Email Verification] Token não encontrado:", token);
      return false;
    }

    const record = tokenRecord[0];

    // Verificar expiração
    if (new Date() > record.expiresAt) {
      console.log("[Email Verification] Token expirado:", token);
      // Deletar token expirado
      await db.delete(emailVerificationTokens).where(eq(emailVerificationTokens.token, token));
      return false;
    }

    // Marcar email como verificado
    await db
      .update(users)
      .set({ emailVerified: 1 })
      .where(eq(users.id, record.userId));

    // Deletar token
    await db.delete(emailVerificationTokens).where(eq(emailVerificationTokens.token, token));

    console.log("[Email Verification] Email verificado com sucesso para usuário:", record.userId);
    return true;
  } catch (error) {
    console.error("[Email Verification] Erro ao verificar token:", error);
    return false;
  }
}

/**
 * Marca um usuário como tendo email verificado
 */
export async function markEmailAsVerified(userId: number): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) return false;

    await db
      .update(users)
      .set({ emailVerified: 1 })
      .where(eq(users.id, userId));

    return true;
  } catch (error) {
    console.error("[Email Verification] Error marking email as verified:", error);
    return false;
  }
}

/**
 * Verifica se um usuário tem email verificado
 */
export async function isEmailVerified(userId: number): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) return false;

    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);

    return (user[0]?.emailVerified === 1) || false;
  } catch (error) {
    console.error("[Email Verification] Error checking email verification:", error);
    return false;
  }
}

/**
 * Requer que um usuário tenha email verificado
 */
export async function requireEmailVerified(userId: number): Promise<void> {
  const verified = await isEmailVerified(userId);
  if (!verified) {
    throw new Error("Email não verificado. Verifique seu email para continuar.");
  }
}

/**
 * Resend verification email
 */
export async function resendVerificationEmail(email: string): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) return false;

    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (!user || user.length === 0) {
      console.log("[Email Verification] User not found:", email);
      return false;
    }

    // Se já verificado, retornar sucesso
    if (user[0].emailVerified === 1) {
      console.log("[Email Verification] Email já verificado:", email);
      return true;
    }

    // Deletar tokens antigos
    await db.delete(emailVerificationTokens).where(eq(emailVerificationTokens.userId, user[0].id));

    // Enviar novo email
    return createAndSendVerificationEmail(user[0].id, email, user[0].name || "Usuário");
  } catch (error) {
    console.error("[Email Verification] Error resending verification email:", error);
    return false;
  }
}
