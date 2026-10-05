import { apiFetch, clearStoredToken, setStoredToken } from "./api";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
};

type AuthResponse = {
  user: AuthUser;
  token: string;
  token_type: string;
};

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}): Promise<AuthUser> {
  // Deliberately doesn't store the returned token — registering sends the
  // user to the login page to sign in explicitly, rather than auto-logging them in.
  const response = await apiFetch<AuthResponse>("auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });

  return response.user;
}

export async function loginUser(input: { email: string; password: string }): Promise<AuthUser> {
  const response = await apiFetch<AuthResponse>("auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });

  setStoredToken(response.token);

  return response.user;
}

export async function logoutUser(): Promise<void> {
  try {
    await apiFetch("auth/logout", { method: "POST" });
  } finally {
    clearStoredToken();
  }
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  const response = await apiFetch<{ data: AuthUser }>("auth/me");

  return response.data;
}

export async function resendVerificationEmail(): Promise<void> {
  await apiFetch("auth/email/verification-notification", { method: "POST" });
}

export async function changePassword(input: {
  current_password: string;
  password: string;
  password_confirmation: string;
}): Promise<void> {
  await apiFetch("auth/change-password", {
    method: "PUT",
    body: JSON.stringify(input),
  });
}
