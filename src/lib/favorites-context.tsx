"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth-context";
import { addFavorite, fetchFavorites, removeFavorite, type FavoriteEntry } from "./favorites";

type FavoritesContextValue = {
  favorites: FavoriteEntry[];
  isLoading: boolean;
  isFavorited: (type: "movie" | "series", id: number) => boolean;
  toggle: (type: "movie" | "series", id: number) => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // No setState here when logged out — the exposed `favorites` below is derived
  // from `user` at render time instead, avoiding a synchronous clear-on-logout
  // call in the effect body (see the AuthProvider/Header notes on this pattern).
  useEffect(() => {
    if (!user) {
      return;
    }

    let cancelled = false;

    (async () => {
      setIsLoading(true);
      try {
        const data = await fetchFavorites();
        if (!cancelled) setFavorites(data);
      } catch {
        if (!cancelled) setFavorites([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const effectiveFavorites = user ? favorites : [];

  function isFavorited(type: "movie" | "series", id: number): boolean {
    return effectiveFavorites.some((f) => f.type === type && f.favoritable_id === id);
  }

  async function toggle(type: "movie" | "series", id: number): Promise<void> {
    if (!user) return;

    if (isFavorited(type, id)) {
      await removeFavorite(type, id);
      setFavorites((prev) => prev.filter((f) => !(f.type === type && f.favoritable_id === id)));
    } else {
      const entry = await addFavorite(type, id);
      setFavorites((prev) => [...prev, entry]);
    }
  }

  return (
    <FavoritesContext.Provider
      value={{ favorites: effectiveFavorites, isLoading, isFavorited, toggle }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
