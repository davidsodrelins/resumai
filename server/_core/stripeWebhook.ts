import Stripe from "stripe";
import { ENV } from "./env";
import { getDb } from "../db";
import { payments, users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(ENV.stripeSecretKey, {
  apiVersion: "2025-11-17.clover",
});

export async function handleStripeWebhook(
  body: string,
  signature: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );

    console.log(`[Stripe Webhook] Received event: ${event.type}`);

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSuccess(paymentIntent);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailed(paymentIntent);
        break;
      }

      case "payment_intent.canceled": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentCanceled(paymentIntent);
        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    return { success: true, message: "Webhook processed successfully" };
  } catch (error: any) {
    console.error("[Stripe Webhook] Error:", error.message);
    return { success: false, message: error.message };
  }
}

async function handlePaymentSuccess(
  paymentIntent: Stripe.PaymentIntent
): Promise<void> {
  const userId = paymentIntent.metadata.userId;
  if (!userId) {
    console.error("[Stripe Webhook] No userId in metadata");
    return;
  }

  const amount = paymentIntent.amount; // Amount in cents
  const paymentMethod = paymentIntent.payment_method_types[0] || "unknown";

  console.log(
    `[Stripe Webhook] Payment succeeded: ${paymentIntent.id} for user ${userId}, amount: ${amount}`
  );

  // Create payment record
  const db = await getDb();
  if (!db) {
    console.error("[Stripe Webhook] Database not available");
    return;
  }
  
  await db.insert(payments).values({
    userId: parseInt(userId),
    stripePaymentIntentId: paymentIntent.id,
    amount,
    currency: paymentIntent.currency,
    status: "succeeded",
    paymentMethod,
    metadata: paymentIntent.metadata as Record<string, any>,
  });

  // Update user's donor status and total donated
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, parseInt(userId)))
    .limit(1);

  if (user) {
    const newTotal = user.totalDonated + amount;
    await db
      .update(users)
      .set({
        isDonor: 1,
        totalDonated: newTotal,
        lastDonationAt: new Date(),
      })
      .where(eq(users.id, parseInt(userId)));

    console.log(
      `[Stripe Webhook] User ${userId} updated: isDonor=true, totalDonated=${newTotal}`
    );
  }
}

async function handlePaymentFailed(
  paymentIntent: Stripe.PaymentIntent
): Promise<void> {
  const userId = paymentIntent.metadata.userId;
  if (!userId) {
    console.error("[Stripe Webhook] No userId in metadata");
    return;
  }

  console.log(
    `[Stripe Webhook] Payment failed: ${paymentIntent.id} for user ${userId}`
  );

  // Create payment record with failed status
  const db = await getDb();
  if (!db) {
    console.error("[Stripe Webhook] Database not available");
    return;
  }
  
  await db.insert(payments).values({
    userId: parseInt(userId),
    stripePaymentIntentId: paymentIntent.id,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    status: "failed",
    paymentMethod: paymentIntent.payment_method_types[0] || "unknown",
    metadata: paymentIntent.metadata as Record<string, any>,
  });
}

async function handlePaymentCanceled(
  paymentIntent: Stripe.PaymentIntent
): Promise<void> {
  const userId = paymentIntent.metadata.userId;
  if (!userId) {
    console.error("[Stripe Webhook] No userId in metadata");
    return;
  }

  console.log(
    `[Stripe Webhook] Payment canceled: ${paymentIntent.id} for user ${userId}`
  );

  // Create payment record with canceled status
  const db = await getDb();
  if (!db) {
    console.error("[Stripe Webhook] Database not available");
    return;
  }
  
  await db.insert(payments).values({
    userId: parseInt(userId),
    stripePaymentIntentId: paymentIntent.id,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    status: "canceled",
    paymentMethod: paymentIntent.payment_method_types[0] || "unknown",
    metadata: paymentIntent.metadata as Record<string, any>,
  });
}
