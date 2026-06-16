import { API_URL } from "@/shared/api/constants";
import { Projects } from "@/shared/types/schemas";

export function mapProjects(projects: Projects) {
  return (
    projects.map((project) => {
      return {
        ...project,
        mainScreenshot: `${API_URL}/api/projects/${project.id}/main_screenshot`,
        screenshots:
          project.screenshots?.map((_, index) => {
            return `${API_URL}/api/projects/${project.id}/screenshots/${
              index + 1
            }`;
          }) ?? null,
      };
    }) ?? null
  );
}
