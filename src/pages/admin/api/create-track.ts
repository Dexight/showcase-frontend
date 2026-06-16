import { API_URL } from "@/shared/api/constants";

export async function createTrack(req: {
  name: string;
}) {
  const res = await fetch(`${API_URL}/admin/tracks`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: req.name }),
  });
  if (!res.ok) {
    throw new Error("Не удалось создать трек");
  }
  return await res.json();
}
