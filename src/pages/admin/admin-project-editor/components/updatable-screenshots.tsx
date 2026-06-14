import { useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { ProjectCarousel } from "@/shared/widgets/project-carousel";
import { FileUpload } from "@/pages/create-project-page/components/file-upload";
import { useUpdateProjectScreenshots } from "../api/hooks/use-update-project-screenshots";

type CarouselImage =
  | { type: "url"; value: string }
  | { type: "file"; value: File };

interface Props {
  projectId: string;
  screenshots: string[];
}

export function UpdatableScreenshots({
  projectId,
  screenshots,
}: Props) {
  const { mutateAsync, isPending } = useUpdateProjectScreenshots();
  const initialImages = useMemo<CarouselImage[]>(
    () =>
      screenshots.map((url) => ({
        type: "url",
        value: url,
      })),
    [screenshots]
  );

  const [images, setImages] =
    useState<CarouselImage[]>(initialImages);

  useEffect(() => {
    setImages(initialImages);
  }, [initialImages]);

  const updateImages = (image: File | null) => {
    if (!image) return;

    setImages((prev) => [
      ...prev,
      {
        type: "file",
        value: image,
      },
    ]);
  };

  const handleDeleteImage = (index: number) => {
    setImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleSetMainImage = (index: number) => {
    setImages((prev) => {
      if (index === 0) return prev;

      const main = prev[index];

      return [
        main,
        ...prev.filter((_, i) => i !== index),
      ];
    });
  };

  const hasChanges =
    JSON.stringify(
      images.map((i) =>
        i.type === "url"
          ? { type: i.type, value: i.value }
          : { type: i.type, value: i.value.name }
      )
    ) !==
    JSON.stringify(
      initialImages.map((i) => ({
        type: i.type,
        value: i.value,
      }))
    );

  const handleSave = async () => {
    const mainScreenshot = images[0];

    const existingImages = images
      .filter(
        (img): img is { type: "url"; value: string } =>
          img.type === "url"
      )
      .map((img) => img.value);

    const newImages = images
      .filter(
        (img): img is { type: "file"; value: File } =>
          img.type === "file"
      )
      .map((img) => img.value);

    await mutateAsync({
      projectId,
      mainScreenshot,
      existingImages,
      newImages,
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <ProjectCarousel
        images={images}
        showControls={images.length > 1}
        onDeleteImage={handleDeleteImage}
        onSetMainImage={handleSetMainImage}
      >
        <FileUpload updateImages={updateImages} />
      </ProjectCarousel>

      {hasChanges && (
        <div className="flex gap-2 justify-end">
          <Button
            size="icon"
            disabled={isPending}
            onClick={handleSave}
          >
            <Check />
          </Button>
        </div>
      )}
    </div>
  );
}