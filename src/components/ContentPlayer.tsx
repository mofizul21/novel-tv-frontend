"use client";

import MuxPlayer from "@mux/mux-player-react";
import Link from "next/link";
import { Loader2, PlayCircle } from "lucide-react";
import type { ContentAccess } from "@/lib/catalog-types";

export type ContentPlayerProps = {
  canWatch: boolean;
  /** Drives PPV-aware messaging when canWatch is false — omit for the generic "subscribe" copy. */
  accessReason?: ContentAccess["reason"];
  isLoggedIn: boolean;
  videoTitle: string;
  muxPlaybackId?: string | null;
  muxPlaybackPolicy?: "public" | "signed" | null;
  /**
   * Required when muxPlaybackPolicy is "signed" — short-lived JWTs from
   * `GET /episodes/{id}/playback-token`, one per resource (Mux Player fetches
   * the video, a poster thumbnail, and a storyboard preview separately, each
   * needing its own audience-specific signature). Pass `undefined` while
   * still fetching (shows a loader) and `null` if the fetch failed.
   */
  muxPlaybackToken?: string | null;
  muxThumbnailToken?: string | null;
  muxStoryboardToken?: string | null;
};

const demoYoutubeId = process.env.NEXT_PUBLIC_DEMO_VIDEO_YOUTUBE_ID?.trim() || null;

/**
 * Shared video area for movie/episode detail pages. Prefers a real Mux
 * playback ID when one exists; otherwise, in dev, falls back to a single
 * shared YouTube placeholder (NEXT_PUBLIC_DEMO_VIDEO_YOUTUBE_ID) so access
 * gating, watch history, etc. can be exercised end-to-end before the client
 * delivers real video. Unset that env var to fall back to a plain
 * "Preview not available" placeholder (the production-safe default).
 */
export function ContentPlayer({
  canWatch,
  accessReason,
  isLoggedIn,
  videoTitle,
  muxPlaybackId,
  muxPlaybackPolicy,
  muxPlaybackToken,
  muxThumbnailToken,
  muxStoryboardToken,
}: ContentPlayerProps) {
  if (!canWatch) {
    if (accessReason === "requires_ppv") {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-4 text-center text-text-muted">
          <PlayCircle size={40} />
          <p className="font-body text-sm">Rent this title to watch — use the Rent button above.</p>
        </div>
      );
    }

    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-4 text-center text-text-muted">
        <PlayCircle size={40} />
        <p className="font-body text-sm">
          {isLoggedIn ? "Subscribe to unlock this title." : "Sign in and subscribe to watch this title."}
        </p>
        <Link
          href="/pricing"
          className="rounded-md bg-primary px-5 py-2 font-ui text-xs font-bold uppercase tracking-wide text-text-primary transition-colors duration-150 hover:bg-accent"
        >
          Subscribe to Watch
        </Link>
      </div>
    );
  }

  if (muxPlaybackId && muxPlaybackPolicy === "signed") {
    if (muxPlaybackToken === undefined) {
      return (
        <div className="flex h-full w-full items-center justify-center">
          <Loader2 size={24} className="animate-spin text-text-secondary" />
        </div>
      );
    }

    if (!muxPlaybackToken) {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-text-muted">
          <PlayCircle size={40} />
          <p className="font-body text-sm">Playback isn&apos;t available right now.</p>
        </div>
      );
    }

    return (
      <MuxPlayer
        playbackId={muxPlaybackId}
        tokens={{
          playback: muxPlaybackToken,
          thumbnail: muxThumbnailToken ?? undefined,
          storyboard: muxStoryboardToken ?? undefined,
        }}
        videoTitle={videoTitle}
        style={{ width: "100%", height: "100%" }}
      />
    );
  }

  if (muxPlaybackId) {
    return (
      <iframe
        src={`https://player.mux.com/${muxPlaybackId}?metadata-video-title=${encodeURIComponent(videoTitle)}`}
        style={{ width: "100%", height: "100%", border: "none" }}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
        allowFullScreen
      />
    );
  }

  if (demoYoutubeId) {
    return (
      <>
        <iframe
          src={`https://www.youtube.com/embed/${demoYoutubeId}`}
          style={{ width: "100%", height: "100%", border: "none" }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
        <span className="absolute left-3 top-3 rounded bg-black/70 px-2 py-0.5 font-ui text-[10px] font-bold uppercase tracking-wide text-text-primary backdrop-blur-sm">
          Demo Preview
        </span>
      </>
    );
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-text-muted">
      <PlayCircle size={40} />
      <p className="font-body text-sm">Preview not available</p>
    </div>
  );
}
