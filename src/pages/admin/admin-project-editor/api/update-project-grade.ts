import { API_URL } from "@/shared/api/constants";

export async function updateProjectGrade({
  projectId,
  grade,
}: {
  projectId: string;
  grade: string;
}) {
  const res = await fetch(
    `${API_URL}/admin/projects/${projectId}/grade?grade=${encodeURIComponent(
      grade
    )}`,
    {
      method: "PATCH",
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Произошла ошибка при изменении оценки");
  }
}
