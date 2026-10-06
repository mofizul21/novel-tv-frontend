"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, Mail, User as UserIcon, CalendarDays, KeyRound, CreditCard, AlertTriangle, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { fetchCurrentSubscription, type CurrentSubscription } from "@/lib/subscriptions";
import { requestAccountDeletion } from "@/lib/account";
import { ApiError } from "@/lib/api";

const STATUS_LABELS: Record<CurrentSubscription["status"], string> = {
  trialing: "Free trial",
  active: "Active",
  past_due: "Past due",
  canceled: "Canceled",
  expired: "Expired",
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [subscription, setSubscription] = useState<CurrentSubscription | null | undefined>(undefined);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    fetchCurrentSubscription()
      .then((data) => {
        if (!cancelled) setSubscription(data);
      })
      .catch(() => {
        if (!cancelled) setSubscription(null);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      await logout();
    } finally {
      router.push("/");
    }
  }

  async function handleConfirmDeletion() {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await requestAccountDeletion();
      await logout();
      router.push("/?account_deleted=1");
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
      setIsDeleting(false);
    }
  }

  if (isLoading || !user) {
    return (
      <section className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-background">
        <p className="font-body text-sm text-text-secondary">Loading your account…</p>
      </section>
    );
  }

  const memberSince = new Date(user.created_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="relative isolate overflow-hidden bg-background">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(0,116,217,0.25),transparent_60%)]" />
      </div>

      <div className="mx-auto max-w-360 px-4 py-16 sm:px-6 lg:px-10">
        <h1 className="font-heading text-5xl uppercase text-text-primary sm:text-6xl">
          My Account
        </h1>
        <p className="mt-2 font-body text-sm text-text-secondary">
          Welcome back, {user.name.split(" ")[0]}.
        </p>

        <div className="mt-10 max-w-xl rounded-xl border border-border bg-surface p-8 shadow-md">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-surface-light text-primary">
              <UserIcon size={28} />
            </div>
            <div>
              <p className="font-ui text-lg font-semibold text-text-primary">{user.name}</p>
              <p className="font-body text-sm text-text-secondary">{user.email}</p>
            </div>
          </div>

          <dl className="mt-6 space-y-3 border-t border-border pt-6 font-body text-sm">
            <div className="flex items-center gap-2 text-text-secondary">
              <Mail size={16} className="text-text-muted" />
              <dt className="sr-only">Email</dt>
              <dd>{user.email}</dd>
            </div>
            <div className="flex items-center gap-2 text-text-secondary">
              <CalendarDays size={16} className="text-text-muted" />
              <dt className="sr-only">Member since</dt>
              <dd>Member since {memberSince}</dd>
            </div>
          </dl>

          <div className="mt-6 border-t border-border pt-6">
            <p className="font-ui text-xs font-bold uppercase tracking-wide text-text-muted">
              Subscription
            </p>

            {subscription === undefined ? (
              <p className="mt-2 font-body text-sm text-text-secondary">Loading…</p>
            ) : subscription === null ? (
              <div className="mt-2 flex items-center justify-between gap-3">
                <p className="font-body text-sm text-text-secondary">You&apos;re not subscribed yet.</p>
                <Link
                  href="/pricing"
                  className="shrink-0 font-ui text-sm font-semibold text-primary hover:text-accent"
                >
                  View Plans
                </Link>
              </div>
            ) : (
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <CreditCard size={16} className="text-text-muted" />
                  <p className="font-body text-sm text-text-primary">
                    {subscription.plan.name} — ${subscription.plan.price.toFixed(2)}/
                    {subscription.plan.billing_interval === "yearly" ? "year" : "month"}
                  </p>
                  <span className="rounded-full bg-primary/15 px-2 py-0.5 font-ui text-xs font-bold uppercase tracking-wide text-primary">
                    {STATUS_LABELS[subscription.status]}
                  </span>
                </div>

                {subscription.status === "trialing" && subscription.trial_ends_at && (
                  <p className="mt-1.5 font-body text-xs text-text-secondary">
                    Trial ends {new Date(subscription.trial_ends_at).toLocaleDateString()}
                  </p>
                )}
                {subscription.status !== "trialing" && subscription.current_period_ends_at && (
                  <p className="mt-1.5 font-body text-xs text-text-secondary">
                    Renews {new Date(subscription.current_period_ends_at).toLocaleDateString()}
                  </p>
                )}
                {subscription.pending_plan && subscription.current_period_ends_at && (
                  <p className="mt-1.5 font-body text-xs text-text-secondary">
                    Switching to {subscription.pending_plan.name} on{" "}
                    {new Date(subscription.current_period_ends_at).toLocaleDateString()}
                  </p>
                )}

                <Link
                  href="/pricing"
                  className="mt-3 inline-block font-ui text-sm font-semibold text-primary hover:text-accent"
                >
                  Manage Plan
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/dashboard/change-password"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-md border border-border-light bg-surface-light py-2.5 font-ui text-sm font-semibold text-text-primary transition-colors duration-150 hover:bg-surface-hover"
          >
            <KeyRound size={16} />
            Change Password
          </Link>

          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-border-light bg-surface-light py-2.5 font-ui text-sm font-semibold text-text-primary transition-colors duration-150 hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut size={16} />
            {isSigningOut ? "Signing Out..." : "Sign Out"}
          </button>
        </div>

        <div className="mt-6 max-w-xl rounded-xl border border-error/30 bg-error/5 p-8">
          <p className="font-ui text-xs font-bold uppercase tracking-wide text-error">
            Danger Zone
          </p>
          <p className="mt-2 font-body text-sm text-text-secondary">
            Permanently delete your account and all of your data. This cannot be undone after the
            30-day grace period ends.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="mt-4 flex items-center gap-2 rounded-md border border-error/40 px-4 py-2 font-ui text-sm font-semibold text-error transition-colors duration-150 hover:bg-error/10"
          >
            <AlertTriangle size={16} />
            Request Account Deletion
          </button>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-md">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 font-ui text-base font-bold text-text-primary">
                <AlertTriangle size={18} className="text-error" />
                Delete your account?
              </p>
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                aria-label="Close"
                className="text-text-muted hover:text-text-primary disabled:cursor-not-allowed"
              >
                <X size={18} />
              </button>
            </div>

            <ul className="mt-4 list-disc space-y-2 pl-5 font-body text-sm text-text-secondary">
              <li>Your account will be deactivated immediately and you&apos;ll be signed out.</li>
              <li>Any active subscription will be canceled right away.</li>
              <li>We&apos;ll send you a confirmation email.</li>
              <li>
                Changed your mind? Contact us through the{" "}
                <Link href="/contact-us" className="font-semibold text-primary hover:text-accent">
                  Contact page
                </Link>{" "}
                within 30 days and we&apos;ll reactivate your account.
              </li>
              <li>After 30 days, your account and all of its data are permanently deleted.</li>
            </ul>

            {deleteError && (
              <p className="mt-4 rounded-md border border-error/30 bg-error/10 px-3 py-2 font-body text-sm text-error">
                {deleteError}
              </p>
            )}

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 rounded-md border border-border-light bg-surface-light py-2.5 font-ui text-sm font-semibold text-text-primary transition-colors duration-150 hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeletion}
                disabled={isDeleting}
                className="flex-1 rounded-md bg-error py-2.5 font-ui text-sm font-bold uppercase tracking-wide text-text-primary transition-colors duration-150 hover:bg-error/80 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete My Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
