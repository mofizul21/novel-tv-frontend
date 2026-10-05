import { apiFetch } from "./api";
import type { SearchResult } from "./search";

export type RecommendationsResponse = {
  data: SearchResult[];
  meta: { basis: "genre_overlap" | "featured" };
};

export async function fetchRecommendations(): Promise<RecommendationsResponse> {
  return apiFetch<RecommendationsResponse>("recommendations");
}
