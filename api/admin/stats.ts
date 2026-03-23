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
    const [usersRes, providersRes, requestsRes, jobsRes, paymentsRes] =
      await Promise.all([
        supabaseRequest("profiles?select=id"),
        supabaseRequest("service_providers?select=id,onboarding_complete"),
        supabaseRequest(
          "maintenance_requests?select=id,title,status,category,priority,created_at&order=created_at.desc&limit=10"
        ),
        supabaseRequest("jobs?select=id,status"),
        supabaseRequest("payments?select=amount,status"),
      ]);

    if (!usersRes.ok || !providersRes.ok || !requestsRes.ok || !jobsRes.ok || !paymentsRes.ok) {
      throw new Error("One or more Supabase queries failed");
    }

    const [users, providers, requests, jobs, payments] = await Promise.all([
      usersRes.json(),
      providersRes.json(),
      requestsRes.json(),
      jobsRes.json(),
      paymentsRes.json(),
    ]);

    const totalUsers = users.length;
    const totalTradePros = providers.length;
    const pendingOnboarding = providers.filter(
      (p: any) => !p.onboarding_complete
    ).length;
    const activeJobs = jobs.filter(
      (j: any) => j.status === "accepted" || j.status === "in_progress"
    ).length;
    const completedJobs = jobs.filter(
      (j: any) => j.status === "completed" || j.status === "paid"
    ).length;
    const totalRevenue = payments
      .filter((p: any) => p.status === "completed" || p.status === "captured")
      .reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0);

    return res.status(200).json({
      totalUsers,
      totalTradePros,
      pendingOnboarding,
      activeJobs,
      completedJobs,
      totalRevenue,
      recentRequests: requests,
    });
  } catch (error: any) {
    console.error("Admin stats error:", error);
    return res.status(500).json({ error: error.message });
  }
}
