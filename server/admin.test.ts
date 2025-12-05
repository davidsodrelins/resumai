import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import { getDb } from "./db";
import { users, activityLogs } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import type { User } from "../drizzle/schema";

describe("Admin Router", () => {
  let adminUser: User;
  let regularUser: User;

  beforeAll(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    // Find or create admin user
    const admins = await db.select().from(users).where(eq(users.role, "admin")).limit(1);
    if (admins.length > 0) {
      adminUser = admins[0];
    } else {
      throw new Error("No admin user found in database");
    }

    // Find or create regular user
    const regularUsers = await db.select().from(users).where(eq(users.role, "user")).limit(1);
    if (regularUsers.length > 0) {
      regularUser = regularUsers[0];
    } else {
      throw new Error("No regular user found in database");
    }
  });

  describe("adminProcedure middleware", () => {
    it("should deny access to non-admin users", async () => {
      const caller = appRouter.createCaller({
        user: regularUser,
        req: {} as any,
        res: {} as any,
      });

      await expect(caller.admin.getGlobalStats()).rejects.toThrow("Apenas administradores");
    });

    it("should allow access to admin users", async () => {
      const caller = appRouter.createCaller({
        user: adminUser,
        req: {} as any,
        res: {} as any,
      });

      const stats = await caller.admin.getGlobalStats();
      expect(stats).toBeDefined();
      expect(stats.totalUsers).toBeGreaterThan(0);
    });

    it("should deny access to unauthenticated requests", async () => {
      const caller = appRouter.createCaller({
        user: null,
        req: {} as any,
        res: {} as any,
      });

      await expect(caller.admin.getGlobalStats()).rejects.toThrow();
    });
  });

  describe("getGlobalStats", () => {
    it("should return global statistics", async () => {
      const caller = appRouter.createCaller({
        user: adminUser,
        req: {} as any,
        res: {} as any,
      });

      const stats = await caller.admin.getGlobalStats();

      expect(stats).toHaveProperty("totalUsers");
      expect(stats).toHaveProperty("totalAdmins");
      expect(stats).toHaveProperty("totalDonors");
      expect(stats).toHaveProperty("totalBlocked");
      expect(stats).toHaveProperty("totalResumes");
      expect(stats).toHaveProperty("totalDonations");
      expect(stats).toHaveProperty("totalPayments");
      expect(stats).toHaveProperty("newUsersThisMonth");
      expect(stats).toHaveProperty("newResumesThisMonth");

      expect(typeof stats.totalUsers).toBe("number");
      expect(typeof stats.totalAdmins).toBe("number");
      expect(stats.totalUsers).toBeGreaterThanOrEqual(stats.totalAdmins);
    });
  });

  describe("getAllUsers", () => {
    it("should return paginated users list", async () => {
      const caller = appRouter.createCaller({
        user: adminUser,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.admin.getAllUsers({
        page: 1,
        limit: 10,
        role: "all",
        status: "all",
        donorStatus: "all",
      });

      expect(result).toHaveProperty("users");
      expect(result).toHaveProperty("total");
      expect(result).toHaveProperty("page");
      expect(result).toHaveProperty("limit");
      expect(result).toHaveProperty("totalPages");

      expect(Array.isArray(result.users)).toBe(true);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it("should filter users by role", async () => {
      const caller = appRouter.createCaller({
        user: adminUser,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.admin.getAllUsers({
        page: 1,
        limit: 10,
        role: "admin",
        status: "all",
        donorStatus: "all",
      });

      expect(result.users.every((u: any) => u.role === "admin")).toBe(true);
    });

    it("should filter users by status", async () => {
      const caller = appRouter.createCaller({
        user: adminUser,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.admin.getAllUsers({
        page: 1,
        limit: 10,
        role: "all",
        status: "active",
        donorStatus: "all",
      });

      expect(result.users.every((u: any) => u.isBlocked === 0)).toBe(true);
    });

    it("should search users by email", async () => {
      const caller = appRouter.createCaller({
        user: adminUser,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.admin.getAllUsers({
        page: 1,
        limit: 10,
        search: adminUser.email,
        role: "all",
        status: "all",
        donorStatus: "all",
      });

      expect(result.users.length).toBeGreaterThan(0);
      expect(result.users.some((u: any) => u.email === adminUser.email)).toBe(true);
    });
  });

  describe("promoteToAdmin", () => {
    it("should promote user to admin", async () => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      // Find a regular user
      const targetUser = await db
        .select()
        .from(users)
        .where(eq(users.role, "user"))
        .limit(1);

      if (targetUser.length === 0) {
        console.log("No regular user found to promote, skipping test");
        return;
      }

      const caller = appRouter.createCaller({
        user: adminUser,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.admin.promoteToAdmin({ userId: targetUser[0].id });
      expect(result.success).toBe(true);

      // Verify promotion
      const updated = await db.select().from(users).where(eq(users.id, targetUser[0].id)).limit(1);
      expect(updated[0].role).toBe("admin");

      // Revert back to user
      await db.update(users).set({ role: "user" }).where(eq(users.id, targetUser[0].id));
    });

    it("should fail to promote already admin user", async () => {
      const caller = appRouter.createCaller({
        user: adminUser,
        req: {} as any,
        res: {} as any,
      });

      await expect(caller.admin.promoteToAdmin({ userId: adminUser.id })).rejects.toThrow(
        "já é administrador"
      );
    });

    it("should fail to promote non-existent user", async () => {
      const caller = appRouter.createCaller({
        user: adminUser,
        req: {} as any,
        res: {} as any,
      });

      await expect(caller.admin.promoteToAdmin({ userId: 999999 })).rejects.toThrow(
        "não encontrado"
      );
    });
  });

  describe("demoteFromAdmin", () => {
    it("should prevent self-demotion", async () => {
      const caller = appRouter.createCaller({
        user: adminUser,
        req: {} as any,
        res: {} as any,
      });

      await expect(caller.admin.demoteFromAdmin({ userId: adminUser.id })).rejects.toThrow(
        "não pode remover seus próprios privilégios"
      );
    });

    it("should fail to demote non-admin user", async () => {
      const caller = appRouter.createCaller({
        user: adminUser,
        req: {} as any,
        res: {} as any,
      });

      await expect(caller.admin.demoteFromAdmin({ userId: regularUser.id })).rejects.toThrow(
        "não é administrador"
      );
    });
  });

  describe("blockUser", () => {
    it("should prevent self-blocking", async () => {
      const caller = appRouter.createCaller({
        user: adminUser,
        req: {} as any,
        res: {} as any,
      });

      await expect(caller.admin.blockUser({ userId: adminUser.id })).rejects.toThrow(
        "não pode bloquear sua própria conta"
      );
    });

    it("should block user successfully", async () => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      // Ensure user is not blocked first
      await db.update(users).set({ isBlocked: 0 }).where(eq(users.id, regularUser.id));

      const caller = appRouter.createCaller({
        user: adminUser,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.admin.blockUser({ userId: regularUser.id });
      expect(result.success).toBe(true);

      // Verify block
      const updated = await db.select().from(users).where(eq(users.id, regularUser.id)).limit(1);
      expect(updated[0].isBlocked).toBe(1);

      // Unblock for cleanup
      await db.update(users).set({ isBlocked: 0 }).where(eq(users.id, regularUser.id));
    });
  });

  describe("unblockUser", () => {
    it("should unblock user successfully", async () => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      // Block user first
      await db.update(users).set({ isBlocked: 1 }).where(eq(users.id, regularUser.id));

      const caller = appRouter.createCaller({
        user: adminUser,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.admin.unblockUser({ userId: regularUser.id });
      expect(result.success).toBe(true);

      // Verify unblock
      const updated = await db.select().from(users).where(eq(users.id, regularUser.id)).limit(1);
      expect(updated[0].isBlocked).toBe(0);
    });

    it("should fail to unblock already active user", async () => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      // Ensure user is not blocked
      await db.update(users).set({ isBlocked: 0 }).where(eq(users.id, regularUser.id));

      const caller = appRouter.createCaller({
        user: adminUser,
        req: {} as any,
        res: {} as any,
      });

      await expect(caller.admin.unblockUser({ userId: regularUser.id })).rejects.toThrow(
        "não está bloqueado"
      );
    });
  });

  describe("getActivityLogs", () => {
    it("should return activity logs", async () => {
      const caller = appRouter.createCaller({
        user: adminUser,
        req: {} as any,
        res: {} as any,
      });

      const logs = await caller.admin.getActivityLogs({ limit: 10 });

      expect(Array.isArray(logs)).toBe(true);
      logs.forEach((log: any) => {
        expect(log).toHaveProperty("id");
        expect(log).toHaveProperty("adminId");
        expect(log).toHaveProperty("action");
        expect(log).toHaveProperty("createdAt");
      });
    });
  });

  describe("getGrowthData", () => {
    it("should return 30 days of growth data", async () => {
      const caller = appRouter.createCaller({
        user: adminUser,
        req: {} as any,
        res: {} as any,
      });

      const growthData = await caller.admin.getGrowthData();

      expect(Array.isArray(growthData)).toBe(true);
      expect(growthData.length).toBe(30);

      growthData.forEach((day: any) => {
        expect(day).toHaveProperty("date");
        expect(day).toHaveProperty("count");
        expect(typeof day.count).toBe("number");
      });

      // Verify dates are sorted
      const dates = growthData.map((d: any) => d.date);
      const sortedDates = [...dates].sort();
      expect(dates).toEqual(sortedDates);
    });
  });
});
