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
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Resume generation sessions - stores temporary data during generation process
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
