import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).unique(), // Now optional for public auth
  email: varchar("email", { length: 320 }).notNull().unique(), // Required and unique for public auth
  passwordHash: varchar("password_hash", { length: 255 }), // For password-based auth
  name: text("name"),
  loginMethod: varchar("loginMethod", { length: 64 }).default("email"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  isBlocked: int("is_blocked").default(0).notNull(), // 0 = active, 1 = blocked
  
  // Location tracking
  country: varchar("country", { length: 100 }),
  state: varchar("state", { length: 100 }),
  city: varchar("city", { length: 100 }),
  
  // Language preference
  preferredLanguage: mysqlEnum("preferred_language", ["pt", "en", "es"]).default("pt").notNull(),
  
  // Donation tracking
  isDonor: int("is_donor").default(0).notNull(), // 0 = no, 1 = yes
  totalDonated: int("total_donated").default(0).notNull(), // Total em centavos (R$ 5 = 500)
  lastDonationAt: timestamp("last_donation_at"),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  
  // Usage limits
  resumesThisMonth: int("resumes_this_month").default(0).notNull(),
  lastResetAt: timestamp("last_reset_at").defaultNow().notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Saved resumes table for storing user's generated resumes
 */
export const savedResumes = mysqlTable("saved_resumes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  resumeData: text("resume_data").notNull(), // JSON stringified ResumeData
  model: mysqlEnum("model", ["reduced", "mixed", "complete"]).notNull(),
  language: mysqlEnum("language", ["pt", "en", "es"]).notNull(),
  template: mysqlEnum("template", ["classic", "modern", "minimal", "executive", "creative"]).notNull(),
  isDraft: int("is_draft").default(0).notNull(), // 0 = final, 1 = draft
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type SavedResume = typeof savedResumes.$inferSelect;
export type InsertSavedResume = typeof savedResumes.$inferInsert;

/**
 * Cover letters table for storing generated cover letters
 */
export const coverLetters = mysqlTable("cover_letters", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  resumeId: int("resume_id"), // Optional link to resume
  title: varchar("title", { length: 255 }).notNull(),
  companyName: varchar("company_name", { length: 255 }),
  jobTitle: varchar("job_title", { length: 255 }),
  jobDescription: text("job_description"),
  content: text("content").notNull(),
  language: mysqlEnum("language", ["pt", "en", "es"]).notNull(),
  template: mysqlEnum("template", ["classic", "modern", "minimal", "executive", "creative"]).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type CoverLetter = typeof coverLetters.$inferSelect;
export type InsertCoverLetter = typeof coverLetters.$inferInsert;

/**
 * Resume sessions - stores temporary data during generation process
 * Not persisted long-term as per requirements
 */
export const resumeSessions = mysqlTable("resume_sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  // Input data
  userPrompt: text("userPrompt"),
  linkedinUrl: varchar("linkedinUrl", { length: 500 }),
  uploadedFileUrls: json("uploadedFileUrls").$type<string[]>(),
  
  // Extracted and processed data
  extractedData: json("extractedData").$type<{
    personalInfo?: any;
    experience?: any[];
    education?: any[];
    skills?: any[];
    languages?: any[];
    certifications?: any[];
    projects?: any[];
    additionalSections?: any[];
  }>(),
  
  // Generated resumes
  generatedResumes: json("generatedResumes").$type<{
    reduced?: any;
    mixed?: any;
    complete?: any;
  }>(),
  
  // Metadata
  status: mysqlEnum("status", ["processing", "completed", "failed"]).default("processing").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ResumeSession = typeof resumeSessions.$inferSelect;
export type InsertResumeSession = typeof resumeSessions.$inferInsert;

/**
 * Payments table for tracking donations via Stripe
 */
export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }).notNull().unique(),
  amount: int("amount").notNull(), // Amount in cents (R$ 5.00 = 500)
  currency: varchar("currency", { length: 3 }).default("brl").notNull(),
  status: mysqlEnum("status", ["pending", "succeeded", "failed", "canceled"]).default("pending").notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }), // card, boleto, pix, etc
  metadata: json("metadata").$type<Record<string, any>>(), // Additional Stripe metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

/**
 * Password reset tokens table for forgot password flow
 */
export const passwordResetTokens = mysqlTable("password_reset_tokens", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  used: int("used").default(0).notNull(), // 0 = not used, 1 = used
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type InsertPasswordResetToken = typeof passwordResetTokens.$inferInsert;

/**
 * Activity logs table for tracking important admin actions
 */
export const activityLogs = mysqlTable("activity_logs", {
  id: int("id").autoincrement().primaryKey(),
  adminId: int("admin_id").notNull(), // User ID of admin who performed action
  targetUserId: int("target_user_id"), // User ID affected by action (optional)
  action: varchar("action", { length: 100 }).notNull(), // promote, demote, block, unblock, etc
  details: text("details"), // Additional context about the action
  ipAddress: varchar("ip_address", { length: 45 }), // IPv4 or IPv6
  userAgent: text("user_agent"), // Browser/device info
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = typeof activityLogs.$inferInsert;

/**
 * Referrals table for tracking user referrals and rewards
 */
export const referrals = mysqlTable("referrals", {
  id: int("id").autoincrement().primaryKey(),
  referrerId: int("referrer_id").notNull(), // User who shared the referral link
  referredId: int("referred_id"), // User who signed up via referral (null until signup)
  referralCode: varchar("referral_code", { length: 50 }).notNull().unique(), // Unique code for tracking
  status: mysqlEnum("status", ["pending", "completed", "rewarded"]).default("pending").notNull(),
  rewardCredits: int("reward_credits").default(0).notNull(), // Extra resumes granted
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"), // When referred user signed up
  rewardedAt: timestamp("rewarded_at"), // When reward was granted
});

export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = typeof referrals.$inferInsert;

/**
 * Blog posts table for SEO content
 */
export const blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(), // URL-friendly version of title
  content: text("content").notNull(), // Markdown content
  excerpt: text("excerpt"), // Short summary for listing pages
  authorId: int("author_id").notNull(), // User ID of author (admin)
  category: varchar("category", { length: 100 }), // e.g., "Dicas de Currículo", "Carreira"
  tags: text("tags"), // Comma-separated tags for filtering
  metaDescription: varchar("meta_description", { length: 160 }), // SEO meta description
  featuredImage: text("featured_image"), // URL to featured image
  status: mysqlEnum("status", ["draft", "published", "archived"]).default("draft").notNull(),
  publishedAt: timestamp("published_at"), // When post was published
  viewCount: int("view_count").default(0).notNull(), // Track popularity
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;
