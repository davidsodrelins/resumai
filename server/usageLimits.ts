import { getDb } from "./db";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const FREE_TIER_LIMIT = 5; // 5 currículos por mês para não-doadores

/**
 * Check if user has reached their monthly resume limit
 */
export async function checkResumeLimit(userId: string): Promise<{
  canCreate: boolean;
  remaining: number;
  limit: number;
  isDonor: boolean;
}> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database connection failed");
  }

  const [user] = await db
    .select({
      resumesThisMonth: users.resumesThisMonth,
      lastResetAt: users.lastResetAt,
      isDonor: users.isDonor,
    })
    .from(users)
    .where(eq(users.openId, userId))
    .limit(1);

  if (!user) {
    throw new Error("User not found");
  }

  const isDonor = Boolean(user.isDonor);

  // Donors have unlimited resumes
  if (isDonor) {
    return {
      canCreate: true,
      remaining: -1, // -1 means unlimited
      limit: -1,
      isDonor: true,
    };
  }

  // Check if we need to reset the counter (monthly reset)
  const now = new Date();
  const lastReset = user.lastResetAt ? new Date(user.lastResetAt) : new Date(0);
  const daysSinceReset = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24);

  let currentCount = user.resumesThisMonth || 0;

  // Reset if more than 30 days have passed
  if (daysSinceReset >= 30) {
    currentCount = 0;
    await db
      .update(users)
      .set({
        resumesThisMonth: 0,
        lastResetAt: now,
      })
      .where(eq(users.openId, userId));
  }

  const remaining = Math.max(0, FREE_TIER_LIMIT - currentCount);
  const canCreate = currentCount < FREE_TIER_LIMIT;

  return {
    canCreate,
    remaining,
    limit: FREE_TIER_LIMIT,
    isDonor: false,
  };
}

/**
 * Increment user's resume count for the current month
 */
export async function incrementResumeCount(userId: string): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database connection failed");
  }

  const [user] = await db
    .select({
      resumesThisMonth: users.resumesThisMonth,
      isDonor: users.isDonor,
    })
    .from(users)
    .where(eq(users.openId, userId))
    .limit(1);

  if (!user) {
    throw new Error("User not found");
  }

  // Don't increment for donors (they have unlimited)
  if (user.isDonor) {
    return;
  }

  const newCount = (user.resumesThisMonth || 0) + 1;

  await db
    .update(users)
    .set({
      resumesThisMonth: newCount,
      updatedAt: new Date(),
    })
    .where(eq(users.openId, userId));
}

/**
 * Get user's current usage stats
 */
export async function getUserUsageStats(userId: string): Promise<{
  resumesThisMonth: number;
  limit: number;
  remaining: number;
  isDonor: boolean;
  lastResetAt: Date | null;
}> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database connection failed");
  }

  const [user] = await db
    .select({
      resumesThisMonth: users.resumesThisMonth,
      lastResetAt: users.lastResetAt,
      isDonor: users.isDonor,
    })
    .from(users)
    .where(eq(users.openId, userId))
    .limit(1);

  if (!user) {
    throw new Error("User not found");
  }

  const isDonor = Boolean(user.isDonor);
  const resumesThisMonth = user.resumesThisMonth || 0;

  if (isDonor) {
    return {
      resumesThisMonth,
      limit: -1, // unlimited
      remaining: -1,
      isDonor: true,
      lastResetAt: user.lastResetAt ? new Date(user.lastResetAt) : null,
    };
  }

  return {
    resumesThisMonth,
    limit: FREE_TIER_LIMIT,
    remaining: Math.max(0, FREE_TIER_LIMIT - resumesThisMonth),
    isDonor: false,
    lastResetAt: user.lastResetAt ? new Date(user.lastResetAt) : null,
  };
}
