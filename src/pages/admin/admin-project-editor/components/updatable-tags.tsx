import { useState } from "react";
import { useToast } from "@/shared/hooks/use-toast";
import { useAddProjectTag } from "../api/hooks/use-add-project-tag";
import { useDeleteProjectTag } from "../api/hooks/use-delete-project-tag";
import { Badge } from "@/shared/ui/badge";
import { Tags } from "@/shared/types/schemas";
import { Spinner } from "@/shared/ui/spinner";
import { TagsSelect } from "@/shared/widgets/tags-select";
import { ConfirmButton } from "./confirm-button";
import { Button } from "@/shared/ui/button";

interface UpdatableTitleProps {
  projectId: string;
  projectTags: Tags | null;
}

export function UpdatableTags({ projectId, projectTags }: UpdatableTitleProps) {
  const { toast } = useToast();

  const { mutateAsync: mutateAddAsync, isPending: isAddPending } =
    useAddProjectTag();
  const { mutateAsync: mutateDeleteAsync, isPending: isDeletePending } =
    useDeleteProjectTag();

  const [edit, setEdit] = useState(false);
  const [tagIds, setTag] = useState<number[]>([]);

  const handleAddTag = async () => {
    try {
      if (tagIds.length === 0) {
        throw new Error("Не удалось получить тег");
      }
      await mutateAddAsync({
        projectId,
        tagId: tagIds[0],
      });
      setTag([]);
      setEdit(false);
    } catch (error) {
      toast({
        title: "Не удалось добавить тег",
        description:
          error instanceof Error
            ? error.message
            : "Что-то пошло не так, попробуйте позже",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTag = async (tagId: number) => {
    try {
      await mutateDeleteAsync({
        projectId,
        tagId,
      });
    } catch (error) {
      toast({
        title: "Не удалось удалить тег",
        description:
          error instanceof Error
            ? error.message
            : "Что-то пошло не так, попробуйте позже",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-2 flex-wrap w-full">
      {projectTags &&
        projectTags?.map((tag) => (
          <Badge
            onClick={() => handleDeleteTag(tag.id)}
            variant="secondary"
            key={tag.id}
            className="cursor-pointer"
          >
            {isDeletePending ? (
              <Spinner className="text-primary-foreground" />
            ) : (
              tag.name
            )}
          </Badge>
        ))}
      {!edit && (
        <Badge
          className="cursor-pointer"
          variant="secondary"
          onClick={() => setEdit(true)}
        >
          Добавить тег
        </Badge>
      )}
      {edit && (
        <div className="w-full">
          <TagsSelect
            value={tagIds}
            onValueChange={(id) => setTag([id])}
            triggerClassName="mb-1 w-full"
          />
          <div className="flex gap-2 items-center w-full">
            <ConfirmButton
              isLoading={isAddPending}
              onConfirm={handleAddTag}
              disabled={tagIds.length === 0}
            />
            <Button onClick={() => setEdit(false)} variant="outline">
              Отменить
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
