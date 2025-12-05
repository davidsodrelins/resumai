import { TRPCError } from "@trpc/server";
import { sql, desc, eq, and, gte } from "drizzle-orm";
import { getDb } from "../db";
import { users, referrals } from "../../drizzle/schema";
import { protectedProcedure, router } from "../_core/trpc";

/**
 * Router de analytics do programa de indicações (apenas admin)
 */
export const referralAnalyticsRouter = router({
  /**
   * Retorna estatísticas gerais do programa de indicações
   */
  getOverviewStats: protectedProcedure.query(async ({ ctx }) => {
    // Verificar se é admin
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Acesso negado" });
    }

    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

    // Total de usuários com indicações
    const [totalReferrersResult] = await db
      .select({ count: sql<number>`COUNT(DISTINCT ${referrals.referrerId})` })
      .from(referrals);
    const totalReferrers = totalReferrersResult?.count || 0;

    // Total de indicações (todas)
    const [totalReferralsResult] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(referrals);
    const totalReferrals = totalReferralsResult?.count || 0;

    // Indicações convertidas (completed ou rewarded)
    const [convertedResult] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(referrals)
      .where(sql`${referrals.status} IN ('completed', 'rewarded')`);
    const convertedReferrals = convertedResult?.count || 0;

    // Taxa de conversão
    const conversionRate = totalReferrals > 0 ? (convertedReferrals / totalReferrals) * 100 : 0;

    // Distribuição por nível
    const levelDistribution = await db
      .select({
        level: users.referralLevel,
        count: sql<number>`COUNT(*)`,
      })
      .from(users)
      .where(sql`${users.totalReferrals} > 0`)
      .groupBy(users.referralLevel);

    // Usuários com acesso ilimitado ativo
    const now = new Date();
    const [unlimitedUsersResult] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(users)
      .where(sql`${users.unlimitedUntil} > ${now}`);
    const unlimitedUsers = unlimitedUsersResult?.count || 0;

    return {
      totalReferrers,
      totalReferrals,
      convertedReferrals,
      conversionRate: Math.round(conversionRate * 10) / 10, // 1 decimal
      levelDistribution,
      unlimitedUsers,
    };
  }),

  /**
   * Retorna crescimento de indicações por mês (últimos 6 meses)
   */
  getGrowthByMonth: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Acesso negado" });
    }

    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

    // Últimos 6 meses
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const growthData = await db
      .select({
        month: sql<string>`DATE_FORMAT(${referrals.createdAt}, '%Y-%m')`,
        total: sql<number>`COUNT(*)`,
        converted: sql<number>`SUM(CASE WHEN ${referrals.status} IN ('completed', 'rewarded') THEN 1 ELSE 0 END)`,
      })
      .from(referrals)
      .where(gte(referrals.createdAt, sixMonthsAgo))
      .groupBy(sql`DATE_FORMAT(${referrals.createdAt}, '%Y-%m')`)
      .orderBy(sql`DATE_FORMAT(${referrals.createdAt}, '%Y-%m')`);

    return growthData;
  }),

  /**
   * Retorna top 20 indicadores (para análise)
   */
  getTopReferrers: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Acesso negado" });
    }

    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

    const topReferrers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        totalReferrals: users.totalReferrals,
        referralLevel: users.referralLevel,
        bonusResumes: users.bonusResumes,
        unlimitedUntil: users.unlimitedUntil,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(sql`${users.totalReferrals} > 0`)
      .orderBy(desc(users.totalReferrals))
      .limit(20);

    return topReferrers;
  }),

  /**
   * Retorna ROI estimado do programa
   */
  getROIMetrics: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Acesso negado" });
    }

    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

    // Total de novos usuários vindos de indicações
    const [newUsersResult] = await db
      .select({ count: sql<number>`COUNT(DISTINCT ${referrals.referredId})` })
      .from(referrals)
      .where(sql`${referrals.status} IN ('completed', 'rewarded')`);
    const newUsers = newUsersResult?.count || 0;

    // Currículos bônus concedidos (estimativa)
    const [bonusResumesResult] = await db
      .select({ total: sql<number>`SUM(${users.bonusResumes})` })
      .from(users)
      .where(sql`${users.bonusResumes} > 0`);
    const totalBonusResumes = bonusResumesResult?.total || 0;

    // Usuários com acesso ilimitado (custo estimado)
    const [unlimitedResult] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(users)
      .where(sql`${users.unlimitedUntil} > NOW()`);
    const unlimitedCount = unlimitedResult?.count || 0;

    // Estimativas de custo/benefício
    const avgResumeValue = 5; // R$ 5 por currículo (estimativa)
    const costOfBonuses = totalBonusResumes * avgResumeValue;
    const costOfUnlimited = unlimitedCount * 50; // R$ 50/mês estimado
    const totalCost = costOfBonuses + costOfUnlimited;

    // Benefício: novos usuários * valor médio de lifetime
    const avgUserLifetimeValue = 30; // R$ 30 estimado
    const totalBenefit = newUsers * avgUserLifetimeValue;

    const roi = totalCost > 0 ? ((totalBenefit - totalCost) / totalCost) * 100 : 0;

    return {
      newUsers,
      totalBonusResumes,
      unlimitedCount,
      totalCost: Math.round(totalCost),
      totalBenefit: Math.round(totalBenefit),
      roi: Math.round(roi * 10) / 10, // 1 decimal
    };
  }),
});
