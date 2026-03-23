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
    const { providerId, email, businessName } = req.body;

    if (!providerId || !email) {
      return res.status(400).json({ error: "providerId and email are required" });
    }

    // Create Stripe Connect Express account
    const account = await stripe.accounts.create({
      type: "express",
      country: "CA",
      email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_profile: {
        name: businessName || undefined,
        mcc: "7349", // Building maintenance services
      },
      default_currency: "cad",
    });

    // Save stripe_account_id to service_providers table
    const updateRes = await supabaseRequest(
      `service_providers?id=eq.${providerId}`,
      {
        method: "PATCH",
        body: JSON.stringify({ stripe_account_id: account.id }),
      }
    );

    if (!updateRes.ok) {
      const errorText = await updateRes.text();
      console.error("Supabase update failed:", errorText);
      return res.status(500).json({ error: "Failed to save Stripe account ID" });
    }

    // Generate onboarding link
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.APP_URL || "https://hrop.ca"}/provider?stripe_refresh=true`,
      return_url: `${process.env.APP_URL || "https://hrop.ca"}/provider?stripe_return=true`,
      type: "account_onboarding",
    });

    return res.status(200).json({
      accountId: account.id,
      onboardingUrl: accountLink.url,
    });
  } catch (error: any) {
    console.error("Stripe onboard error:", error);
    return res.status(500).json({ error: error.message });
  }
}
