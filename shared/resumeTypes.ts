export interface PersonalInfo {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  website?: string;
  summary?: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description?: string;
  achievements?: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field?: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
}

export interface Language {
  name: string;
  proficiency: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
}

export interface Project {
  name: string;
  description: string;
  technologies?: string[];
  url?: string;
  startDate?: string;
  endDate?: string;
}

export interface AdditionalSection {
  title: string;
  content: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
  languages: Language[];
  certifications: Certification[];
  projects: Project[];
  additionalSections: AdditionalSection[];
}

export type ResumeModel = "reduced" | "mixed" | "complete";
export type ResumeLanguage = "pt" | "en" | "es";
export type ResumeTemplate = "classic" | "modern" | "minimal" | "executive" | "creative";
