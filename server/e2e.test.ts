import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getDb } from "./db";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { signupUser, loginUser } from "./publicAuth";

/**
 * E2E Tests - User Journey
 * 
 * These tests simulate a complete user journey:
 * 1. Signup
 * 2. Login
 * 3. Verify user data
 * 4. Test role-based access
 * 5. Verify admin functionality
 */
describe("E2E - User Journey", () => {
  let testUserId: number;
  const testEmail = `e2e-test-${Date.now()}@test.com`;
  const testPassword = "TestPassword123";
  const testName = "E2E Test User";

  beforeAll(async () => {
    console.log("[E2E] Starting E2E tests");
  });

  afterAll(async () => {
    // Cleanup: delete test user
    try {
      const db = await getDb();
      if (db) {
        await db.delete(users).where(eq(users.email, testEmail));
        console.log("[E2E] Test user cleaned up");
      }
    } catch (error) {
      console.error("[E2E] Error during cleanup:", error);
    }
  });

  // ===== AUTHENTICATION TESTS =====

  it("should signup a new user", async () => {
    console.log("[E2E] Test 1: Signup");
    const result = await signupUser({
      email: testEmail,
      password: testPassword,
      name: testName,
    });

    expect(result).toBeDefined();
    expect(result.user).toBeDefined();
    expect(result.user.email).toBe(testEmail);
    expect(result.user.name).toBe(testName);
    expect(result.token).toBeDefined();

    testUserId = result.user.id;
    console.log("[E2E] ✓ Signup successful, userId:", testUserId);
  });

  it("should login with correct credentials", async () => {
    console.log("[E2E] Test 2: Login");
    const result = await loginUser({
      email: testEmail,
      password: testPassword,
    });

    expect(result).toBeDefined();
    expect(result.user).toBeDefined();
    expect(result.user.email).toBe(testEmail);
    expect(result.token).toBeDefined();
    console.log("[E2E] ✓ Login successful");
  });

  it("should reject login with incorrect password", async () => {
    console.log("[E2E] Test 3: Login with wrong password");
    try {
      await loginUser({
        email: testEmail,
        password: "WrongPassword123",
      });
      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error.message).toContain("Email ou senha incorretos");
      console.log("[E2E] ✓ Login correctly rejected");
    }
  });

  it("should reject login with non-existent email", async () => {
    console.log("[E2E] Test 4: Login with non-existent email");
    try {
      await loginUser({
        email: "nonexistent@test.com",
        password: testPassword,
      });
      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error.message).toContain("Email ou senha incorretos");
      console.log("[E2E] ✓ Login correctly rejected");
    }
  });

  // ===== USER DATA TESTS =====

  it("should verify user exists in database", async () => {
    console.log("[E2E] Test 5: Verify user in database");
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    const result = await db.select().from(users).where(eq(users.email, testEmail)).limit(1);

    expect(result.length).toBe(1);
    expect(result[0].email).toBe(testEmail);
    expect(result[0].name).toBe(testName);
    console.log("[E2E] ✓ User verified in database");
  });

  it("should verify user has correct role (user)", async () => {
    console.log("[E2E] Test 6: Verify user role");
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    const result = await db.select().from(users).where(eq(users.email, testEmail)).limit(1);

    expect(result.length).toBe(1);
    expect(result[0].role).toBe("user");
    console.log("[E2E] ✓ User role verified (should be 'user')");
  });

  it("should verify user is not a donor initially", async () => {
    console.log("[E2E] Test 7: Verify user is not donor");
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    const result = await db.select().from(users).where(eq(users.email, testEmail)).limit(1);

    expect(result.length).toBe(1);
    expect(result[0].isDonor).toBe(0);
    console.log("[E2E] ✓ User is not a donor initially");
  });

  // ===== ADMIN TESTS =====

  it("should verify admin user exists", async () => {
    console.log("[E2E] Test 8: Verify admin user exists");
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    const result = await db
      .select()
      .from(users)
      .where(eq(users.role, "admin"))
      .limit(1);

    expect(result.length).toBeGreaterThan(0);
    expect(result[0].role).toBe("admin");
    console.log("[E2E] ✓ Admin user verified");
  });

  it("should verify admin has different role than regular user", async () => {
    console.log("[E2E] Test 9: Verify role separation");
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    const adminResult = await db
      .select()
      .from(users)
      .where(eq(users.role, "admin"))
      .limit(1);

    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.email, testEmail))
      .limit(1);

    expect(adminResult[0].role).toBe("admin");
    expect(userResult[0].role).toBe("user");
    expect(adminResult[0].role).not.toBe(userResult[0].role);
    console.log("[E2E] ✓ Role separation verified");
  });

  // ===== SECURITY TESTS =====

  it("should not expose password hash in login response", async () => {
    console.log("[E2E] Test 10: Verify password hash not exposed");
    const result = await loginUser({
      email: testEmail,
      password: testPassword,
    });

    expect(result.user).toBeDefined();
    expect(result.user.passwordHash).toBeUndefined();
    expect(Object.keys(result.user)).not.toContain("passwordHash");
    console.log("[E2E] ✓ Password hash not exposed");
  });

  it("should verify password is hashed in database", async () => {
    console.log("[E2E] Test 11: Verify password is hashed");
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    const result = await db.select().from(users).where(eq(users.email, testEmail)).limit(1);

    expect(result[0].passwordHash).toBeDefined();
    expect(result[0].passwordHash).not.toBe(testPassword);
    expect(result[0].passwordHash?.length).toBeGreaterThan(20);
    console.log("[E2E] ✓ Password is hashed in database");
  });

  // ===== MULTIPLE USERS TEST =====

  it("should handle multiple users without conflicts", async () => {
    console.log("[E2E] Test 12: Multiple users");
    const email2 = `e2e-test-2-${Date.now()}@test.com`;
    const password2 = "AnotherPassword123";
    const name2 = "Another User";

    // Signup second user
    const result1 = await signupUser({
      email: email2,
      password: password2,
      name: name2,
    });

    expect(result1.user.email).toBe(email2);

    // Verify first user still exists
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    const firstUser = await db
      .select()
      .from(users)
      .where(eq(users.email, testEmail))
      .limit(1);

    const secondUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email2))
      .limit(1);

    expect(firstUser.length).toBe(1);
    expect(secondUser.length).toBe(1);
    expect(firstUser[0].id).not.toBe(secondUser[0].id);

    // Cleanup second user
    await db.delete(users).where(eq(users.email, email2));
    console.log("[E2E] ✓ Multiple users handled correctly");
  });
});
