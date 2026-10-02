/**
 * Only allow same-site paths (must start with a single "/", not "//" or
 * "/\" which browsers treat as protocol-relative) — prevents an open
 * redirect via a crafted `?redirect=` query value.
 */
export function getSafeRedirectPath(raw: string | null): string {
  if (!raw) return "/";
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\")) {
    return "/";
  }
  return raw;
}
