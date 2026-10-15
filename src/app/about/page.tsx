"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { fetchPage, type LegalPage } from "@/lib/pages";
import { ApiError } from "@/lib/api";

export default function AboutPage() {
  const [page, setPage] = useState<LegalPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await fetchPage("about");
        if (!cancelled) setPage(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError && err.status === 404
              ? "This page could not be found."
              : "Something went wrong. Please try again.",
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <section className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-background">
        <Loader2 size={20} className="animate-spin text-text-secondary" />
      </section>
    );
  }

  if (error || !page) {
    return (
      <section className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-background">
        <p className="font-body text-sm text-text-secondary">{error ?? "This page could not be found."}</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-10">
      <h1 className="font-heading text-5xl uppercase text-text-primary sm:text-6xl">{page.title}</h1>

      {/* page.content is admin-authored HTML from the Filament "Site
          Pages" editor — rendering it raw, styled via these descendant
          selectors, same as the Privacy Policy / Terms of Use pages. */}
      <div
        className="mt-6 space-y-6 font-body text-sm leading-relaxed text-text-secondary [&_em]:text-text-muted [&_h2]:mt-8 [&_h2]:font-ui [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-text-primary [&_p]:mt-2"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </section>
  );
}
