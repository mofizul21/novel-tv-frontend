import { apiFetch } from "./api";

export type LiveTvCategory = {
  id: number;
  name: string;
  slug: string;
};

export type LiveTvChannel = {
  id: number;
  name: string;
  slug: string;
  channel_number: string | null;
  logo_url: string | null;
  category: { id: number; name: string };
};

export async function fetchLiveTvCategories(): Promise<LiveTvCategory[]> {
  const response = await apiFetch<{ data: LiveTvCategory[] }>("live-tv/categories");
  return response.data;
}

export async function fetchLiveTvChannels(): Promise<LiveTvChannel[]> {
  const response = await apiFetch<{ data: LiveTvChannel[] }>("live-tv/channels");
  return response.data;
}
