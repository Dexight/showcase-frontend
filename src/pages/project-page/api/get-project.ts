import { API_URL } from "@/shared/api/constants";
import { fetchWithValidation } from "@/shared/api/fetch-with-validation";
import { projectSchema } from "@/shared/types/schemas";

export async function getProject(id: string) {
  const project = await fetchWithValidation(projectSchema, `/projects/${id}`);
  const mappedProject = {
    ...project,
    mainScreenshot: project.mainScreenshot
      ? `${API_URL}/api/projects/${project.id}/main_screenshot`
      : null,
    screenshots:
      project.screenshots?.map((_, index) => {
        return `${API_URL}/api/projects/${project.id}/screenshots/${index}`;
      }) ?? null,
  };

  return mappedProject;
}
