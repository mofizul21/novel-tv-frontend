"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail } from "lucide-react";
import { ApiError } from "@/lib/api";
import { requestPasswordReset } from "@/lib/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await requestPasswordReset(email);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="relative isolate flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(0,116,217,0.25),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_100%_100%,rgba(0,175,255,0.12),transparent_65%)]" />
      </div>

      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-8 shadow-md">
        <Link href="/" className="mx-auto flex w-fit items-center">
          <Image
            src="/images/novel-tv-logo.png"
            alt="Novel TV"
            width={500}
            height={228}
            className="h-10 w-auto"
          />
        </Link>

        <h1 className="mt-6 text-center font-heading text-4xl uppercase text-text-primary">
          Forgot Password
        </h1>
        <p className="mt-1 text-center font-body text-sm text-text-secondary">
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>

        {submitted ? (
          <div className="mt-6 space-y-4">
            <p className="rounded-md border border-success/30 bg-success/10 px-3 py-2 font-body text-sm text-success">
              If that email address is registered, a password reset link has been sent. Check your
              inbox.
            </p>
            <Link
              href="/login"
              className="block w-full rounded-md bg-primary py-3 text-center font-ui text-sm font-bold uppercase tracking-wide text-text-primary transition-colors duration-150 hover:bg-accent"
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <p className="rounded-md border border-error/30 bg-error/10 px-3 py-2 font-body text-sm text-error">
                {error}
              </p>
            )}

            <div>
              <label className="mb-1.5 block font-ui text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Email
              </label>
              <div className="flex items-center gap-2 rounded-md border border-border bg-surface-light px-3 py-2.5 focus-within:border-primary">
                <Mail size={16} className="text-text-muted" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-transparent font-body text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-primary py-3 font-ui text-sm font-bold uppercase tracking-wide text-text-primary shadow-primary transition-colors duration-150 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </button>

            <p className="text-center font-body text-sm text-text-secondary">
              Remembered it?{" "}
              <Link href="/login" className="font-semibold text-primary hover:text-accent">
                Back to Sign In
              </Link>
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
