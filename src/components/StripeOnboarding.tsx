import { useState } from "react";

interface StripeOnboardingProps {
  providerId: string;
  email: string;
  businessName?: string;
  isOnboarded: boolean;
}

export default function StripeOnboarding({
  providerId,
  email,
  businessName,
  isOnboarded,
}: StripeOnboardingProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/stripe/onboard-provider", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ providerId, email, businessName }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to start onboarding");
      }

      // Redirect to Stripe onboarding
      window.location.href = data.onboardingUrl;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (isOnboarded) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 border border-green-200">
        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-sm font-medium text-green-800">
          Stripe Connected
        </span>
        <span className="text-green-700 text-sm">
          Your account is set up to receive payments
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold mb-2">Connect Stripe Account</h3>
      <p className="text-sm text-gray-600 mb-4">
        Set up your Stripe account to receive payments for completed jobs. HROP
        takes a 15% platform fee on each transaction.
      </p>

      {error && (
        <p className="text-sm text-red-600 mb-3">{error}</p>
      )}

      <button
        onClick={handleConnect}
        disabled={loading}
        className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Redirecting..." : "Connect Stripe Account"}
      </button>
    </div>
  );
}
