import { MemberList } from "@/pages/project-page/components/member-list";
import { useToast } from "@/shared/hooks/use-toast";
import { Users } from "@/shared/types/schemas";
import { useAddProjectUser } from "../api/hooks/use-add-project-user";
import { useDeleteProjectUser } from "../api/hooks/use-delete-project-user";
import { useState } from "react";
import { UsersSelect } from "@/pages/admin/components/users-select";
import { ConfirmButton } from "./confirm-button";
import { Button } from "@/shared/ui/button";

interface UpdateProjectUsers {
  projectId: string;
  projectUsers: Users;
}

export function UpdatableProjectUsers({
  projectId,
  projectUsers,
}: UpdateProjectUsers) {
  const { mutateAsync: mutateAddAsync, isPending } = useAddProjectUser();
  const { mutateAsync: mutateDeleteAsync } = useDeleteProjectUser();
  const [edit, setEdit] = useState(false);
  const [addedUserId, setAddedUserId] = useState<number | null>(null);
  const { toast } = useToast();

  const handleAddUser = async () => {
    try {
      if (addedUserId === null) { throw new Error("Не удалось получить участника"); }

      await mutateAddAsync({
        projectId,
        userId: addedUserId,
      });

      setAddedUserId(null);
      setEdit(false);
    } 
    catch (error) 
    {
      toast({
        title: "Не удалось добавить участника",
        description:
          error instanceof Error
            ? error.message
            : "Что-то пошло не так, попробуйте позже",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await mutateDeleteAsync({
        projectId,
        userId: userId,
      });
    } catch (error) {
      toast({
        title: "Не удалось удалить участника",
        description:
          error instanceof Error
            ? error.message
            : "Что-то пошло не так, попробуйте позже",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <MemberList
        onEditClick={() => setEdit(true)}
        users={projectUsers}
        isEditable
        onClick={handleDeleteUser}
      />
      {edit && (
        <div className="flex flex-col gap-2 w-full">
          <UsersSelect
            value={addedUserId}
            onValueChange={setAddedUserId}
          />
          <div className="flex gap-2 items-center">
            <ConfirmButton
              onConfirm={handleAddUser}
              isLoading={isPending}
              show
              disabled={addedUserId === null}
            />
            <Button onClick={() => setEdit(false)} variant="outline">
              Отменить
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
