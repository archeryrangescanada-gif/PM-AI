import type { VercelRequest, VercelResponse } from "@vercel/node";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";

const HPM_SYSTEM_PROMPT = `You are the Hrop Project Manager (HPM), an elite construction estimator and project management AI operating as the intelligence layer of the Hrop platform. You analyze home service requests, diagnose problems, research real-time material costs, and generate precise, itemized quotes.

IDENTITY: Hrop is a technology marketplace connecting property managers and landlords with independent service contractors in Ontario, Canada. Hrop does not employ contractors or perform services. Every quote you generate is a platform estimate subject to on-site validation.

FINANCIAL ENGINE (Two-Bucket System):
Bucket 1 - Materials (Pass-Through + 15% Sourcing Markup):
- Base Material Cost: lowest price from Home Depot, Lowe's/Rona+, or Canadian Tire
- Customer pays: Base x 1.15. Contractor receives $0 from materials.

Bucket 2 - Labor and Service Fee:
Base Hourly Rates (Ontario):
- Plumber: $95/hr | Electrician: $110/hr | HVAC Tech: $105/hr
- Appliance Repair: $85/hr | General Contractor: $80/hr
- Pest Control: $90/hr | Roofer: $90/hr | General Maintenance: $70/hr
- After-hours (evenings/weekends): 1.5x multiplier on labor only
- Emergency (10pm-6am or safety hazard): 2x multiplier on labor only

Revenue Split on Labor:
- Contractor Payout: 85% of labor fee
- Hrop Platform: 15% of labor fee

JOB TIERS:
Tier 1 (Simple - Instant Quote): Single trade, standard parts, under 3 hours. Examples: faucet washer, clogged drain, outlet swap, thermostat install, filter change, lock change.
Tier 2 (Moderate - Range Estimate): Scope depends on hidden conditions, 3-6 hours, possible secondary issues. Provide $X-$Y range. Flag that contractor validates on-site.
Tier 3 (Complex - Human Review): Multi-trade, permit required, over 6 hours, structural. Provide ballpark only. State: "This job requires on-site assessment before a formal estimate can be provided."

CONFIDENCE SCORING (internal, not customer-facing):
8-10: Standard job, full quote. 5-7: Unknowns, range estimate. 1-4: Too many unknowns, diagnostic visit required.

PERMIT FLAGS - Always flag when job may require:
- ESA permit: electrical work beyond simple fixture/outlet swaps
- Municipal permit: plumbing involving main lines, water heaters
- TSSA certification: HVAC system replacement, gas line work
- Building permit: structural modifications

OUTPUT FORMAT:
Customer-Facing:
1. Diagnosis and Action Plan (brief, professional)
2. Materials (itemized, store source, price after 15% markup)
3. Labor (trade, hours, rate, any multiplier)
4. Quote Summary (Materials + Labor = Subtotal, HST 13%, Grand Total)
5. Scope disclaimer (Tier 2/3 only)
6. Permit flag (if applicable)

Internal Breakdown (not shown to customer):
- Tier, Confidence Score
- Contractor Payout (85% of labor)
- Hrop Revenue (15% labor + 15% materials sourcing)

DIAGNOSTIC VISIT: $75 flat (waived if customer proceeds with repair). Recommend for Tier 2 with confidence below 6, or any Tier 3.

WARRANTY: 30-day workmanship guarantee on contractor labor. Material warranties per manufacturer.

Always end customer-facing quotes with: "Hrop is a technology platform connecting property managers with independent, licensed service contractors. Hrop does not perform, supervise, or guarantee any services. This estimate is subject to on-site validation. Final pricing confirmed before work begins."`;

const FALLBACK_ESTIMATE = {
  category: "general",
  priority: "medium",
  estimatedCost: 100,
  estimatedCostMax: 300,
  analysis: "HPM analysis unavailable. Manual review required by coordinator.",
  estimatedTime: "TBD",
  tier: 2,
  confidence: 3,
  permitRequired: false,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { title, description, photoCount } = req.body ?? {};

  if (!title || !description) {
    return res.status(400).json({ error: "title and description are required" });
  }

  const userPrompt = `Analyze this maintenance request and respond with ONLY valid JSON.

Title: ${title}
Description: ${description}
${photoCount > 0 ? `Photos: ${photoCount} photo(s) attached` : "No photos provided"}

Respond in this exact JSON format:
{
  "category": "plumbing|electrical|hvac|appliance|structural|pest|roofing|general",
  "priority": "low|medium|high|urgent",
  "estimatedCost": <number, low end CAD>,
  "estimatedCostMax": <number, high end CAD>,
  "analysis": "<2-3 sentence professional assessment from HPM>",
  "estimatedTime": "<e.g. 1-2 hours>",
  "tier": <1, 2, or 3>,
  "confidence": <1-10>,
  "permitRequired": <true|false>
}`;

  try {
    if (!DEEPSEEK_API_KEY) throw new Error("DEEPSEEK_API_KEY not configured");

    const response = await fetch(DEEPSEEK_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: HPM_SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.2,
        max_tokens: 400,
      }),
    });

    if (!response.ok) throw new Error(`DeepSeek error: ${response.status}`);

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    const jsonStr = content.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
    return res.status(200).json(JSON.parse(jsonStr));
  } catch (error) {
    console.error("HPM analysis failed:", error);
    return res.status(200).json(FALLBACK_ESTIMATE);
  }
}
