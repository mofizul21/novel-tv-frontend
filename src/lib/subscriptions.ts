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
