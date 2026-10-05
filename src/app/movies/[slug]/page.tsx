"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Loader2, Check, Plus } from "lucide-react";
import { fetchMovieAccess, fetchMovieBySlug, fetchMoviePlaybackToken, type Movie } from "@/lib/movies";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useFavorites } from "@/lib/favorites-context";
import { ContentPlayer } from "@/components/ContentPlayer";
import type { ContentAccess, PlaybackTokens } from "@/lib/catalog-types";

export default function MovieDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { user } = useAuth();
  const { isFavorited, toggle } = useFavorites();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [access, setAccess] = useState<ContentAccess | null>(null);
  const [playbackTokens, setPlaybackTokens] = useState<PlaybackTokens | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchMovieBySlug(slug);
        if (!cancelled) setMovie(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError && err.status === 404
              ? "This movie could not be found."
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
        const data = await fetchMovieAccess(slug);
        if (!cancelled) setAccess(data);
      } catch {
        if (!cancelled) setAccess(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug, user]);

  const canWatch = access?.reason === "subscribed" || access?.reason === "ppv_purchased";

  useEffect(() => {
    if (!movie || movie.mux_playback_policy !== "signed" || !canWatch) return;

    let cancelled = false;

    (async () => {
      try {
        const tokens = await fetchMoviePlaybackToken(movie.id);
        if (!cancelled) setPlaybackTokens(tokens);
      } catch {
        if (!cancelled) setPlaybackTokens(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [movie, canWatch]);

  if (isLoading) {
    return (
      <section className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-background">
        <Loader2 size={20} className="animate-spin text-text-secondary" />
      </section>
    );
  }

  if (error || !movie) {
    return (
      <section className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center gap-3 bg-background text-center">
        <p className="font-body text-sm text-text-secondary">{error ?? "Movie not found."}</p>
        <Link href="/movies" className="font-ui text-sm font-semibold text-primary hover:text-accent">
          Back to Movies
        </Link>
      </section>
    );
  }

  return (
    <section className="bg-background">
      <div className="relative isolate min-h-100 overflow-hidden sm:min-h-125">
        <div className="absolute inset-0 -z-10">
          <Image
            src={movie.backdrop_url ?? "/images/movie-poster.png"}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/30" />
        </div>

        <div className="mx-auto flex max-w-360 flex-col gap-6 px-4 pb-10 pt-16 sm:flex-row sm:px-6 lg:px-10">
          <div className="relative hidden aspect-2/3 w-48 shrink-0 overflow-hidden rounded-md border border-border shadow-md sm:block">
            <Image src={movie.poster_url ?? "/images/movie-poster.png"} alt="" fill className="object-cover" />
          </div>

          <div className="max-w-2xl">
            {movie.is_ppv && (
              <span className="mb-3 inline-block rounded bg-primary px-2 py-0.5 font-ui text-[10px] font-bold uppercase tracking-wide text-text-primary">
                Pay-Per-View
              </span>
            )}
            <h1 className="font-heading text-5xl uppercase text-text-primary sm:text-6xl">{movie.title}</h1>

            <div className="mt-3 flex flex-wrap items-center gap-3 font-body text-sm text-text-secondary">
              {movie.release_year && <span>{movie.release_year}</span>}
              {movie.runtime_minutes && <span>{movie.runtime_minutes} min</span>}
              {movie.certification && (
                <span className="rounded border border-border-light px-1.5 py-0.5 font-ui text-xs font-semibold">
                  {movie.certification}
                </span>
              )}
              {movie.country && <span>{movie.country.name}</span>}
            </div>

            {movie.genres && movie.genres.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-full border border-border-light px-3 py-1 font-ui text-xs font-medium text-text-secondary"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {movie.synopsis && (
              <p className="mt-5 font-body text-base text-text-secondary">{movie.synopsis}</p>
            )}

            <div className="mt-7 flex flex-wrap items-center gap-4">
              {!user || access?.reason === "requires_subscription" ? (
                <Link
                  href="/pricing"
                  className="flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-ui text-sm font-bold uppercase tracking-wide text-text-primary shadow-primary transition-colors duration-150 hover:bg-accent"
                >
                  <Play size={18} fill="currentColor" />
                  Subscribe to Watch
                </Link>
              ) : canWatch ? (
                <a
                  href="#movie-player"
                  className="flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-ui text-sm font-bold uppercase tracking-wide text-text-primary shadow-primary transition-colors duration-150 hover:bg-accent"
                >
                  <Play size={18} fill="currentColor" />
                  Watch Now
                </a>
              ) : (
                <button
                  disabled
                  title="Pay-per-view purchasing isn't wired up yet"
                  className="flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-ui text-sm font-bold uppercase tracking-wide text-text-primary opacity-60 shadow-primary"
                >
                  <Play size={18} fill="currentColor" />
                  {movie.is_ppv ? `Rent for $${movie.ppv_price?.toFixed(2)}` : "Play"}
                </button>
              )}

              {user && (
                <button
                  onClick={() => toggle("movie", movie.id)}
                  className="flex items-center gap-2 rounded-md border border-text-primary px-6 py-3 font-ui text-sm font-bold uppercase tracking-wide text-text-primary transition-colors duration-150 hover:border-primary hover:bg-primary"
                >
                  {isFavorited("movie", movie.id) ? (
                    <>
                      <Check size={18} />
                      In My List
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Add to My List
                    </>
                  )}
                </button>
              )}
            </div>

            {movie.cast && movie.cast.length > 0 && (
              <div className="mt-8">
                <h2 className="font-ui text-sm font-semibold uppercase tracking-wide text-text-secondary">
                  Cast
                </h2>
                <p className="mt-2 font-body text-sm text-text-secondary">
                  {movie.cast.map((member) => member.name).join(", ")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div id="movie-player" className="mx-auto max-w-360 px-4 py-8 sm:px-6 lg:px-10">
        <h2 className="mb-4 font-ui text-xl font-semibold text-text-primary sm:text-2xl">Watch</h2>
        <div className="relative aspect-video overflow-hidden rounded-md border border-border bg-black">
          <ContentPlayer
            canWatch={canWatch}
            isLoggedIn={Boolean(user)}
            videoTitle={movie.title}
            muxPlaybackId={movie.mux_playback_id}
            muxPlaybackPolicy={movie.mux_playback_policy}
            muxPlaybackToken={playbackTokens === null ? null : playbackTokens?.token}
            muxThumbnailToken={playbackTokens?.thumbnailToken}
            muxStoryboardToken={playbackTokens?.storyboardToken}
          />
        </div>
      </div>
    </section>
  );
}
