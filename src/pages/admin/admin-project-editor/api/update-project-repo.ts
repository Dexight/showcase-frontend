import { API_URL } from "@/shared/api/constants";

export async function updateProjectRepo({
  projectId,
  repo,
}: {
  projectId: string;
  repo: string;
}) {
  const res = await fetch(
    `${API_URL}/admin/projects/${projectId}/repo?repo=${encodeURIComponent(
      repo
    )}`,
    {
      method: "PATCH",
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Произошла ошибка при изменении ссылки на репозиторий");
  }
}
