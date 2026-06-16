import { useState } from "react";
import { Check, Trash2 } from "lucide-react";
import { UsersSelect } from "./components/users-select";
import { useGetAllUsers } from "./api/hooks/use-get-all-users";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { addAdmin } from "./api/add-admin";
import { deleteAdmin } from "./api/delete-admin";

interface AdminUser {
  id: number;
  fullName: string;
}

export function AdminAdmins() {
  const { data: users } = useGetAllUsers();

  const [selectedUser, setSelectedUser] = useState("");
  const [admins, setAdmins] = useState<AdminUser[]>([]);

  const handleAddAdmin = async () => {
  const user = users?.find(
    (user) => user.fullName === selectedUser
  );

  if (!user) return;

  const alreadyExists = admins.some(
    (admin) => admin.id === user.id
  );

  if (alreadyExists) return;

  await addAdmin(user.id);

  setAdmins((prev) => [
    ...prev,
    {
      id: user.id,
      fullName: user.fullName,
    },
  ]);

  setSelectedUser("");
};

const handleDeleteAdmin = async (id: number) => {
  await deleteAdmin(id);

  setAdmins((prev) =>
    prev.filter((admin) => admin.id !== id)
  );
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
            value={selectedUser ? [selectedUser] : []}
            onValueChange={setSelectedUser}
          />

          <Button
            size="icon"
            onClick={handleAddAdmin}
            disabled={!selectedUser}
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