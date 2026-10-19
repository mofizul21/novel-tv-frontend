"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search as SearchIcon, Loader2 } from "lucide-react";
import { searchCatalog, type SearchResult } from "@/lib/search";
import { ApiError } from "@/lib/api";
import { PosterCard } from "@/components/PosterCard";

function ResultCard({ result }: { result: SearchResult }) {
  return (
    <PosterCard
      href={result.type === "series" ? `/series/${result.slug}` : `/movies/${result.slug}`}
      title={result.title}
      posterUrl={result.poster_url}
      subtitle={result.year ? String(result.year) : undefined}
      topLeftBadge={result.is_ppv ? "PPV" : undefined}
      topRightBadge={result.type === "series" ? "Series" : "Movie"}
      cornerTag={result.is_ppv && result.ppv_price !== null ? `$${result.ppv_price.toFixed(2)}` : undefined}
    />
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
