import type { VercelRequest, VercelResponse } from "@vercel/node";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;
const ADMIN_SECRET = process.env.ADMIN_SECRET || "hrop-admin-secret";

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
      Prefer: "return=representation",
      ...options.headers,
    },
  });
}

// In production, this would trigger T4A generation via CRA e-file or a payroll service.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Admin-only: check hardcoded secret header
  const adminSecret = req.headers["x-admin-secret"];
  if (adminSecret !== ADMIN_SECRET) {
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    const { year } = req.body;
    if (!year || typeof year !== "number") {
      return res.status(400).json({ error: "year (number) is required" });
    }

    // Query payments for the given tax year where t4a_eligible = true
    const response = await supabaseRequest(
      `payments?tax_year=eq.${year}&t4a_eligible=eq.true&select=service_provider_id,amount`
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Supabase query failed: ${text}`);
    }

    const payments: { service_provider_id: string; amount: number }[] =
      await response.json();

    // Group by provider and sum earnings
    const providerTotals = new Map<string, number>();
    for (const p of payments) {
      const current = providerTotals.get(p.service_provider_id) || 0;
      providerTotals.set(p.service_provider_id, current + p.amount);
    }

    const result = Array.from(providerTotals.entries()).map(
      ([providerId, totalEarnings]) => ({
        providerId,
        totalEarnings,
        t4aRequired: totalEarnings >= 500,
      })
    );

    return res.status(200).json({ year, providers: result });
  } catch (error: any) {
    console.error("Trigger T4A error:", error);
    return res.status(500).json({ error: error.message });
  }
}
