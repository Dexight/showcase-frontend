import { API_URL } from "@/shared/api/constants";

export async function addProjectTag({
  projectId,
  tagId,
}: {
  projectId: string;
  tagId: number;
}) {
  const res = await fetch(
    `${API_URL}/admin/projects/${projectId}/tags/add?tagId=${encodeURIComponent(
      tagId
    )}`,
    {
      method: "POST",
    }
  );

  if (!res.ok) throw new Error("Не удалось добавить тег к проекту");
}
