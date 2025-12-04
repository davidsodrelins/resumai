import bcrypt from "bcryptjs";
import { getDb } from "./db";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { ENV } from "./_core/env";

const SALT_ROUNDS = 10;
const JWT_SECRET = ENV.cookieSecret;
const JWT_EXPIRES_IN = "30d"; // 30 days

export interface SignupData {
  email: string;
  password: string;
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

/**
 * Register a new user with email/password
 */
export async function signupUser(data: SignupData) {
  const { email, password, name } = data;

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Email inválido");
  }

  // Validate password strength (min 6 characters)
  if (password.length < 6) {
    throw new Error("Senha deve ter no mínimo 6 caracteres");
  }

  // Check if email already exists
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");
  
  const existingUsers = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
  const existingUser = existingUsers.length > 0 ? existingUsers[0] : null;

  if (existingUser) {
    throw new Error("Email já cadastrado");
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // Create user
  const [newUser] = await db.insert(users).values({
    email: email.toLowerCase(),
    passwordHash,
    name,
    loginMethod: "email",
    role: "user",
    isDonor: 0,
    totalDonated: 0,
    resumesThisMonth: 0,
  });

  // Generate JWT token
  const token = jwt.sign(
    { userId: newUser.insertId, email: email.toLowerCase() },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return {
    user: {
      id: newUser.insertId,
      email: email.toLowerCase(),
      name,
    },
    token,
  };
}

/**
 * Login user with email/password
 */
export async function loginUser(data: LoginData) {
  const { email, password } = data;

  // Find user by email
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");
  
  const userResult = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
  const user = userResult.length > 0 ? userResult[0] : null;

  if (!user) {
    throw new Error("Email ou senha incorretos");
  }

  // Check if user has password (might be OAuth user)
  if (!user.passwordHash) {
    throw new Error("Esta conta usa login social. Use o método de login original.");
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.passwordHash);

  if (!isValidPassword) {
    throw new Error("Email ou senha incorretos");
  }

  // Update last signed in
  await db.update(users)
    .set({ lastSignedIn: new Date() })
    .where(eq(users.id, user.id));

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      isDonor: user.isDonor === 1,
      resumesThisMonth: user.resumesThisMonth,
    },
    token,
  };
}

/**
 * Verify JWT token and return user
 */
export async function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
    
    // Fetch user from database
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");
    
    const userResult = await db.select().from(users).where(eq(users.id, decoded.userId)).limit(1);
    const user = userResult.length > 0 ? userResult[0] : null;

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    // Return full user object to match User type
    return user;
  } catch (error) {
    throw new Error("Token inválido ou expirado");
  }
}

/**
 * Check if user has reached resume limit
 */
export async function checkResumeLimit(userId: number): Promise<{ canCreate: boolean; remaining: number }> {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");
  
  const userResult = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  const user = userResult.length > 0 ? userResult[0] : null;

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  // Donors have unlimited resumes
  if (user.isDonor === 1) {
    return { canCreate: true, remaining: -1 }; // -1 = unlimited
  }

  // Check if we need to reset monthly counter
  const now = new Date();
  const lastReset = new Date(user.lastResetAt);
  const monthsSinceReset = (now.getFullYear() - lastReset.getFullYear()) * 12 + 
                           (now.getMonth() - lastReset.getMonth());

  if (monthsSinceReset >= 1) {
    // Reset counter
    await db.update(users)
      .set({ 
        resumesThisMonth: 0,
        lastResetAt: now,
      })
      .where(eq(users.id, userId));
    
    return { canCreate: true, remaining: 5 };
  }

  // Check limit (5 resumes per month for non-donors)
  const MONTHLY_LIMIT = 5;
  const remaining = MONTHLY_LIMIT - user.resumesThisMonth;

  return {
    canCreate: remaining > 0,
    remaining: Math.max(0, remaining),
  };
}

/**
 * Increment resume counter for user
 */
export async function incrementResumeCount(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");
  
  const userResult = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  const user = userResult.length > 0 ? userResult[0] : null;

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  // Don't increment for donors
  if (user.isDonor === 1) {
    return;
  }

  await db.update(users)
    .set({ resumesThisMonth: user.resumesThisMonth + 1 })
    .where(eq(users.id, userId));
}
