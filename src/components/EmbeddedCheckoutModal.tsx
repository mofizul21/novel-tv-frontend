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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8">
      <div className="relative max-h-full w-full max-w-lg overflow-y-auto rounded-xl border border-border bg-surface p-4 shadow-md sm:p-6">
        <button
          type="button"
          aria-label="Close checkout"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 text-text-muted transition-colors duration-150 hover:text-text-primary"
        >
          <X size={20} />
        </button>

        <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret, onComplete }}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
    </div>
  );
}
