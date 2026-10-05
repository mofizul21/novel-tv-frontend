"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Play,
  Clapperboard,
  Tv,
  Home as HomeIcon,
  Radio,
  Bookmark,
  Loader2,
} from "lucide-react";
import { fetchMovies, type Movie } from "@/lib/movies";
import { fetchSeriesList, type Series } from "@/lib/series";
import { PosterCard } from "@/components/PosterCard";

const originalsFilters = ["All", "Series", "Movies"] as const;

const bottomNavItems = [
  { label: "Home", href: "/", icon: HomeIcon },
  { label: "Movies", href: "/movies", icon: Clapperboard },
  { label: "TV Shows", href: "/tv-shows", icon: Tv },
  { label: "Live TV", href: "/live-tv", icon: Radio },
  { label: "My List", href: "/my-list", icon: Bookmark },
];

type OriginalEntry = { type: "movie"; item: Movie } | { type: "series"; item: Series };

export default function OriginalsPage() {
  const pathname = usePathname();
  const [activeFilter, setActiveFilter] = useState<(typeof originalsFilters)[number]>("All");

  const [originalMovies, setOriginalMovies] = useState<Movie[]>([]);
  const [originalSeries, setOriginalSeries] = useState<Series[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setIsLoading(true);
      try {
        const [movies, series] = await Promise.all([
          fetchMovies({ original: true, perPage: 20 }),
          fetchSeriesList({ original: true, perPage: 20 }),
        ]);
        if (!cancelled) {
          setOriginalMovies(movies);
          setOriginalSeries(series);
        }
      } catch {
        if (!cancelled) {
          setOriginalMovies([]);
          setOriginalSeries([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const entries: OriginalEntry[] = [
    ...originalMovies.map((item): OriginalEntry => ({ type: "movie", item })),
    ...originalSeries.map((item): OriginalEntry => ({ type: "series", item })),
  ];

  const visibleEntries = entries.filter((entry) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Movies") return entry.type === "movie";
    return entry.type === "series";
  });

  const heroEntry = entries[0];

  return (
    <>
      <div className="pb-16 lg:pb-0">
        {/* ===================== Hero Section: Start ===================== */}
        <section className="relative isolate min-h-115 overflow-hidden bg-background sm:min-h-125">
          <div className="absolute inset-0 -z-10">
            <Image
              src="/images/home-hero.png"
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
                Originals.
              </h1>

              <p className="mt-5 max-w-md font-body text-base text-text-secondary sm:text-lg">
                Only on Novel TV. Exclusive series and films you won&apos;t
                find anywhere else.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                {heroEntry ? (
                  <Link
                    href={
                      heroEntry.type === "movie"
                        ? `/movies/${heroEntry.item.slug}`
                        : `/series/${heroEntry.item.slug}`
                    }
                    className="flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-ui text-sm font-bold uppercase tracking-wide text-text-primary shadow-primary transition-colors duration-150 hover:bg-accent"
                  >
                    <Play size={18} fill="currentColor" />
                    Watch Now
                  </Link>
                ) : (
                  <a
                    href="#originals-catalog"
                    className="flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-ui text-sm font-bold uppercase tracking-wide text-text-primary shadow-primary transition-colors duration-150 hover:bg-accent"
                  >
                    <Play size={18} fill="currentColor" />
                    Watch Now
                  </a>
                )}
                <a
                  href="#originals-catalog"
                  className="rounded-md border border-text-primary px-6 py-3 font-ui text-sm font-bold uppercase tracking-wide text-text-primary transition-colors duration-150 hover:border-primary hover:bg-primary"
                >
                  Browse All
                </a>
              </div>
            </div>

            <div className="no-scrollbar mt-8 flex gap-2 overflow-x-auto pb-1">
              {originalsFilters.map((filter) => {
                const selected = activeFilter === filter;
                return (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`flex-none rounded-md border px-4 py-2 font-ui text-xs font-semibold uppercase tracking-wide transition-colors duration-150 ${
                      selected
                        ? "border-primary bg-primary text-text-primary"
                        : "border-border text-text-secondary hover:border-border-light hover:text-text-primary"
                    }`}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
        {/* ====================== Hero Section: End ====================== */}

        {/* =================== Novel TV Originals Section: Start =================== */}
        <section id="originals-catalog" className="mx-auto max-w-360 px-4 py-8 sm:px-6 lg:px-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-ui text-xl font-semibold text-text-primary sm:text-2xl">
              Novel TV Originals
            </h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 size={20} className="animate-spin text-text-secondary" />
            </div>
          ) : visibleEntries.length === 0 ? (
            <p className="py-10 text-center font-body text-sm text-text-secondary">
              No originals in this category yet.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {visibleEntries.map((entry) => (
                <PosterCard
                  key={`${entry.type}-${entry.item.id}`}
                  href={entry.type === "movie" ? `/movies/${entry.item.slug}` : `/series/${entry.item.slug}`}
                  title={entry.item.title}
                  posterUrl={entry.item.poster_url}
                  subtitle={entry.type === "movie" ? "Film" : "Series"}
                  topLeftBadge="Original"
                />
              ))}
            </div>
          )}
        </section>
        {/* ==================== Novel TV Originals Section: End ==================== */}
      </div>

      {/* Mobile app-style bottom nav — page-scoped for now; move into the
          root layout if every page should keep it visible on mobile. */}
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
