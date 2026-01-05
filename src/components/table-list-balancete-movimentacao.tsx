import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import type { BalanceteMovimentacaoList } from "../model/balancete-movimentacao-model";
import { deleteBalanceteMovimentacao } from "../services/balancete-movimentacoes";
import { isSuccessRequest } from "../utils/response-request";
import { ModalDeleteBalanceteMovimentacao } from "./modal-delete-balancete-movimentacao";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface TableBalanceteMovimentacoesListProps {
  movimentacaoList: BalanceteMovimentacaoList[];
  handleListData: () => void;
}

export function TableBalanceteMovimentacoesList({
  movimentacaoList,
  handleListData,
}: TableBalanceteMovimentacoesListProps) {
  const { t } = useTranslation();
  const [movimentacaoToDelete, setMovimentacaoToDelete] = useState<
    string | null
  >(null);
  const navigate = useNavigate();

  const openDeleteDialog = (id: string) => {
    setMovimentacaoToDelete(id);
  };

  const closeDeleteDialog = () => {
    setMovimentacaoToDelete(null);
  };

  async function onDelete(id: string) {
    try {
      const response = await deleteBalanceteMovimentacao(id);
      if (response && isSuccessRequest(response.status)) {
        toast.success(t("common.success"), {
          description: t("condominio.balancete.movimentacao.table.successDelete"),
        });
        closeDeleteDialog();
        handleListData();
      } else {
        toast.error(t("common.error"), {
          description: t("condominio.balancete.movimentacao.table.errorDelete"),
        });
      }
    } catch (error: unknown) {
      console.error("Erro ao deletar movimentação:", error);
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || t("condominio.balancete.movimentacao.table.errorDelete");
      toast.error(t("common.error"), {
        description: message,
      });
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getTipoColor = (tipo: string) => {
    return tipo === "Entrada"
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed bg-white dark:bg-emerald-600 rounded-lg overflow-hidden shadow-lg">
          <thead>
            <tr>
              <th className="w-1/6 py-3 px-4 border-b border-gray-200 dark:border-emerald-800 dark:bg-emerald-600 dark:text-emerald-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
                {t("condominio.balancete.movimentacao.table.tipo")}
              </th>
              <th className="w-1/6 py-3 px-4 border-b border-gray-200 dark:border-emerald-800 dark:bg-emerald-600 dark:text-emerald-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
                {t("condominio.balancete.movimentacao.table.data")}
              </th>
              <th className="w-1/6 py-3 px-4 border-b border-gray-200 dark:border-emerald-800 dark:bg-emerald-600 dark:text-emerald-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
                {t("condominio.balancete.movimentacao.table.valor")}
              </th>
              <th className="w-1/2 py-3 px-4 border-b border-gray-200 dark:border-emerald-800 dark:bg-emerald-600 dark:text-emerald-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
                {t("condominio.balancete.movimentacao.table.motivo")}
              </th>
              <th className="w-1/12 py-3 px-4 border-b border-gray-200 dark:border-emerald-800 dark:bg-emerald-600 dark:text-emerald-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
                {t("condominio.balancete.movimentacao.table.acao")}
              </th>
            </tr>
          </thead>
          <tbody>
            {movimentacaoList?.map((movimentacao) => (
              <tr
                key={movimentacao.id}
                className="hover:bg-gray-50 dark:hover:bg-emerald-700 transition-colors"
              >
                <td className="py-3 px-4 border-b border-gray-200 dark:border-emerald-700 text-gray-900 dark:text-emerald-100 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getTipoColor(movimentacao.tipo)}`}
                  >
                    {movimentacao.tipo}
                  </span>
                </td>
                <td className="py-3 px-4 border-b border-gray-200 dark:border-emerald-700 text-gray-900 dark:text-emerald-100 text-sm">
                  {formatDate(movimentacao.data)}
                </td>
                <td className="py-3 px-4 border-b border-gray-200 dark:border-emerald-700 text-gray-900 dark:text-emerald-100 text-sm font-semibold">
                  {formatCurrency(movimentacao.valor)}
                </td>
                <td className="py-3 px-4 border-b border-gray-200 dark:border-emerald-700 text-gray-900 dark:text-emerald-100 text-sm">
                  {movimentacao.motivo}
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
                        onClick={() =>
                          navigate({
                            to: `/condominio/balancete/movimentacoes/${movimentacao.id}/edit`,
                          })
                        }
                      >
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => openDeleteDialog(movimentacao.id)}
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
        {movimentacaoList?.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-emerald-200">
            {t("condominio.balancete.movimentacao.table.emptyMessage")}
          </div>
        )}
      </div>
      <ModalDeleteBalanceteMovimentacao
        movimentacaoToDelete={movimentacaoToDelete}
        closeDeleteDialog={closeDeleteDialog}
        onDelete={onDelete}
      />
    </>
  );
}
