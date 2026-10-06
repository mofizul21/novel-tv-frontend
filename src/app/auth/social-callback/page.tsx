"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, XCircle } from "lucide-react";
import { ApiError } from "@/lib/api";
import { exchangeSocialLoginCode } from "@/lib/auth";
import { useAuth } from "@/lib/auth-context";

function SocialCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const status = searchParams.get("status");
    const code = searchParams.get("code");

    (async () => {
      if (status === "error" || !code) {
        throw new Error("That sign-in link didn't work. Please try again.");
      }
      return exchangeSocialLoginCode(code);
    })()
      .then((user) => {
        if (cancelled) return;
        setUser(user);
        router.push("/");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "That sign-in link didn't work. Please try again.");
      });

    return () => {
      cancelled = true;
    };
    // Only ever run once per visit to this callback URL.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <section className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center gap-4 bg-background px-4 text-center">
        <XCircle size={48} className="text-error" />
        <h1 className="font-heading text-4xl uppercase text-text-primary">Sign-In Failed</h1>
        <p className="max-w-md font-body text-sm text-text-secondary">{error}</p>
        <Link
          href="/login"
          className="mt-4 rounded-md bg-primary px-6 py-3 font-ui text-sm font-bold uppercase tracking-wide text-text-primary transition-colors duration-150 hover:bg-accent"
        >
          Back to Sign In
        </Link>
      </section>
    );
  }

  return (
    <section className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-background">
      <Loader2 size={24} className="animate-spin text-text-secondary" />
    </section>
  );
}

export default function SocialCallbackPage() {
  return (
    <Suspense fallback={null}>
      <SocialCallbackContent />
    </Suspense>
  );
}
