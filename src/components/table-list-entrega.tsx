import { EllipsisVertical, Download } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import type { Entrega } from "../services/entregas";
import { deleteEntrega, downloadEntregaAnexo } from "../services/entregas";
import { ModalDeleteEntrega } from "./modal-delete-entrega";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface TableEntregasListProps {
  entregaList: Entrega[];
  handleListData: () => void;
}

export function TableEntregasList({
  entregaList,
  handleListData,
}: TableEntregasListProps) {
  const { t } = useTranslation();
  const [entregaToDelete, setEntregaToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  const openDeleteDialog = (id: string) => {
    setEntregaToDelete(id);
  };

  const closeDeleteDialog = () => {
    setEntregaToDelete(null);
  };

  async function onDelete(id: string) {
    try {
      await deleteEntrega(id);
      toast.success(t("common.success"), {
        description: "Entrega excluída com sucesso",
      });
      closeDeleteDialog();
      handleListData();
    } catch (error: unknown) {
      console.error("Erro ao excluir entrega:", error);
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Erro ao excluir entrega";
      toast.error(t("common.error"), {
        description: message,
      });
    }
  }

  const handleDownloadAnexo = async (id: string) => {
    try {
      await downloadEntregaAnexo(id);
      toast.success("Anexo baixado com sucesso");
    } catch (error) {
      console.error("Erro ao baixar anexo:", error);
      toast.error("Erro ao baixar anexo");
    }
  };

  const getRecebidoPorLabel = (recebidoPor: string) => {
    switch (recebidoPor) {
      case "portaria":
        return "Portaria";
      case "zelador":
        return "Zelador";
      case "morador":
        return "Morador";
      default:
        return recebidoPor;
    }
  };

  if (entregaList.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        Nenhuma entrega encontrada.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-fixed bg-white dark:bg-emerald-600 rounded-lg overflow-hidden shadow-lg">
        <thead>
          <tr>
            <th className="w-1/6 py-3 px-4 border-b border-gray-200 dark:border-emerald-800 dark:bg-emerald-600 dark:text-emerald-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
              Título
            </th>
            <th className="w-1/6 py-3 px-4 border-b border-gray-200 dark:border-emerald-800 dark:bg-emerald-600 dark:text-emerald-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
              Data e Hora
            </th>
            <th className="w-1/6 py-3 px-4 border-b border-gray-200 dark:border-emerald-800 dark:bg-emerald-600 dark:text-emerald-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
              Recebedor
            </th>
            <th className="w-1/6 py-3 px-4 border-b border-gray-200 dark:border-emerald-800 dark:bg-emerald-600 dark:text-emerald-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
              Recebido Por
            </th>
            <th className="w-1/6 py-3 px-4 border-b border-gray-200 dark:border-emerald-800 dark:bg-emerald-600 dark:text-emerald-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
              Unidade
            </th>
            <th className="w-1/12 py-3 px-4 border-b border-gray-200 dark:border-emerald-800 dark:bg-emerald-600 dark:text-emerald-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
              Anexo
            </th>
            <th className="w-1/12 py-3 px-4 border-b border-gray-200 dark:border-emerald-800 dark:bg-emerald-600 dark:text-emerald-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
              Ação
            </th>
          </tr>
        </thead>
        <tbody>
          {entregaList.map((entrega) => (
            <tr
              key={entrega.id}
              className="hover:bg-gray-100 dark:hover:bg-emerald-700"
            >
              <td className="w-1/6 py-2 px-4 border-b border-gray-200 dark:border-emerald-800 text-left text-sm text-gray-900 dark:text-emerald-300">
                {entrega.titulo}
              </td>
              <td className="w-1/6 py-2 px-4 border-b border-gray-200 dark:border-emerald-800 text-left text-sm text-gray-900 dark:text-emerald-300">
                {new Date(entrega.dataHora).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}{" "}
                {new Date(entrega.dataHora).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
              <td className="w-1/6 py-2 px-4 border-b border-gray-200 dark:border-emerald-800 text-left text-sm text-gray-900 dark:text-emerald-300">
                {entrega.nomeRecebedor}
              </td>
              <td className="w-1/6 py-2 px-4 border-b border-gray-200 dark:border-emerald-800 text-left text-sm text-gray-900 dark:text-emerald-300">
                {getRecebidoPorLabel(entrega.recebidoPor)}
              </td>
              <td className="w-1/6 py-2 px-4 border-b border-gray-200 dark:border-emerald-800 text-left text-sm text-gray-900 dark:text-emerald-300">
                {entrega.unidade?.numero}
                {entrega.unidade?.bloco && ` - Bloco ${entrega.unidade.bloco}`}
                {entrega.unidade?.apartamento && ` - Apt ${entrega.unidade.apartamento}`}
              </td>
              <td className="w-1/12 py-2 px-4 border-b border-gray-200 dark:border-emerald-800 text-left text-sm text-gray-900 dark:text-emerald-300">
                {entrega.anexo && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownloadAnexo(entrega.id)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}
              </td>
              <td className="w-1/12 py-2 px-4 border-b border-gray-200 dark:border-emerald-800 text-left text-sm text-gray-900 dark:text-emerald-300">
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
                          to: "/condominio/entregas/$id/edit",
                          params: { id: entrega.id },
                        });
                      }}
                    >
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                        openDeleteDialog(entrega.id);
                      }}
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
      <ModalDeleteEntrega
        entregaToDelete={entregaToDelete}
        closeDeleteDialog={closeDeleteDialog}
        onDelete={onDelete}
      />
    </div>
  );
}
