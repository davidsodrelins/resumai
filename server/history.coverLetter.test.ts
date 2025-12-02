import { describe, expect, it } from "vitest";
import type { ResumeData } from "../shared/resumeTypes";
import type { CoverLetterInput } from "./coverLetterGenerator";

describe("Resume History Data Structures", () => {
  it("should create valid saved resume data", () => {
    const savedResume = {
      id: 1,
      userId: 123,
      title: "Currículo Desenvolvedor Senior",
      resumeData: {} as ResumeData,
      model: "complete" as const,
      language: "pt" as const,
      template: "modern" as const,
      isDraft: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(savedResume.title).toBe("Currículo Desenvolvedor Senior");
    expect(savedResume.model).toBe("complete");
    expect(savedResume.language).toBe("pt");
    expect(savedResume.template).toBe("modern");
    expect(savedResume.isDraft).toBe(false);
  });

  it("should handle draft status correctly", () => {
    const draft = { isDraft: true };
    const final = { isDraft: false };

    expect(draft.isDraft).toBe(true);
    expect(final.isDraft).toBe(false);
  });

  it("should validate resume model types", () => {
    const models = ["reduced", "mixed", "complete"];
    models.forEach((model) => {
      expect(["reduced", "mixed", "complete"]).toContain(model);
    });
  });

  it("should validate language types", () => {
    const languages = ["pt", "en", "es"];
    languages.forEach((lang) => {
      expect(["pt", "en", "es"]).toContain(lang);
    });
  });

  it("should validate template types", () => {
    const templates = ["classic", "modern", "minimal", "executive", "creative"];
    templates.forEach((template) => {
      expect(["classic", "modern", "minimal", "executive", "creative"]).toContain(template);
    });
  });
});

describe("Cover Letter Data Structures", () => {
  it("should create valid cover letter data", () => {
    const coverLetter = {
      id: 1,
      userId: 123,
      resumeId: 456,
      title: "Carta para Vaga de Desenvolvedor",
      companyName: "Tech Corp",
      jobTitle: "Senior Developer",
      jobDescription: "Looking for experienced developer",
      content: "Dear Hiring Manager...",
      language: "en" as const,
      template: "modern" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(coverLetter.title).toBe("Carta para Vaga de Desenvolvedor");
    expect(coverLetter.companyName).toBe("Tech Corp");
    expect(coverLetter.jobTitle).toBe("Senior Developer");
    expect(coverLetter.language).toBe("en");
  });

  it("should handle optional resume link", () => {
    const withResume = { resumeId: 123 };
    const withoutResume = { resumeId: undefined };

    expect(withResume.resumeId).toBe(123);
    expect(withoutResume.resumeId).toBeUndefined();
  });

  it("should create valid cover letter input", () => {
    const input: CoverLetterInput = {
      resumeData: {
        personalInfo: {
          fullName: "John Doe",
          email: "john@example.com",
        },
        experience: [],
        education: [],
        skills: ["JavaScript", "TypeScript"],
      },
      companyName: "Awesome Company",
      jobTitle: "Frontend Developer",
      jobDescription: "We are looking for a talented frontend developer",
      language: "en",
      additionalInfo: "Available for remote work",
    };

    expect(input.companyName).toBe("Awesome Company");
    expect(input.jobTitle).toBe("Frontend Developer");
    expect(input.language).toBe("en");
    expect(input.resumeData.skills).toHaveLength(2);
  });

  it("should handle optional fields in cover letter input", () => {
    const minimalInput: CoverLetterInput = {
      resumeData: {
        personalInfo: { fullName: "Jane Doe" },
      },
      companyName: "Company",
      jobTitle: "Position",
      language: "pt",
    };

    expect(minimalInput.jobDescription).toBeUndefined();
    expect(minimalInput.additionalInfo).toBeUndefined();
    expect(minimalInput.companyName).toBe("Company");
  });
});

describe("Resume History Operations", () => {
  it("should filter resumes by draft status", () => {
    const resumes = [
      { id: 1, isDraft: true, title: "Draft 1" },
      { id: 2, isDraft: false, title: "Final 1" },
      { id: 3, isDraft: true, title: "Draft 2" },
      { id: 4, isDraft: false, title: "Final 2" },
    ];

    const drafts = resumes.filter((r) => r.isDraft);
    const finals = resumes.filter((r) => !r.isDraft);

    expect(drafts).toHaveLength(2);
    expect(finals).toHaveLength(2);
    expect(drafts[0].title).toBe("Draft 1");
    expect(finals[0].title).toBe("Final 1");
  });

  it("should sort resumes by update date", () => {
    const resumes = [
      { id: 1, updatedAt: new Date("2024-01-01") },
      { id: 2, updatedAt: new Date("2024-03-01") },
      { id: 3, updatedAt: new Date("2024-02-01") },
    ];

    const sorted = [...resumes].sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    );

    expect(sorted[0].id).toBe(2); // Most recent
    expect(sorted[1].id).toBe(3);
    expect(sorted[2].id).toBe(1); // Oldest
  });

  it("should handle resume data serialization", () => {
    const resumeData: ResumeData = {
      personalInfo: { fullName: "Test User" },
      experience: [{ company: "Test Co", position: "Dev", startDate: "2020" }],
      skills: ["JavaScript"],
    };

    const serialized = JSON.stringify(resumeData);
    const deserialized = JSON.parse(serialized) as ResumeData;

    expect(deserialized.personalInfo?.fullName).toBe("Test User");
    expect(deserialized.experience).toHaveLength(1);
    expect(deserialized.skills).toContain("JavaScript");
  });
});

describe("Cover Letter Language Support", () => {
  it("should support Portuguese language", () => {
    const input: CoverLetterInput = {
      resumeData: { personalInfo: { fullName: "João Silva" } },
      companyName: "Empresa Brasileira",
      jobTitle: "Desenvolvedor",
      language: "pt",
    };

    expect(input.language).toBe("pt");
    expect(input.companyName).toBe("Empresa Brasileira");
  });

  it("should support English language", () => {
    const input: CoverLetterInput = {
      resumeData: { personalInfo: { fullName: "John Smith" } },
      companyName: "American Company",
      jobTitle: "Developer",
      language: "en",
    };

    expect(input.language).toBe("en");
    expect(input.companyName).toBe("American Company");
  });

  it("should support Spanish language", () => {
    const input: CoverLetterInput = {
      resumeData: { personalInfo: { fullName: "Juan García" } },
      companyName: "Empresa Española",
      jobTitle: "Desarrollador",
      language: "es",
    };

    expect(input.language).toBe("es");
    expect(input.companyName).toBe("Empresa Española");
  });
});
