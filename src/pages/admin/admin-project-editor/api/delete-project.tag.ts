import { API_URL } from "@/shared/api/constants";

export async function deleteProjectTag({
  projectId,
  tagId,
}: {
  projectId: string;
  tagId: number;
}) {
  const res = await fetch(
    `${API_URL}/admin/projects/${projectId}/tags/remove?tagId=${encodeURIComponent(
      tagId
    )}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!res.ok) throw new Error("Не удалось удалить тег с проекта");
}
