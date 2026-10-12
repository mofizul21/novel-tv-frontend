import { apiFetch } from "./api";

export type LegalPage = {
  slug: string;
  title: string;
  content: string;
  updated_at: string;
};

export async function fetchPage(slug: string): Promise<LegalPage> {
  const response = await apiFetch<{ data: LegalPage }>(`pages/${encodeURIComponent(slug)}`);
  return response.data;
}
