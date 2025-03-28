"use client";

import type React from "react";

import { useState } from "react";
import { EllipsisVertical } from "lucide-react";
import type { ProfileList } from "../model/profile-model";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { deleteProfile } from "../services/profile";
import { toast } from "sonner";
import { isSuccessRequest } from "../utils/response-request";

interface TableListProfileProps {
  profileList: ProfileList[];
  setPage: (value: React.SetStateAction<number>) => void;
}

export function TableListProfile({
  profileList,
  setPage,
}: TableListProfileProps) {
  const [profileToDelete, setProfileToDelete] = useState<number | null>(null);

  const openDeleteDialog = (id: number) => {
    setProfileToDelete(id);
  };

  const closeDeleteDialog = () => {
    setProfileToDelete(null);
  };

  async function onDelete(id: number) {
    try {
      const response = await deleteProfile(id);
      if (response && isSuccessRequest(response.status)) {
        toast.success("Sucesso", {
          description: "Perfil deletado com sucesso",
        });
        closeDeleteDialog();
        setPage(1);
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
            <tr
              key={profile.id}
              className="hover:bg-gray-100 dark:hover:bg-indigo-700"
            >
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
                    <DropdownMenuItem onSelect={() => console.log(profile.id)}>
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

      <Dialog
        open={profileToDelete !== null}
        onOpenChange={(open) => !open && closeDeleteDialog()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deletar Perfil</DialogTitle>
            <DialogDescription asChild>
              <div className="w-full mx-auto">
                <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
                  <div className="relative px-6 pt-12 pb-6">
                    <div className="relative shrink-0 mb-2 text-red-500">
                      Essa ação não pode ser desfeita.
                    </div>
                    <div className="relative shrink-0 mb-2 text-red-500">
                      Tem certeza que deseja deletar o perfil?
                    </div>
                    <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-6" />
                    <Button
                      variant="destructive"
                      onClick={() =>
                        profileToDelete && onDelete(profileToDelete)
                      }
                    >
                      Deletar
                    </Button>
                  </div>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
