import { useState } from "react";
import { UserList } from "../model/user-model";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { EllipsisVertical } from "lucide-react";
import { deleteUser } from "../services/usuarios";
import { isSuccessRequest } from "../utils/response-request";
import { toast } from "sonner";
import { ModalDeleteUser } from "./modal-delete-user";

interface TableUsersListProps {
  userList: UserList[];
  handleListData: () => void;
}

export function TableUsersList({
  userList,
  handleListData,
}: TableUsersListProps) {
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const openDeleteDialog = (id: string) => {
    setUserToDelete(id);
  };

  const closeDeleteDialog = () => {
    setUserToDelete(null);
  };

  async function onDelete(id: string) {
    try {
      const response = await deleteUser(id);
      if (response && isSuccessRequest(response.status)) {
        toast.success("Sucesso", {
          description: "Usuário deletado com sucesso",
        });
        closeDeleteDialog();
        handleListData();
      } else {
        toast.error("Error", {
          description: "Erro ao deletar o Usuário",
        });
      }
    } catch (error) {
      console.error("Erro ao deletar Usuário:", error);
      toast.error("Error", {
        description: "Erro ao deletar o Usuário",
      });
    }
  }
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-fixed bg-white dark:bg-indigo-600 rounded-lg overflow-hidden shadow-lg">
        <thead>
          <tr>
            <th className="w-1/6 py-3 px-4 border-b border-gray-200 dark:border-indigo-800 dark:bg-indigo-600 dark:text-indigo-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
              ID
            </th>
            <th className="w-2/6 py-3 px-4 border-b border-gray-200 dark:border-indigo-800 dark:bg-indigo-600 dark:text-indigo-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
              Nome do Usuário
            </th>
            <th className="w-2/6 py-3 px-4 border-b border-gray-200 dark:border-indigo-800 dark:bg-indigo-600 dark:text-indigo-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
              Email
            </th>
            <th className="w-2/6 py-3 px-4 border-b border-gray-200 dark:border-indigo-800 dark:bg-indigo-600 dark:text-indigo-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
              Perfil
            </th>
            <th className="w-2/6 py-3 px-4 border-b border-gray-200 dark:border-indigo-800 dark:bg-indigo-600 dark:text-indigo-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
              CEP
            </th>
            <th className="w-1/6 py-3 px-4 border-b border-gray-200 dark:border-indigo-800 dark:bg-indigo-600 dark:text-indigo-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
              Ação
            </th>
          </tr>
        </thead>
        <tbody>
          {userList?.map((user) => (
            <tr
              key={user.id}
              className="hover:bg-gray-100 dark:hover:bg-indigo-700"
            >
              <td className="w-1/6 py-2 px-4 border-b border-gray-200 dark:border-indigo-800 text-left text-sm text-gray-900 dark:text-indigo-300">
                {user.id}
              </td>
              <td className="w-2/6 py-2 px-4 border-b border-gray-200 dark:border-indigo-800 text-left text-sm text-gray-900 dark:text-indigo-300">
                {user.nome}
              </td>
              <td className="w-2/6 py-2 px-4 border-b border-gray-200 dark:border-indigo-800 text-left text-sm text-gray-900 dark:text-indigo-300">
                {user.email}
              </td>
              <td className="w-2/6 py-2 px-4 border-b border-gray-200 dark:border-indigo-800 text-left text-sm text-gray-900 dark:text-indigo-300">
                {user.perfil}
              </td>
              <td className="w-2/6 py-2 px-4 border-b border-gray-200 dark:border-indigo-800 text-left text-sm text-gray-900 dark:text-indigo-300">
                {user.cep}
              </td>
              <td className="w-1/6 py-2 px-4 border-b border-gray-200 dark:border-indigo-800 text-left text-sm text-gray-900 dark:text-indigo-300">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="link" className="dark:text-indigo-300">
                      <EllipsisVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                        //openEditDialog(user.id, user.descricao);
                      }}
                    >
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                        openDeleteDialog(user.id);
                      }}
                    >
                      Deletar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ModalDeleteUser
        userToDelete={userToDelete}
        closeDeleteDialog={closeDeleteDialog}
        onDelete={onDelete}
      />
    </div>
  );
}
