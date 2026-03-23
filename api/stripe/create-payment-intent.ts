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
      ...options.headers,
    },
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { jobId, amount, providerId } = req.body;

    if (!jobId || !amount || !providerId) {
      return res
        .status(400)
        .json({ error: "jobId, amount, and providerId are required" });
    }

    // Look up provider's stripe_account_id
    const providerRes = await supabaseRequest(
      `service_providers?id=eq.${providerId}&select=stripe_account_id`,
      { headers: { Prefer: "return=representation" } }
    );

    if (!providerRes.ok) {
      return res.status(500).json({ error: "Failed to look up provider" });
    }

    const providers = await providerRes.json();
    if (!providers.length || !providers[0].stripe_account_id) {
      return res
        .status(400)
        .json({ error: "Provider does not have a connected Stripe account" });
    }

    const stripeAccountId = providers[0].stripe_account_id;
    const platformFee = Math.round(amount * 0.15); // 15% HROP platform fee

    // Create PaymentIntent with Connect
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "cad",
      application_fee_amount: platformFee,
      transfer_data: {
        destination: stripeAccountId,
      },
      metadata: {
        jobId,
        providerId,
      },
    });

    // Save payment record to Supabase
    const insertRes = await supabaseRequest("payments", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        job_id: jobId,
        stripe_payment_intent_id: paymentIntent.id,
        amount: amount / 100, // Store as dollars
        platform_fee: platformFee / 100,
        provider_payout: (amount - platformFee) / 100,
        status: "pending",
      }),
    });

    if (!insertRes.ok) {
      console.error("Failed to save payment record:", await insertRes.text());
    }

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: any) {
    console.error("Create payment intent error:", error);
    return res.status(500).json({ error: error.message });
  }
}
