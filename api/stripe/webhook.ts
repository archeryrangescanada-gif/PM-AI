import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;
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

// Vercel needs raw body for webhook signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(req: VercelRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const { jobId } = paymentIntent.metadata;

  if (jobId) {
    // Update payment status
    await supabaseRequest(
      `payments?stripe_payment_intent_id=eq.${paymentIntent.id}`,
      {
        method: "PATCH",
        body: JSON.stringify({ status: "captured" }),
      }
    );

    // Update job status to paid
    await supabaseRequest(`jobs?id=eq.${jobId}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "paid" }),
    });
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  const { jobId } = paymentIntent.metadata;

  console.error(
    `Payment failed for job ${jobId}:`,
    paymentIntent.last_payment_error?.message
  );

  // Update payment status to failed
  await supabaseRequest(
    `payments?stripe_payment_intent_id=eq.${paymentIntent.id}`,
    {
      method: "PATCH",
      body: JSON.stringify({ status: "failed" }),
    }
  );
}

async function handleAccountUpdated(account: Stripe.Account) {
  const isOnboarded =
    account.charges_enabled === true && account.details_submitted === true;

  await supabaseRequest(
    `service_providers?stripe_account_id=eq.${account.id}`,
    {
      method: "PATCH",
      body: JSON.stringify({ stripe_onboarded: isOnboarded }),
    }
  );
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const rawBody = await getRawBody(req);
    const signature = req.headers["stripe-signature"] as string;

    if (!signature) {
      return res.status(400).json({ error: "Missing stripe-signature header" });
    }

    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      WEBHOOK_SECRET
    );

    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      case "payment_intent.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      case "account.updated":
        await handleAccountUpdated(event.data.object as Stripe.Account);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return res.status(400).json({ error: error.message });
  }
}
