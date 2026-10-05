"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const gateway = searchParams.get("gateway") === "paypal" ? "paypal" : "stripe";
  const reference = gateway === "paypal" ? searchParams.get("subscription_id") : sessionId;
  const gatewayName = gateway === "paypal" ? "PayPal" : "Stripe";

  return (
    <section className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <CheckCircle2 size={48} className="text-success" />
      <h1 className="font-heading text-4xl uppercase text-text-primary">You&rsquo;re all set</h1>
      <p className="max-w-md font-body text-sm text-text-secondary">
        Your subscription is being activated. This usually takes just a few seconds — {gatewayName}{" "}
        confirms the payment in the background and your account updates automatically.
      </p>
      {reference && (
        <p className="font-body text-xs text-text-muted">Reference: {reference}</p>
      )}
      <Link
        href="/"
        className="mt-4 rounded-md bg-primary px-6 py-3 font-ui text-sm font-bold uppercase tracking-wide text-text-primary transition-colors duration-150 hover:bg-accent"
      >
        Start Watching
      </Link>
    </section>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
