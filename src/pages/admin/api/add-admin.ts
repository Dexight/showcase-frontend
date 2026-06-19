import { API_URL } from "@/shared/api/constants";

export async function addAdmin(userId: number) {
  const res = await fetch(`${API_URL}/admin/admins?userId=${userId}`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Не удалось назначить администратора");
  }
}