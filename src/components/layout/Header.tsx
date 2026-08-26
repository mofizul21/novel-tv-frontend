"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Search, UserCircle2, Menu, X } from "lucide-react";
import { mainNavLinks } from "@/lib/demo-data";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
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

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
    setSearchOpen(false);
  }

  return (
    <header
      className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-md"
      style={{ zIndex: "var(--z-header)" }}
    >
      <div className="mx-auto flex max-w-360 items-center gap-6 px-4 py-3 sm:px-6 lg:px-10">
        <Link href="/" className="inline-flex items-center">
          <Image
            src="/images/drip-logo.png"
            alt="Drip TV"
            width={245}
            height={110}
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
            href="/login"
            aria-label="Account"
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
