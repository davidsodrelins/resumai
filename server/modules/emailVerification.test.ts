import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  generateVerificationToken,
  markEmailAsVerified,
  isEmailVerified,
  requireEmailVerified,
} from "./emailVerification";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

describe("Email Verification", () => {
  let testUserId: number;

  beforeEach(async () => {
    // Create test user
    const db = await getDb();
    if (db) {
      const result = await db.insert(users).values({
        email: `test-verify-${Date.now()}@example.com`,
        passwordHash: "test-hash",
        name: "Test User",
        emailVerified: 0,
      });
      testUserId = result[0].insertId as number;
    }
  });

  it("should generate a verification token", () => {
    const token = generateVerificationToken();
    expect(token).toBeDefined();
    expect(token.length).toBe(64); // 32 bytes = 64 hex characters
    expect(typeof token).toBe("string");
  });

  it("should generate unique tokens", () => {
    const token1 = generateVerificationToken();
    const token2 = generateVerificationToken();
    expect(token1).not.toBe(token2);
  });

  it("should mark email as verified", async () => {
    const result = await markEmailAsVerified(testUserId);
    expect(result).toBe(true);

    // Verify the change
    const verified = await isEmailVerified(testUserId);
    expect(verified).toBe(true);
  });

  it("should check if email is verified", async () => {
    // Initially not verified
    let verified = await isEmailVerified(testUserId);
    expect(verified).toBe(false);

    // Mark as verified
    await markEmailAsVerified(testUserId);

    // Now should be verified
    verified = await isEmailVerified(testUserId);
    expect(verified).toBe(true);
  });

  it("should require email to be verified", async () => {
    // Should throw error if not verified
    await expect(requireEmailVerified(testUserId)).rejects.toThrow(
      "Email não verificado"
    );

    // Mark as verified
    await markEmailAsVerified(testUserId);

    // Should not throw error now
    await expect(requireEmailVerified(testUserId)).resolves.not.toThrow();
  });

  it("should handle non-existent user gracefully", async () => {
    const verified = await isEmailVerified(99999);
    expect(verified).toBe(false);
  });

  it("should handle marking non-existent user gracefully", async () => {
    const result = await markEmailAsVerified(99999);
    // Should return true (no error) but user won't be updated
    expect(result).toBe(true);
  });

  // Cleanup
  afterEach(async () => {
    const db = await getDb();
    if (db && testUserId) {
      await db.delete(users).where(eq(users.id, testUserId));
    }
  });
});
