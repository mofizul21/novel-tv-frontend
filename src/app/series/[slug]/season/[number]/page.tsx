"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Loader2, Play } from "lucide-react";
import { fetchSeriesBySlug, type Series } from "@/lib/series";
import { ApiError } from "@/lib/api";

export default function SeasonDetailPage({
  params,
}: {
  params: Promise<{ slug: string; number: string }>;
}) {
  const { slug, number } = use(params);
  const seasonNumber = Number(number);

  const [series, setSeries] = useState<Series | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchSeriesBySlug(slug);
        if (!cancelled) setSeries(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError && err.status === 404
              ? "This series could not be found."
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
  }, [slug]);

  if (isLoading) {
    return (
      <section className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-background">
        <Loader2 size={20} className="animate-spin text-text-secondary" />
      </section>
    );
  }

  const season = series?.seasons?.find((s) => s.number === seasonNumber);

  if (error || !series || !season) {
    return (
      <section className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center gap-3 bg-background text-center">
        <p className="font-body text-sm text-text-secondary">
          {error ?? "This season could not be found."}
        </p>
        <Link href={`/series/${slug}`} className="font-ui text-sm font-semibold text-primary hover:text-accent">
          Back to {series?.title ?? "Series"}
        </Link>
      </section>
    );
  }

  return (
    <section className="min-h-[calc(100vh-64px)] bg-background">
      <div className="mx-auto max-w-360 px-4 py-10 sm:px-6 lg:px-10">
        <Link
          href={`/series/${slug}`}
          className="inline-flex items-center gap-1 font-ui text-sm font-medium text-text-secondary hover:text-text-primary"
        >
          <ChevronLeft size={16} />
          {series.title}
        </Link>

        <h1 className="mt-4 font-heading text-4xl uppercase text-text-primary sm:text-5xl">
          {season.title ?? `Season ${season.number}`}
        </h1>
        {season.overview && <p className="mt-2 max-w-2xl font-body text-sm text-text-secondary">{season.overview}</p>}

        <div className="mt-6 flex flex-wrap gap-2">
          {series.seasons?.map((s) => (
            <Link
              key={s.id}
              href={`/series/${slug}/season/${s.number}`}
              className={`rounded-md border px-4 py-2 font-ui text-xs font-semibold uppercase tracking-wide transition-colors duration-150 ${
                s.number === season.number
                  ? "border-primary bg-primary text-text-primary"
                  : "border-border text-text-secondary hover:border-border-light hover:text-text-primary"
              }`}
            >
              {s.title ?? `Season ${s.number}`}
            </Link>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          {season.episodes?.map((episode) => (
            <Link
              key={episode.id}
              href={`/series/${slug}/season/${season.number}/episode/${episode.number}`}
              className="flex items-center gap-4 rounded-md border border-border bg-surface p-3 transition-colors duration-150 hover:border-border-light hover:bg-surface-hover"
            >
              <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded border border-border-light">
                <Image
                  src={episode.still_url ?? "/images/movie-preview.png"}
                  alt=""
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Play size={16} className="text-text-primary" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-ui text-sm font-semibold text-text-primary">
                    {episode.number}. {episode.title}
                  </p>
                  {episode.runtime_minutes && (
                    <span className="shrink-0 font-body text-xs text-text-muted">
                      {episode.runtime_minutes}m
                    </span>
                  )}
                </div>
                {episode.overview && (
                  <p className="mt-0.5 line-clamp-2 font-body text-xs text-text-secondary">
                    {episode.overview}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
