import { apiFetch } from "./api";

export type SubscriptionPlan = {
  id: number;
  name: string;
  slug: string;
  price: number;
  billing_interval: "monthly" | "yearly";
  max_screens: number;
  quality_cap: "sd" | "hd" | "full_hd" | "uhd_4k";
  trial_days: number;
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

export async function startSubscriptionCheckout(
  planSlug: string,
  gateway: CheckoutGateway = "stripe",
): Promise<string> {
  const response = await apiFetch<{ url: string }>("checkout/subscriptions", {
    method: "POST",
    body: JSON.stringify({ plan_slug: planSlug, gateway }),
  });
  return response.url;
}
