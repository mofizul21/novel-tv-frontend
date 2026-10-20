"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { clearStoredToken, getStoredToken } from "./api";
import { type AuthUser, fetchCurrentUser, logoutUser } from "./auth";

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
  logoutLocally: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  // Only worth "loading" if there's a stored token to verify — otherwise we
  // already know synchronously that nobody's logged in, no effect needed for that case.
  const [isLoading, setIsLoading] = useState(() => Boolean(getStoredToken()));

  useEffect(() => {
    if (!getStoredToken()) return;

    fetchCurrentUser()
      .then(setUser)
      .catch(() => clearStoredToken())
      .finally(() => setIsLoading(false));
  }, []);

  async function logout() {
    await logoutUser();
    setUser(null);
  }

  // Clears local session state without calling the authenticated
  // /auth/logout endpoint — needed for account deletion, which revokes all
  // of the user's tokens server-side as part of the request itself, so
  // that endpoint would always 401 by the time this runs.
  function logoutLocally() {
    clearStoredToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, setUser, logout, logoutLocally }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
