import { useMutation } from "@tanstack/react-query";
import { API_URL } from "@/shared/api/constants";

async function deleteProject(projectId: string) {
  const response = await fetch(
    `${API_URL}/projects/${projectId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Не удалось удалить проект");
  }
}

export function useDeleteProject() {
  return useMutation({
    mutationFn: deleteProject,
  });
}