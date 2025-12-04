import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { signupUser, loginUser } from "./publicAuth";
import { getDb } from "./db";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * Complete Authentication Flow Test
 * Tests the entire user journey: signup → login → session
 */
describe("Complete Auth Flow", () => {
  const testEmail = `flow-test-${Date.now()}@test.com`;
  const testPassword = "TestPassword123!";
  const testName = "Flow Test User";
  let userId: number;

  afterAll(async () => {
    // Cleanup
    try {
      const db = await getDb();
      if (db && userId) {
        await db.delete(users).where(eq(users.id, userId));
        console.log("[Flow Test] ✓ Cleanup completed");
      }
    } catch (error) {
      console.error("[Flow Test] Error during cleanup:", error);
    }
  });

  it("should complete full signup flow", async () => {
    console.log("[Flow Test] Step 1: Testing signup");
    
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
    expect(result.token.length).toBeGreaterThan(20);

    userId = result.user.id;
    console.log("[Flow Test] ✓ Signup successful, userId:", userId);
  });

  it("should verify user exists in database", async () => {
    console.log("[Flow Test] Step 2: Verifying user in database");
    
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, testEmail))
      .limit(1);

    expect(result.length).toBe(1);
    expect(result[0].email).toBe(testEmail);
    expect(result[0].name).toBe(testName);
    expect(result[0].passwordHash).toBeDefined();
    expect(result[0].passwordHash).not.toBe(testPassword);
    
    console.log("[Flow Test] ✓ User verified in database");
  });

  it("should complete full login flow", async () => {
    console.log("[Flow Test] Step 3: Testing login");
    
    const result = await loginUser({
      email: testEmail,
      password: testPassword,
    });

    expect(result).toBeDefined();
    expect(result.user).toBeDefined();
    expect(result.user.email).toBe(testEmail);
    expect(result.token).toBeDefined();
    expect(result.token.length).toBeGreaterThan(20);
    
    console.log("[Flow Test] ✓ Login successful");
  });

  it("should reject login with wrong password", async () => {
    console.log("[Flow Test] Step 4: Testing wrong password");
    
    try {
      await loginUser({
        email: testEmail,
        password: "WrongPassword123!",
      });
      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error.message).toContain("Email ou senha incorretos");
      console.log("[Flow Test] ✓ Wrong password correctly rejected");
    }
  });

  it("should reject signup with existing email", async () => {
    console.log("[Flow Test] Step 5: Testing duplicate email");
    
    try {
      await signupUser({
        email: testEmail,
        password: "AnotherPassword123!",
        name: "Another User",
      });
      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error.message).toContain("já cadastrado");
      console.log("[Flow Test] ✓ Duplicate email correctly rejected");
    }
  });

  it("should verify token structure", async () => {
    console.log("[Flow Test] Step 6: Verifying token structure");
    
    const result = await loginUser({
      email: testEmail,
      password: testPassword,
    });

    // JWT tokens have 3 parts separated by dots
    const tokenParts = result.token.split(".");
    expect(tokenParts.length).toBe(3);
    
    console.log("[Flow Test] ✓ Token structure verified");
  });

  it("should not expose sensitive data in response", async () => {
    console.log("[Flow Test] Step 7: Checking sensitive data exposure");
    
    const result = await loginUser({
      email: testEmail,
      password: testPassword,
    });

    expect(result.user.passwordHash).toBeUndefined();
    expect(Object.keys(result.user)).not.toContain("passwordHash");
    
    console.log("[Flow Test] ✓ Sensitive data not exposed");
  });
});
