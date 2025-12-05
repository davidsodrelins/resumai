import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { checkAndUnlockAchievements, getUserAchievementProgress, unlockAchievement } from "../achievementChecker";
import { ACHIEVEMENTS, getAchievementById } from "../achievements";
import { getDb } from "../db";
import { userAchievements } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const achievementsRouter = router({
  /**
   * Get all available achievements
   */
  getAll: protectedProcedure.query(async () => {
    return ACHIEVEMENTS;
  }),

  /**
   * Get user's unlocked achievements
   */
  getUserAchievements: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    const unlocked = await db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, ctx.user.id));

    return unlocked.map((ua: any) => ({
      ...ua,
      achievement: getAchievementById(ua.achievementId),
    }));
  }),

  /**
   * Get user's progress towards all achievements
   */
  getProgress: protectedProcedure.query(async ({ ctx }) => {
    return await getUserAchievementProgress(ctx.user.id);
  }),

  /**
   * Check and unlock new achievements for current user
   */
  checkAchievements: protectedProcedure.mutation(async ({ ctx }) => {
    const result = await checkAndUnlockAchievements(ctx.user.id);
    return result;
  }),

  /**
   * Manually unlock achievement (for special cases like ATS score, portfolio)
   */
  unlockAchievement: protectedProcedure
    .input(
      z.object({
        achievementId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const unlocked = await unlockAchievement(ctx.user.id, input.achievementId);
      return { success: unlocked };
    }),

  /**
   * Get achievement stats (total unlocked, by category, by rarity)
   */
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      return {
        totalUnlocked: 0,
        totalAvailable: ACHIEVEMENTS.length,
        byCategory: {},
        byRarity: {},
      };
    }

    const unlocked = await db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, ctx.user.id));

    const unlockedIds = new Set(unlocked.map((ua: any) => ua.achievementId));

    // Count by category
    const byCategory: Record<string, { unlocked: number; total: number }> = {};
    const byRarity: Record<string, { unlocked: number; total: number }> = {};

    for (const achievement of ACHIEVEMENTS) {
      const isUnlocked = unlockedIds.has(achievement.id);

      // By category
      if (!byCategory[achievement.category]) {
        byCategory[achievement.category] = { unlocked: 0, total: 0 };
      }
      byCategory[achievement.category].total++;
      if (isUnlocked) byCategory[achievement.category].unlocked++;

      // By rarity
      if (!byRarity[achievement.rarity]) {
        byRarity[achievement.rarity] = { unlocked: 0, total: 0 };
      }
      byRarity[achievement.rarity].total++;
      if (isUnlocked) byRarity[achievement.rarity].unlocked++;
    }

    return {
      totalUnlocked: unlocked.length,
      totalAvailable: ACHIEVEMENTS.length,
      byCategory,
      byRarity,
    };
  }),
});
