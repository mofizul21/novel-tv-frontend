"use client";

import { Mail, Phone, MessageCircle, Clock } from "lucide-react";

const contactMethods = [
  {
    icon: Mail,
    title: "Email Support",
    detail: "support@noveltv.com",
    subtext: "We usually reply within 24 hours.",
  },
  {
    icon: MessageCircle,
    title: "Live Chat",
    detail: "Chat with our team",
    subtext: "Available 9am – 9pm, 7 days a week.",
  },
  {
    icon: Phone,
    title: "Phone Support",
    detail: "1-800-555-0199",
    subtext: "Mon – Fri, 9am – 6pm EST.",
  },
  {
    icon: Clock,
    title: "Response Time",
    detail: "Under 24 hours",
    subtext: "For most account and billing questions.",
  },
];

export default function ContactUsPage() {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Wire up to the Contact Messages API once the backend is ready.
  }

  return (
    <section className="mx-auto max-w-360 px-4 py-16 sm:px-6 lg:px-10">
      <div className="text-center">
        <h1 className="font-heading text-5xl uppercase text-text-primary sm:text-6xl">
          Contact Us
        </h1>
        <p className="mx-auto mt-2 max-w-md font-body text-text-secondary">
          Questions, feedback, or need a hand? We&apos;d love to hear from
          you.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-5">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-border bg-surface p-6 sm:p-8 lg:col-span-3"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block font-ui text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Name
              </label>
              <input
                type="text"
                required
                placeholder="Your name"
                className="w-full rounded-md border border-border bg-surface-light px-3 py-2.5 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block font-ui text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Email
              </label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-md border border-border bg-surface-light px-3 py-2.5 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block font-ui text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Subject
            </label>
            <input
              type="text"
              required
              placeholder="How can we help?"
              className="w-full rounded-md border border-border bg-surface-light px-3 py-2.5 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block font-ui text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Message
            </label>
            <textarea
              required
              rows={5}
              placeholder="Tell us more…"
              className="w-full resize-none rounded-md border border-border bg-surface-light px-3 py-2.5 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="rounded-md bg-primary px-6 py-3 font-ui text-sm font-bold uppercase tracking-wide text-text-primary shadow-primary transition-colors duration-150 hover:bg-accent"
          >
            Send Message
          </button>
        </form>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-1">
          {contactMethods.map(({ icon: Icon, title, detail, subtext }) => (
            <div
              key={title}
              className="rounded-lg border border-border bg-surface p-5"
            >
              <Icon size={22} className="text-primary" />
              <p className="mt-3 font-ui text-sm font-semibold text-text-primary">
                {title}
              </p>
              <p className="mt-1 font-body text-sm text-text-secondary">
                {detail}
              </p>
              <p className="mt-1 font-body text-xs text-text-muted">
                {subtext}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
