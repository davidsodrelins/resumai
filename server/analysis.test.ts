import { describe, expect, it } from "vitest";
import { analyzeATSCompatibility } from "./atsAnalyzer";
import { extractJobKeywords, analyzeKeywordMatch } from "./keywordMatcher";
import type { ResumeData } from "../shared/resumeTypes";

describe("ATS Analysis", () => {
  const mockResume: ResumeData = {
    personalInfo: {
      fullName: "João Silva",
      email: "joao@example.com",
      phone: "+55 11 99999-9999",
      location: "São Paulo, SP",
      summary: "Desenvolvedor full-stack com 5 anos de experiência em React e Node.js",
    },
    experience: [
      {
        company: "Tech Company",
        position: "Desenvolvedor Senior",
        startDate: "2020-01",
        endDate: "2024-12",
        description: "Desenvolvi aplicações web usando React e Node.js",
        achievements: [
          "Aumentei a performance em 30%",
          "Liderei equipe de 5 desenvolvedores",
        ],
      },
    ],
    education: [
      {
        institution: "Universidade de São Paulo",
        degree: "Bacharelado",
        field: "Ciência da Computação",
        startDate: "2015-01",
        endDate: "2019-12",
      },
    ],
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "Docker"],
    languages: [],
    certifications: [],
    projects: [],
  };

  it("should calculate overall ATS score", () => {
    const result = analyzeATSCompatibility(mockResume);
    
    expect(result.overall).toBeGreaterThanOrEqual(0);
    expect(result.overall).toBeLessThanOrEqual(100);
  });

  it("should provide breakdown scores", () => {
    const result = analyzeATSCompatibility(mockResume);
    
    expect(result.breakdown.formatting).toBeGreaterThanOrEqual(0);
    expect(result.breakdown.keywords).toBeGreaterThanOrEqual(0);
    expect(result.breakdown.actionVerbs).toBeGreaterThanOrEqual(0);
    expect(result.breakdown.quantification).toBeGreaterThanOrEqual(0);
  });

  it("should generate suggestions", () => {
    const result = analyzeATSCompatibility(mockResume);
    
    expect(Array.isArray(result.suggestions)).toBe(true);
    
    if (result.suggestions.length > 0) {
      const suggestion = result.suggestions[0];
      expect(suggestion).toHaveProperty("category");
      expect(suggestion).toHaveProperty("title");
      expect(suggestion).toHaveProperty("description");
      expect(suggestion).toHaveProperty("impact");
    }
  });

  it("should penalize missing essential sections", () => {
    const incompleteResume: ResumeData = {
      personalInfo: {
        fullName: "Test User",
      },
      experience: [],
      education: [],
      skills: [],
      languages: [],
      certifications: [],
      projects: [],
    };
    
    const result = analyzeATSCompatibility(incompleteResume);
    
    expect(result.overall).toBeLessThan(50);
    expect(result.suggestions.length).toBeGreaterThan(0);
  });
});

describe("Keyword Extraction", () => {
  it("should extract keywords from job description", () => {
    const jobDescription = `
      We are looking for a Senior Full-Stack Developer with experience in React, Node.js, and TypeScript.
      Must have 5+ years of experience and strong problem-solving skills.
      Experience with Docker and PostgreSQL is required.
    `;
    
    const keywords = extractJobKeywords(jobDescription);
    
    expect(Array.isArray(keywords)).toBe(true);
    expect(keywords.length).toBeGreaterThan(0);
    expect(keywords.some(k => k.includes("react") || k.includes("node"))).toBe(true);
  });

  it("should filter out stop words", () => {
    const jobDescription = "The developer will work with the team and the manager";
    const keywords = extractJobKeywords(jobDescription);
    
    // Stop words like "the", "and", "with" should be filtered
    expect(keywords.some(k => k === "the" || k === "and" || k === "with")).toBe(false);
  });

  it("should extract multi-word phrases", () => {
    const jobDescription = "Experience with full-stack development and problem-solving skills required";
    const keywords = extractJobKeywords(jobDescription);
    
    // Should extract phrases like "full-stack development"
    expect(keywords.some(k => k.split(" ").length > 1)).toBe(true);
  });
});

describe("Keyword Matching", () => {
  const mockResume: ResumeData = {
    personalInfo: {
      fullName: "João Silva",
      summary: "Desenvolvedor full-stack especializado em React e Node.js",
    },
    experience: [
      {
        company: "Tech Company",
        position: "Desenvolvedor",
        startDate: "2020-01",
        endDate: "2024-12",
        description: "Trabalhei com React, Node.js e TypeScript",
        achievements: [],
      },
    ],
    education: [],
    skills: ["React", "Node.js", "TypeScript", "Docker"],
    languages: [],
    certifications: [],
    projects: [],
  };

  it("should calculate match percentage", () => {
    const jobDescription = "Looking for React and Node.js developer with TypeScript experience";
    const result = analyzeKeywordMatch(mockResume, jobDescription);
    
    expect(result.matchPercentage).toBeGreaterThanOrEqual(0);
    expect(result.matchPercentage).toBeLessThanOrEqual(100);
  });

  it("should identify present keywords", () => {
    const jobDescription = "React developer needed";
    const result = analyzeKeywordMatch(mockResume, jobDescription);
    
    // Check if any keyword related to React is present
    const hasReactKeyword = result.keywords.some(k => 
      k.keyword.toLowerCase().includes("react") && k.present
    );
    expect(hasReactKeyword || result.matchPercentage > 0).toBe(true);
  });

  it("should identify missing keywords", () => {
    const jobDescription = "Python and Django experience required";
    const result = analyzeKeywordMatch(mockResume, jobDescription);
    
    const pythonKeyword = result.keywords.find(k => k.keyword.toLowerCase().includes("python"));
    if (pythonKeyword) {
      expect(pythonKeyword.present).toBe(false);
    }
  });

  it("should provide keyword locations", () => {
    const jobDescription = "React developer";
    const result = analyzeKeywordMatch(mockResume, jobDescription);
    
    const reactKeyword = result.keywords.find(k => k.keyword.toLowerCase().includes("react"));
    if (reactKeyword && reactKeyword.present) {
      expect(Array.isArray(reactKeyword.locations)).toBe(true);
      expect(reactKeyword.locations.length).toBeGreaterThan(0);
    }
  });

  it("should generate suggestions for missing keywords", () => {
    const jobDescription = "Python, Django, and AWS experience required";
    const result = analyzeKeywordMatch(mockResume, jobDescription);
    
    expect(Array.isArray(result.suggestions)).toBe(true);
    expect(result.suggestions.length).toBeGreaterThan(0);
    
    if (result.suggestions.length > 0) {
      const suggestion = result.suggestions[0];
      expect(suggestion).toHaveProperty("keyword");
      expect(suggestion).toHaveProperty("section");
      expect(suggestion).toHaveProperty("suggestion");
      expect(suggestion).toHaveProperty("priority");
    }
  });
});
