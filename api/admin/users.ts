import type { VercelRequest, VercelResponse } from "@vercel/node";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;
const ADMIN_SECRET = "hrop2026";

async function supabaseRequest(path: string): Promise<Response> {
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (req.headers["x-admin-secret"] !== ADMIN_SECRET) {
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    const response = await supabaseRequest(
      "profiles?select=id,email,full_name,phone,role,avatar_url,created_at&order=created_at.desc"
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Supabase query failed: ${text}`);
    }

    const users = await response.json();
    return res.status(200).json(users);
  } catch (error: any) {
    console.error("Admin users error:", error);
    return res.status(500).json({ error: error.message });
  }
}
