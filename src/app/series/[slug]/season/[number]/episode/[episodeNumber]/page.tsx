"use client";

import { use, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, CheckCircle2, ChevronLeft, Loader2, Plus } from "lucide-react";
import { fetchSeriesAccess, fetchSeriesBySlug, type Series } from "@/lib/series";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useFavorites } from "@/lib/favorites-context";
import { recordProgress } from "@/lib/watch-history";
import { ContentPlayer } from "@/components/ContentPlayer";
import type { ContentAccess } from "@/lib/catalog-types";

export default function EpisodeDetailPage({
  params,
}: {
  params: Promise<{ slug: string; number: string; episodeNumber: string }>;
}) {
  const { slug, number, episodeNumber } = use(params);
  const seasonNumber = Number(number);
  const epNumber = Number(episodeNumber);
  const { user } = useAuth();
  const { isFavorited, toggle } = useFavorites();

  const [series, setSeries] = useState<Series | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [access, setAccess] = useState<ContentAccess | null>(null);
  const [watchedProgress, setWatchedProgress] = useState<number | null>(null);
  const recordedEpisodeId = useRef<number | null>(null);

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

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    (async () => {
      try {
        const data = await fetchSeriesAccess(slug);
        if (!cancelled) setAccess(data);
      } catch {
        if (!cancelled) setAccess(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug, user]);

  const season = series?.seasons?.find((s) => s.number === seasonNumber);
  const episode = season?.episodes?.find((e) => e.number === epNumber);

  useEffect(() => {
    if (!user || !episode || !access?.can_watch) return;
    if (recordedEpisodeId.current === episode.id) return;
    recordedEpisodeId.current = episode.id;

    (async () => {
      try {
        await recordProgress("episode", episode.id, 1);
        setWatchedProgress((prev) => prev ?? 1);
      } catch {
        recordedEpisodeId.current = null;
      }
    })();
  }, [user, episode, access]);

  async function handleMarkAsWatched() {
    if (!episode) return;
    try {
      await recordProgress("episode", episode.id, 100);
      setWatchedProgress(100);
    } catch {
      // Non-critical — leave the button visible so the user can retry.
    }
  }

  if (isLoading) {
    return (
      <section className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-background">
        <Loader2 size={20} className="animate-spin text-text-secondary" />
      </section>
    );
  }

  if (error || !series || !season || !episode) {
    return (
      <section className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center gap-3 bg-background text-center">
        <p className="font-body text-sm text-text-secondary">
          {error ?? "This episode could not be found."}
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
          href={`/series/${slug}/season/${season.number}`}
          className="inline-flex items-center gap-1 font-ui text-sm font-medium text-text-secondary hover:text-text-primary"
        >
          <ChevronLeft size={16} />
          {series.title} — {season.title ?? `Season ${season.number}`}
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="relative aspect-video overflow-hidden rounded-md border border-border bg-black">
              <ContentPlayer
                canWatch={Boolean(access?.can_watch)}
                isLoggedIn={Boolean(user)}
                videoTitle={`${series.title} S${season.number}E${episode.number} ${episode.title}`}
                muxPlaybackId={episode.mux_playback_id}
                muxPlaybackPolicy={episode.mux_playback_policy}
              />
            </div>

            <h1 className="mt-5 font-heading text-3xl uppercase text-text-primary sm:text-4xl">
              {episode.number}. {episode.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 font-body text-sm text-text-secondary">
              {episode.runtime_minutes && <span>{episode.runtime_minutes} min</span>}
              {episode.air_date && <span>{episode.air_date}</span>}
            </div>

            {user && (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => toggle("series", series.id)}
                  className="flex items-center gap-2 rounded-md border border-text-primary px-4 py-2 font-ui text-xs font-bold uppercase tracking-wide text-text-primary transition-colors duration-150 hover:border-primary hover:bg-primary"
                >
                  {isFavorited("series", series.id) ? (
                    <>
                      <Check size={16} />
                      In My List
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      Add to My List
                    </>
                  )}
                </button>

                {watchedProgress === 100 ? (
                  <span className="flex items-center gap-1.5 font-ui text-xs font-semibold uppercase tracking-wide text-success">
                    <CheckCircle2 size={16} />
                    Watched
                  </span>
                ) : (
                  <button
                    onClick={handleMarkAsWatched}
                    className="font-ui text-xs font-semibold uppercase tracking-wide text-text-secondary hover:text-text-primary"
                  >
                    Mark as Watched
                  </button>
                )}
              </div>
            )}

            {episode.overview && (
              <p className="mt-4 font-body text-base text-text-secondary">{episode.overview}</p>
            )}
          </div>

          <div className="relative hidden aspect-video overflow-hidden rounded-md border border-border-light lg:block">
            <Image
              src={episode.still_url ?? "/images/movie-preview.png"}
              alt=""
              fill
              className="object-cover"
            />
          </div>
        </div>

        {season.episodes && season.episodes.length > 1 && (
          <div className="mt-10">
            <h2 className="font-ui text-sm font-semibold uppercase tracking-wide text-text-secondary">
              More from {season.title ?? `Season ${season.number}`}
            </h2>
            <div className="mt-3 space-y-2">
              {season.episodes
                .filter((e) => e.number !== episode.number)
                .map((e) => (
                  <Link
                    key={e.id}
                    href={`/series/${slug}/season/${season.number}/episode/${e.number}`}
                    className="flex items-center justify-between rounded-md border border-border bg-surface px-4 py-2.5 transition-colors duration-150 hover:border-border-light hover:bg-surface-hover"
                  >
                    <span className="font-body text-sm text-text-primary">
                      {e.number}. {e.title}
                    </span>
                    {e.mux_playback_id && (
                      <span className="rounded border border-border-light px-1.5 py-0.5 font-ui text-[10px] font-semibold uppercase text-text-secondary">
                        Preview ready
                      </span>
                    )}
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
