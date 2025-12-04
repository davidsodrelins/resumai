import { describe, it, expect, beforeAll } from "vitest";
import { signupUser, loginUser, verifyToken } from "./publicAuth";
import { getDb } from "./db";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

describe("Public Authentication", () => {
  const testEmail = `test-${Date.now()}@test.com`;
  const testPassword = "test123456";
  const testName = "Test User";
  let testUserId: number;
  let testToken: string;

  it("should signup a new user", async () => {
    const result = await signupUser({
      email: testEmail,
      password: testPassword,
      name: testName,
    });

    expect(result).toBeDefined();
    expect(result.user).toBeDefined();
    expect(result.user.email).toBe(testEmail.toLowerCase());
    expect(result.user.name).toBe(testName);
    expect(result.token).toBeDefined();
    expect(typeof result.token).toBe("string");

    testUserId = result.user.id;
    testToken = result.token;
  });

  it("should reject duplicate email signup", async () => {
    await expect(
      signupUser({
        email: testEmail,
        password: testPassword,
        name: testName,
      })
    ).rejects.toThrow("Email já cadastrado");
  });

  it("should reject invalid email", async () => {
    await expect(
      signupUser({
        email: "invalid-email",
        password: testPassword,
        name: testName,
      })
    ).rejects.toThrow("Email inválido");
  });

  it("should reject short password", async () => {
    await expect(
      signupUser({
        email: "another@test.com",
        password: "123",
        name: testName,
      })
    ).rejects.toThrow("Senha deve ter no mínimo 6 caracteres");
  });

  it("should login with correct credentials", async () => {
    const result = await loginUser({
      email: testEmail,
      password: testPassword,
    });

    expect(result).toBeDefined();
    expect(result.user).toBeDefined();
    expect(result.user.email).toBe(testEmail.toLowerCase());
    expect(result.user.name).toBe(testName);
    expect(result.token).toBeDefined();
    expect(typeof result.token).toBe("string");
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

  it("should verify valid JWT token", async () => {
    const user = await verifyToken(testToken);

    expect(user).toBeDefined();
    expect(user.id).toBe(testUserId);
    expect(user.email).toBe(testEmail.toLowerCase());
    expect(user.name).toBe(testName);
  });

  it("should reject invalid JWT token", async () => {
    await expect(verifyToken("invalid-token")).rejects.toThrow(
      "Token inválido ou expirado"
    );
  });

  it("should reject expired JWT token", async () => {
    // Create a token that expired 1 hour ago
    const jwt = require("jsonwebtoken");
    const { ENV } = await import("./_core/env");
    const expiredToken = jwt.sign(
      { userId: testUserId, email: testEmail },
      ENV.cookieSecret,
      { expiresIn: "-1h" }
    );

    await expect(verifyToken(expiredToken)).rejects.toThrow(
      "Token inválido ou expirado"
    );
  });

  // Cleanup: delete test user
  it("should cleanup test user", async () => {
    const db = await getDb();
    if (db) {
      await db.delete(users).where(eq(users.id, testUserId));
    }
  });
});
