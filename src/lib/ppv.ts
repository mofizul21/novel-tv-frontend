import { apiFetch } from "./api";
import type { CheckoutGateway, CheckoutStart } from "./subscriptions";

export type PurchasableType = "movie" | "series";

/** Same gateway-shaped response as startSubscriptionCheckout — see there. */
export async function startPpvCheckout(
  purchasableType: PurchasableType,
  purchasableId: number,
  gateway: CheckoutGateway = "stripe",
): Promise<CheckoutStart> {
  const response = await apiFetch<
    { gateway: "stripe"; client_secret: string; publishable_key: string } | { gateway: "paypal"; url: string }
  >("checkout/ppv", {
    method: "POST",
    body: JSON.stringify({ purchasable_type: purchasableType, purchasable_id: purchasableId, gateway }),
  });

  return response.gateway === "stripe"
    ? { gateway: "stripe", clientSecret: response.client_secret, publishableKey: response.publishable_key }
    : { gateway: "paypal", url: response.url };
}

export async function capturePaypalPpvOrder(
  purchasableType: PurchasableType,
  purchasableId: number,
  paypalOrderId: string,
): Promise<void> {
  await apiFetch("checkout/ppv/paypal/capture", {
    method: "POST",
    body: JSON.stringify({
      purchasable_type: purchasableType,
      purchasable_id: purchasableId,
      paypal_order_id: paypalOrderId,
    }),
  });
}
