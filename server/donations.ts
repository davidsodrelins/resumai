import Stripe from "stripe";
import { ENV } from "./_core/env";
import { getDb } from "./db";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(ENV.stripeSecretKey, {
  apiVersion: "2025-11-17.clover",
});

export interface DonationAmount {
  amount: number; // in cents (R$ 5.00 = 500)
  description: string;
}

export const DONATION_OPTIONS = {
  coffee: { amount: 500, description: "☕ Me pague um café" },
  chocolate: { amount: 1000, description: "🍫 Compre um chocolate pra Luluzinha" },
  sandwich: { amount: 1500, description: "🥪 Me pague um sanduíche" },
} as const;

/**
 * Create a Stripe Checkout session for donation
 */
export async function createDonationCheckout(
  userId: string,
  amount: number,
  description: string,
  successUrl: string,
  cancelUrl: string
): Promise<{ sessionId: string; url: string }> {
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "brl",
          product_data: {
            name: "Doação para ResumAI",
            description,
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
      donationType: "one-time",
      amount: amount.toString(),
    },
  });

  if (!session.url) {
    throw new Error("Failed to create checkout session");
  }

  return {
    sessionId: session.id,
    url: session.url,
  };
}

/**
 * Handle successful payment from Stripe webhook
 */
export async function handleSuccessfulPayment(sessionId: string): Promise<void> {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    throw new Error("Payment not completed");
  }

  const userId = session.metadata?.userId;
  const amount = parseInt(session.metadata?.amount || "0", 10);

  if (!userId || !amount) {
    throw new Error("Missing metadata in session");
  }

  // Update user donation info in database
  const db = await getDb();
  
  // Get current user data
  if (!db) throw new Error("Database connection failed");
  
  const [currentUser] = await db
    .select()
    .from(users)
    .where(eq(users.openId, userId))
    .limit(1);

  if (!currentUser) {
    throw new Error("User not found");
  }

  const newTotal = (currentUser.totalDonated || 0) + amount;

  // Update user with new donation total and donor status
  if (db) {
    await db
      .update(users)
      .set({
        totalDonated: newTotal,
        isDonor: 1, // MySQL int: 0 = false, 1 = true
        lastDonationAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.openId, userId));
  }
}

/**
 * Get user's total donations
 */
export async function getUserDonations(userId: string): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  
  const [user] = await db
    .select({ totalDonated: users.totalDonated })
    .from(users)
    .where(eq(users.openId, userId))
    .limit(1);

  return user?.totalDonated || 0;
}

/**
 * Check if user is a donor
 */
export async function isUserDonor(userId: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  const [user] = await db
    .select({ isDonor: users.isDonor })
    .from(users)
    .where(eq(users.openId, userId))
    .limit(1);

  return Boolean(user?.isDonor);
}
