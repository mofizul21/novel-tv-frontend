import Link from "next/link";
import Image from "next/image";

export type PosterCardProps = {
  href: string;
  title: string;
  posterUrl?: string | null;
  subtitle?: string;
  topLeftBadge?: string;
  topRightBadge?: string;
  cornerTag?: string;
};

/**
 * Shared poster tile used across catalog listing and detail pages.
 * Falls back to the generic placeholder poster until real artwork is uploaded.
 */
export function PosterCard({
  href,
  title,
  posterUrl,
  subtitle,
  topLeftBadge,
  topRightBadge,
  cornerTag,
}: PosterCardProps) {
  return (
    <Link
      href={href}
      className="group relative block aspect-2/3 overflow-hidden rounded-md border border-border bg-surface transition-colors duration-150 hover:border-border-light"
    >
      {topLeftBadge && (
        <span className="absolute left-2 top-2 z-10 rounded bg-primary px-2 py-0.5 font-ui text-[10px] font-bold uppercase tracking-wide text-text-primary">
          {topLeftBadge}
        </span>
      )}
      {topRightBadge && (
        <span className="absolute right-2 top-2 z-10 rounded bg-black/60 px-2 py-0.5 font-ui text-[10px] font-bold uppercase tracking-wide text-text-primary backdrop-blur-sm">
          {topRightBadge}
        </span>
      )}

      <Image
        src={posterUrl ?? "/images/movie-poster.png"}
        alt=""
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        className="object-cover transition-transform duration-150 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-3">
        <p className="line-clamp-1 font-ui text-sm font-semibold text-text-primary">{title}</p>
        {(subtitle || cornerTag) && (
          <div className="mt-1 flex items-center justify-between gap-2">
            {subtitle && <span className="font-body text-xs text-text-secondary">{subtitle}</span>}
            {cornerTag && (
              <span className="rounded border border-border-light bg-black/40 px-1.5 py-0.5 font-ui text-[10px] font-semibold text-text-secondary backdrop-blur-sm">
                {cornerTag}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
