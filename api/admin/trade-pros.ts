import type { VercelRequest, VercelResponse } from "@vercel/node";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;
const ADMIN_SECRET = "hrop2026";

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.headers["x-admin-secret"] !== ADMIN_SECRET) {
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    if (req.method === "GET") {
      const response = await supabaseRequest(
        "service_providers?select=id,business_name,service_type,license_number,insurance_verified,wsib_clearance_verified,wsib_last_verified_at,trade_licence_verified,background_check_status,stripe_account_id,stripe_onboarded,onboarding_complete,available,rating,total_jobs,total_earnings,created_at,profiles(full_name,email,phone)&order=created_at.desc"
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Supabase query failed: ${text}`);
      }

      const tradePros = await response.json();
      return res.status(200).json(tradePros);
    }

    if (req.method === "PATCH") {
      const { id, updates } = req.body;
      if (!id || !updates) {
        return res.status(400).json({ error: "id and updates are required" });
      }

      // Only allow specific fields to be updated
      const allowedFields = [
        "wsib_clearance_verified",
        "wsib_last_verified_at",
        "trade_licence_verified",
        "onboarding_complete",
        "available",
        "background_check_status",
      ];
      const sanitized: Record<string, any> = {};
      for (const key of Object.keys(updates)) {
        if (allowedFields.includes(key)) {
          sanitized[key] = updates[key];
        }
      }

      if (Object.keys(sanitized).length === 0) {
        return res.status(400).json({ error: "No valid fields to update" });
      }

      const response = await supabaseRequest(
        `service_providers?id=eq.${id}`,
        {
          method: "PATCH",
          body: JSON.stringify(sanitized),
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Supabase update failed: ${text}`);
      }

      const result = await response.json();
      return res.status(200).json(result);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    console.error("Admin trade-pros error:", error);
    return res.status(500).json({ error: error.message });
  }
}
