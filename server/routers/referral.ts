import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq, and, sql } from "drizzle-orm";
import { getDb } from "../db";
import { referrals, users } from "../../drizzle/schema";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";

/**
 * Gera um código de referral único
 */
function generateUniqueCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Sem caracteres ambíguos
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export const referralRouter = router({
  /**
   * Gera ou retorna o código de referral do usuário
   */
  getMyReferralCode: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

    const userId = ctx.user.id;

    // Verificar se já existe um código
    const existing = await db
      .select()
      .from(referrals)
      .where(eq(referrals.referrerId, userId))
      .limit(1);

    if (existing.length > 0) {
      return { code: existing[0].referralCode };
    }

    // Gerar novo código único
    let code = generateUniqueCode();
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      const duplicate = await db
        .select()
        .from(referrals)
        .where(eq(referrals.referralCode, code))
        .limit(1);

      if (duplicate.length === 0) break;

      code = generateUniqueCode();
      attempts++;
    }

    if (attempts >= maxAttempts) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Não foi possível gerar um código único. Tente novamente.",
      });
    }

    // Criar registro de referral
    await db.insert(referrals).values({
      referrerId: userId,
      referralCode: code,
      status: "pending",
      rewardCredits: 0,
    });

    return { code };
  }),

  /**
   * Retorna estatísticas de referrals do usuário
   */
  getMyReferralStats: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

    const userId = ctx.user.id;

    // Total de referrals criados
    const allReferrals = await db
      .select()
      .from(referrals)
      .where(eq(referrals.referrerId, userId));

    const totalClicks = allReferrals.length;
    const completed = allReferrals.filter((r: any) => r.status === "completed" || r.status === "rewarded").length;
    const rewarded = allReferrals.filter((r: any) => r.status === "rewarded").length;
    const totalCreditsEarned = allReferrals.reduce((sum: number, r: any) => sum + r.rewardCredits, 0);

    // Referrals recentes (últimos 10)
    const recentReferrals = await db
      .select({
        id: referrals.id,
        status: referrals.status,
        createdAt: referrals.createdAt,
        completedAt: referrals.completedAt,
        rewardCredits: referrals.rewardCredits,
        referredUserName: users.name,
        referredUserEmail: users.email,
      })
      .from(referrals)
      .leftJoin(users, eq(referrals.referredId, users.id))
      .where(eq(referrals.referrerId, userId))
      .orderBy(sql`${referrals.createdAt} DESC`)
      .limit(10);

    return {
      totalClicks,
      completed,
      rewarded,
      totalCreditsEarned,
      recentReferrals,
    };
  }),

  /**
   * Registra um novo referral quando alguém usa o código
   * (Chamado durante o signup)
   */
  registerReferral: publicProcedure
    .input(
      z.object({
        code: z.string().min(6).max(10),
        referredUserId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const { code, referredUserId } = input;

      // Verificar se o código existe
      const referralRecord = await db
        .select()
        .from(referrals)
        .where(eq(referrals.referralCode, code))
        .limit(1);

      if (referralRecord.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Código de referral inválido.",
        });
      }

      const referral = referralRecord[0];

      // Verificar se o usuário não está se auto-referenciando
      if (referral.referrerId === referredUserId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Você não pode usar seu próprio código de referral.",
        });
      }

      // Atualizar o registro com o ID do usuário referido
      await db
        .update(referrals)
        .set({
          referredId: referredUserId,
          status: "completed",
          completedAt: new Date(),
        })
        .where(eq(referrals.id, referral.id));

      return { success: true };
    }),

  /**
   * Concede recompensa ao referrer (chamado automaticamente após signup bem-sucedido)
   */
  claimReward: protectedProcedure
    .input(
      z.object({
        referralId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const { referralId } = input;
      const userId = ctx.user.id;

      // Buscar o referral
      const referralRecord = await db
        .select()
        .from(referrals)
        .where(and(eq(referrals.id, referralId), eq(referrals.referrerId, userId)))
        .limit(1);

      if (referralRecord.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Referral não encontrado.",
        });
      }

      const referral = referralRecord[0];

      // Verificar se já foi recompensado
      if (referral.status === "rewarded") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Recompensa já foi concedida para este referral.",
        });
      }

      // Verificar se o referral foi completado
      if (referral.status !== "completed") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Referral ainda não foi completado.",
        });
      }

      // Conceder recompensa: +2 currículos extras
      const rewardCredits = 2;

      // Atualizar o referral
      await db
        .update(referrals)
        .set({
          status: "rewarded",
          rewardCredits,
          rewardedAt: new Date(),
        })
        .where(eq(referrals.id, referralId));

      // Atualizar o limite de currículos do usuário (não reseta no mês)
      // Vamos adicionar um campo extra para créditos bônus
      // Por enquanto, vamos apenas marcar como recompensado
      // TODO: Implementar sistema de créditos bônus separado do limite mensal

      return { success: true, creditsEarned: rewardCredits };
    }),

  /**
   * Valida se um código de referral existe (usado no signup)
   */
  validateCode: publicProcedure
    .input(
      z.object({
        code: z.string().min(6).max(10),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const { code } = input;

      const referralRecord = await db
        .select({
          id: referrals.id,
          referrerId: referrals.referrerId,
          referrerName: users.name,
        })
        .from(referrals)
        .leftJoin(users, eq(referrals.referrerId, users.id))
        .where(eq(referrals.referralCode, code))
        .limit(1);

      if (referralRecord.length === 0) {
        return { valid: false, referrerName: null };
      }

      return {
        valid: true,
        referrerName: referralRecord[0].referrerName || "Um usuário",
      };
    }),
});
