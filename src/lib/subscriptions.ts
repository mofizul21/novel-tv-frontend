import { apiFetch } from "./api";

export type SubscriptionPlan = {
  id: number;
  name: string;
  slug: string;
  price: number;
  billing_interval: "monthly" | "yearly";
  max_screens: number;
  quality_cap: "sd" | "hd" | "full_hd" | "uhd_4k";
  trial_duration: number;
  trial_duration_unit: "minutes" | "hours" | "days";
  trial_label: string | null;
};

export async function fetchSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const response = await apiFetch<{ data: SubscriptionPlan[] }>("subscription-plans");
  return response.data;
}

export type SubscriptionStatus = "trialing" | "active" | "past_due" | "canceled" | "expired";

export type CurrentSubscription = {
  id: number;
  status: SubscriptionStatus;
  gateway: string;
  trial_ends_at: string | null;
  current_period_ends_at: string | null;
  canceled_at: string | null;
  plan: SubscriptionPlan;
  pending_plan: SubscriptionPlan | null;
};

export async function fetchCurrentSubscription(): Promise<CurrentSubscription | null> {
  const response = await apiFetch<{ data: CurrentSubscription | null }>("subscriptions/current");
  return response.data;
}

export async function changeSubscriptionPlan(planSlug: string): Promise<CurrentSubscription> {
  const response = await apiFetch<{ data: CurrentSubscription }>("subscriptions/change-plan", {
    method: "POST",
    body: JSON.stringify({ plan_slug: planSlug }),
  });
  return response.data;
}

export type CheckoutGateway = "stripe" | "paypal";

export type CheckoutStart =
  | { gateway: "stripe"; clientSecret: string; publishableKey: string }
  | { gateway: "paypal"; url: string };

/**
 * Stripe comes back as a client_secret for an embedded checkout session
 * (mounted inline via <EmbeddedCheckout>, no redirect) — PayPal still comes
 * back as an approval URL to redirect to, since PayPal's own embedded
 * button flow is a separate integration not covered by this change.
 */
export async function startSubscriptionCheckout(
  planSlug: string,
  gateway: CheckoutGateway = "stripe",
  couponCode?: string,
): Promise<CheckoutStart> {
  const response = await apiFetch<
    { gateway: "stripe"; client_secret: string; publishable_key: string } | { gateway: "paypal"; url: string }
  >("checkout/subscriptions", {
    method: "POST",
    body: JSON.stringify({ plan_slug: planSlug, gateway, coupon_code: couponCode || undefined }),
  });

  return response.gateway === "stripe"
    ? { gateway: "stripe", clientSecret: response.client_secret, publishableKey: response.publishable_key }
    : { gateway: "paypal", url: response.url };
}
