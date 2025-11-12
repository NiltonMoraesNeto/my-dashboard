import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { ProfileList } from "../model/profile-model";
import { deleteProfile } from "../services/profile";
import { isSuccessRequest } from "../utils/response-request";
import { ModalDeleteProfile } from "./modal-delete-profile";
import { ModalEditProfile } from "./modal-edit-profile";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface TableListProfileProps {
  profileList: ProfileList[];
  handleListData: () => void;
}

export function TableListProfile({ profileList, handleListData }: TableListProfileProps) {
  const [profileToDelete, setProfileToDelete] = useState<number | null>(null);
  const [profileToEdit, setProfileToEdit] = useState<ProfileList | null>(null);

  const openDeleteDialog = (id: number) => {
    setProfileToDelete(id);
  };

  const closeDeleteDialog = () => {
    setProfileToDelete(null);
  };

  const openEditDialog = (id: number, descricao: string) => {
    setProfileToEdit({
      id,
      descricao,
    });
  };

  const closeEditDialog = () => {
    setProfileToEdit(null);
  };

  async function onDelete(id: number) {
    try {
      const response = await deleteProfile(id);
      if (response && isSuccessRequest(response.status)) {
        toast.success("Sucesso", {
          description: "Perfil deletado com sucesso",
        });
        closeDeleteDialog();
        handleListData();
      } else {
        toast.error("Error", {
          description: "Erro ao deletar o Perfil",
        });
      }
    } catch (error) {
      console.error("Erro ao deletar perfil:", error);
      toast.error("Error", {
        description: "Erro ao deletar o Perfil",
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
            <th className="w-4/6 py-3 px-4 border-b border-gray-200 dark:border-indigo-800 dark:bg-indigo-600 dark:text-indigo-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
              Nome do Perfil
            </th>
            <th className="w-1/6 py-3 px-4 border-b border-gray-200 dark:border-indigo-800 dark:bg-indigo-600 dark:text-indigo-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
              Ação
            </th>
          </tr>
        </thead>
        <tbody>
          {profileList?.map((profile) => (
            <tr key={profile.id} className="hover:bg-gray-100 dark:hover:bg-indigo-700">
              <td className="w-1/6 py-2 px-4 border-b border-gray-200 dark:border-indigo-800 text-left text-sm text-gray-900 dark:text-indigo-300">
                {profile.id}
              </td>
              <td className="w-4/6 py-2 px-4 border-b border-gray-200 dark:border-indigo-800 text-left text-sm text-gray-900 dark:text-indigo-300">
                {profile.descricao}
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
                        openEditDialog(profile.id, profile.descricao);
                      }}
                    >
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                        openDeleteDialog(profile.id);
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

      <ModalEditProfile
        profileToEdit={profileToEdit}
        closeEditDialog={closeEditDialog}
        handleListData={handleListData}
      />

      <ModalDeleteProfile
        profileToDelete={profileToDelete}
        closeDeleteDialog={closeDeleteDialog}
        onDelete={onDelete}
      />
    </div>
  );
}
