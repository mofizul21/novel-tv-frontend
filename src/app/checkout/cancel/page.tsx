"use client";

import Link from "next/link";
import { XCircle } from "lucide-react";

export default function CheckoutCancelPage() {
  return (
    <section className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <XCircle size={48} className="text-error" />
      <h1 className="font-heading text-4xl uppercase text-text-primary">Checkout canceled</h1>
      <p className="max-w-md font-body text-sm text-text-secondary">
        No charge was made. You can pick a plan again whenever you&rsquo;re ready.
      </p>
      <Link
        href="/pricing"
        className="mt-4 rounded-md bg-primary px-6 py-3 font-ui text-sm font-bold uppercase tracking-wide text-text-primary transition-colors duration-150 hover:bg-accent"
      >
        Back to Plans
      </Link>
    </section>
  );
}
