import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
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
