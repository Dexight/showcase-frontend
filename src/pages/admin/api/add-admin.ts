import { API_URL } from "@/shared/api/constants";

export async function addAdmin(userId: number) {
  const res = await fetch(`${API_URL}/admin/admins`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });

  if (!res.ok) {
    throw new Error("Не удалось назначить администратора");
  }

  return await res.json();
}