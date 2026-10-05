"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { changePassword } from "@/lib/auth";
import { ApiError } from "@/lib/api";

export default function ChangePasswordPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [showPasswords, setShowPasswords] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setSuccess(false);
    setIsSubmitting(true);

    try {
      await changePassword({
        current_password: currentPassword,
        password,
        password_confirmation: passwordConfirmation,
      });
      setSuccess(true);
      setCurrentPassword("");
      setPassword("");
      setPasswordConfirmation("");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        setFieldErrors(err.errors ?? {});
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading || !user) {
    return (
      <section className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-background">
        <p className="font-body text-sm text-text-secondary">Loading your account…</p>
      </section>
    );
  }

  return (
    <section className="relative isolate overflow-hidden bg-background">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(0,116,217,0.25),transparent_60%)]" />
      </div>

      <div className="mx-auto max-w-360 px-4 py-16 sm:px-6 lg:px-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 font-ui text-sm font-medium text-text-secondary hover:text-text-primary"
        >
          <ChevronLeft size={16} />
          My Account
        </Link>

        <h1 className="mt-4 font-heading text-5xl uppercase text-text-primary sm:text-6xl">
          Change Password
        </h1>
        <p className="mt-2 max-w-md font-body text-sm text-text-secondary">
          Changing your password signs you out of any other devices currently logged in.
        </p>

        <div className="mt-10 max-w-xl rounded-xl border border-border bg-surface p-8 shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            {success && (
              <p className="rounded-md border border-success/30 bg-success/10 px-3 py-2 font-body text-sm text-success">
                Password updated.
              </p>
            )}

            {error && (
              <p className="rounded-md border border-error/30 bg-error/10 px-3 py-2 font-body text-sm text-error">
                {error}
              </p>
            )}

            <div>
              <label className="mb-1.5 block font-ui text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Current Password
              </label>
              <div className="flex items-center gap-2 rounded-md border border-border bg-surface-light px-3 py-2.5 focus-within:border-primary">
                <Lock size={16} className="text-text-muted" />
                <input
                  type={showPasswords ? "text" : "password"}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-transparent font-body text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
                />
              </div>
              {fieldErrors.current_password && (
                <p className="mt-1 font-body text-xs text-error">{fieldErrors.current_password[0]}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block font-ui text-xs font-semibold uppercase tracking-wide text-text-secondary">
                New Password
              </label>
              <div className="flex items-center gap-2 rounded-md border border-border bg-surface-light px-3 py-2.5 focus-within:border-primary">
                <Lock size={16} className="text-text-muted" />
                <input
                  type={showPasswords ? "text" : "password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full bg-transparent font-body text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
                />
                <button
                  type="button"
                  aria-label={showPasswords ? "Hide passwords" : "Show passwords"}
                  onClick={() => setShowPasswords((v) => !v)}
                  className="text-text-muted transition-colors duration-150 hover:text-text-primary"
                >
                  {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1 font-body text-xs text-error">{fieldErrors.password[0]}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block font-ui text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Confirm New Password
              </label>
              <div className="flex items-center gap-2 rounded-md border border-border bg-surface-light px-3 py-2.5 focus-within:border-primary">
                <Lock size={16} className="text-text-muted" />
                <input
                  type={showPasswords ? "text" : "password"}
                  required
                  minLength={8}
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  className="w-full bg-transparent font-body text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-primary py-3 font-ui text-sm font-bold uppercase tracking-wide text-text-primary shadow-primary transition-colors duration-150 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
