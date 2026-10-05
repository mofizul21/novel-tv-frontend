"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { fetchCurrentUser } from "@/lib/auth";

const STATUS_CONTENT = {
  success: {
    icon: CheckCircle2,
    iconClassName: "text-success",
    heading: "Email Verified",
    message: "Your email address has been verified. Thanks for confirming it's really you.",
  },
  "already-verified": {
    icon: CheckCircle2,
    iconClassName: "text-success",
    heading: "Already Verified",
    message: "This email address was already verified — you're all set.",
  },
  invalid: {
    icon: XCircle,
    iconClassName: "text-error",
    heading: "Link Invalid or Expired",
    message:
      "This verification link no longer works. Sign in and use the \"Resend email\" option to get a new one.",
  },
} as const;

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const content = STATUS_CONTENT[status as keyof typeof STATUS_CONTENT] ?? STATUS_CONTENT.invalid;
  const Icon = content.icon;

  const { user, setUser } = useAuth();

  useEffect(() => {
    if (!user) return;
    if (status !== "success" && status !== "already-verified") return;

    // Refresh so the "verify your email" banner clears immediately, without
    // needing a manual page refresh.
    fetchCurrentUser().then(setUser).catch(() => {});
  }, [status, user, setUser]);

  return (
    <section className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <Icon size={48} className={content.iconClassName} />
      <h1 className="font-heading text-4xl uppercase text-text-primary">{content.heading}</h1>
      <p className="max-w-md font-body text-sm text-text-secondary">{content.message}</p>
      <Link
        href="/"
        className="mt-4 rounded-md bg-primary px-6 py-3 font-ui text-sm font-bold uppercase tracking-wide text-text-primary transition-colors duration-150 hover:bg-accent"
      >
        Start Watching
      </Link>
    </section>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}
