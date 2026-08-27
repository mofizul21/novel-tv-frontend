"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Play,
  ChevronRight,
  Star,
  Sparkles,
  Clapperboard,
  Home as HomeIcon,
  Tv,
  Radio,
  Bookmark,
} from "lucide-react";
import {
  movieGenreFilters,
  featuredMovies,
  trendingMovies,
  newReleaseMovies,
  type Movie,
} from "@/lib/demo-data";

const genreIcons: Record<string, React.ComponentType<{ size?: number }>> = {
  Featured: Star,
  "New Releases": Sparkles,
};

const bottomNavItems = [
  { label: "Home", href: "/", icon: HomeIcon },
  { label: "Movies", href: "/movies", icon: Clapperboard },
  { label: "TV Shows", href: "/tv-shows", icon: Tv },
  { label: "Live TV", href: "/live-tv", icon: Radio },
  { label: "My List", href: "/my-list", icon: Bookmark },
];

function MoviePoster({ movie }: { movie: Movie }) {
  return (
    <div className="relative aspect-2/3 overflow-hidden rounded-md border border-border bg-surface">
      {movie.isNew && (
        <span className="absolute left-2 top-2 z-10 rounded bg-primary px-2 py-0.5 font-ui text-[10px] font-bold uppercase tracking-wide text-text-primary">
          New
        </span>
      )}
      <Image
        src="/images/movie-poster.png"
        alt=""
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-3">
        <p className="line-clamp-1 font-ui text-sm font-semibold text-text-primary">
          {movie.title}
        </p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="font-body text-xs text-text-secondary">
            {movie.year} · {movie.runtime}
          </span>
          <span className="rounded border border-border-light bg-black/40 px-1.5 py-0.5 font-ui text-[10px] font-semibold text-text-secondary backdrop-blur-sm">
            {movie.rating}
          </span>
        </div>
      </div>
    </div>
  );
}

function MovieRow({
  title,
  movies,
}: {
  title: string;
  movies: Movie[];
}) {
  return (
    <section className="mx-auto max-w-360 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-ui text-xl font-semibold text-text-primary sm:text-2xl">
          {title}
        </h2>
        <a
          href="#"
          className="flex items-center gap-1 font-ui text-sm font-medium text-primary transition-colors duration-150 hover:text-accent"
        >
          View All
          <ChevronRight size={16} />
        </a>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {movies.map((movie) => (
          <MoviePoster key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}

export default function MoviesPage() {
  const pathname = usePathname();
  const [activeGenre, setActiveGenre] = useState(movieGenreFilters[0]);

  return (
    <>
      <div className="pb-16 lg:pb-0">
        {/* ===================== Hero Section: Start ===================== */}
        <section className="relative isolate min-h-115 overflow-hidden bg-background sm:min-h-125">
          <div className="absolute inset-0 -z-10">
            <Image
              src="/images/movies-hero.png"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-right"
            />
            <div className="absolute inset-0 bg-linear-to-r from-black via-black/10 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/10" />
          </div>

          <div className="mx-auto max-w-360 px-4 pb-8 pt-10 sm:px-6 lg:px-10 lg:pt-14">
            <div className="max-w-2xl">
              <p className="font-ui text-sm font-semibold uppercase tracking-[0.2em] text-text-secondary">
                Stream <span className="text-accent">Different.</span>
              </p>

              <h1
                className="mt-2 font-heading text-6xl uppercase text-text-primary sm:text-7xl lg:text-hero"
                style={{ lineHeight: "var(--leading-tight)" }}
              >
                Movies.
              </h1>

              <p className="mt-5 max-w-md font-body text-base text-text-secondary sm:text-lg">
                Blockbusters, classics, and hidden gems. All the movies you
                love. All in one place.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <button className="flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-ui text-sm font-bold uppercase tracking-wide text-text-primary shadow-primary transition-colors duration-150 hover:bg-accent">
                  <Play size={18} fill="currentColor" />
                  Play Trailer
                </button>
                <button className="rounded-md border border-text-primary px-6 py-3 font-ui text-sm font-bold uppercase tracking-wide text-text-primary transition-colors duration-150 hover:border-primary hover:bg-primary">
                  Browse All
                </button>
              </div>
            </div>

            <div className="no-scrollbar mt-8 flex gap-2 overflow-x-auto pb-1">
              {movieGenreFilters.map((genre) => {
                const Icon = genreIcons[genre];
                const selected = activeGenre === genre;
                return (
                  <button
                    key={genre}
                    onClick={() => setActiveGenre(genre)}
                    className={`flex flex-none items-center gap-2 rounded-md border px-4 py-2 font-ui text-xs font-semibold uppercase tracking-wide transition-colors duration-150 ${
                      selected
                        ? "border-primary bg-primary text-text-primary"
                        : "border-border text-text-secondary hover:border-border-light hover:text-text-primary"
                    }`}
                  >
                    {Icon && <Icon size={14} />}
                    {genre}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
        {/* ====================== Hero Section: End ====================== */}

        <MovieRow title="Featured Movies" movies={featuredMovies} />
        <MovieRow title="Trending Now" movies={trendingMovies} />
        <MovieRow title="New Releases" movies={newReleaseMovies} />
      </div>

      {/* Mobile app-style bottom nav — page-scoped for now; move into _app.tsx
          if every page should keep it visible on mobile. */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-border bg-background/95 py-2 backdrop-blur-md lg:hidden">
        {bottomNavItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 px-3 py-1 font-ui text-[10px] font-medium uppercase tracking-wide text-text-secondary"
            >
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-md ${
                  active ? "bg-primary text-text-primary" : "text-text-secondary"
                }`}
              >
                <Icon size={16} />
              </span>
              <span className={active ? "text-primary" : ""}>{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
