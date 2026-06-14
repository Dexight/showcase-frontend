import { API_URL } from "@/shared/api/constants";

export async function updateProjectScreenshots({
  projectId,
  existingImages,
  newImages,
  mainScreenshot,
}: {
  projectId: string;
  existingImages: string[];
  newImages: File[];
  mainScreenshot:
    | { type: "url"; value: string }
    | { type: "file"; value: File }
    | undefined;
}) {
  const formData = new FormData();

  existingImages.forEach((url) => {
    formData.append("existingImages", url);
  });

  newImages.forEach((file) => {
    formData.append("newImages", file);
  });

  if (mainScreenshot) {
        if (mainScreenshot.type === "url") {
            formData.append(
                "mainScreenshotUrl",
                mainScreenshot.value
            );
        } 
        else     
        {
            formData.append(
                "mainScreenshotFile",
                mainScreenshot.value
            );
        }
    }

  const res = await fetch(
    `${API_URL}/admin/projects/${projectId}/screenshots`,
    {
      method: "PATCH",
      credentials: "include",
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error("Произошла ошибка при обновлении скриншотов");
  }
}