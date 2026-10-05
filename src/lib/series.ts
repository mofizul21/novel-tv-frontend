import { apiFetch } from "./api";
import type {
  CastMember,
  ContentAccess,
  Country,
  Director,
  Genre,
  Language,
  PaginatedResponse,
  PlaybackTokens,
} from "./catalog-types";

export type Episode = {
  id: number;
  number: number;
  title: string;
  overview: string | null;
  runtime_minutes: number | null;
  still_url: string | null;
  mux_playback_id: string | null;
  mux_playback_policy: "public" | "signed" | null;
  air_date: string | null;
};

export type Season = {
  id: number;
  number: number;
  title: string | null;
  overview: string | null;
  poster_url: string | null;
  air_year: number | null;
  episodes?: Episode[];
};

export type Series = {
  id: number;
  title: string;
  slug: string;
  synopsis: string | null;
  first_air_year: number | null;
  certification: string | null;
  poster_url: string | null;
  backdrop_url: string | null;
  trailer_url: string | null;
  is_featured: boolean;
  is_original: boolean;
  is_ppv: boolean;
  ppv_price: number | null;
  published_at: string | null;
  country?: Country;
  genres?: Genre[];
  languages?: Language[];
  directors?: Director[];
  cast?: CastMember[];
  seasons?: Season[];
};

export async function fetchSeriesList(
  params: { genre?: string; featured?: boolean; original?: boolean; perPage?: number } = {},
): Promise<Series[]> {
  const search = new URLSearchParams();
  if (params.genre) search.set("genre", params.genre);
  if (params.featured) search.set("featured", "1");
  if (params.original) search.set("original", "1");
  if (params.perPage) search.set("per_page", String(params.perPage));

  const qs = search.toString();
  const response = await apiFetch<PaginatedResponse<Series>>(`series${qs ? `?${qs}` : ""}`);
  return response.data;
}

export async function fetchSeriesBySlug(slug: string): Promise<Series> {
  const response = await apiFetch<{ data: Series }>(`series/${encodeURIComponent(slug)}`);
  return response.data;
}

/**
 * Whether the current authenticated user can actually stream this series'
 * episodes (as opposed to just seeing its metadata). Requires a logged-in user.
 */
export async function fetchSeriesAccess(slug: string): Promise<ContentAccess> {
  return apiFetch<ContentAccess>(`series/${encodeURIComponent(slug)}/access`);
}

/**
 * Short-lived signed playback tokens for an episode with mux_playback_policy
 * "signed" — Mux Player needs a separate token for the video, poster
 * thumbnail, and storyboard preview. Only call this once access has already
 * been confirmed — the backend re-checks entitlement anyway, but there's no
 * point fetching early.
 */
export async function fetchEpisodePlaybackToken(episodeId: number): Promise<PlaybackTokens> {
  const response = await apiFetch<{ token: string | null; thumbnail_token: string | null; storyboard_token: string | null }>(
    `episodes/${episodeId}/playback-token`,
  );
  return {
    token: response.token,
    thumbnailToken: response.thumbnail_token,
    storyboardToken: response.storyboard_token,
  };
}
