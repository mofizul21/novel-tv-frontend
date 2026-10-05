"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, BellOff, Loader2, CheckCheck } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type AppNotification,
} from "@/lib/notifications";

function timeAgo(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NotificationsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    (async () => {
      setIsLoading(true);
      try {
        const data = await fetchNotifications();
        if (!cancelled) setNotifications(data);
      } catch {
        if (!cancelled) setNotifications([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  async function handleMarkRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    try {
      await markNotificationRead(id);
    } catch {
      // Non-critical — the list will self-correct on next load.
    }
  }

  async function handleMarkAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await markAllNotificationsRead();
    } catch {
      // Non-critical.
    }
  }

  const hasUnread = notifications.some((n) => !n.read);

  if (authLoading || !user) {
    return (
      <section className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-background">
        <p className="font-body text-sm text-text-secondary">Loading…</p>
      </section>
    );
  }

  return (
    <section className="min-h-[calc(100vh-64px)] bg-background">
      <div className="mx-auto max-w-240 px-4 py-16 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Bell size={32} className="text-primary" />
            <h1 className="font-heading text-5xl uppercase text-text-primary sm:text-6xl">
              Notifications
            </h1>
          </div>
          {hasUnread && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 rounded-md border border-border-light px-3 py-2 font-ui text-xs font-semibold uppercase tracking-wide text-text-secondary transition-colors duration-150 hover:bg-surface-hover hover:text-text-primary"
            >
              <CheckCheck size={14} />
              Mark All Read
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="mt-16 flex justify-center">
            <Loader2 size={24} className="animate-spin text-text-secondary" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-3 text-center">
            <BellOff size={32} className="text-text-muted" />
            <p className="font-body text-sm text-text-secondary">You don&apos;t have any notifications yet.</p>
          </div>
        ) : (
          <div className="mt-10 space-y-2">
            {notifications.map((notification) => (
              <button
                key={notification.id}
                onClick={() => !notification.read && handleMarkRead(notification.id)}
                className={`flex w-full items-start gap-3 rounded-md border px-4 py-3 text-left transition-colors duration-150 ${
                  notification.read
                    ? "border-border bg-surface"
                    : "border-primary/40 bg-primary/5 hover:bg-primary/10"
                }`}
              >
                {!notification.read && (
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-ui text-sm font-semibold text-text-primary">
                    {notification.title ?? "Notification"}
                  </p>
                  {notification.message && (
                    <p className="mt-0.5 font-body text-sm text-text-secondary">{notification.message}</p>
                  )}
                  <p className="mt-1 font-body text-xs text-text-muted">{timeAgo(notification.created_at)}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
