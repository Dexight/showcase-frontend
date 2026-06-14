import { API_URL } from "@/shared/api/constants";

export async function createDate(req: {
  name: string;
}) {
  const res = await fetch(`${API_URL}/admin/dates`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: req.name }),
  });
  if (!res.ok) {
    throw new Error("Не удалось создать дату");
  }
  return await res.json();
}
