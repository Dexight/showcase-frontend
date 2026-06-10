import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Separator } from "@/shared/ui/separator";
import { useGetProject } from "@/pages/project-page/api/hooks/use-get-project";
import { Link } from "lucide-react";
import { ErrorFallback } from "@/shared/ui/error-fallback";
import { ProjectCarousel } from "@/shared/widgets/project-carousel";
import { FullPageSpinner } from "@/shared/ui/full-page-spinner";
import { UpdatableTitle } from "./components/updatable-title";
import { UpdatableDescription } from "./components/updatable-description";
import { UpdatableDate } from "./components/updatable-date";
import { UpdatableTrack } from "./components/updatable-track";
import { UpdatableTags } from "./components/updatable-tags";
import { UpdatablePresentation } from "./components/updatable-presentation";
import { UpdatableRepo } from "./components/updatable-repo";
import { UpdatableGrade } from "./components/updatable-grade";
import { UpdatableProjectUsers } from "./components/updatable-project-users";
import { Navigate } from "react-router";
import { useAuth } from "@/shared/hooks/use-auth";
import { useGetDatabaseUser } from "@/pages/create-project-page/api/hooks/use-get-database-user";
import { FileUpload } from "@/pages/create-project-page/components/file-upload";

export function AdminProjectEditor() {
  const { id } = useParams();

  const { authUser, isAuthLoading } = useAuth();
	
  const { data: currentUser } = useGetDatabaseUser(
    authUser?.attributes.email as string,
    !!authUser && !isAuthLoading
  );
	
  const { data: project, isPending, refetch } = useGetProject(id as string);

  type CarouselImage =
  | { type: "url"; value: string }
  | { type: "file"; value: File };

  const [images, setImages] = useState<CarouselImage[]>([]);

  useEffect(() => {
    if (!project?.screenshots) return;

    setImages(
      project.screenshots.map((url) => ({
        type: "url",
        value: url,
      }))
    );
  }, [project]);

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
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetAsMainImage = (index: number) => {
    setImages((prev) => {
      if (index === 0) return prev;

      const main = prev[index];

      return [
        main,
        ...prev.filter((_, i) => i !== index),
      ];
    });
  };

  if (isPending) {
    return <FullPageSpinner />;
  }

  if (!project) {
    return <ErrorFallback refetch={refetch} />;
  }

  const canEdit =
    currentUser &&
    (
      currentUser.role === "ADMIN" ||
      project.users?.some((u) => u.id === currentUser.id)
    );
  
  if (!canEdit) {
    return <Navigate to={`/projects/${project.id}`} replace />;
  }
	
  const hasLinks = project.repo || project.presentation;
  return (
    <div className="flex flex-col justify-between gap-2 max-w-7xl w-full">
      <UpdatableTitle previousValue={project.title} projectId={id as string} />
      <Separator className="mb-2" />
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex lg:w-[75%] flex-col">
          <ProjectCarousel
            images={images}
            showControls={images.length > 1}
            onDeleteImage={handleDeleteImage}
            onSetMainImage={handleSetAsMainImage}
          >
            <FileUpload updateImages={updateImages} />
          </ProjectCarousel>
          <UpdatableDescription
            previousValue={project.description ?? ""}
            projectId={id as string}
          />
        </div>
        <div className="lg:w-[25%] flex flex-col gap-2 items-start">
          <div className="flex flex-col gap-3">
            <div className="flex gap-2 flex-wrap">
              <UpdatableDate
                projectId={id as string}
                previousValue={project.date?.name ?? null}
              />
              <UpdatableTrack
                projectId={id as string}
                previousValue={project.track?.name ?? null}
              />
              <UpdatableTags
                projectId={id as string}
                projectTags={project.tags}
              />
            </div>
            {hasLinks && (
              <div className="flex gap-2 items-center mb-2">
                <Link size={16} />
                <div className="flex flex-col gap-1">
                  <UpdatableRepo
                    projectId={id as string}
                    previousValue={project.repo ?? ""}
                  />
                  <UpdatablePresentation
                    projectId={id as string}
                    previousValue={project.presentation ?? ""}
                  />
                </div>
              </div>
            )}
          </div>
          <UpdatableProjectUsers
            projectId={id as string}
            projectUsers={project.users}
          />
          <UpdatableGrade
            projectId={id as string}
            previousValue={project.grade?.toString() ?? ""}
          />
        </div>
      </div>
    </div>
  );
}
