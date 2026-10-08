"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { capturePaypalPpvOrder, type PurchasableType } from "@/lib/ppv";
import { ApiError } from "@/lib/api";

function PaypalReturnContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("token");
  const purchasableType = searchParams.get("purchasable_type") as PurchasableType | null;
  const purchasableId = searchParams.get("purchasable_id");
  const purchasableSlug = searchParams.get("purchasable_slug");

  const [state, setState] = useState<"capturing" | "done" | "error">("capturing");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId || !purchasableType || !purchasableId) {
      Promise.resolve().then(() => setState("error"));
      return;
    }

    let cancelled = false;

    capturePaypalPpvOrder(purchasableType, Number(purchasableId), orderId)
      .then(() => {
        if (!cancelled) setState("done");
      })
      .catch((err) => {
        if (!cancelled) {
          setErrorMessage(err instanceof ApiError ? err.message : "Something went wrong confirming your payment.");
          setState("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [orderId, purchasableType, purchasableId]);

  const contentHref = purchasableSlug
    ? purchasableType === "series"
      ? `/series/${purchasableSlug}`
      : `/movies/${purchasableSlug}`
    : "/";

  if (state === "capturing") {
    return (
      <section className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center gap-4 bg-background px-4 text-center">
        <Loader2 size={40} className="animate-spin text-text-secondary" />
        <p className="font-body text-sm text-text-secondary">Confirming your payment with PayPal…</p>
      </section>
    );
  }

  if (state === "error") {
    return (
      <section className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center gap-4 bg-background px-4 text-center">
        <XCircle size={48} className="text-error" />
        <h1 className="font-heading text-4xl uppercase text-text-primary">Payment Not Confirmed</h1>
        <p className="max-w-md font-body text-sm text-text-secondary">
          {errorMessage ?? "We couldn't confirm your PayPal payment. No charge should have gone through — try renting again."}
        </p>
        <Link
          href={contentHref}
          className="mt-4 rounded-md bg-primary px-6 py-3 font-ui text-sm font-bold uppercase tracking-wide text-text-primary transition-colors duration-150 hover:bg-accent"
        >
          Back to Title
        </Link>
      </section>
    );
  }

  return (
    <section className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <CheckCircle2 size={48} className="text-success" />
      <h1 className="font-heading text-4xl uppercase text-text-primary">You&rsquo;re all set</h1>
      <p className="max-w-md font-body text-sm text-text-secondary">
        Your payment was confirmed — enjoy your rental for the next 48 hours.
      </p>
      <Link
        href={contentHref}
        className="mt-4 rounded-md bg-primary px-6 py-3 font-ui text-sm font-bold uppercase tracking-wide text-text-primary transition-colors duration-150 hover:bg-accent"
      >
        Start Watching
      </Link>
    </section>
  );
}

export default function PaypalReturnPage() {
  return (
    <Suspense fallback={null}>
      <PaypalReturnContent />
    </Suspense>
  );
}
