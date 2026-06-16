import { useState } from "react";
import { useUpdateProjectTitle } from "../api/hooks/use-update-project-title";
import { Input } from "@/shared/ui/input";
import { ConfirmButton } from "./confirm-button";
import { useToast } from "@/shared/hooks/use-toast";

interface UpdatableTitleProps {
  previousValue?: string;
  projectId: string;
}

export function UpdatableTitle({
  previousValue,
  projectId,
}: UpdatableTitleProps) {
  const { mutateAsync, isPending } = useUpdateProjectTitle();
  const { toast } = useToast();
  const [title, setTitle] = useState<string | null>(null);

  const currentTitle = title !== null ? title : previousValue ?? "";

  const handleTitleChange = async () => {
    try {
      await mutateAsync({
        projectId,
        title: currentTitle,
      });
    } catch (error) {
      toast({
        title: "Не удалось изменить заголовок",
        description:
          error instanceof Error
            ? error.message
            : "Что-то пошло не так, попробуйте позже",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-2 max-w-[75%]">
      <Input
        placeholder="Введите имя вашего проекта..."
        className="border-none shadow-none w-full lg:max-w-[505px] leading-tight font-semibold text-xl"
        value={currentTitle}
        onChange={(e) => setTitle(e.target.value)}
      />
      <ConfirmButton
        show={!!currentTitle && currentTitle !== previousValue}
        isLoading={isPending}
        onConfirm={handleTitleChange}
      />
    </div>
  );
}
