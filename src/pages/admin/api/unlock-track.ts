import { API_URL } from "@/shared/api/constants";

export async function unlockTrack(dateId: number, trackId: number) {
  const res = await fetch(
    `${API_URL}/dates/${dateId}/unlock_track/${trackId}`,
    {
      method: "PATCH",
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Не удалось открыть трек");
  }
}