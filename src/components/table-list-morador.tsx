import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import type { MoradorList } from "../model/morador-model";
import { deleteMorador } from "../services/moradores";
import { isSuccessRequest } from "../utils/response-request";
import { ModalDeleteMorador } from "./modal-delete-morador";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface TableMoradoresListProps {
  moradorList: MoradorList[];
  handleListData: () => void;
}

export function TableMoradoresList({
  moradorList,
  handleListData,
}: TableMoradoresListProps) {
  const [moradorToDelete, setMoradorToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  const openDeleteDialog = (id: string) => {
    setMoradorToDelete(id);
  };

  const closeDeleteDialog = () => {
    setMoradorToDelete(null);
  };

  async function onDelete(id: string) {
    try {
      const response = await deleteMorador(id);
      if (response && isSuccessRequest(response.status)) {
        toast.success("Sucesso", {
          description: "Morador deletado com sucesso",
        });
        closeDeleteDialog();
        handleListData();
      } else {
        toast.error("Error", {
          description: "Erro ao deletar o morador",
        });
      }
    } catch (error: unknown) {
      console.error("Erro ao deletar morador:", error);
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Erro ao deletar o morador";
      toast.error("Error", {
        description: message,
      });
    }
  }
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-fixed bg-white dark:bg-emerald-600 rounded-lg overflow-hidden shadow-lg">
        <thead>
          <tr>
            <th className="w-2/6 py-3 px-4 border-b border-gray-200 dark:border-emerald-800 dark:bg-emerald-600 dark:text-emerald-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
              Nome do Morador
            </th>
            <th className="w-2/6 py-3 px-4 border-b border-gray-200 dark:border-emerald-800 dark:bg-emerald-600 dark:text-emerald-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
              Email
            </th>
            <th className="w-1/6 py-3 px-4 border-b border-gray-200 dark:border-emerald-800 dark:bg-emerald-600 dark:text-emerald-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
              CEP
            </th>
            <th className="w-1/6 py-3 px-4 border-b border-gray-200 dark:border-emerald-800 dark:bg-emerald-600 dark:text-emerald-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
              Data de Criação
            </th>
            <th className="w-1/6 py-3 px-4 border-b border-gray-200 dark:border-emerald-800 dark:bg-emerald-600 dark:text-emerald-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
              Ação
            </th>
          </tr>
        </thead>
        <tbody>
          {moradorList?.map((morador) => (
            <tr
              key={morador.id}
              className="hover:bg-gray-100 dark:hover:bg-emerald-700"
            >
              <td className="w-2/6 py-2 px-4 border-b border-gray-200 dark:border-emerald-800 text-left text-sm text-gray-900 dark:text-emerald-300">
                {morador.nome}
              </td>
              <td className="w-2/6 py-2 px-4 border-b border-gray-200 dark:border-emerald-800 text-left text-sm text-gray-900 dark:text-emerald-300">
                {morador.email}
              </td>
              <td className="w-1/6 py-2 px-4 border-b border-gray-200 dark:border-emerald-800 text-left text-sm text-gray-900 dark:text-emerald-300">
                {morador.cep || "-"}
              </td>
              <td className="w-1/6 py-2 px-4 border-b border-gray-200 dark:border-emerald-800 text-left text-sm text-gray-900 dark:text-emerald-300">
                {new Date(morador.createdAt).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </td>
              <td className="w-1/6 py-2 px-4 border-b border-gray-200 dark:border-emerald-800 text-left text-sm text-gray-900 dark:text-emerald-300">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="link" className="dark:text-emerald-300">
                      <EllipsisVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                        navigate({
                          to: "/condominio/moradores/$id/edit",
                          params: { id: morador.id },
                        });
                      }}
                    >
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                        openDeleteDialog(morador.id);
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
      <ModalDeleteMorador
        moradorToDelete={moradorToDelete}
        closeDeleteDialog={closeDeleteDialog}
        onDelete={onDelete}
      />
    </div>
  );
}
