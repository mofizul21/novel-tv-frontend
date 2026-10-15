import { apiFetch, ApiError } from "./api";

export type CouponPreview = {
  valid: true;
  code: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  original_amount: number | null;
  discounted_amount: number | null;
};

export type CouponPreviewResult = CouponPreview | { valid: false; message: string };

/**
 * Previews a coupon against a plan or a PPV title before checkout. Never
 * throws for an invalid code — the backend's 422 ("not valid"/"expired"/
 * etc.) is a normal outcome here, not an error state, so it's translated
 * into { valid: false, message } instead of surfacing as an ApiError.
 */
export async function validateCoupon(input: {
  code: string;
  planSlug?: string;
  purchasableType?: "movie" | "series";
  purchasableId?: number;
}): Promise<CouponPreviewResult> {
  try {
    return await apiFetch<CouponPreview>("coupons/validate", {
      method: "POST",
      body: JSON.stringify({
        code: input.code,
        plan_slug: input.planSlug,
        purchasable_type: input.purchasableType,
        purchasable_id: input.purchasableId,
      }),
    });
  } catch (err) {
    if (err instanceof ApiError) {
      return { valid: false, message: err.message };
    }
    throw err;
  }
}
