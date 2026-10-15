"use client";

import { useState } from "react";
import { Tag, X } from "lucide-react";
import { validateCoupon, type CouponPreview } from "@/lib/coupons";

/**
 * Small inline "have a coupon?" input shown next to the Rent buttons on a
 * movie/series detail page — shared by both since the PPV purchase flow is
 * identical for each (see src/app/movies/[slug]/page.tsx and
 * src/app/series/[slug]/page.tsx).
 */
export function PpvCouponInput({
  purchasableType,
  purchasableId,
  appliedCoupon,
  onApply,
  onRemove,
}: {
  purchasableType: "movie" | "series";
  purchasableId: number;
  appliedCoupon: CouponPreview | null;
  onApply: (coupon: CouponPreview) => void;
  onRemove: () => void;
}) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleApply() {
    const trimmed = code.trim();
    if (!trimmed) return;

    setStatus("checking");
    setError(null);

    const result = await validateCoupon({ code: trimmed, purchasableType, purchasableId });

    if (result.valid) {
      onApply(result);
      setStatus("idle");
    } else {
      setError(result.message);
      setStatus("error");
    }
  }

  if (appliedCoupon) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-success/30 bg-success/10 px-3 py-2 font-body text-sm text-success">
        <Tag size={14} />
        <span>
          Code <span className="font-semibold">{appliedCoupon.code}</span> applied
        </span>
        <button
          onClick={onRemove}
          aria-label="Remove coupon"
          className="ml-1 text-success/70 transition-colors duration-150 hover:text-success"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2">
        <div className="flex items-center gap-2 rounded-md border border-border bg-surface-light px-3 py-2 focus-within:border-primary">
          <Tag size={14} className="text-text-muted" />
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
            placeholder="Coupon code"
            className="w-32 bg-transparent font-body text-sm uppercase text-text-primary placeholder:normal-case placeholder:text-text-muted focus:outline-none"
          />
        </div>
        <button
          onClick={handleApply}
          disabled={!code.trim() || status === "checking"}
          className="rounded-md border border-border-light bg-surface-light px-3 py-2 font-ui text-xs font-semibold uppercase tracking-wide text-text-primary transition-colors duration-150 hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "checking" ? "…" : "Apply"}
        </button>
      </div>
      {status === "error" && error && <p className="mt-1 font-body text-xs text-error">{error}</p>}
    </div>
  );
}
