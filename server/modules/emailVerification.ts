import { randomBytes } from "crypto";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * Gera um token único de verificação de email
 */
export function generateVerificationToken(): string {
  return randomBytes(32).toString("hex");
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
 * Resend verification email (placeholder)
 * In production, this would send an actual email
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

    // In production, you would:
    // 1. Generate a new verification token
    // 2. Store it in a verification_tokens table
    // 3. Send email with verification link
    // 4. Return true if successful

    console.log("[Email Verification] Resend email requested for:", email);
    return true;
  } catch (error) {
    console.error("[Email Verification] Error resending verification email:", error);
    return false;
  }
}
