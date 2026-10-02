"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Search, UserCircle2, Menu, X, Film, Tv as TvIcon, Loader2 } from "lucide-react";
import { mainNavLinks } from "@/lib/demo-data";
import { useAuth } from "@/lib/auth-context";
import { searchCatalog, type SearchResult } from "@/lib/search";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [searchOpen]);

  // Live "ajax" search-as-you-type: debounce so we don't hit the API on every keystroke.
  // Nothing here sets state synchronously in the effect body itself (only inside the
  // setTimeout/promise callbacks) — required by the react-hooks/set-state-in-effect rule.
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      return;
    }

    let cancelled = false;
    const timeout = setTimeout(() => {
      setIsSearching(true);
      searchCatalog(trimmed)
        .then((response) => {
          if (!cancelled) setResults(response.data.slice(0, 6));
        })
        .catch(() => {
          if (!cancelled) setResults([]);
        })
        .finally(() => {
          if (!cancelled) setIsSearching(false);
        });
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [query]);

  function goToResultsPage(q: string) {
    const trimmed = q.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    setSearchOpen(false);
    setResults([]);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    goToResultsPage(query);
  }

  const showDropdown = searchOpen && query.trim().length >= 2;

  return (
    <header
      className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-md"
      style={{ zIndex: "var(--z-header)" }}
    >
      <div className="mx-auto flex max-w-360 items-center gap-6 px-4 py-3 sm:px-6 lg:px-10">
        <Link href="/" className="inline-flex items-center">
          <Image
            src="/images/novel-tv-logo.png"
            alt="Novel TV"
            width={500}
            height={228}
            priority
            className="h-9 w-auto sm:h-10"
          />
        </Link>

        <nav className="hidden flex-1 items-center gap-6 font-ui text-sm font-medium tracking-wide lg:flex">
          {mainNavLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 uppercase transition-colors duration-150 hover:text-accent ${
                  active ? "text-primary" : "text-text-secondary"
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute -bottom-[13px] left-0 right-0 h-0.5 bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-4 lg:ml-0">
          <button
            aria-label={searchOpen ? "Close search" : "Search"}
            aria-expanded={searchOpen}
            className="text-text-primary transition-colors duration-150 hover:text-accent"
            onClick={() => setSearchOpen((v) => !v)}
          >
            {searchOpen ? <X size={20} /> : <Search size={20} />}
          </button>
          <Link
            href={user ? "/dashboard" : "/login"}
            aria-label={user ? "Your account" : "Sign in"}
            className="text-text-primary transition-colors duration-150 hover:text-accent"
          >
            <UserCircle2 size={26} />
          </Link>
          <button
            aria-label="Toggle menu"
            className="text-text-primary lg:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-border/60 bg-background px-4 py-3 sm:px-6 lg:px-10">
          <form
            onSubmit={handleSearchSubmit}
            className="mx-auto flex max-w-360 items-center gap-3"
          >
            <Search size={18} className="shrink-0 text-text-muted" />
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies, TV shows, live channels…"
              className="flex-1 bg-transparent font-body text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
            />
            <button
              type="button"
              aria-label="Close search"
              onClick={() => setSearchOpen(false)}
              className="shrink-0 text-text-muted transition-colors duration-150 hover:text-text-primary"
            >
              <X size={18} />
            </button>
          </form>

          {showDropdown && (
            <div className="mx-auto mt-3 max-w-360">
              <div className="max-h-96 overflow-y-auto rounded-md border border-border bg-surface shadow-md">
                {isSearching ? (
                  <div className="flex items-center gap-2 px-4 py-3 font-body text-sm text-text-secondary">
                    <Loader2 size={14} className="animate-spin" />
                    Searching…
                  </div>
                ) : results.length === 0 ? (
                  <p className="px-4 py-3 font-body text-sm text-text-secondary">
                    No matches for &ldquo;{query.trim()}&rdquo;.
                  </p>
                ) : (
                  <>
                    {results.map((result) => {
                      const TypeIcon = result.type === "series" ? TvIcon : Film;
                      return (
                        <button
                          key={`${result.type}-${result.id}`}
                          type="button"
                          onClick={() => goToResultsPage(result.title)}
                          className="flex w-full items-center gap-3 border-b border-border/60 px-4 py-2.5 text-left transition-colors duration-150 last:border-b-0 hover:bg-surface-hover"
                        >
                          <TypeIcon size={16} className="shrink-0 text-text-muted" />
                          <span className="flex-1 truncate font-body text-sm text-text-primary">
                            {result.title}
                          </span>
                          {result.year && (
                            <span className="shrink-0 font-body text-xs text-text-muted">
                              {result.year}
                            </span>
                          )}
                          {result.is_ppv && (
                            <span className="shrink-0 rounded border border-border-light px-1.5 py-0.5 font-ui text-[10px] font-semibold uppercase text-text-secondary">
                              PPV
                            </span>
                          )}
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => goToResultsPage(query)}
                      className="w-full px-4 py-2.5 text-left font-ui text-sm font-semibold text-primary transition-colors duration-150 hover:text-accent"
                    >
                      See all results for &ldquo;{query.trim()}&rdquo;
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {open && (
        <nav className="flex flex-col gap-1 border-t border-border/60 bg-background px-4 py-3 font-ui text-sm font-medium uppercase tracking-wide lg:hidden">
          {mainNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`rounded-md px-3 py-2 transition-colors duration-150 hover:bg-surface-hover ${
                pathname === link.href ? "text-primary" : "text-text-secondary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
