"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, Mail, User as UserIcon, CalendarDays, KeyRound } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      await logout();
    } finally {
      router.push("/");
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

          <p className="mt-6 font-body text-xs text-text-muted">
            Subscription and billing history will show up here soon.
          </p>

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
      </div>
    </section>
  );
}
