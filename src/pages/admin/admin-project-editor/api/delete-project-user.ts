import { API_URL } from "@/shared/api/constants";

export async function deleteProjectUser({
  projectId,
  userId,
}: {
  projectId: string;
  userId: number;
}) {
  const res = await fetch(
    `${API_URL}/admin/projects/${projectId}/users/remove?userId=${encodeURIComponent(
      userId
    )}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!res.ok) throw new Error("Не удалось удалить участника");
}
