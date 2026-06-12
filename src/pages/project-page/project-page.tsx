import { useParams } from "react-router";
import { Badge } from "@/shared/ui/badge";
import { Separator } from "@/shared/ui/separator";
import { useGetProject } from "./api/hooks/use-get-project";
import { Spinner } from "@/shared/ui/spinner";
import { Link } from "lucide-react";
import { MemberList } from "./components/member-list";
import { StaticRichEditor } from "@/shared/ui/editors/static-rich-editor";
import { ErrorFallback } from "@/shared/ui/error-fallback";
import { ProjectCarousel } from "@/shared/widgets/project-carousel";
import { Pencil } from "lucide-react";
import { useAuth } from "@/shared/hooks/use-auth";
import { useGetDatabaseUser } from "@/pages/create-project-page/api/hooks/use-get-database-user";
import { Link as RouterLink } from "react-router";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router";
import { useDeleteProject } from "./api/hooks/use-delete-project";

export function ProjectPage() {
  const { id } = useParams();
  const { data: project, isPending, refetch } = useGetProject(id as string);
  const { authUser, isAuthLoading } = useAuth();
  const { data: currentUser } = useGetDatabaseUser(
	  authUser?.attributes.email as string,
	  !!authUser && !isAuthLoading
  );
  const navigate = useNavigate();
  const deleteProjectMutation = useDeleteProject();
  if (isPending) {
    return (
      <div className="flex items-center justify-center absolute top-0 left-0 h-svh -z-10 w-full bg-background">
        <Spinner className="relative z-50 text-foreground" size={30} />
      </div>
    );
  }
  if (!project) {
    return <ErrorFallback refetch={refetch} />;
  }

  const canEdit =
    currentUser &&
    (
      currentUser.role.id === 4 ||
      project.users?.some((u) => u.id === currentUser.id)
    );
  
  const hasLinks = project.repo || project.presentation;

  const handleDeleteProject = async () => {
    const confirmed = window.confirm(
      `Удалить проект "${project.title}"?`
    );

    if (!confirmed) return;

    try {
      await deleteProjectMutation.mutateAsync(project.id.toString());

      navigate("/projects");
    } catch {
      alert("Не удалось удалить проект");
    }
  };

  return (
    <div className="flex flex-col justify-between gap-2 max-w-7xl w-full">
      <div className="flex items-center gap-2 max-w-[100%]">
  	    <h1 className="w-full mb-1">{project.title}</h1>
          <div className="flex items-center gap-2">
            <RouterLink to={`/edit/projects/${project.id}`}>
              <Pencil
                size={20}
                className="cursor-pointer hover:opacity-70"
              />
            </RouterLink>

            <Trash2
              size={20}
              className="cursor-pointer text-destructive hover:opacity-70"
              onClick={handleDeleteProject}
            />
          </div>
      </div>      
      <Separator className="mb-2" />
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex lg:w-[75%] flex-col">
          {project.mainScreenshot && project.screenshots && (
            <ProjectCarousel
              images={project.screenshots.map((url) => ({
                type: "url" as const,
                value: url,
              }))}
              showControls={project.screenshots.length > 1}
            />
          )}
          <StaticRichEditor
            className="mt-2"
            content={
              project.description
                ? project.description
                : "У этого проекта нет описания"
            }
          />
        </div>
        <div className="lg:w-[25%] flex flex-col gap-2 items-start">
          <div className="flex flex-col gap-3">
            <div className="flex gap-2 flex-wrap">
              {project.date && <Badge>{project.date.name}</Badge>}
              {project.track && <Badge>{project.track.name}</Badge>}
              {project.tags &&
                project.tags.map((tag) => (
                  <Badge variant="secondary" key={tag.id}>
                    {tag.name}
                  </Badge>
                ))}
            </div>
            {hasLinks && (
              <div className="flex gap-2 items-center mb-2">
                <Link size={20} className="shrink-0" />
                <div className="flex flex-col">
                  {project.repo && (
                    <a
                      className="break-all line-clamp-1 hover:underline"
                      href={project.repo}
                    >
                      {project.repo}
                    </a>
                  )}
                  {project.presentation && (
                    <a
                      className="break-all line-clamp-1 hover:underline"
                      href={project.presentation}
                    >
                      {project.presentation}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
          <MemberList users={project.users} isEditable={false} />
          {project.grade && (
            <span className="text-center py-1 pl-2">
              Оценка проекта: {project.grade}/100
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
