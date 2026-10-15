"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Lock, Eye, EyeOff } from "lucide-react";
import { ApiError } from "@/lib/api";
import { resetPassword } from "@/lib/auth";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await resetPassword({
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
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
          Reset Password
        </h1>
        <p className="mt-1 text-center font-body text-sm text-text-secondary">
          Choose a new password for your account.
        </p>

        {!token || !email ? (
          <div className="mt-6 space-y-4">
            <p className="rounded-md border border-error/30 bg-error/10 px-3 py-2 font-body text-sm text-error">
              This reset link is invalid or incomplete. Request a new one below.
            </p>
            <Link
              href="/forgot-password"
              className="block w-full rounded-md bg-primary py-3 text-center font-ui text-sm font-bold uppercase tracking-wide text-text-primary transition-colors duration-150 hover:bg-accent"
            >
              Request New Link
            </Link>
          </div>
        ) : success ? (
          <div className="mt-6 space-y-4">
            <p className="rounded-md border border-success/30 bg-success/10 px-3 py-2 font-body text-sm text-success">
              Your password has been reset. Redirecting you to sign in...
            </p>
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
                New Password
              </label>
              <div className="flex items-center gap-2 rounded-md border border-border bg-surface-light px-3 py-2.5 focus-within:border-primary">
                <Lock size={16} className="text-text-muted" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full bg-transparent font-body text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-text-muted transition-colors duration-150 hover:text-text-primary"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block font-ui text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Confirm New Password
              </label>
              <div className="flex items-center gap-2 rounded-md border border-border bg-surface-light px-3 py-2.5 focus-within:border-primary">
                <Lock size={16} className="text-text-muted" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  placeholder="Re-enter your new password"
                  className="w-full bg-transparent font-body text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-primary py-3 font-ui text-sm font-bold uppercase tracking-wide text-text-primary shadow-primary transition-colors duration-150 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
