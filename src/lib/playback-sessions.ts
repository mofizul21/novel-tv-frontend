import { apiFetch } from "./api";

export async function sendPlaybackHeartbeat(deviceId: string): Promise<void> {
  await apiFetch("playback-sessions/heartbeat", {
    method: "POST",
    body: JSON.stringify({ device_id: deviceId }),
  });
}

export async function stopPlaybackSession(deviceId: string): Promise<void> {
  await apiFetch("playback-sessions/stop", {
    method: "POST",
    body: JSON.stringify({ device_id: deviceId }),
  });
}
