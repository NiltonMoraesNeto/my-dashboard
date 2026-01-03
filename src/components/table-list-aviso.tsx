import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import type { AvisoList } from "../model/aviso-model";
import { deleteAviso, marcarAvisoComoLido } from "../services/avisos";
import { isSuccessRequest } from "../utils/response-request";
import { ModalDeleteAviso } from "./modal-delete-aviso";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface TableAvisosListProps {
  avisoList: AvisoList[];
  handleListData: () => void;
  onMarkAsRead?: () => void;
}

export function TableAvisosList({
  avisoList,
  handleListData,
  onMarkAsRead,
}: TableAvisosListProps) {
  const [avisoToDelete, setAvisoToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  const openDeleteDialog = (id: string) => {
    setAvisoToDelete(id);
  };

  const closeDeleteDialog = () => {
    setAvisoToDelete(null);
  };

  async function onDelete(id: string) {
    try {
      const response = await deleteAviso(id);
      if (response && isSuccessRequest(response.status)) {
        toast.success("Sucesso", {
          description: "Aviso deletado com sucesso",
        });
        closeDeleteDialog();
        handleListData();
      } else {
        toast.error("Error", {
          description: "Erro ao deletar o aviso",
        });
      }
    } catch (error: unknown) {
      console.error("Erro ao deletar aviso:", error);
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Erro ao deletar o aviso";
      toast.error("Error", {
        description: message,
      });
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      await marcarAvisoComoLido(id);
      handleListData();
      if (onMarkAsRead) {
        onMarkAsRead();
      }
    } catch (error: unknown) {
      console.error("Erro ao marcar aviso como lido:", error);
      toast.error("Erro ao marcar aviso como lido");
    }
  };

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
              <th className="w-1/12 py-3 px-4 border-b border-gray-200 dark:border-emerald-800 dark:bg-emerald-600 dark:text-emerald-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
                Lido
              </th>
              <th className="w-2/6 py-3 px-4 border-b border-gray-200 dark:border-emerald-800 dark:bg-emerald-600 dark:text-emerald-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
                Título
              </th>
              <th className="w-2/6 py-3 px-4 border-b border-gray-200 dark:border-emerald-800 dark:bg-emerald-600 dark:text-emerald-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
                Descrição
              </th>
              <th className="w-1/6 py-3 px-4 border-b border-gray-200 dark:border-emerald-800 dark:bg-emerald-600 dark:text-emerald-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
                Tipo
              </th>
              <th className="w-1/6 py-3 px-4 border-b border-gray-200 dark:border-emerald-800 dark:bg-emerald-600 dark:text-emerald-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
                Data Início
              </th>
              <th className="w-1/6 py-3 px-4 border-b border-gray-200 dark:border-emerald-800 dark:bg-emerald-600 dark:text-emerald-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
                Ação
              </th>
            </tr>
          </thead>
          <tbody>
            {avisoList?.map((aviso) => (
              <tr
                key={aviso.id}
                className={`hover:bg-gray-50 dark:hover:bg-emerald-700 transition-colors cursor-pointer ${
                  !aviso.lido ? "bg-blue-50 dark:bg-emerald-700/50" : ""
                }`}
                onClick={() => {
                  if (!aviso.lido) {
                    handleMarkAsRead(aviso.id);
                  }
                }}
              >
                <td className="py-3 px-4 border-b border-gray-200 dark:border-emerald-700 text-gray-900 dark:text-emerald-100 text-sm">
                  {aviso.lido ? (
                    <span className="text-green-500">✓</span>
                  ) : (
                    <span className="text-blue-500 font-bold">●</span>
                  )}
                </td>
                <td className="py-3 px-4 border-b border-gray-200 dark:border-emerald-700 text-gray-900 dark:text-emerald-100 text-sm">
                  <div className="flex items-center gap-2">
                    {aviso.titulo}
                    {aviso.destaque && (
                      <span className="bg-yellow-500 text-white text-xs px-2 py-0.5 rounded">
                        Destaque
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 border-b border-gray-200 dark:border-emerald-700 text-gray-900 dark:text-emerald-100 text-sm">
                  {aviso.descricao.length > 50
                    ? `${aviso.descricao.substring(0, 50)}...`
                    : aviso.descricao}
                </td>
                <td className="py-3 px-4 border-b border-gray-200 dark:border-emerald-700 text-gray-900 dark:text-emerald-100 text-sm">
                  {aviso.tipo || "-"}
                </td>
                <td className="py-3 px-4 border-b border-gray-200 dark:border-emerald-700 text-gray-900 dark:text-emerald-100 text-sm">
                  {formatDate(aviso.dataInicio)}
                </td>
                <td className="py-3 px-4 border-b border-gray-200 dark:border-emerald-700 text-gray-900 dark:text-emerald-100 text-sm">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <EllipsisVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate({
                            to: `/condominio/avisos/${aviso.id}/edit`,
                          });
                        }}
                      >
                        Editar
                      </DropdownMenuItem>
                      {!aviso.lido && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(aviso.id);
                          }}
                        >
                          Marcar como lido
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteDialog(aviso.id);
                        }}
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
        {avisoList?.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-emerald-200">
            Nenhum aviso encontrado.
          </div>
        )}
      </div>
      <ModalDeleteAviso
        avisoToDelete={avisoToDelete}
        closeDeleteDialog={closeDeleteDialog}
        onDelete={onDelete}
      />
    </>
  );
}
