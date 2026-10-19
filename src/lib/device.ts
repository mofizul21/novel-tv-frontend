const DEVICE_ID_STORAGE_KEY = "novel-tv-device-id";

/**
 * A stable per-browser identifier — generated once and persisted in
 * localStorage — used to enforce a subscription plan's "screens at once"
 * limit. Not tied to a Sanctum token: a user can hold many tokens (old
 * logins, other apps) without that meaning many concurrent screens, so the
 * backend counts distinct device IDs instead.
 */
export function getDeviceId(): string | null {
  if (typeof window === "undefined") return null;

  try {
    let id = window.localStorage.getItem(DEVICE_ID_STORAGE_KEY);
    if (!id) {
      id = crypto.randomUUID();
      window.localStorage.setItem(DEVICE_ID_STORAGE_KEY, id);
    }
    return id;
  } catch {
    // localStorage can be unavailable (private browsing, disabled storage)
    // — playback just isn't screen-limited for this session, same as any
    // other client that doesn't send a device_id.
    return null;
  }
}
