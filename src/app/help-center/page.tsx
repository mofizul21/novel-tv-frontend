"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  CreditCard,
  MonitorPlay,
  Smartphone,
  ListChecks,
  MessageCircle,
} from "lucide-react";
import { helpCategories, faqItems } from "@/lib/demo-data";

const categoryIcons: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  "account-billing": CreditCard,
  "streaming-playback": MonitorPlay,
  "devices-apps": Smartphone,
  plans: ListChecks,
};

export default function HelpCenterPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [query, setQuery] = useState("");

  return (
    <>
      <section className="relative isolate overflow-hidden bg-background">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(0,116,217,0.25),transparent_60%)]" />
        </div>

        <div className="mx-auto max-w-360 px-4 py-16 text-center sm:px-6 lg:px-10">
          <h1 className="font-heading text-5xl uppercase text-text-primary sm:text-6xl">
            Help Center
          </h1>
          <p className="mt-2 font-body text-text-secondary">
            Search our knowledge base or browse a topic below.
          </p>

          <div className="mx-auto mt-6 flex max-w-lg items-center gap-2 rounded-md border border-border bg-surface-light px-4 py-3 focus-within:border-primary">
            <Search size={18} className="text-text-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for help…"
              className="w-full bg-transparent font-body text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-360 px-4 py-8 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {helpCategories.map((cat) => {
            const Icon = categoryIcons[cat.id] ?? MonitorPlay;
            return (
              <div
                key={cat.id}
                className="rounded-lg border border-border bg-surface p-5 transition-colors duration-150 hover:border-border-light"
              >
                <Icon size={24} className="text-primary" />
                <p className="mt-3 font-ui text-sm font-semibold text-text-primary">
                  {cat.title}
                </p>
                <p className="mt-1 font-body text-xs text-text-secondary">
                  {cat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-360 px-4 py-8 sm:px-6 lg:px-10">
        <h2 className="font-ui text-xl font-semibold text-text-primary sm:text-2xl">
          Frequently Asked Questions
        </h2>

        <div className="mt-4 divide-y divide-border rounded-lg border border-border">
          {faqItems.map((item, i) => {
            const open = openIndex === i;
            return (
              <div key={item.question}>
                <button
                  onClick={() => setOpenIndex(open ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-ui text-sm font-semibold text-text-primary">
                    {item.question}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`flex-none text-text-muted transition-transform duration-150 ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {open && (
                  <p className="px-5 pb-4 font-body text-sm text-text-secondary">
                    {item.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-360 px-4 py-8 sm:px-6 lg:px-10">
        <div className="flex flex-col items-center gap-4 rounded-xl border border-primary bg-surface-blue px-6 py-10 text-center">
          <MessageCircle size={32} className="text-primary" />
          <h2 className="font-heading text-3xl uppercase text-text-primary">
            Still need help?
          </h2>
          <p className="max-w-md font-body text-text-secondary">
            Our support team is here for you. Reach out and we&apos;ll get
            back to you as soon as possible.
          </p>
          <Link
            href="/contact-us"
            className="rounded-md bg-primary px-6 py-3 font-ui text-sm font-bold uppercase tracking-wide text-text-primary shadow-primary transition-colors duration-150 hover:bg-accent"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}
