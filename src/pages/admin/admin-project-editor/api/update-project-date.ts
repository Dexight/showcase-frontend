import { API_URL } from "@/shared/api/constants";

export async function updateProjectDate({
  projectId,
  dateId
}: {
  projectId: string;
  dateId: number;
}) {
  const res = await fetch(
    `${API_URL}/admin/projects/${projectId}/date?dateId=${encodeURIComponent(
      dateId
    )}`,
    {
      method: "PATCH"
    }
  );

  if (!res.ok) {
    throw new Error("Произошла ошибка при изменении даты");
  }
}
