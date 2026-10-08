import { apiFetch } from "./api";
import type { CheckoutGateway } from "./subscriptions";

export type PurchasableType = "movie" | "series";

export async function startPpvCheckout(
  purchasableType: PurchasableType,
  purchasableId: number,
  gateway: CheckoutGateway = "stripe",
): Promise<string> {
  const response = await apiFetch<{ url: string }>("checkout/ppv", {
    method: "POST",
    body: JSON.stringify({ purchasable_type: purchasableType, purchasable_id: purchasableId, gateway }),
  });
  return response.url;
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
