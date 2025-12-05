import { getDb } from "./db";
import { userAchievements, savedResumes, coverLetters, users } from "../drizzle/schema";
import { ACHIEVEMENTS, type Achievement } from "./achievements";
import { eq, and, gte, sql } from "drizzle-orm";
import { notifyOwner } from "./_core/notification";

/**
 * Check and unlock achievements for a user based on their current stats
 */
export async function checkAndUnlockAchievements(userId: number): Promise<{
  newAchievements: Achievement[];
  totalUnlocked: number;
}> {
  const db = await getDb();
  if (!db) return { newAchievements: [], totalUnlocked: 0 };

  // Get user's current achievements
  const unlockedAchievements = await db
    .select()
    .from(userAchievements)
    .where(eq(userAchievements.userId, userId));

  const unlockedIds = new Set(unlockedAchievements.map((a: any) => a.achievementId));

  // Get user stats
  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user.length) return { newAchievements: [], totalUnlocked: 0 };

  const userData = user[0];

  // Count resumes
  const resumeCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(savedResumes)
    .where(eq(savedResumes.userId, userId));

  const totalResumes = Number(resumeCount[0]?.count || 0);

  // Count cover letters
  const coverLetterCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(coverLetters)
    .where(eq(coverLetters.userId, userId));

  const totalCoverLetters = Number(coverLetterCount[0]?.count || 0);

  // Count unique languages used
  const languagesUsed = await db
    .selectDistinct({ language: savedResumes.language })
    .from(savedResumes)
    .where(eq(savedResumes.userId, userId));

  const uniqueLanguages = languagesUsed.length;

  // Count resumes created today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const resumesToday = await db
    .select({ count: sql<number>`count(*)` })
    .from(savedResumes)
    .where(and(eq(savedResumes.userId, userId), gte(savedResumes.createdAt, today)));

  const resumesInDay = Number(resumesToday[0]?.count || 0);

  // Count resumes created in last 7 days
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const resumesWeek = await db
    .select({ count: sql<number>`count(*)` })
    .from(savedResumes)
    .where(and(eq(savedResumes.userId, userId), gte(savedResumes.createdAt, weekAgo)));

  const resumesInWeek = Number(resumesWeek[0]?.count || 0);

  // Check each achievement
  const newAchievements: Achievement[] = [];

  for (const achievement of ACHIEVEMENTS) {
    // Skip if already unlocked
    if (unlockedIds.has(achievement.id)) continue;

    let shouldUnlock = false;

    switch (achievement.condition.type) {
      case "resume_count":
        shouldUnlock = totalResumes >= achievement.condition.value;
        break;
      case "referral_count":
        shouldUnlock = userData.totalReferrals >= achievement.condition.value;
        break;
      case "donation_amount":
        shouldUnlock = userData.totalDonated >= achievement.condition.value;
        break;
      case "cover_letter_count":
        shouldUnlock = totalCoverLetters >= achievement.condition.value;
        break;
      case "languages_used":
        shouldUnlock = uniqueLanguages >= achievement.condition.value;
        break;
      case "resumes_in_day":
        shouldUnlock = resumesInDay >= achievement.condition.value;
        break;
      case "resumes_in_week":
        shouldUnlock = resumesInWeek >= achievement.condition.value;
        break;
      case "ats_score":
        // This will be checked separately when ATS analysis is done
        shouldUnlock = false;
        break;
      case "portfolio_created":
        // This will be checked separately when portfolio is created
        shouldUnlock = false;
        break;
    }

    if (shouldUnlock) {
      // Unlock achievement
      await db.insert(userAchievements).values({
        userId,
        achievementId: achievement.id,
        notified: 0,
      });

      newAchievements.push(achievement);

      // Notify owner (for monitoring)
      try {
        await notifyOwner({
          title: `🏆 Conquista Desbloqueada!`,
          content: `${userData.name} desbloqueou: ${achievement.icon} ${achievement.name}`,
        });
      } catch (error) {
        console.error("[Achievements] Erro ao notificar owner:", error);
      }
    }
  }

  return {
    newAchievements,
    totalUnlocked: unlockedIds.size + newAchievements.length,
  };
}

/**
 * Manually unlock a specific achievement (for special cases like ATS score, portfolio)
 */
export async function unlockAchievement(userId: number, achievementId: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  // Check if already unlocked
  const existing = await db
    .select()
    .from(userAchievements)
    .where(and(eq(userAchievements.userId, userId), eq(userAchievements.achievementId, achievementId)))
    .limit(1);

  if (existing.length > 0) {
    return false; // Already unlocked
  }

  // Unlock
  await db.insert(userAchievements).values({
    userId,
    achievementId,
    notified: 0,
  });

  // Get user name for notification
  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId);

  if (user.length && achievement) {
    try {
      await notifyOwner({
        title: `🏆 Conquista Desbloqueada!`,
        content: `${user[0].name} desbloqueou: ${achievement.icon} ${achievement.name}`,
      });
    } catch (error) {
      console.error("[Achievements] Erro ao notificar owner:", error);
    }
  }

  return true;
}

/**
 * Get user's progress towards all achievements
 */
export async function getUserAchievementProgress(userId: number): Promise<{
  achievement: Achievement;
  unlocked: boolean;
  progress: number; // 0-100
  current: number;
  required: number;
}[]> {
  const db = await getDb();
  if (!db) return [];

  // Get unlocked achievements
  const unlocked = await db
    .select()
    .from(userAchievements)
    .where(eq(userAchievements.userId, userId));

  const unlockedIds = new Set(unlocked.map((a: any) => a.achievementId));

  // Get user stats (same as checkAndUnlockAchievements)
  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user.length) return [];

  const userData = user[0];

  const resumeCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(savedResumes)
    .where(eq(savedResumes.userId, userId));
  const totalResumes = Number(resumeCount[0]?.count || 0);

  const coverLetterCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(coverLetters)
    .where(eq(coverLetters.userId, userId));
  const totalCoverLetters = Number(coverLetterCount[0]?.count || 0);

  const languagesUsed = await db
    .selectDistinct({ language: savedResumes.language })
    .from(savedResumes)
    .where(eq(savedResumes.userId, userId));
  const uniqueLanguages = languagesUsed.length;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const resumesToday = await db
    .select({ count: sql<number>`count(*)` })
    .from(savedResumes)
    .where(and(eq(savedResumes.userId, userId), gte(savedResumes.createdAt, today)));
  const resumesInDay = Number(resumesToday[0]?.count || 0);

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const resumesWeek = await db
    .select({ count: sql<number>`count(*)` })
    .from(savedResumes)
    .where(and(eq(savedResumes.userId, userId), gte(savedResumes.createdAt, weekAgo)));
  const resumesInWeek = Number(resumesWeek[0]?.count || 0);

  // Calculate progress for each achievement
  return ACHIEVEMENTS.map((achievement) => {
    const isUnlocked = unlockedIds.has(achievement.id);
    let current = 0;
    let required = achievement.condition.value;

    switch (achievement.condition.type) {
      case "resume_count":
        current = totalResumes;
        break;
      case "referral_count":
        current = userData.totalReferrals;
        break;
      case "donation_amount":
        current = userData.totalDonated;
        break;
      case "cover_letter_count":
        current = totalCoverLetters;
        break;
      case "languages_used":
        current = uniqueLanguages;
        break;
      case "resumes_in_day":
        current = resumesInDay;
        break;
      case "resumes_in_week":
        current = resumesInWeek;
        break;
      case "ats_score":
      case "portfolio_created":
        // Special cases - will be 0 or 100%
        current = isUnlocked ? required : 0;
        break;
    }

    const progress = isUnlocked ? 100 : Math.min(100, Math.round((current / required) * 100));

    return {
      achievement,
      unlocked: isUnlocked,
      progress,
      current,
      required,
    };
  });
}
