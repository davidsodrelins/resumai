import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("resume.updateSection", () => {
  it("should update a resume section successfully", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const mockResumeData = {
      personalInfo: {
        fullName: "John Doe",
        email: "john@example.com"
      },
      experience: [],
      education: [],
      skills: [],
      languages: [],
      certifications: [],
      projects: [],
      additionalSections: []
    };

    const result = await caller.resume.updateSection({
      resumeData: mockResumeData,
      sectionName: "personalInfo",
      sectionData: {
        fullName: "Jane Doe",
        email: "jane@example.com"
      }
    });

    expect(result.success).toBe(true);
    expect(result.resume.personalInfo.fullName).toBe("Jane Doe");
    expect(result.resume.personalInfo.email).toBe("jane@example.com");
  });

  it("should preserve other sections when updating one section", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const mockResumeData = {
      personalInfo: {
        fullName: "John Doe",
        email: "john@example.com"
      },
      experience: [
        {
          company: "Tech Corp",
          position: "Developer",
          startDate: "2020",
          description: "Worked on projects"
        }
      ],
      education: [],
      skills: [],
      languages: [],
      certifications: [],
      projects: [],
      additionalSections: []
    };

    const result = await caller.resume.updateSection({
      resumeData: mockResumeData,
      sectionName: "personalInfo",
      sectionData: {
        fullName: "Jane Doe",
        email: "jane@example.com"
      }
    });

    expect(result.success).toBe(true);
    expect(result.resume.experience).toHaveLength(1);
    expect(result.resume.experience[0].company).toBe("Tech Corp");
  });
});
