"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth-context";
import {
  fetchNotifications,
  fetchUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
  type AppNotification,
} from "./notifications";

type NotificationsContextValue = {
  notifications: AppNotification[];
  unreadCount: number;
  isLoading: boolean;
  refresh: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
};

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  async function refresh(): Promise<void> {
    setIsLoading(true);
    try {
      const [list, count] = await Promise.all([fetchNotifications(), fetchUnreadNotificationCount()]);
      setNotifications(list);
      setUnreadCount(count);
    } catch {
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  }

  // No setState here when logged out — the exposed values below are derived
  // from `user` at render time instead, avoiding a synchronous clear-on-logout
  // call in the effect body (see the FavoritesProvider notes on this pattern).
  useEffect(() => {
    if (!user) return;
    // Deferred via .then() rather than calling refresh() directly, so the
    // setState calls inside it don't happen synchronously within the effect body.
    Promise.resolve().then(refresh);
  }, [user]);

  async function markRead(id: string): Promise<void> {
    const target = notifications.find((n) => n.id === id);
    if (!target || target.read) return;

    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await markNotificationRead(id);
    } catch {
      // Non-critical — the next full refresh will self-correct.
    }
  }

  async function markAllRead(): Promise<void> {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);

    try {
      await markAllNotificationsRead();
    } catch {
      // Non-critical.
    }
  }

  const effective = user
    ? { notifications, unreadCount }
    : { notifications: [] as AppNotification[], unreadCount: 0 };

  return (
    <NotificationsContext.Provider
      value={{
        notifications: effective.notifications,
        unreadCount: effective.unreadCount,
        isLoading,
        refresh,
        markRead,
        markAllRead,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications(): NotificationsContextValue {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationsProvider");
  }
  return context;
}
