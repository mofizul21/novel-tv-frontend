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

export type Movie = {
  id: number;
  title: string;
  slug: string;
  synopsis: string | null;
  release_year: number | null;
  runtime_minutes: number | null;
  certification: string | null;
  poster_url: string | null;
  backdrop_url: string | null;
  trailer_url: string | null;
  mux_playback_id: string | null;
  mux_playback_policy: "public" | "signed" | null;
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
};

export async function fetchMovies(
  params: { genre?: string; featured?: boolean; original?: boolean; perPage?: number } = {},
): Promise<Movie[]> {
  const search = new URLSearchParams();
  if (params.genre) search.set("genre", params.genre);
  if (params.featured) search.set("featured", "1");
  if (params.original) search.set("original", "1");
  if (params.perPage) search.set("per_page", String(params.perPage));

  const qs = search.toString();
  const response = await apiFetch<PaginatedResponse<Movie>>(`movies${qs ? `?${qs}` : ""}`);
  return response.data;
}

export async function fetchMovieBySlug(slug: string): Promise<Movie> {
  const response = await apiFetch<{ data: Movie }>(`movies/${encodeURIComponent(slug)}`);
  return response.data;
}

/**
 * Whether the current authenticated user can actually stream this movie
 * (as opposed to just seeing its metadata, which the public endpoint above
 * already allows for anyone). Requires a logged-in user.
 */
export async function fetchMovieAccess(slug: string): Promise<ContentAccess> {
  return apiFetch<ContentAccess>(`movies/${encodeURIComponent(slug)}/access`);
}

/**
 * Short-lived signed playback tokens for a movie with mux_playback_policy
 * "signed" — Mux Player needs a separate token for the video, poster
 * thumbnail, and storyboard preview. Only call this once access has already
 * been confirmed.
 */
export async function fetchMoviePlaybackToken(movieId: number): Promise<PlaybackTokens> {
  const response = await apiFetch<{ token: string | null; thumbnail_token: string | null; storyboard_token: string | null }>(
    `movies/${movieId}/playback-token`,
  );
  return {
    token: response.token,
    thumbnailToken: response.thumbnail_token,
    storyboardToken: response.storyboard_token,
  };
}
