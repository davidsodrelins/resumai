import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { payments } from "../../drizzle/schema";
import { eq, desc, and } from "drizzle-orm";

export const paymentsRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        status: z
          .enum(["pending", "succeeded", "failed", "canceled"])
          .optional(),
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(100).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      const userId = ctx.user.id;
      const offset = (input.page - 1) * input.pageSize;

      // Build where clause
      const whereConditions = [eq(payments.userId, userId)];
      if (input.status) {
        whereConditions.push(eq(payments.status, input.status));
      }

      // Get payments
      const userPayments = await db
        .select()
        .from(payments)
        .where(and(...whereConditions))
        .orderBy(desc(payments.createdAt))
        .limit(input.pageSize)
        .offset(offset);

      // Get total count
      const [countResult] = await db
        .select({ count: payments.id })
        .from(payments)
        .where(and(...whereConditions));

      // Calculate total donated (only succeeded payments)
      const succeededPayments = await db
        .select()
        .from(payments)
        .where(
          and(eq(payments.userId, userId), eq(payments.status, "succeeded"))
        );

      const totalDonated = succeededPayments.reduce(
        (sum, payment) => sum + payment.amount,
        0
      );

      return {
        payments: userPayments,
        total: userPayments.length,
        totalDonated,
      };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      const [payment] = await db
        .select()
        .from(payments)
        .where(
          and(eq(payments.id, input.id), eq(payments.userId, ctx.user.id))
        )
        .limit(1);

      if (!payment) {
        throw new Error("Payment not found");
      }

      return payment;
    }),
});
