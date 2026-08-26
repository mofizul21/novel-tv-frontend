"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X,
  Star,
  Clapperboard,
  Tv,
  Home as HomeIcon,
  Radio,
  Bookmark,
} from "lucide-react";
import { myListItems, type SavedItem } from "@/lib/demo-data";

const listFilters = ["All", "Movies", "TV Shows"] as const;

const bottomNavItems = [
  { label: "Home", href: "/", icon: HomeIcon },
  { label: "Movies", href: "/movies", icon: Clapperboard },
  { label: "TV Shows", href: "/tv-shows", icon: Tv },
  { label: "Live TV", href: "/live-tv", icon: Radio },
  { label: "My List", href: "/my-list", icon: Bookmark },
];

function SavedCard({ item }: { item: SavedItem }) {
  const Icon = item.type === "Movie" ? Clapperboard : Tv;

  return (
    <div>
      <div className="group relative aspect-2/3 overflow-hidden rounded-md border border-border bg-surface">
        <span className="absolute left-2 top-2 z-10 rounded bg-black/60 px-2 py-0.5 font-ui text-[10px] font-bold uppercase tracking-wide text-text-secondary backdrop-blur-sm">
          {item.type}
        </span>
        <button
          aria-label={`Remove ${item.title} from My List`}
          className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-text-primary opacity-0 backdrop-blur-sm transition-opacity duration-150 hover:bg-error group-hover:opacity-100"
        >
          <X size={14} />
        </button>
        {/* Placeholder artwork — swap for the real poster image */}
        <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-surface-light to-surface">
          <Icon size={32} className="text-border-light" />
        </div>
      </div>

      <p className="mt-2 line-clamp-1 font-ui text-sm font-semibold text-text-primary">
        {item.title}
      </p>
      <div className="mt-1 flex items-center justify-between gap-2">
        <span className="font-body text-xs text-text-muted">
          {item.year} · {item.meta}
        </span>
        <span className="rounded border border-border-light px-1.5 py-0.5 font-ui text-[10px] font-semibold text-text-secondary">
          {item.rating}
        </span>
      </div>
    </div>
  );
}

export default function MyListPage() {
  const pathname = usePathname();
  const [activeFilter, setActiveFilter] =
    useState<(typeof listFilters)[number]>("All");

  const items = myListItems.filter((item) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Movies") return item.type === "Movie";
    return item.type === "TV Show";
  });

  return (
    <>
      <div className="pb-16 lg:pb-0">
        <section className="mx-auto max-w-360 px-4 pb-4 pt-10 sm:px-6 lg:px-10 lg:pt-14">
          <div className="flex items-center gap-3">
            <Bookmark size={32} className="text-primary" fill="currentColor" />
            <h1 className="font-heading text-5xl uppercase text-text-primary sm:text-6xl">
              My List
            </h1>
          </div>
          <p className="mt-2 max-w-md font-body text-text-secondary">
            Movies and shows you&apos;ve saved to watch later.
          </p>

          <div className="mt-6 flex gap-2">
            {listFilters.map((filter) => {
              const selected = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-md border px-4 py-2 font-ui text-xs font-semibold uppercase tracking-wide transition-colors duration-150 ${
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
        </section>

        <section className="mx-auto max-w-360 px-4 py-8 sm:px-6 lg:px-10">
          <div className="mb-4 flex items-center gap-2 font-body text-sm text-text-muted">
            <Star size={14} className="fill-warning text-warning" />
            {items.length} title{items.length === 1 ? "" : "s"} saved
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {items.map((item) => (
              <SavedCard key={item.id} item={item} />
            ))}
          </div>
        </section>
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
