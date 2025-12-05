import { describe, it, expect, beforeEach } from "vitest";
import { checkAndUnlockAchievements, getUserAchievementProgress, unlockAchievement } from "./achievementChecker";
import { ACHIEVEMENTS, getAchievementById } from "./achievements";
import { getDb } from "./db";
import { users, savedResumes, userAchievements } from "../drizzle/schema";
import { eq } from "drizzle-orm";

describe("Achievement System", () => {
  let testUserId: number;

  beforeEach(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Create test user
    const result = await db.insert(users).values({
      email: `test-achievements-${Date.now()}@test.com`,
      name: "Test User Achievements",
      passwordHash: "test",
      role: "user",
    });

    testUserId = Number(result[0].insertId);
  });

  it("should have defined achievements", () => {
    expect(ACHIEVEMENTS).toBeDefined();
    expect(ACHIEVEMENTS.length).toBeGreaterThan(0);
  });

  it("should get achievement by ID", () => {
    const achievement = getAchievementById("first_resume");
    expect(achievement).toBeDefined();
    expect(achievement?.id).toBe("first_resume");
    expect(achievement?.name).toBe("Primeiro Passo");
  });

  it("should unlock first_resume achievement when user creates first resume", async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Create a resume for the user
    await db.insert(savedResumes).values({
      userId: testUserId,
      title: "Test Resume",
      resumeData: JSON.stringify({ name: "Test" }),
      model: "complete",
      language: "pt",
      template: "modern",
    });

    // Check achievements
    const result = await checkAndUnlockAchievements(testUserId);

    expect(result.newAchievements.length).toBeGreaterThan(0);
    expect(result.newAchievements.some((a) => a.id === "first_resume")).toBe(true);
  });

  it("should track user progress towards achievements", async () => {
    const progress = await getUserAchievementProgress(testUserId);

    expect(progress).toBeDefined();
    expect(Array.isArray(progress)).toBe(true);
    expect(progress.length).toBe(ACHIEVEMENTS.length);

    // Check first_resume progress
    const firstResumeProgress = progress.find((p) => p.achievement.id === "first_resume");
    expect(firstResumeProgress).toBeDefined();
    expect(firstResumeProgress?.unlocked).toBe(false);
    expect(firstResumeProgress?.current).toBe(0);
    expect(firstResumeProgress?.required).toBe(1);
  });

  it("should manually unlock achievement", async () => {
    const unlocked = await unlockAchievement(testUserId, "web_developer");
    expect(unlocked).toBe(true);

    // Verify it was unlocked
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const achievements = await db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, testUserId));

    expect(achievements.some((a: any) => a.achievementId === "web_developer")).toBe(true);
  });

  it("should not unlock same achievement twice", async () => {
    // Unlock first time
    const firstUnlock = await unlockAchievement(testUserId, "supporter");
    expect(firstUnlock).toBe(true);

    // Try to unlock again
    const secondUnlock = await unlockAchievement(testUserId, "supporter");
    expect(secondUnlock).toBe(false);
  });

  it("should categorize achievements correctly", () => {
    const resumeAchievements = ACHIEVEMENTS.filter((a) => a.category === "resumes");
    const referralAchievements = ACHIEVEMENTS.filter((a) => a.category === "referrals");

    expect(resumeAchievements.length).toBeGreaterThan(0);
    expect(referralAchievements.length).toBeGreaterThan(0);
  });

  it("should have different rarity levels", () => {
    const common = ACHIEVEMENTS.filter((a) => a.rarity === "common");
    const legendary = ACHIEVEMENTS.filter((a) => a.rarity === "legendary");

    expect(common.length).toBeGreaterThan(0);
    expect(legendary.length).toBeGreaterThan(0);
  });
});
