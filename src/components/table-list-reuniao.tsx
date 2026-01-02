import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import type { ReuniaoList } from "../model/reuniao-model";
import { deleteReuniao } from "../services/reunioes";
import { isSuccessRequest } from "../utils/response-request";
import { ModalDeleteReuniao } from "./modal-delete-reuniao";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface TableReunioesListProps {
  reuniaoList: ReuniaoList[];
  handleListData: () => void;
}

export function TableReunioesList({ reuniaoList, handleListData }: TableReunioesListProps) {
  const [reuniaoToDelete, setReuniaoToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  const openDeleteDialog = (id: string) => {
    setReuniaoToDelete(id);
  };

  const closeDeleteDialog = () => {
    setReuniaoToDelete(null);
  };

  async function onDelete(id: string) {
    try {
      const response = await deleteReuniao(id);
      if (response && isSuccessRequest(response.status)) {
        toast.success("Sucesso", {
          description: "Reunião deletada com sucesso",
        });
        closeDeleteDialog();
        handleListData();
      } else {
        toast.error("Error", {
          description: "Erro ao deletar a reunião",
        });
      }
    } catch (error: any) {
      console.error("Erro ao deletar reunião:", error);
      const message = error?.response?.data?.message || "Erro ao deletar a reunião";
      toast.error("Error", {
        description: message,
      });
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed bg-white dark:bg-emerald-600 rounded-lg overflow-hidden shadow-lg">
          <thead>
            <tr>
              <th className="w-2/6 py-3 px-4 border-b border-gray-200 dark:border-emerald-800 dark:bg-emerald-600 dark:text-emerald-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
                Título
              </th>
              <th className="w-1/6 py-3 px-4 border-b border-gray-200 dark:border-emerald-800 dark:bg-emerald-600 dark:text-emerald-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
                Data
              </th>
              <th className="w-1/6 py-3 px-4 border-b border-gray-200 dark:border-emerald-800 dark:bg-emerald-600 dark:text-emerald-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
                Hora
              </th>
              <th className="w-1/6 py-3 px-4 border-b border-gray-200 dark:border-emerald-800 dark:bg-emerald-600 dark:text-emerald-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
                Tipo
              </th>
              <th className="w-1/6 py-3 px-4 border-b border-gray-200 dark:border-emerald-800 dark:bg-emerald-600 dark:text-emerald-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
                Status
              </th>
              <th className="w-1/6 py-3 px-4 border-b border-gray-200 dark:border-emerald-800 dark:bg-emerald-600 dark:text-emerald-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
                Ação
              </th>
            </tr>
          </thead>
          <tbody>
            {reuniaoList?.map((reuniao) => (
              <tr
                key={reuniao.id}
                className="hover:bg-gray-50 dark:hover:bg-emerald-700 transition-colors"
              >
                <td className="py-3 px-4 border-b border-gray-200 dark:border-emerald-700 text-gray-900 dark:text-emerald-100 text-sm">
                  {reuniao.titulo}
                </td>
                <td className="py-3 px-4 border-b border-gray-200 dark:border-emerald-700 text-gray-900 dark:text-emerald-100 text-sm">
                  {formatDate(reuniao.data)}
                </td>
                <td className="py-3 px-4 border-b border-gray-200 dark:border-emerald-700 text-gray-900 dark:text-emerald-100 text-sm">
                  {reuniao.hora}
                </td>
                <td className="py-3 px-4 border-b border-gray-200 dark:border-emerald-700 text-gray-900 dark:text-emerald-100 text-sm">
                  {reuniao.tipo || "-"}
                </td>
                <td className="py-3 px-4 border-b border-gray-200 dark:border-emerald-700 text-gray-900 dark:text-emerald-100 text-sm">
                  {reuniao.status || "-"}
                </td>
                <td className="py-3 px-4 border-b border-gray-200 dark:border-emerald-700 text-gray-900 dark:text-emerald-100 text-sm">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <EllipsisVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => navigate({ to: `/condominio/reunioes/${reuniao.id}/edit` })}
                      >
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => openDeleteDialog(reuniao.id)}
                        className="text-red-600"
                      >
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {reuniaoList?.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-emerald-200">
            Nenhuma reunião encontrada.
          </div>
        )}
      </div>
      <ModalDeleteReuniao
        reuniaoToDelete={reuniaoToDelete}
        closeDeleteDialog={closeDeleteDialog}
        onDelete={onDelete}
      />
    </>
  );
}

