import type { Express, Request, Response } from "express";
import { handleStripeWebhook } from "./stripeWebhook";

export function registerWebhookRoute(app: Express): void {
  // Stripe webhook endpoint - must use raw body
  app.post(
    "/api/stripe/webhook",
    async (req: Request, res: Response) => {
      try {
        const signature = req.headers["stripe-signature"];

        if (!signature || typeof signature !== "string") {
          console.error("[Webhook] Missing Stripe signature");
          return res.status(400).json({ error: "Missing signature" });
        }

        // Get raw body as string
        const rawBody = JSON.stringify(req.body);

        const result = await handleStripeWebhook(rawBody, signature);

        if (result.success) {
          res.status(200).json({ received: true });
        } else {
          res.status(400).json({ error: result.message });
        }
      } catch (error: any) {
        console.error("[Webhook] Error processing webhook:", error.message);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  console.log("[Webhook] Stripe webhook route registered at /api/stripe/webhook");
}
