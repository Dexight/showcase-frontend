import { API_URL } from "@/shared/api/constants";

export async function createTag(req: {
  name: string;
}) {
  const res = await fetch(`${API_URL}/admin/tags`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body:  JSON.stringify({ name: req.name }),
  });
  if (!res.ok) {
    throw new Error("Не удалось создать тег");
  }
  return await res.json();
}
