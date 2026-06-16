import { API_URL } from "@/shared/api/constants";

export async function updateProjectTrack({
  projectId,
  trackId,
}: {
  projectId: string;
  trackId: number;
}) {
  const res = await fetch(
    `${API_URL}/admin/projects/${projectId}/track?trackId=${encodeURIComponent(
      trackId
    )}`,
    {
      method: "PATCH",
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Произошла ошибка при изменении трека");
  }
}
