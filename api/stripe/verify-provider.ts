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
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const accountId = req.query.accountId as string;

    if (!accountId) {
      return res.status(400).json({ error: "accountId query parameter is required" });
    }

    const account = await stripe.accounts.retrieve(accountId);

    const isComplete =
      account.charges_enabled === true &&
      account.details_submitted === true;

    // Update stripe_onboarded status if onboarding is complete
    if (isComplete) {
      const updateRes = await supabaseRequest(
        `service_providers?stripe_account_id=eq.${accountId}`,
        {
          method: "PATCH",
          body: JSON.stringify({ stripe_onboarded: true }),
        }
      );

      if (!updateRes.ok) {
        console.error(
          "Failed to update stripe_onboarded:",
          await updateRes.text()
        );
      }
    }

    return res.status(200).json({
      isComplete,
      chargesEnabled: account.charges_enabled,
      detailsSubmitted: account.details_submitted,
    });
  } catch (error: any) {
    console.error("Stripe verify error:", error);
    return res.status(500).json({ error: error.message });
  }
}
