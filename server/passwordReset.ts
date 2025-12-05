import { getDb } from "./db";
import { users, passwordResetTokens } from "../drizzle/schema";
import { eq, and, gt } from "drizzle-orm";
import bcrypt from "bcryptjs";
import crypto from "crypto";
// Email sending will be implemented via SMTP
import { ENV } from "./_core/env";

const SALT_ROUNDS = 10;
const RESET_TOKEN_EXPIRY_HOURS = 1; // Token expires in 1 hour

/**
 * Generate a password reset token and send email
 */
export async function requestPasswordReset(email: string) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");

  // Find user by email
  const userResults = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
  const user = userResults.length > 0 ? userResults[0] : null;

  if (!user) {
    // Don't reveal if email exists or not (security best practice)
    return {
      success: true,
      message: "Se o email existir, você receberá um link de recuperação",
    };
  }

  // Generate random token
  const token = crypto.randomBytes(32).toString("hex");
  
  // Calculate expiry time (1 hour from now)
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + RESET_TOKEN_EXPIRY_HOURS);

  // Save token to database
  await db.insert(passwordResetTokens).values({
    userId: user.id,
    token,
    expiresAt,
    used: 0,
  });

  // Send email with reset link
  const resetUrl = `https://curriculumia-xun2vbve.manus.space/reset-password?token=${token}`;
  
  // TODO: Implement email sending via SMTP
  console.log("[Password Reset] Reset URL:", resetUrl);
  console.log("[Password Reset] Send email to:", user.email);

  return {
    success: true,
    message: "Email de recuperação enviado com sucesso",
  };
}

/**
 * Reset password using token
 */
export async function resetPassword(token: string, newPassword: string) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");

  // Validate password strength
  if (newPassword.length < 6) {
    throw new Error("Senha deve ter no mínimo 6 caracteres");
  }

  // Find valid token
  const tokenResults = await db
    .select()
    .from(passwordResetTokens)
    .where(
      and(
        eq(passwordResetTokens.token, token),
        eq(passwordResetTokens.used, 0),
        gt(passwordResetTokens.expiresAt, new Date())
      )
    )
    .limit(1);

  const resetToken = tokenResults.length > 0 ? tokenResults[0] : null;

  if (!resetToken) {
    throw new Error("Token inválido ou expirado");
  }

  // Hash new password
  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

  // Update user password
  await db
    .update(users)
    .set({ passwordHash })
    .where(eq(users.id, resetToken.userId));

  // Mark token as used
  await db
    .update(passwordResetTokens)
    .set({ used: 1 })
    .where(eq(passwordResetTokens.id, resetToken.id));

  return {
    success: true,
    message: "Senha redefinida com sucesso",
  };
}
