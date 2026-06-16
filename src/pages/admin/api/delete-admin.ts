import { API_URL } from "@/shared/api/constants";

export async function deleteAdmin(userId: number) {
  const res = await fetch(`${API_URL}/admin/admins/${userId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Не удалось удалить администратора");
  }

  return await res.json();
}