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
      Prefer: "return=representation",
      ...options.headers,
    },
  });
}

async function getUserFromToken(token: string): Promise<{ id: string } | null> {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { jobId } = req.query;
  if (!jobId || typeof jobId !== "string") {
    return res.status(400).json({ error: "jobId is required" });
  }

  // Authenticate user from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const user = await getUserFromToken(authHeader.split(" ")[1]);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Fetch the job with its linked maintenance request to verify access
    const jobRes = await supabaseRequest(
      `jobs?id=eq.${jobId}&select=id,status,service_provider_id,scheduled_date,request:maintenance_requests(id,tenant_id,landlord_id,category)`
    );
    if (!jobRes.ok) {
      return res.status(500).json({ error: "Failed to fetch job" });
    }

    const jobs = await jobRes.json();
    if (!jobs.length) {
      return res.status(404).json({ error: "Job not found" });
    }

    const job = jobs[0];
    const request = job.request;

    // Verify user is the tenant or landlord on this job
    if (request.tenant_id !== user.id && request.landlord_id !== user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // If no provider assigned yet
    if (!job.service_provider_id) {
      return res.status(200).json({
        tradeCategory: request.category,
        estimatedArrival: job.scheduled_date || null,
        status: job.status,
        providerAssigned: false,
      });
    }

    // Pre-accepted statuses: mask personal info
    if (["available", "pending"].includes(job.status)) {
      return res.status(200).json({
        tradeCategory: request.category,
        estimatedArrival: job.scheduled_date || null,
        status: job.status,
        providerAssigned: true,
      });
    }

    // Post-accepted statuses: return full provider info (no phone from profiles)
    const providerRes = await supabaseRequest(
      `service_providers?id=eq.${job.service_provider_id}&select=business_name,service_type,rating,total_jobs`
    );
    if (!providerRes.ok) {
      return res.status(500).json({ error: "Failed to fetch provider" });
    }

    const providers = await providerRes.json();
    if (!providers.length) {
      return res.status(200).json({
        tradeCategory: request.category,
        estimatedArrival: job.scheduled_date || null,
        status: job.status,
        providerAssigned: true,
      });
    }

    const provider = providers[0];

    // Fetch masked phone from profiles (service provider's user profile)
    const profileRes = await supabaseRequest(
      `profiles?id=eq.${job.service_provider_id}&select=phone`
    );
    const profiles = profileRes.ok ? await profileRes.json() : [];
    const phone = profiles[0]?.phone || "";
    const maskedPhone = phone.length >= 2
      ? "\u25CF\u25CF\u25CF \u25CF\u25CF\u25CF \u25CF\u25CF" + phone.slice(-2)
      : null;

    return res.status(200).json({
      tradeCategory: request.category,
      estimatedArrival: job.scheduled_date || null,
      status: job.status,
      providerAssigned: true,
      businessName: provider.business_name,
      serviceType: provider.service_type,
      rating: provider.rating,
      totalJobs: provider.total_jobs,
      maskedPhone,
    });
  } catch (error: any) {
    console.error("get-job-provider error:", error);
    return res.status(500).json({ error: error.message });
  }
}
