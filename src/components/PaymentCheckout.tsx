import { useState, useEffect, FormEvent } from "react";

// Stripe.js types
declare global {
  interface Window {
    Stripe?: (key: string) => any;
  }
}

interface PaymentCheckoutProps {
  jobId: string;
  amount: number; // in cents
  providerId: string;
  onSuccess: () => void;
}

// Load Stripe.js from CDN
function loadStripe(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (window.Stripe) {
      resolve(
        window.Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
      );
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/";
    script.onload = () => {
      if (window.Stripe) {
        resolve(
          window.Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
        );
      } else {
        reject(new Error("Stripe.js failed to load"));
      }
    };
    script.onerror = () => reject(new Error("Failed to load Stripe.js"));
    document.head.appendChild(script);
  });
}

export default function PaymentCheckout({
  jobId,
  amount,
  providerId,
  onSuccess,
}: PaymentCheckoutProps) {
  const [stripe, setStripe] = useState<any>(null);
  const [elements, setElements] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const stripeInstance = await loadStripe();
        if (cancelled) return;

        // Create payment intent
        const res = await fetch("/api/stripe/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobId, amount, providerId }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create payment");

        if (cancelled) return;

        setPaymentIntentId(data.paymentIntentId);

        // Mount card element
        const elementsInstance = stripeInstance.elements({
          clientSecret: data.clientSecret,
        });
        const cardElement = elementsInstance.create("payment");
        cardElement.mount("#payment-element");

        setStripe(stripeInstance);
        setElements(elementsInstance);
        setLoading(false);
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [jobId, amount, providerId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setPaying(true);
    setError(null);

    try {
      const { error: stripeError } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (stripeError) {
        setError(stripeError.message);
        setPaying(false);
        return;
      }

      // Confirm payment on server
      const confirmRes = await fetch("/api/stripe/confirm-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentIntentId, jobId }),
      });

      const confirmData = await confirmRes.json();

      if (confirmData.success) {
        onSuccess();
      } else {
        setError(`Payment status: ${confirmData.status}`);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setPaying(false);
    }
  };

  const displayAmount = (amount / 100).toFixed(2);

  return (
    <div className="rounded-lg border border-gray-200 p-6 max-w-md">
      <h3 className="text-lg font-semibold mb-1">Pay for Service</h3>
      <p className="text-2xl font-bold text-gray-900 mb-4">
        ${displayAmount} CAD
      </p>

      {error && (
        <div className="rounded-md bg-red-50 p-3 mb-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div
          id="payment-element"
          className="mb-4 min-h-[60px]"
        >
          {loading && (
            <p className="text-sm text-gray-500">Loading payment form...</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || paying || !stripe}
          className="w-full rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {paying ? "Processing..." : `Pay $${displayAmount} CAD`}
        </button>
      </form>

      <p className="text-xs text-gray-500 mt-3 text-center">
        Payments are processed securely by Stripe
      </p>
    </div>
  );
}
