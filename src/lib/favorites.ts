import { apiFetch } from "./api";

export type FavoriteEntry = {
  id: number;
  type: "movie" | "series";
  favoritable_id: number;
  title: string | null;
  slug: string | null;
  poster_url: string | null;
  year: number | null;
};

export async function fetchFavorites(): Promise<FavoriteEntry[]> {
  const response = await apiFetch<{ data: FavoriteEntry[] }>("favorites");
  return response.data;
}

export async function addFavorite(type: "movie" | "series", id: number): Promise<FavoriteEntry> {
  const response = await apiFetch<{ data: FavoriteEntry }>("favorites", {
    method: "POST",
    body: JSON.stringify({ type, id }),
  });
  return response.data;
}

export async function removeFavorite(type: "movie" | "series", id: number): Promise<void> {
  await apiFetch(`favorites/${type}/${id}`, { method: "DELETE" });
}
