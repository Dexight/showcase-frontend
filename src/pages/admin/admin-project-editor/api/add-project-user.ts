import { API_URL } from "@/shared/api/constants";

export async function addProjectUser({
  projectId,
  userId,
}: {
  projectId: string;
  userId: number;
}) {
  const res = await fetch(
    `${API_URL}/admin/projects/${projectId}/users/add?userId=${encodeURIComponent(
      userId
    )}`,
    {
      method: "POST",
    }
  );

  if (!res.ok) throw new Error("Не удалось добавить участника");
}
