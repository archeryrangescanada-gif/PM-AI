import type { VercelRequest, VercelResponse } from "@vercel/node";

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
    const { paymentId, jobId, amount, providerId } = req.body;

    if (!paymentId || !providerId) {
      return res
        .status(400)
        .json({ error: "paymentId and providerId are required" });
    }

    const taxYear = new Date().getFullYear();

    // Set tax_year on this payment record
    await supabaseRequest(`payments?id=eq.${paymentId}`, {
      method: "PATCH",
      body: JSON.stringify({ tax_year: taxYear }),
    });

    // Sum all payments for this provider in the current tax year
    const sumResponse = await supabaseRequest(
      `payments?service_provider_id=eq.${providerId}&tax_year=eq.${taxYear}&select=amount`,
      { headers: { Prefer: "return=representation" } }
    );

    if (!sumResponse.ok) {
      const text = await sumResponse.text();
      throw new Error(`Failed to query provider payments: ${text}`);
    }

    const payments: { amount: number }[] = await sumResponse.json();
    const totalEarnings = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const t4aEligible = totalEarnings >= 500;

    // Update t4a_eligible on this payment record
    await supabaseRequest(`payments?id=eq.${paymentId}`, {
      method: "PATCH",
      body: JSON.stringify({ t4a_eligible: t4aEligible }),
    });

    return res.status(200).json({
      success: true,
      taxYear,
      totalEarnings,
      t4aEligible,
    });
  } catch (error: any) {
    console.error("Update payment tax error:", error);
    return res.status(500).json({ error: error.message });
  }
}
