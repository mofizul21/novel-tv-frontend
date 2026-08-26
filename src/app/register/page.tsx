"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.7-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.1-4 1.1-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1C3.4 21.3 7.4 24 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.4 14.3c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3V6.6H1.4C.5 8.3 0 10.1 0 12s.5 3.7 1.4 5.4l4-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.8c1.7 0 3.3.6 4.5 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0 7.4 0 3.4 2.7 1.4 6.6l4 3.1c.9-2.8 3.5-4.9 6.6-4.9Z"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="12" fill="#1877F2" />
      <path
        d="M13.6 21v-7.3h2.4l.4-2.8h-2.8v-1.8c0-.8.2-1.4 1.4-1.4h1.5V5.1c-.3 0-1.1-.1-2.1-.1-2.1 0-3.5 1.3-3.5 3.6v2.3H8.5v2.8h2.4V21h2.7Z"
        fill="#fff"
      />
    </svg>
  );
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Wire up to the Authentication API once the backend is ready.
  }

  return (
    <section className="relative isolate flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden bg-background px-4 py-12">
      {/* Placeholder backdrop — swap for real key-art if desired */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(0,116,217,0.25),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_100%_100%,rgba(0,175,255,0.12),transparent_65%)]" />
      </div>

      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-8 shadow-md">
        <Link href="/" className="mx-auto flex w-fit items-center">
          <Image
            src="/images/drip-logo.png"
            alt="Drip TV"
            width={245}
            height={110}
            className="h-10 w-auto"
          />
        </Link>

        <h1 className="mt-6 text-center font-heading text-4xl uppercase text-text-primary">
          Create Account
        </h1>
        <p className="mt-1 text-center font-body text-sm text-text-secondary">
          Join Drip TV and start streaming in minutes.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block font-ui text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Full Name
            </label>
            <div className="flex items-center gap-2 rounded-md border border-border bg-surface-light px-3 py-2.5 focus-within:border-primary">
              <User size={16} className="text-text-muted" />
              <input
                type="text"
                required
                placeholder="Jordan Smith"
                className="w-full bg-transparent font-body text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block font-ui text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Email
            </label>
            <div className="flex items-center gap-2 rounded-md border border-border bg-surface-light px-3 py-2.5 focus-within:border-primary">
              <Mail size={16} className="text-text-muted" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="w-full bg-transparent font-body text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block font-ui text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Password
            </label>
            <div className="flex items-center gap-2 rounded-md border border-border bg-surface-light px-3 py-2.5 focus-within:border-primary">
              <Lock size={16} className="text-text-muted" />
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
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

          <label className="flex items-start gap-2 font-body text-sm text-text-secondary">
            <input
              type="checkbox"
              required
              className="mt-0.5 h-4 w-4 rounded border-border-light bg-surface-light accent-primary"
            />
            I agree to the{" "}
            <Link href="/terms-of-use" className="text-primary hover:text-accent">
              Terms of Use
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy" className="text-primary hover:text-accent">
              Privacy Policy
            </Link>
          </label>

          <button
            type="submit"
            className="w-full rounded-md bg-primary py-3 font-ui text-sm font-bold uppercase tracking-wide text-text-primary shadow-primary transition-colors duration-150 hover:bg-accent"
          >
            Create Account
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="font-ui text-xs uppercase tracking-wide text-text-muted">
            Or continue with
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 rounded-md border border-border-light bg-surface-light py-2.5 font-ui text-sm font-semibold text-text-primary transition-colors duration-150 hover:bg-surface-hover">
            <GoogleIcon />
            Google
          </button>
          <button className="flex items-center justify-center gap-2 rounded-md border border-border-light bg-surface-light py-2.5 font-ui text-sm font-semibold text-text-primary transition-colors duration-150 hover:bg-surface-hover">
            <FacebookIcon />
            Facebook
          </button>
        </div>

        <p className="mt-6 text-center font-body text-sm text-text-secondary">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:text-accent">
            Sign In
          </Link>
        </p>
      </div>
    </section>
  );
}
