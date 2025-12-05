import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { users, savedResumes, payments, activityLogs } from "../../drizzle/schema";
import { eq, desc, sql, and, gte, like, or } from "drizzle-orm";

/**
 * Admin-only procedure middleware
 * Verifies that the user is authenticated and has admin role
 */
const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user?.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Apenas administradores podem acessar esta área",
    });
  }

  return next({ ctx });
});

/**
 * Helper function to log admin actions
 */
async function logActivity(
  adminId: number,
  action: string,
  details?: string,
  targetUserId?: number
) {
  const db = await getDb();
  if (!db) return;

  await db.insert(activityLogs).values({
    adminId,
    action,
    details,
    targetUserId,
    ipAddress: null,
    userAgent: null,
  });
}

export const adminRouter = router({
  /**
   * Get global platform statistics
   */
  getGlobalStats: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    // Total users
    const totalUsersResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users);
    const totalUsers = Number(totalUsersResult[0]?.count || 0);

    // Total admins
    const totalAdminsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.role, "admin"));
    const totalAdmins = Number(totalAdminsResult[0]?.count || 0);

    // Total donors
    const totalDonorsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.isDonor, 1));
    const totalDonors = Number(totalDonorsResult[0]?.count || 0);

    // Total blocked users
    const totalBlockedResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.isBlocked, 1));
    const totalBlocked = Number(totalBlockedResult[0]?.count || 0);

    // Total resumes
    const totalResumesResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(savedResumes);
    const totalResumes = Number(totalResumesResult[0]?.count || 0);

    // Total donations (sum of all payments)
    const totalDonationsResult = await db
      .select({ total: sql<number>`sum(amount)` })
      .from(payments)
      .where(eq(payments.status, "succeeded"));
    const totalDonations = Number(totalDonationsResult[0]?.total || 0);

    // Total successful payments
    const totalPaymentsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(payments)
      .where(eq(payments.status, "succeeded"));
    const totalPayments = Number(totalPaymentsResult[0]?.count || 0);

    // Users created this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const newUsersThisMonthResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(gte(users.createdAt, startOfMonth));
    const newUsersThisMonth = Number(newUsersThisMonthResult[0]?.count || 0);

    // Resumes created this month
    const newResumesThisMonthResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(savedResumes)
      .where(gte(savedResumes.createdAt, startOfMonth));
    const newResumesThisMonth = Number(newResumesThisMonthResult[0]?.count || 0);

    return {
      totalUsers,
      totalAdmins,
      totalDonors,
      totalBlocked,
      totalResumes,
      totalDonations, // in cents
      totalPayments,
      newUsersThisMonth,
      newResumesThisMonth,
    };
  }),

  /**
   * Get all users with pagination and filters
   */
  getAllUsers: adminProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(20),
        search: z.string().optional(),
        role: z.enum(["all", "user", "admin"]).default("all"),
        status: z.enum(["all", "active", "blocked"]).default("all"),
        donorStatus: z.enum(["all", "donor", "non-donor"]).default("all"),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      const { page, limit, search, role, status, donorStatus } = input;
      const offset = (page - 1) * limit;

      // Build WHERE conditions
      const conditions = [];

      if (search) {
        conditions.push(
          or(
            like(users.name, `%${search}%`),
            like(users.email, `%${search}%`)
          )
        );
      }

      if (role !== "all") {
        conditions.push(eq(users.role, role));
      }

      if (status === "active") {
        conditions.push(eq(users.isBlocked, 0));
      } else if (status === "blocked") {
        conditions.push(eq(users.isBlocked, 1));
      }

      if (donorStatus === "donor") {
        conditions.push(eq(users.isDonor, 1));
      } else if (donorStatus === "non-donor") {
        conditions.push(eq(users.isDonor, 0));
      }

      // Get total count
      const totalResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(users)
        .where(conditions.length > 0 ? and(...conditions) : undefined);
      const total = Number(totalResult[0]?.count || 0);

      // Get users
      const usersList = await db
        .select({
          id: users.id,
          email: users.email,
          name: users.name,
          role: users.role,
          isBlocked: users.isBlocked,
          isDonor: users.isDonor,
          totalDonated: users.totalDonated,
          resumesThisMonth: users.resumesThisMonth,
          createdAt: users.createdAt,
          lastSignedIn: users.lastSignedIn,
        })
        .from(users)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(users.createdAt))
        .limit(limit)
        .offset(offset);

      return {
        users: usersList,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    }),

  /**
   * Promote user to admin
   */
  promoteToAdmin: adminProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      const { userId } = input;

      // Check if user exists
      const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (!user.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Usuário não encontrado",
        });
      }

      // Check if already admin
      if (user[0].role === "admin") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Usuário já é administrador",
        });
      }

      // Promote to admin
      await db.update(users).set({ role: "admin" }).where(eq(users.id, userId));

      // Log activity
      await logActivity(
        ctx.user.id,
        "promote_to_admin",
        `Promoveu ${user[0].email} para administrador`,
        userId
      );

      return { success: true, message: "Usuário promovido a administrador com sucesso" };
    }),

  /**
   * Demote admin to user
   */
  demoteFromAdmin: adminProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      const { userId } = input;

      // Prevent self-demotion
      if (userId === ctx.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Você não pode remover seus próprios privilégios de administrador",
        });
      }

      // Check if user exists
      const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (!user.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Usuário não encontrado",
        });
      }

      // Check if is admin
      if (user[0].role !== "admin") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Usuário não é administrador",
        });
      }

      // Demote to user
      await db.update(users).set({ role: "user" }).where(eq(users.id, userId));

      // Log activity
      await logActivity(
        ctx.user.id,
        "demote_from_admin",
        `Removeu privilégios de administrador de ${user[0].email}`,
        userId
      );

      return { success: true, message: "Privilégios de administrador removidos com sucesso" };
    }),

  /**
   * Block user
   */
  blockUser: adminProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      const { userId } = input;

      // Prevent self-blocking
      if (userId === ctx.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Você não pode bloquear sua própria conta",
        });
      }

      // Check if user exists
      const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (!user.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Usuário não encontrado",
        });
      }

      // Check if already blocked
      if (user[0].isBlocked === 1) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Usuário já está bloqueado",
        });
      }

      // Block user
      await db.update(users).set({ isBlocked: 1 }).where(eq(users.id, userId));

      // Log activity
      await logActivity(
        ctx.user.id,
        "block_user",
        `Bloqueou o usuário ${user[0].email}`,
        userId
      );

      return { success: true, message: "Usuário bloqueado com sucesso" };
    }),

  /**
   * Unblock user
   */
  unblockUser: adminProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      const { userId } = input;

      // Check if user exists
      const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (!user.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Usuário não encontrado",
        });
      }

      // Check if is blocked
      if (user[0].isBlocked === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Usuário não está bloqueado",
        });
      }

      // Unblock user
      await db.update(users).set({ isBlocked: 0 }).where(eq(users.id, userId));

      // Log activity
      await logActivity(
        ctx.user.id,
        "unblock_user",
        `Desbloqueou o usuário ${user[0].email}`,
        userId
      );

      return { success: true, message: "Usuário desbloqueado com sucesso" };
    }),

  /**
   * Get activity logs
   */
  getActivityLogs: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      const { limit } = input;

      const logs = await db
        .select({
          id: activityLogs.id,
          adminId: activityLogs.adminId,
          adminEmail: users.email,
          adminName: users.name,
          targetUserId: activityLogs.targetUserId,
          action: activityLogs.action,
          details: activityLogs.details,
          createdAt: activityLogs.createdAt,
        })
        .from(activityLogs)
        .leftJoin(users, eq(activityLogs.adminId, users.id))
        .orderBy(desc(activityLogs.createdAt))
        .limit(limit);

      return logs;
    }),

  /**
   * Get growth data (new users per day for the last 30 days)
   */
  getGrowthData: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    // Get all users created in the last 30 days
    const recentUsers = await db
      .select({
        createdAt: users.createdAt,
      })
      .from(users)
      .where(gte(users.createdAt, thirtyDaysAgo));

    // Group by date
    const dailyCounts: Record<string, number> = {};
    
    // Initialize all days with 0
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      dailyCounts[dateStr] = 0;
    }

    // Count users per day
    recentUsers.forEach((user) => {
      const dateStr = user.createdAt.toISOString().split("T")[0];
      if (dailyCounts[dateStr] !== undefined) {
        dailyCounts[dateStr]++;
      }
    });

    // Convert to array and sort by date
    const growthData = Object.entries(dailyCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return growthData;
  }),

  // Legacy endpoints for backward compatibility
  getStats: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    const allUsers = await db.select().from(users);
    const totalUsers = allUsers.length;
    const donors = allUsers.filter((u: any) => u.isDonor === 1);
    const totalDonors = donors.length;
    const totalDonations = donors.reduce((sum: number, u: any) => sum + (u.totalDonated || 0), 0);
    const admins = allUsers.filter((u: any) => u.role === "admin");
    const totalAdmins = admins.length;

    return {
      totalUsers,
      totalDonors,
      totalDonations,
      totalAdmins,
    };
  }),

  getRecentUsers: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    const recentUsers = await db
      .select()
      .from(users)
      .orderBy(desc(users.createdAt))
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

  promoteUser: adminProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      await db.update(users).set({ role: "admin" }).where(eq(users.id, input.userId));
      return { success: true };
    }),

  demoteUser: adminProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      if (input.userId === ctx.user?.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Você não pode rebaixar a si mesmo",
        });
      }

      await db.update(users).set({ role: "user" }).where(eq(users.id, input.userId));
      return { success: true };
    }),

  deleteUser: adminProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      if (input.userId === ctx.user?.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Você não pode deletar a si mesmo",
        });
      }

      await db.delete(users).where(eq(users.id, input.userId));
      return { success: true };
    }),

  /**
   * Get advanced metrics for admin dashboard
   */
  getAdvancedMetrics: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    // Distribution of resumes by template
    const templateDistribution = await db
      .select({
        template: savedResumes.template,
        count: sql<number>`count(*)`,
      })
      .from(savedResumes)
      .groupBy(savedResumes.template);

    // Donor conversion rate
    const totalUsersResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users);
    const totalUsers = Number(totalUsersResult[0]?.count || 0);

    const totalDonorsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.isDonor, 1));
    const totalDonors = Number(totalDonorsResult[0]?.count || 0);

    const conversionRate = totalUsers > 0 ? (totalDonors / totalUsers) * 100 : 0;

    // Activity heatmap (users created by hour of day)
    const allUsers = await db.select({ createdAt: users.createdAt }).from(users);
    const hourlyActivity = Array(24).fill(0);
    
    allUsers.forEach((user) => {
      const hour = new Date(user.createdAt).getHours();
      hourlyActivity[hour]++;
    });

    // Average session metrics (mock data for now - would need session tracking)
    const avgSessionTime = 0; // TODO: Implement session tracking
    const returnRate = 0; // TODO: Implement return tracking

    return {
      templateDistribution: templateDistribution.map((t) => ({
        template: t.template,
        count: Number(t.count),
      })),
      conversionRate,
      hourlyActivity,
      avgSessionTime,
      returnRate,
    };
  }),

  /**
   * Get admin notifications (suspicious activities)
   */
  getAdminNotifications: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    const notifications: Array<{
      id: string;
      type: "warning" | "info" | "error";
      title: string;
      message: string;
      userId?: number;
      userEmail?: string;
      createdAt: Date;
      isRead: boolean;
    }> = [];

    // Check for users with excessive resume creation this month
    const heavyUsers = await db
      .select({
        id: users.id,
        email: users.email,
        resumesThisMonth: users.resumesThisMonth,
      })
      .from(users)
      .where(gte(users.resumesThisMonth, 10)); // 10+ resumes this month

    heavyUsers.forEach((user) => {
      notifications.push({
        id: `heavy-usage-${user.id}`,
        type: "warning",
        title: "Uso Excessivo Detectado",
        message: `Usuário ${user.email} criou ${user.resumesThisMonth} currículos este mês`,
        userId: user.id,
        userEmail: user.email,
        createdAt: new Date(),
        isRead: false,
      });
    });

    // Check for blocked users
    const blockedUsers = await db
      .select({
        id: users.id,
        email: users.email,
      })
      .from(users)
      .where(eq(users.isBlocked, 1));

    if (blockedUsers.length > 0) {
      notifications.push({
        id: "blocked-users",
        type: "info",
        title: "Usuários Bloqueados",
        message: `${blockedUsers.length} usuário(s) bloqueado(s) no sistema`,
        createdAt: new Date(),
        isRead: false,
      });
    }

    // Check for recent donations
    const recentPayments = await db
      .select({
        userId: payments.userId,
        amount: payments.amount,
        createdAt: payments.createdAt,
      })
      .from(payments)
      .where(
        and(
          eq(payments.status, "succeeded"),
          gte(payments.createdAt, new Date(Date.now() - 24 * 60 * 60 * 1000)) // Last 24h
        )
      );

    if (recentPayments.length > 0) {
      const totalAmount = recentPayments.reduce((sum, p) => sum + p.amount, 0);
      notifications.push({
        id: "recent-donations",
        type: "info",
        title: "Novas Doações",
        message: `${recentPayments.length} doação(ões) nas últimas 24h (R$ ${(totalAmount / 100).toFixed(2)})`,
        createdAt: new Date(),
        isRead: false,
      });
    }

    return notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }),

  /**
   * Export report data
   */
  exportReport: adminProcedure
    .input(
      z.object({
        type: z.enum(["monthly", "users", "growth"]),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      const { type, startDate, endDate } = input;

      if (type === "monthly") {
        // Monthly report: stats for the current month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const newUsers = await db
          .select()
          .from(users)
          .where(gte(users.createdAt, startOfMonth));

        const newResumes = await db
          .select()
          .from(savedResumes)
          .where(gte(savedResumes.createdAt, startOfMonth));

        const newPayments = await db
          .select()
          .from(payments)
          .where(
            and(
              eq(payments.status, "succeeded"),
              gte(payments.createdAt, startOfMonth)
            )
          );

        const totalRevenue = newPayments.reduce((sum, p) => sum + p.amount, 0);

        return {
          type: "monthly",
          period: `${startOfMonth.toLocaleDateString("pt-BR")} - ${new Date().toLocaleDateString("pt-BR")}`,
          data: {
            newUsers: newUsers.length,
            newResumes: newResumes.length,
            newDonations: newPayments.length,
            totalRevenue: totalRevenue / 100,
            users: newUsers.map((u) => ({
              email: u.email,
              name: u.name,
              createdAt: u.createdAt,
            })),
            resumes: newResumes.map((r) => ({
              title: r.title,
              template: r.template,
              language: r.language,
              createdAt: r.createdAt,
            })),
          },
        };
      } else if (type === "users") {
        // Users report: all users with their stats
        const allUsers = await db.select().from(users);

        return {
          type: "users",
          period: "Todos os tempos",
          data: {
            totalUsers: allUsers.length,
            users: allUsers.map((u) => ({
              id: u.id,
              email: u.email,
              name: u.name,
              role: u.role,
              isDonor: u.isDonor === 1,
              totalDonated: u.totalDonated / 100,
              resumesThisMonth: u.resumesThisMonth,
              createdAt: u.createdAt,
              lastSignedIn: u.lastSignedIn,
            })),
          },
        };
      } else if (type === "growth") {
        // Growth report: user growth over time
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentUsers = await db
          .select({ createdAt: users.createdAt })
          .from(users)
          .where(gte(users.createdAt, thirtyDaysAgo));

        const dailyCounts: Record<string, number> = {};
        for (let i = 0; i < 30; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split("T")[0];
          dailyCounts[dateStr] = 0;
        }

        recentUsers.forEach((user) => {
          const dateStr = user.createdAt.toISOString().split("T")[0];
          if (dailyCounts[dateStr] !== undefined) {
            dailyCounts[dateStr]++;
          }
        });

        const growthData = Object.entries(dailyCounts)
          .map(([date, count]) => ({ date, count }))
          .sort((a, b) => a.date.localeCompare(b.date));

        return {
          type: "growth",
          period: "Últimos 30 dias",
          data: {
            growthData,
            totalNewUsers: recentUsers.length,
          },
        };
      }

      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Tipo de relatório inválido",
      });
    }),
});
