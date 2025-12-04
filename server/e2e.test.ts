import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getDb } from "./db";
import { users, savedResumes } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { signupUser, loginUser, checkResumeLimit, incrementResumeCount } from "./publicAuth";
import { isUserDonor, createDonationCheckout } from "./donations";

describe("End-to-End Flows", () => {
  let testUserId: number;
  let testEmail: string;
  let testPassword: string;
  let testName: string;

  beforeAll(async () => {
    // Setup test user
    testEmail = `e2e-${Date.now()}@test.com`;
    testPassword = "test123456";
    testName = "E2E Test User";
  });

  describe("Signup Flow", () => {
    it("should complete signup flow", async () => {
      const result = await signupUser({
        email: testEmail,
        password: testPassword,
        name: testName,
      });

      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(testEmail.toLowerCase());
      expect(result.user.name).toBe(testName);
      expect(result.token).toBeDefined();

      testUserId = result.user.id;
    });

    it("should create user in database with correct defaults", async () => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      const userResult = await db
        .select()
        .from(users)
        .where(eq(users.id, testUserId))
        .limit(1);

      const user = userResult[0];

      expect(user).toBeDefined();
      expect(user.email).toBe(testEmail.toLowerCase());
      expect(user.name).toBe(testName);
      expect(user.loginMethod).toBe("email");
      expect(user.role).toBe("user");
      expect(user.isDonor).toBe(0); // Should be free user
      expect(user.resumesThisMonth).toBe(0); // No resumes yet
      expect(user.totalDonated).toBe(0); // No donations yet
    });
  });

  describe("Login Flow", () => {
    it("should complete login flow with correct credentials", async () => {
      const result = await loginUser({
        email: testEmail,
        password: testPassword,
      });

      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(testEmail.toLowerCase());
      expect(result.user.name).toBe(testName);
      expect(result.user.isDonor).toBe(false);
      expect(result.token).toBeDefined();
    });

    it("should reject login with wrong password", async () => {
      await expect(
        loginUser({
          email: testEmail,
          password: "wrongpassword",
        })
      ).rejects.toThrow("Email ou senha incorretos");
    });

    it("should reject login with non-existent email", async () => {
      await expect(
        loginUser({
          email: "nonexistent@test.com",
          password: testPassword,
        })
      ).rejects.toThrow("Email ou senha incorretos");
    });
  });

  describe("Resume Limit Flow - Free User", () => {
    it("should allow free user to create 5 resumes", async () => {
      for (let i = 0; i < 5; i++) {
        const limit = await checkResumeLimit(testUserId);
        expect(limit.canCreate).toBe(true);
        expect(limit.remaining).toBeGreaterThan(0);

        // Simulate resume creation
        await incrementResumeCount(testUserId);
      }
    });

    it("should block free user from creating 6th resume", async () => {
      const limit = await checkResumeLimit(testUserId);
      expect(limit.canCreate).toBe(false);
      expect(limit.remaining).toBe(0);
    });

    it("should show correct remaining count", async () => {
      const limit = await checkResumeLimit(testUserId);
      expect(limit.remaining).toBe(0);
    });
  });

  describe("Donation Flow", () => {
    it("should create donation checkout session", async () => {
      const result = await createDonationCheckout(
        testUserId.toString(),
        500,
        "Coffee donation",
        "https://resumai.manus.space/donation-success",
        "https://resumai.manus.space/donation-cancel"
      );

      expect(result).toBeDefined();
      expect(result.sessionId).toBeDefined();
      expect(result.url).toBeDefined();
      expect(result.url).toContain("checkout.stripe.com");
    });

    it("should verify user is not donor before donation", async () => {
      const isDonor = await isUserDonor(testUserId);
      expect(isDonor).toBe(false);
    });
  });

  describe("Resume Limit Flow - After Donation", () => {
    it("should manually mark user as donor for testing", async () => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      await db
        .update(users)
        .set({
          isDonor: 1,
          totalDonated: 500,
        })
        .where(eq(users.id, testUserId));
    });

    it("should verify user is now donor", async () => {
      const isDonor = await isUserDonor(testUserId);
      expect(isDonor).toBe(true);
    });

    it("should allow donor to create unlimited resumes", async () => {
      // Try to create more than 5 resumes
      for (let i = 0; i < 10; i++) {
        const limit = await checkResumeLimit(testUserId);
        expect(limit.canCreate).toBe(true);
        expect(limit.remaining).toBe(-1); // -1 = unlimited
      }
    });

    it("should not increment resume count for donors", async () => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      const userBefore = await db
        .select()
        .from(users)
        .where(eq(users.id, testUserId))
        .limit(1);

      const countBefore = userBefore[0].resumesThisMonth;

      // Try to increment
      await incrementResumeCount(testUserId);

      const userAfter = await db
        .select()
        .from(users)
        .where(eq(users.id, testUserId))
        .limit(1);

      const countAfter = userAfter[0].resumesThisMonth;

      // Count should not change for donors
      expect(countAfter).toBe(countBefore);
    });
  });

  describe("Resume Saving Flow", () => {
    it("should allow user to save resume", async () => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      const resumeData = {
        personalInfo: {
          fullName: "Test User",
          email: "test@example.com",
          phone: "(11) 99999-9999",
          location: "São Paulo, SP",
          summary: "Test summary",
        },
        experience: [],
        education: [],
        skills: [],
        languages: [],
      };

      const [result] = await db.insert(savedResumes).values({
        userId: testUserId,
        title: "Test Resume",
        resumeData: JSON.stringify(resumeData),
        template: "classic",
        language: "pt",
        model: "complete",
        isDraft: false,
      });

      expect(result.insertId).toBeDefined();
    });

    it("should retrieve saved resumes", async () => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      const resumes = await db
        .select()
        .from(savedResumes)
        .where(eq(savedResumes.userId, testUserId));

      expect(resumes.length).toBeGreaterThan(0);
      expect(resumes[0].title).toBe("Test Resume");
      expect(resumes[0].template).toBe("classic");
      expect(resumes[0].language).toBe("pt");
    });
  });

  describe("Complete User Journey", () => {
    it("should summarize complete flow: signup -> login -> resume limit -> donation -> unlimited", async () => {
      // 1. Signup ✓
      // 2. Login ✓
      // 3. Check resume limit (5 allowed) ✓
      // 4. Create 5 resumes ✓
      // 5. Try to create 6th (blocked) ✓
      // 6. Donate ✓
      // 7. Unlimited resumes ✓

      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      const finalUser = await db
        .select()
        .from(users)
        .where(eq(users.id, testUserId))
        .limit(1);

      expect(finalUser[0]).toBeDefined();
      expect(finalUser[0].isDonor).toBe(1);
      expect(finalUser[0].totalDonated).toBeGreaterThan(0);
    });
  });

  afterAll(async () => {
    // Cleanup test user
    const db = await getDb();
    if (db) {
      await db.delete(savedResumes).where(eq(savedResumes.userId, testUserId));
      await db.delete(users).where(eq(users.id, testUserId));
    }
  });
});
