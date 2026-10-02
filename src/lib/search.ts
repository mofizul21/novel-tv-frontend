import { apiFetch } from "./api";

export type SearchResult = {
  type: "movie" | "series";
  id: number;
  title: string;
  slug: string;
  poster_url: string | null;
  year: number | null;
  is_ppv: boolean;
  ppv_price: number | null;
};

export type SearchResponse = {
  data: SearchResult[];
  meta: {
    query: string;
    movie_count: number;
    series_count: number;
    total: number;
  };
};

export async function searchCatalog(query: string): Promise<SearchResponse> {
  const trimmed = query.trim();

  if (!trimmed) {
    return { data: [], meta: { query: "", movie_count: 0, series_count: 0, total: 0 } };
  }

  return apiFetch<SearchResponse>(`search?q=${encodeURIComponent(trimmed)}`);
}
