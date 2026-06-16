import { API_URL } from "@/shared/api/constants";

export async function updateProjectPresentation({
  projectId,
  presentation,
}: {
  projectId: string;
  presentation: string;
}) {
  const res = await fetch(
    `${API_URL}/admin/projects/${projectId}/presentation?presentation=${encodeURIComponent(
      presentation
    )}`,
    {
      method: "PATCH",
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Произошла ошибка при изменении ссылки на презентацию");
  }
}
