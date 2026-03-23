import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;

async function supabaseRequest(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
      ...options.headers,
    },
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { paymentIntentId, jobId } = req.body;

    if (!paymentIntentId || !jobId) {
      return res
        .status(400)
        .json({ error: "paymentIntentId and jobId are required" });
    }

    // Verify payment status with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      // Update payments table
      await supabaseRequest(
        `payments?stripe_payment_intent_id=eq.${paymentIntentId}`,
        {
          method: "PATCH",
          body: JSON.stringify({ status: "captured" }),
        }
      );

      // Update job status to paid
      await supabaseRequest(`jobs?id=eq.${jobId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "paid" }),
      });

      // Look up payment record to get id, amount, and provider
      const paymentRes = await supabaseRequest(
        `payments?stripe_payment_intent_id=eq.${paymentIntentId}&select=id,amount,service_provider_id`,
        { headers: { Prefer: "return=representation" } }
      );
      const paymentRecords = await paymentRes.json();
      if (paymentRecords.length > 0) {
        const payment = paymentRecords[0];
        // Trigger T4A tax tracking
        const baseUrl = `${req.headers["x-forwarded-proto"] || "https"}://${req.headers.host}`;
        await fetch(`${baseUrl}/api/update-payment-tax`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentId: payment.id,
            jobId,
            amount: payment.amount,
            providerId: payment.service_provider_id,
          }),
        });
      }

      return res.status(200).json({ success: true, status: "succeeded" });
    }

    return res.status(200).json({
      success: false,
      status: paymentIntent.status,
    });
  } catch (error: any) {
    console.error("Confirm payment error:", error);
    return res.status(500).json({ error: error.message });
  }
}
