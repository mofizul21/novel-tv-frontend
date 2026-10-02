"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Search as SearchIcon, Film, Tv as TvIcon, Loader2 } from "lucide-react";
import { searchCatalog, type SearchResult } from "@/lib/search";
import { ApiError } from "@/lib/api";

function ResultCard({ result }: { result: SearchResult }) {
  const TypeIcon = result.type === "series" ? TvIcon : Film;

  return (
    <div className="relative aspect-2/3 overflow-hidden rounded-md border border-border bg-surface">
      <span className="absolute left-2 top-2 z-10 flex items-center gap-1 rounded bg-black/60 px-2 py-0.5 font-ui text-[10px] font-bold uppercase tracking-wide text-text-primary backdrop-blur-sm">
        <TypeIcon size={10} />
        {result.type === "series" ? "Series" : "Movie"}
      </span>
      {result.is_ppv && (
        <span className="absolute right-2 top-2 z-10 rounded bg-primary px-2 py-0.5 font-ui text-[10px] font-bold uppercase tracking-wide text-text-primary">
          PPV
        </span>
      )}

      <Image
        src={result.poster_url ?? "/images/movie-poster.png"}
        alt=""
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-3">
        <p className="line-clamp-1 font-ui text-sm font-semibold text-text-primary">
          {result.title}
        </p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="font-body text-xs text-text-secondary">{result.year ?? "—"}</span>
          {result.is_ppv && result.ppv_price !== null && (
            <span className="rounded border border-border-light bg-black/40 px-1.5 py-0.5 font-ui text-[10px] font-semibold text-text-secondary backdrop-blur-sm">
              ${result.ppv_price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("q") ?? "";

  const [inputValue, setInputValue] = useState(currentQuery);
  // Keep the controlled input in sync when the URL's ?q= changes (e.g. via the header's
  // dropdown or browser back/forward) — adjusted during render per React's guidance for
  // "adjusting state when a prop changes", rather than in an effect.
  const [syncedQuery, setSyncedQuery] = useState(currentQuery);
  if (currentQuery !== syncedQuery) {
    setSyncedQuery(currentQuery);
    setInputValue(currentQuery);
  }

  const [results, setResults] = useState<SearchResult[]>([]);
  // Start "loading" if a query is already present (e.g. on first load of /search?q=...)
  // so the initial render doesn't briefly flash a false "no results" before the fetch resolves.
  const [isLoading, setIsLoading] = useState(() => Boolean(currentQuery.trim()));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    if (!q.trim()) {
      return;
    }

    let cancelled = false;

    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await searchCatalog(q);
        if (!cancelled) setResults(response.data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
          setResults([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = inputValue.trim();
    router.push(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search");
  }

  return (
    <section className="min-h-[calc(100vh-64px)] bg-background">
      <div className="mx-auto max-w-360 px-4 py-12 sm:px-6 lg:px-10">
        <h1 className="font-heading text-4xl uppercase text-text-primary sm:text-5xl">Search</h1>

        <form onSubmit={handleSubmit} className="mt-6 flex max-w-xl items-center gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-md border border-border bg-surface-light px-3 py-2.5 focus-within:border-primary">
            <SearchIcon size={16} className="text-text-muted" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search movies, TV shows…"
              className="w-full bg-transparent font-body text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-primary px-5 py-2.5 font-ui text-sm font-bold uppercase tracking-wide text-text-primary transition-colors duration-150 hover:bg-accent"
          >
            Search
          </button>
        </form>

        <div className="mt-10">
          {isLoading && (
            <div className="flex items-center gap-2 font-body text-sm text-text-secondary">
              <Loader2 size={16} className="animate-spin" />
              Searching…
            </div>
          )}

          {!isLoading && error && (
            <p className="rounded-md border border-error/30 bg-error/10 px-4 py-3 font-body text-sm text-error">
              {error}
            </p>
          )}

          {!isLoading && !error && currentQuery.trim() && (
            <p className="mb-6 font-body text-sm text-text-secondary">
              {results.length > 0
                ? `${results.length} result${results.length === 1 ? "" : "s"} for “${currentQuery}”`
                : `No results for “${currentQuery}”. Try a different title.`}
            </p>
          )}

          {!isLoading && !currentQuery.trim() && !error && (
            <p className="font-body text-sm text-text-secondary">
              Start typing above to search the catalog.
            </p>
          )}

          {!isLoading && currentQuery.trim() && results.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {results.map((result) => (
                <ResultCard key={`${result.type}-${result.id}`} result={result} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchPageContent />
    </Suspense>
  );
}
