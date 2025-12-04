import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

/**
 * Admin-only router for managing users and viewing statistics
 */
export const adminRouter = router({
  /**
   * Get admin statistics
   */
  getStats: protectedProcedure.query(async ({ ctx }) => {
    // Check if user is admin
    if (ctx.user?.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Apenas administradores podem acessar esta funcionalidade",
      });
    }

    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    // Get total users
    const allUsers = await db.select().from(users);
    const totalUsers = allUsers.length;

    // Get total donors
    const donors = allUsers.filter((u: any) => u.isDonor === 1);
    const totalDonors = donors.length;

    // Get total donations
    const totalDonations = donors.reduce((sum: number, u: any) => sum + (u.totalDonated || 0), 0);

    // Get total admins
    const admins = allUsers.filter((u: any) => u.role === "admin");
    const totalAdmins = admins.length;

    return {
      totalUsers,
      totalDonors,
      totalDonations,
      totalAdmins,
    };
  }),

  /**
   * Get recent users
   */
  getRecentUsers: protectedProcedure.query(async ({ ctx }) => {
    // Check if user is admin
    if (ctx.user?.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Apenas administradores podem acessar esta funcionalidade",
      });
    }

    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    // Get last 10 users
    const recentUsers = await db
      .select()
      .from(users)
      .orderBy((u: any) => u.createdAt)
      .limit(10);

    return recentUsers.map((u: any) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      isDonor: u.isDonor === 1,
      totalDonated: u.totalDonated || 0,
      createdAt: u.createdAt,
    }));
  }),

  /**
   * Promote user to admin
   */
  promoteUser: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // Check if user is admin
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Apenas administradores podem acessar esta funcionalidade",
        });
      }

      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      // Update user role
      await db.update(users).set({ role: "admin" }).where(eq(users.id, input.userId));

      return { success: true };
    }),

  /**
   * Demote user from admin
   */
  demoteUser: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // Check if user is admin
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Apenas administradores podem acessar esta funcionalidade",
        });
      }

      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      // Prevent demoting yourself
      if (input.userId === ctx.user?.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Você não pode rebaixar a si mesmo",
        });
      }

      // Update user role
      await db.update(users).set({ role: "user" }).where(eq(users.id, input.userId));

      return { success: true };
    }),

  /**
   * Delete user
   */
  deleteUser: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // Check if user is admin
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Apenas administradores podem acessar esta funcionalidade",
        });
      }

      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      // Prevent deleting yourself
      if (input.userId === ctx.user?.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Você não pode deletar a si mesmo",
        });
      }

      // Delete user
      await db.delete(users).where(eq(users.id, input.userId));

      return { success: true };
    }),
});
