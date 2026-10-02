"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { fetchSubscriptionPlans, startSubscriptionCheckout, type SubscriptionPlan } from "@/lib/subscriptions";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";

const QUALITY_LABELS: Record<SubscriptionPlan["quality_cap"], string> = {
  sd: "SD",
  hd: "HD",
  full_hd: "Full HD",
  uhd_4k: "4K Ultra HD",
};

export default function PricingPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [checkoutSlug, setCheckoutSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await fetchSubscriptionPlans();
        if (!cancelled) setPlans(data);
      } catch {
        if (!cancelled) setPlans([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubscribe(plan: SubscriptionPlan) {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent("/pricing")}`);
      return;
    }

    setError(null);
    setCheckoutSlug(plan.slug);

    try {
      const url = await startSubscriptionCheckout(plan.slug);
      window.location.assign(url);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
      setCheckoutSlug(null);
    }
  }

  return (
    <section className="min-h-[calc(100vh-64px)] bg-background">
      <div className="mx-auto max-w-360 px-4 py-16 sm:px-6 lg:px-10">
        <div className="text-center">
          <h1 className="font-heading text-5xl uppercase text-text-primary sm:text-6xl">
            Choose your plan
          </h1>
          <p className="mt-3 font-body text-base text-text-secondary">
            Cancel anytime. Prices in USD.
          </p>
        </div>

        {error && (
          <p className="mx-auto mt-6 max-w-md rounded-md border border-error/30 bg-error/10 px-4 py-3 text-center font-body text-sm text-error">
            {error}
          </p>
        )}

        {isLoading ? (
          <div className="mt-16 flex justify-center">
            <Loader2 size={24} className="animate-spin text-text-secondary" />
          </div>
        ) : (
          <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="flex flex-col rounded-xl border border-border bg-surface p-8 shadow-md"
              >
                <h2 className="font-ui text-xl font-bold uppercase tracking-wide text-text-primary">
                  {plan.name}
                </h2>
                <p className="mt-4 font-heading text-4xl text-text-primary">
                  ${plan.price.toFixed(2)}
                  <span className="font-body text-base font-normal text-text-secondary">
                    /{plan.billing_interval === "yearly" ? "year" : "month"}
                  </span>
                </p>

                <ul className="mt-6 flex-1 space-y-2 font-body text-sm text-text-secondary">
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-success" />
                    {plan.max_screens} screen{plan.max_screens === 1 ? "" : "s"} at once
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-success" />
                    Up to {QUALITY_LABELS[plan.quality_cap]}
                  </li>
                  {plan.trial_days > 0 && (
                    <li className="flex items-center gap-2">
                      <Check size={16} className="text-success" />
                      {plan.trial_days}-day free trial
                    </li>
                  )}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={checkoutSlug === plan.slug}
                  className="mt-8 rounded-md bg-primary py-3 font-ui text-sm font-bold uppercase tracking-wide text-text-primary transition-colors duration-150 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {checkoutSlug === plan.slug ? "Redirecting…" : "Subscribe"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
