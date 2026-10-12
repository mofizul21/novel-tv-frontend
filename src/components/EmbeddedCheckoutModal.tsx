"use client";

import { useMemo } from "react";
import { X } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";

type Props = {
  clientSecret: string;
  publishableKey: string;
  onClose: () => void;
  onComplete: () => void;
};

/**
 * Hosts Stripe's checkout UI inline instead of redirecting the whole page
 * to stripe.com — the client_secret comes from a Checkout Session created
 * with ui_mode: "embedded" (see backend's CheckoutController). Stripe still
 * renders the card form (we don't build our own), it just stays inside
 * this modal rather than navigating away.
 */
export function EmbeddedCheckoutModal({ clientSecret, publishableKey, onClose, onComplete }: Props) {
  // Re-created only if the key actually changes — loadStripe() shouldn't be
  // called on every render.
  const stripePromise = useMemo(() => loadStripe(publishableKey), [publishableKey]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      {/* flex-col + overflow-hidden on this shell, with a hard vh cap (not
          max-h-full, which depends on the padded flex parent resolving
          percentages correctly — Stripe's embedded iframe can report a tall
          intrinsic height and blow past that) — only the content below the
          header scrolls, so the close button in the header never scrolls
          out of view. */}
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-md">
        <div className="flex items-center justify-end border-b border-border px-4 py-3">
          <button
            type="button"
            aria-label="Close checkout"
            onClick={onClose}
            className="text-text-muted transition-colors duration-150 hover:text-text-primary"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret, onComplete }}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </div>
    </div>
  );
}
