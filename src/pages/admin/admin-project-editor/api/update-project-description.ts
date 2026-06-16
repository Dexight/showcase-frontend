import { API_URL } from "@/shared/api/constants";

export async function updateProjectDescription({
  projectId,
  description,
}: {
  projectId: string;
  description: string;
}) {
  const res = await fetch(
    `${API_URL}/admin/projects/${projectId}/description?description=${encodeURIComponent(
      description
    )}`,
    {
      method: "PATCH",
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Произошла ошибка при изменении описания");
  }
}
