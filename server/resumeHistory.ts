import { eq, desc } from "drizzle-orm";
import { getDb } from "./db";
import { savedResumes, coverLetters, type InsertSavedResume, type InsertCoverLetter } from "../drizzle/schema";
import type { ResumeData } from "../shared/resumeTypes";

/**
 * Save a resume to the database
 */
export async function saveResume(data: {
  userId: number;
  title: string;
  resumeData: ResumeData;
  model: "reduced" | "mixed" | "complete";
  language: "pt" | "en" | "es";
  template: "classic" | "modern" | "minimal" | "executive" | "creative";
  isDraft?: boolean;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const resume: InsertSavedResume = {
    userId: data.userId,
    title: data.title,
    resumeData: JSON.stringify(data.resumeData),
    model: data.model,
    language: data.language,
    template: data.template,
    isDraft: data.isDraft ? 1 : 0,
  };

  const result = await db.insert(savedResumes).values(resume);
  return result;
}

/**
 * Update an existing resume
 */
export async function updateResume(
  id: number,
  userId: number,
  data: {
    title?: string;
    resumeData?: ResumeData;
    model?: "reduced" | "mixed" | "complete";
    language?: "pt" | "en" | "es";
    template?: "classic" | "modern" | "minimal" | "executive" | "creative";
    isDraft?: boolean;
  }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updateData: Partial<InsertSavedResume> = {};
  if (data.title) updateData.title = data.title;
  if (data.resumeData) updateData.resumeData = JSON.stringify(data.resumeData);
  if (data.model) updateData.model = data.model;
  if (data.language) updateData.language = data.language;
  if (data.template) updateData.template = data.template;
  if (data.isDraft !== undefined) updateData.isDraft = data.isDraft ? 1 : 0;

  await db
    .update(savedResumes)
    .set(updateData)
    .where(eq(savedResumes.id, id));
}

/**
 * Get all resumes for a user
 */
export async function getUserResumes(userId: number, includeDrafts: boolean = true) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  let query = db
    .select()
    .from(savedResumes)
    .where(eq(savedResumes.userId, userId))
    .orderBy(desc(savedResumes.updatedAt));

  const results = await query;

  return results.map((resume) => ({
    ...resume,
    resumeData: JSON.parse(resume.resumeData) as ResumeData,
    isDraft: resume.isDraft === 1,
  }));
}

/**
 * Get a specific resume by ID
 */
export async function getResumeById(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const results = await db
    .select()
    .from(savedResumes)
    .where(eq(savedResumes.id, id))
    .limit(1);

  if (results.length === 0) return null;

  const resume = results[0];
  if (resume.userId !== userId) return null;

  return {
    ...resume,
    resumeData: JSON.parse(resume.resumeData) as ResumeData,
    isDraft: resume.isDraft === 1,
  };
}

/**
 * Delete a resume
 */
export async function deleteResume(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .delete(savedResumes)
    .where(eq(savedResumes.id, id));
}

/**
 * Save a cover letter
 */
export async function saveCoverLetter(data: {
  userId: number;
  resumeId?: number;
  title: string;
  companyName?: string;
  jobTitle?: string;
  jobDescription?: string;
  content: string;
  language: "pt" | "en" | "es";
  template: "classic" | "modern" | "minimal" | "executive" | "creative";
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const coverLetter: InsertCoverLetter = {
    userId: data.userId,
    resumeId: data.resumeId,
    title: data.title,
    companyName: data.companyName,
    jobTitle: data.jobTitle,
    jobDescription: data.jobDescription,
    content: data.content,
    language: data.language,
    template: data.template,
  };

  const result = await db.insert(coverLetters).values(coverLetter);
  return result;
}

/**
 * Get all cover letters for a user
 */
export async function getUserCoverLetters(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const results = await db
    .select()
    .from(coverLetters)
    .where(eq(coverLetters.userId, userId))
    .orderBy(desc(coverLetters.updatedAt));

  return results;
}

/**
 * Get a specific cover letter by ID
 */
export async function getCoverLetterById(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const results = await db
    .select()
    .from(coverLetters)
    .where(eq(coverLetters.id, id))
    .limit(1);

  if (results.length === 0) return null;

  const letter = results[0];
  if (letter.userId !== userId) return null;

  return letter;
}

/**
 * Delete a cover letter
 */
export async function deleteCoverLetter(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .delete(coverLetters)
    .where(eq(coverLetters.id, id));
}
