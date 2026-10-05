"use client";

import { useState } from "react";
import { MailWarning } from "lucide-react";
import { ApiError } from "@/lib/api";
import { resendVerificationEmail } from "@/lib/auth";
import { useAuth } from "@/lib/auth-context";

export function EmailVerificationBanner() {
  const { user } = useAuth();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  if (!user || user.email_verified_at) return null;

  async function handleResend() {
    setStatus("sending");
    setError(null);

    try {
      await resendVerificationEmail();
      setStatus("sent");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 border-b border-warning/30 bg-warning/10 px-4 py-2 text-center font-body text-sm text-warning">
      <MailWarning size={16} className="shrink-0" />
      {status === "sent" ? (
        <span>Verification email sent — check your inbox.</span>
      ) : (
        <>
          <span>Please verify your email address.</span>
          <button
            type="button"
            onClick={handleResend}
            disabled={status === "sending"}
            className="font-semibold underline underline-offset-2 hover:text-accent disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "sending" ? "Sending..." : "Resend email"}
          </button>
        </>
      )}
      {error && <span className="text-error">{error}</span>}
    </div>
  );
}
