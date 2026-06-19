import { API_URL } from "@/shared/api/constants";

export async function lockTrack(dateId: number, trackId: number) {
  const res = await fetch(
    `${API_URL}/dates/${dateId}/lock_track/${trackId}`,
    {
      method: "PATCH",
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Не удалось закрыть трек");
  }
}