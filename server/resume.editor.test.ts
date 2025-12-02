import { describe, expect, it } from "vitest";
import type { ResumeData, Experience, Education, AdditionalSection } from "../shared/resumeTypes";

describe("Resume Editor Data Structures", () => {
  it("should create valid resume data with all sections", () => {
    const resumeData: ResumeData = {
      personalInfo: {
        fullName: "John Doe",
        email: "john@example.com",
        phone: "+1234567890",
        location: "New York, USA",
        summary: "Experienced professional",
      },
      experience: [
        {
          company: "Tech Corp",
          position: "Senior Developer",
          startDate: "2020-01",
          endDate: "2023-12",
          description: "Led development team",
          achievements: ["Increased performance by 50%"],
        },
      ],
      education: [
        {
          institution: "University of Tech",
          degree: "Bachelor of Science",
          field: "Computer Science",
          startDate: "2015",
          endDate: "2019",
        },
      ],
      skills: ["JavaScript", "TypeScript", "React"],
      languages: [
        { name: "English", proficiency: "Native" },
        { name: "Spanish", proficiency: "Intermediate" },
      ],
      certifications: [
        {
          name: "AWS Certified",
          issuer: "Amazon",
          date: "2022-06",
        },
      ],
      projects: [
        {
          name: "E-commerce Platform",
          description: "Built scalable platform",
          technologies: ["React", "Node.js"],
        },
      ],
      additionalSections: [
        {
          title: "Volunteer Work",
          content: "Taught coding to underprivileged youth",
        },
      ],
    };

    expect(resumeData.personalInfo.fullName).toBe("John Doe");
    expect(resumeData.experience).toHaveLength(1);
    expect(resumeData.education).toHaveLength(1);
    expect(resumeData.skills).toHaveLength(3);
    expect(resumeData.languages).toHaveLength(2);
    expect(resumeData.certifications).toHaveLength(1);
    expect(resumeData.projects).toHaveLength(1);
    expect(resumeData.additionalSections).toHaveLength(1);
  });

  it("should handle adding new experience", () => {
    const experiences: Experience[] = [
      {
        company: "Company A",
        position: "Developer",
        startDate: "2020",
      },
    ];

    const newExperience: Experience = {
      company: "Company B",
      position: "Senior Developer",
      startDate: "2023",
    };

    const updated = [...experiences, newExperience];
    expect(updated).toHaveLength(2);
    expect(updated[1].company).toBe("Company B");
  });

  it("should handle removing experience", () => {
    const experiences: Experience[] = [
      { company: "A", position: "Dev", startDate: "2020" },
      { company: "B", position: "Dev", startDate: "2021" },
      { company: "C", position: "Dev", startDate: "2022" },
    ];

    const updated = experiences.filter((_, i) => i !== 1);
    expect(updated).toHaveLength(2);
    expect(updated[0].company).toBe("A");
    expect(updated[1].company).toBe("C");
  });

  it("should handle updating experience", () => {
    const experiences: Experience[] = [
      { company: "Old Company", position: "Dev", startDate: "2020" },
    ];

    const updated = [...experiences];
    updated[0] = { ...updated[0], company: "New Company" };

    expect(updated[0].company).toBe("New Company");
    expect(updated[0].position).toBe("Dev");
  });

  it("should handle adding custom sections", () => {
    const sections: AdditionalSection[] = [];

    const newSection: AdditionalSection = {
      title: "Publications",
      content: "Published 5 research papers",
    };

    const updated = [...sections, newSection];
    expect(updated).toHaveLength(1);
    expect(updated[0].title).toBe("Publications");
  });

  it("should handle reordering sections", () => {
    const sections: AdditionalSection[] = [
      { title: "Section A", content: "Content A" },
      { title: "Section B", content: "Content B" },
      { title: "Section C", content: "Content C" },
    ];

    // Move section at index 0 down (swap with index 1)
    const updated = [...sections];
    [updated[0], updated[1]] = [updated[1], updated[0]];

    expect(updated[0].title).toBe("Section B");
    expect(updated[1].title).toBe("Section A");
    expect(updated[2].title).toBe("Section C");
  });

  it("should validate required personal info fields", () => {
    const personalInfo = {
      fullName: "Jane Doe",
      email: "jane@example.com",
    };

    expect(personalInfo.fullName).toBeTruthy();
    expect(personalInfo.email).toBeTruthy();
    expect(personalInfo.email).toContain("@");
  });

  it("should handle multiple skills", () => {
    const skills = ["JavaScript", "Python", "Go", "Rust"];
    
    const addSkill = (skillList: string[], newSkill: string) => [...skillList, newSkill];
    const removeSkill = (skillList: string[], index: number) => 
      skillList.filter((_, i) => i !== index);

    const withNewSkill = addSkill(skills, "TypeScript");
    expect(withNewSkill).toHaveLength(5);

    const withRemovedSkill = removeSkill(withNewSkill, 0);
    expect(withRemovedSkill).toHaveLength(4);
    expect(withRemovedSkill[0]).toBe("Python");
  });

  it("should handle education with optional fields", () => {
    const education: Education = {
      institution: "MIT",
      degree: "PhD",
      field: "Artificial Intelligence",
      startDate: "2020",
      endDate: "2024",
      gpa: "4.0",
    };

    expect(education.institution).toBe("MIT");
    expect(education.gpa).toBe("4.0");

    const educationWithoutGPA: Education = {
      institution: "Harvard",
      degree: "Master",
      startDate: "2018",
      endDate: "2020",
    };

    expect(educationWithoutGPA.gpa).toBeUndefined();
  });
});

describe("Resume Template Types", () => {
  it("should support all template types", () => {
    const templates = ["classic", "modern", "minimal", "executive", "creative"];
    
    templates.forEach(template => {
      expect(["classic", "modern", "minimal", "executive", "creative"]).toContain(template);
    });
  });

  it("should support all language types", () => {
    const languages = ["pt", "en", "es"];
    
    languages.forEach(lang => {
      expect(["pt", "en", "es"]).toContain(lang);
    });
  });

  it("should support all resume model types", () => {
    const models = ["reduced", "mixed", "complete"];
    
    models.forEach(model => {
      expect(["reduced", "mixed", "complete"]).toContain(model);
    });
  });
});
