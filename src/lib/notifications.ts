import { apiFetch } from "./api";

export type AppNotification = {
  id: string;
  type: string | null;
  title: string | null;
  message: string | null;
  read: boolean;
  created_at: string | null;
};

export async function fetchNotifications(): Promise<AppNotification[]> {
  const response = await apiFetch<{ data: AppNotification[] }>("notifications");
  return response.data;
}

export async function fetchUnreadNotificationCount(): Promise<number> {
  const response = await apiFetch<{ unread_count: number }>("notifications/unread-count");
  return response.unread_count;
}

export async function markNotificationRead(id: string): Promise<void> {
  await apiFetch(`notifications/${id}/read`, { method: "PUT" });
}

export async function markNotificationUnread(id: string): Promise<void> {
  await apiFetch(`notifications/${id}/unread`, { method: "PUT" });
}

export async function markAllNotificationsRead(): Promise<void> {
  await apiFetch("notifications/read-all", { method: "PUT" });
}
