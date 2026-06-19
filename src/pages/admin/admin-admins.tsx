import { useState } from "react";
import { Check, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { UsersSelect } from "./components/users-select";
import { useGetAllUsers } from "./api/hooks/use-get-all-users";
import { addAdmin } from "./api/add-admin";
import { deleteAdmin } from "./api/delete-admin";

import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

export function AdminAdmins() {
  const queryClient = useQueryClient();

  const { data: users = [] } = useGetAllUsers();
  
  const [selectedUser, setSelectedUser] =
    useState<number | null>(null);

  const admins = users.filter(
    (user) => user.role.id === 4
  );

  const handleAddAdmin = async () => {
    const user = users.find(
      (user) => user.id === selectedUser
    );

    if (!user) return;

    const alreadyExists = admins.some(
      (admin) => admin.id === user.id
    );

    if (alreadyExists) return;

    await addAdmin(user.id);

    await queryClient.invalidateQueries({
      queryKey: ["users"],
    });

    setSelectedUser(null);
  };

  const handleDeleteAdmin = async (
    id: number
  ) => {
    await deleteAdmin(id);

    await queryClient.invalidateQueries({
      queryKey: ["users"],
    });
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <div className="flex justify-center items-center gap-2">
          <CardTitle>
            Управление администраторами
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex justify-center items-center gap-2">
          <UsersSelect
            value={
              selectedUser !== null
                ? [selectedUser]
                : []
            }
            onValueChange={setSelectedUser}
          />

          <Button
            size="icon"
            onClick={handleAddAdmin}
            disabled={selectedUser === null}
          >
            <Check />
          </Button>
        </div>

        <div className="space-y-2">
          {admins.map((admin) => (
            <div
              key={admin.id}
              className="flex items-center justify-between border rounded-md p-3"
            >
              <span>{admin.fullName}</span>

              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  handleDeleteAdmin(admin.id)
                }
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}