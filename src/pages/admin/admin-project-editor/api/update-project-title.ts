import { API_URL } from "@/shared/api/constants";

export async function updateProjectTitle({
  projectId,
  title,
}: {
  projectId: string;
  title: string;
}) {

  const res = await fetch(
    `${API_URL}/admin/projects/${projectId}/title?title=${encodeURIComponent(
      title
    )}`,
    {
      method: "PATCH",
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Произошла ошибка при изменении заголовка");
  }
}
