import { apiFetch } from "./api";

export async function requestAccountDeletion(): Promise<void> {
  await apiFetch("account/request-deletion", { method: "POST" });
}
