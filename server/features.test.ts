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

describe("New Features - Endpoint Availability", () => {
  it("should have resume history endpoints", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Verify history endpoints exist
    expect(caller.history).toBeDefined();
    expect(caller.history.listResumes).toBeDefined();
    expect(caller.history.updateResume).toBeDefined();
    expect(caller.history.deleteResume).toBeDefined();

    // Test listResumes returns array
    const resumes = await caller.history.listResumes();
    expect(Array.isArray(resumes)).toBe(true);
  });

  it("should have cover letter generation endpoint", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Verify cover letter endpoint exists
    expect(caller.coverLetter).toBeDefined();
    expect(caller.coverLetter.generate).toBeDefined();
  });

  it("should have resume generation endpoints", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Verify resume endpoints exist
    expect(caller.resume).toBeDefined();
    expect(caller.resume.process).toBeDefined();
    expect(caller.resume.generate).toBeDefined();
    expect(caller.resume.exportPDF).toBeDefined();
    expect(caller.resume.exportDOCX).toBeDefined();
  });

  it("should have auth endpoints", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Verify auth endpoints exist
    expect(caller.auth).toBeDefined();
    expect(caller.auth.me).toBeDefined();
    expect(caller.auth.logout).toBeDefined();

    // Test auth.me returns user
    const user = await caller.auth.me();
    expect(user).toBeDefined();
    expect(user?.email).toBe("test@example.com");
  });
});

describe("Feature Integration", () => {
  it("should support complete resume workflow", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Verify all required endpoints for complete workflow exist
    const workflowEndpoints = [
      caller.resume.process,
      caller.resume.generate,
      caller.resume.exportPDF,
      caller.resume.exportDOCX,
      caller.history.listResumes,
      caller.history.updateResume,
      caller.coverLetter.generate,
    ];

    workflowEndpoints.forEach((endpoint) => {
      expect(endpoint).toBeDefined();
    });
  });

  it("should support comparison workflow", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Get resumes for comparison
    const resumes = await caller.history.listResumes();
    expect(Array.isArray(resumes)).toBe(true);

    // Verify resume structure for comparison
    if (resumes && resumes.length > 0) {
      const resume = resumes[0];
      expect(resume).toHaveProperty("id");
      expect(resume).toHaveProperty("title");
      expect(resume).toHaveProperty("resumeData");
      expect(resume).toHaveProperty("model");
      expect(resume).toHaveProperty("language");
      expect(resume).toHaveProperty("template");
      expect(resume).toHaveProperty("createdAt");
      expect(resume).toHaveProperty("updatedAt");
    }
  });
});
