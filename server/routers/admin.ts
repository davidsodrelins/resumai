import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { users, savedResumes } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

/**
 * Admin router - requires admin role
 */
export const adminRouter = router({
  /**
   * Get admin statistics
   */
  getStats: protectedProcedure.query(async ({ ctx }) => {
    // Check if user is admin
    if (ctx.user.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Acesso negado. Você não tem permissão para acessar este recurso.",
      });
    }

    try {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      // Get all users
      const allUsers = await db.select().from(users);

      // Calculate statistics
      const totalUsers = allUsers.length;
      const totalDonors = allUsers.filter((u) => u.isDonor === 1).length;
      const totalDonations = allUsers.reduce((sum, u) => sum + (u.totalDonated || 0), 0);
      const emailsVerified = allUsers.filter((u) => u.emailVerified === 1).length;
      const emailsPending = allUsers.filter((u) => u.emailVerified === 0).length;

      // Get total resumes generated
      const allResumes = await db.select().from(savedResumes);
      const totalResumesGenerated = allResumes.length;

      // Get recent users (last 10)
      const recentUsers = allUsers
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10)
        .map((u) => ({
          id: u.id,
          email: u.email,
          name: u.name || "Sem nome",
          createdAt: u.createdAt.toISOString(),
          emailVerified: u.emailVerified === 1,
          isDonor: u.isDonor === 1,
        }));

      return {
        totalUsers,
        totalDonors,
        totalDonations,
        totalResumesGenerated,
        emailsVerified,
        emailsPending,
        recentUsers,
      };
    } catch (error: any) {
      console.error("[Admin] Error getting stats:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao obter estatísticas",
      });
    }
  }),

  /**
   * Get all users
   */
  getAllUsers: protectedProcedure.query(async ({ ctx }) => {
    // Check if user is admin
    if (ctx.user.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Acesso negado",
      });
    }

    try {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      const allUsers = await db.select().from(users);

      return allUsers.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        isDonor: u.isDonor === 1,
        totalDonated: u.totalDonated,
        emailVerified: u.emailVerified === 1,
        createdAt: u.createdAt.toISOString(),
      }));
    } catch (error: any) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao obter usuários",
      });
    }
  }),

  /**
   * Get user details
   */
  getUserDetails: protectedProcedure
    .input((input: any) => ({ userId: input.userId as number }))
    .query(async ({ ctx, input }) => {
      // Check if user is admin
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Acesso negado",
        });
      }

      try {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");

        const user = await db.select().from(users).where(eq(users.id, input.userId)).limit(1);

        if (!user || user.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Usuário não encontrado",
          });
        }

        const userData = user[0];
        const userResumes = await db
          .select()
          .from(savedResumes)
          .where(eq(savedResumes.userId, input.userId));

        return {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          isDonor: userData.isDonor === 1,
          totalDonated: userData.totalDonated,
          emailVerified: userData.emailVerified === 1,
          resumesCount: userResumes.length,
          createdAt: userData.createdAt.toISOString(),
          lastSignedIn: userData.lastSignedIn.toISOString(),
        };
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao obter detalhes do usuário",
        });
      }
    }),

  /**
   * Promote user to admin
   */
  promoteToAdmin: protectedProcedure
    .input((input: any) => ({ userId: input.userId as number }))
    .mutation(async ({ ctx, input }) => {
      // Check if user is admin
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Acesso negado",
        });
      }

      try {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");

        await db.update(users).set({ role: "admin" }).where(eq(users.id, input.userId));

        return {
          success: true,
          message: "Usuário promovido a admin",
        };
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao promover usuário",
        });
      }
    }),

  /**
   * Demote admin to user
   */
  demoteToUser: protectedProcedure
    .input((input: any) => ({ userId: input.userId as number }))
    .mutation(async ({ ctx, input }) => {
      // Check if user is admin
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Acesso negado",
        });
      }

      try {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");

        await db.update(users).set({ role: "user" }).where(eq(users.id, input.userId));

        return {
          success: true,
          message: "Admin rebaixado a usuário",
        };
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao rebaixar admin",
        });
      }
    }),

  /**
   * Delete user
   */
  deleteUser: protectedProcedure
    .input((input: any) => ({ userId: input.userId as number }))
    .mutation(async ({ ctx, input }) => {
      // Check if user is admin
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Acesso negado",
        });
      }

      try {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");

        // Don't allow deleting yourself
        if (input.userId === ctx.user.id) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Você não pode deletar sua própria conta",
          });
        }

        // Delete user resumes first
        await db.delete(savedResumes).where(eq(savedResumes.userId, input.userId));

        // Delete user
        await db.delete(users).where(eq(users.id, input.userId));

        return {
          success: true,
          message: "Usuário deletado com sucesso",
        };
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao deletar usuário",
        });
      }
    }),
});
