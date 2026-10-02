import { apiFetch } from "./api";

export type WatchHistoryEntry = {
  id: number;
  type: "movie" | "episode";
  title: string | null;
  poster_url: string | null;
  url: string | null;
  progress_percent: number;
  last_watched_at: string | null;
};

export async function fetchWatchHistory(): Promise<WatchHistoryEntry[]> {
  const response = await apiFetch<{ data: WatchHistoryEntry[] }>("watch-history");
  return response.data;
}

export async function recordProgress(
  type: "movie" | "episode",
  id: number,
  progressPercent: number,
): Promise<void> {
  await apiFetch("watch-history", {
    method: "POST",
    body: JSON.stringify({ type, id, progress_percent: progressPercent }),
  });
}

export async function removeFromHistory(type: "movie" | "episode", id: number): Promise<void> {
  await apiFetch(`watch-history/${type}/${id}`, { method: "DELETE" });
}
