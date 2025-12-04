import crypto from "crypto";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { sendPasswordResetEmailSMTP } from "./smtpEmail";

/**
 * Interface para token de reset de senha
 */
export interface PasswordResetToken {
  userId: number;
  token: string;
  expiresAt: Date;
}

// Armazenar tokens em memória (em produção, usar banco de dados)
const resetTokens = new Map<string, PasswordResetToken>();

/**
 * Gera um token único para reset de senha
 */
function generateResetToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Solicita reset de senha para um email
 */
export async function requestPasswordReset(email: string): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    // Encontrar usuário por email
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    const user = userResult.length > 0 ? userResult[0] : null;

    if (!user) {
      // Não revelar se o email existe ou não (segurança)
      console.log(`[PasswordReset] Email não encontrado: ${email}`);
      return true;
    }

    // Gerar token
    const token = generateResetToken();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    // Armazenar token
    resetTokens.set(token, {
      userId: user.id,
      token,
      expiresAt,
    });

    // Construir link de reset
    const resetLink = `https://resumai.manus.space/reset-password?token=${token}`;

    // Enviar email
    const emailSent = await sendPasswordResetEmailSMTP(
      user.email,
      user.name || "Usuário",
      resetLink
    );

    if (emailSent) {
      console.log(`[PasswordReset] Email de reset enviado para: ${email}`);
    } else {
      console.warn(`[PasswordReset] Falha ao enviar email para: ${email}`);
    }

    return true;
  } catch (error) {
    console.error("[PasswordReset] Erro ao solicitar reset de senha:", error);
    return false;
  }
}

/**
 * Valida um token de reset de senha
 */
export async function validateResetToken(token: string): Promise<number | null> {
  try {
    const resetToken = resetTokens.get(token);

    if (!resetToken) {
      console.warn("[PasswordReset] Token não encontrado");
      return null;
    }

    // Verificar expiração
    if (new Date() > resetToken.expiresAt) {
      console.warn("[PasswordReset] Token expirado");
      resetTokens.delete(token);
      return null;
    }

    return resetToken.userId;
  } catch (error) {
    console.error("[PasswordReset] Erro ao validar token:", error);
    return null;
  }
}

/**
 * Reseta a senha do usuário
 */
export async function resetPassword(
  token: string,
  newPassword: string
): Promise<boolean> {
  try {
    // Validar token
    const userId = await validateResetToken(token);
    if (!userId) {
      throw new Error("Token inválido ou expirado");
    }

    // Validar nova senha
    if (newPassword.length < 6) {
      throw new Error("Senha deve ter no mínimo 6 caracteres");
    }

    // Hash da nova senha
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Atualizar senha no banco
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    await db
      .update(users)
      .set({
        passwordHash,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    // Remover token usado
    resetTokens.delete(token);

    console.log(`[PasswordReset] Senha redefinida para usuário: ${userId}`);
    return true;
  } catch (error) {
    console.error("[PasswordReset] Erro ao redefinir senha:", error);
    return false;
  }
}

/**
 * Limpa tokens expirados (deve ser chamado periodicamente)
 */
export function cleanupExpiredTokens(): number {
  const now = new Date();
  let cleanedCount = 0;
  const tokensToDelete: string[] = [];

  resetTokens.forEach((resetToken, token) => {
    if (now > resetToken.expiresAt) {
      tokensToDelete.push(token);
    }
  });

  tokensToDelete.forEach((token) => {
    resetTokens.delete(token);
    cleanedCount++;
  });

  if (cleanedCount > 0) {
    console.log(`[PasswordReset] Limpeza: ${cleanedCount} tokens expirados removidos`);
  }

  return cleanedCount;
}

/**
 * Inicia limpeza periódica de tokens (a cada 5 minutos)
 */
export function startTokenCleanupInterval(): NodeJS.Timeout {
  return setInterval(() => {
    cleanupExpiredTokens();
  }, 5 * 60 * 1000); // 5 minutos
}
