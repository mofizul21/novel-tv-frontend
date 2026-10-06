"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import {
  changeSubscriptionPlan,
  fetchCurrentSubscription,
  fetchSubscriptionPlans,
  startSubscriptionCheckout,
  type CheckoutGateway,
  type CurrentSubscription,
  type SubscriptionPlan,
} from "@/lib/subscriptions";
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
  const [currentSubscription, setCurrentSubscription] = useState<CurrentSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [checkoutKey, setCheckoutKey] = useState<string | null>(null);
  const [changingSlug, setChangingSlug] = useState<string | null>(null);
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

  useEffect(() => {
    let cancelled = false;

    (user ? fetchCurrentSubscription() : Promise.resolve(null))
      .then((subscription) => {
        if (!cancelled) setCurrentSubscription(subscription);
      })
      .catch(() => {
        if (!cancelled) setCurrentSubscription(null);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  async function handleSubscribe(plan: SubscriptionPlan, gateway: CheckoutGateway) {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent("/pricing")}`);
      return;
    }

    const key = `${plan.slug}:${gateway}`;
    setError(null);
    setCheckoutKey(key);

    try {
      const url = await startSubscriptionCheckout(plan.slug, gateway);
      window.location.assign(url);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
      setCheckoutKey(null);
    }
  }

  async function handleChangePlan(plan: SubscriptionPlan) {
    setError(null);
    setChangingSlug(plan.slug);

    try {
      const updated = await changeSubscriptionPlan(plan.slug);
      setCurrentSubscription(updated);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setChangingSlug(null);
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
            {plans.map((plan) => {
              const isCurrentPlan = currentSubscription?.plan.id === plan.id;
              const isPendingPlan = currentSubscription?.pending_plan?.id === plan.id;
              const isUpgrade = currentSubscription ? plan.price > currentSubscription.plan.price : false;

              return (
                <div
                  key={plan.id}
                  className={`flex flex-col rounded-xl border p-8 shadow-md ${
                    isCurrentPlan ? "border-primary bg-surface" : "border-border bg-surface"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h2 className="font-ui text-xl font-bold uppercase tracking-wide text-text-primary">
                      {plan.name}
                    </h2>
                    {isCurrentPlan && (
                      <span className="rounded-full bg-primary/15 px-3 py-1 font-ui text-xs font-bold uppercase tracking-wide text-primary">
                        Current Plan
                      </span>
                    )}
                  </div>
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

                  <div className="mt-8 space-y-2">
                    {isCurrentPlan ? (
                      <div className="rounded-md border border-primary/30 bg-primary/10 py-3 text-center font-ui text-sm font-bold uppercase tracking-wide text-primary">
                        Current Plan
                      </div>
                    ) : isPendingPlan ? (
                      <div className="rounded-md border border-border-light bg-surface-light px-3 py-3 text-center font-body text-sm text-text-secondary">
                        Switching to this plan
                        {currentSubscription?.current_period_ends_at &&
                          ` on ${new Date(currentSubscription.current_period_ends_at).toLocaleDateString()}`}
                      </div>
                    ) : currentSubscription ? (
                      <button
                        onClick={() => handleChangePlan(plan)}
                        disabled={changingSlug === plan.slug}
                        className={`w-full rounded-md py-3 font-ui text-sm font-bold uppercase tracking-wide transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60 ${
                          isUpgrade
                            ? "bg-primary text-text-primary hover:bg-accent"
                            : "border border-border-light bg-surface-light text-text-primary hover:bg-surface-hover"
                        }`}
                      >
                        {changingSlug === plan.slug
                          ? "Updating…"
                          : isUpgrade
                            ? "Upgrade"
                            : "Downgrade"}
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleSubscribe(plan, "stripe")}
                          disabled={checkoutKey === `${plan.slug}:stripe`}
                          className="w-full rounded-md bg-primary py-3 font-ui text-sm font-bold uppercase tracking-wide text-text-primary transition-colors duration-150 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {checkoutKey === `${plan.slug}:stripe` ? "Redirecting…" : "Subscribe with Card"}
                        </button>
                        <button
                          onClick={() => handleSubscribe(plan, "paypal")}
                          disabled={checkoutKey === `${plan.slug}:paypal`}
                          className="w-full rounded-md border border-border-light bg-surface-light py-3 font-ui text-sm font-bold uppercase tracking-wide text-text-primary transition-colors duration-150 hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {checkoutKey === `${plan.slug}:paypal` ? "Redirecting…" : "Subscribe with PayPal"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
