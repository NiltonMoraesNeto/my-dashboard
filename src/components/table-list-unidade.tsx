import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import type { UnidadeList } from "../model/unidade-model";
import { deleteUnidade } from "../services/unidades";
import { isSuccessRequest } from "../utils/response-request";
import { ModalDeleteUnidade } from "./modal-delete-unidade";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface TableUnidadesListProps {
  unidadeList: UnidadeList[];
  handleListData: () => void;
}

export function TableUnidadesList({
  unidadeList,
  handleListData,
}: TableUnidadesListProps) {
  const { t } = useTranslation();
  const [unidadeToDelete, setUnidadeToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  const openDeleteDialog = (id: string) => {
    setUnidadeToDelete(id);
  };

  const closeDeleteDialog = () => {
    setUnidadeToDelete(null);
  };

  async function onDelete(id: string) {
    try {
      const response = await deleteUnidade(id);
      if (response && isSuccessRequest(response.status)) {
        toast.success(t("common.success"), {
          description: t("condominio.unidades.table.successDelete"),
        });
        closeDeleteDialog();
        handleListData();
      } else {
        toast.error(t("common.error"), {
          description: t("condominio.unidades.table.errorDelete"),
        });
      }
    } catch (error: unknown) {
      console.error("Erro ao deletar unidade:", error);
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || t("condominio.unidades.table.errorDelete");
      toast.error(t("common.error"), {
        description: message,
      });
    }
  }
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-fixed bg-white dark:bg-emerald-600 rounded-lg overflow-hidden shadow-lg">
        <thead>
          <tr>
            <th className="w-1/12 py-3 px-4 border-b border-gray-200 dark:border-emerald-800 dark:bg-emerald-600 dark:text-emerald-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
              {t("condominio.unidades.table.numero")}
            </th>
            <th className="w-1/12 py-3 px-4 border-b border-gray-200 dark:border-emerald-800 dark:bg-emerald-600 dark:text-emerald-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
              {t("condominio.unidades.table.bloco")}
            </th>
            <th className="w-1/12 py-3 px-4 border-b border-gray-200 dark:border-emerald-800 dark:bg-emerald-600 dark:text-emerald-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
              {t("condominio.unidades.table.apt")}
            </th>
            <th className="w-1/12 py-3 px-4 border-b border-gray-200 dark:border-emerald-800 dark:bg-emerald-600 dark:text-emerald-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
              {t("condominio.unidades.table.tipo")}
            </th>
            <th className="w-1/12 py-3 px-4 border-b border-gray-200 dark:border-emerald-800 dark:bg-emerald-600 dark:text-emerald-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
              {t("condominio.unidades.table.status")}
            </th>
            <th className="w-2/12 py-3 px-4 border-b border-gray-200 dark:border-emerald-800 dark:bg-emerald-600 dark:text-emerald-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
              {t("condominio.unidades.table.proprietario")}
            </th>
            <th className="w-2/12 py-3 px-4 border-b border-gray-200 dark:border-emerald-800 dark:bg-emerald-600 dark:text-emerald-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
              {t("condominio.unidades.table.morador")}
            </th>
            <th className="w-1/12 py-3 px-4 border-b border-gray-200 dark:border-emerald-800 dark:bg-emerald-600 dark:text-emerald-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
              {t("condominio.unidades.table.acao")}
            </th>
          </tr>
        </thead>
        <tbody>
          {unidadeList?.map((unidade) => (
            <tr
              key={unidade.id}
              className="hover:bg-gray-100 dark:hover:bg-emerald-700"
            >
              <td className="w-1/12 py-2 px-4 border-b border-gray-200 dark:border-emerald-800 text-left text-sm text-gray-900 dark:text-emerald-300">
                {unidade.numero}
              </td>
              <td className="w-1/12 py-2 px-4 border-b border-gray-200 dark:border-emerald-800 text-left text-sm text-gray-900 dark:text-emerald-300">
                {unidade.bloco || "-"}
              </td>
              <td className="w-1/12 py-2 px-4 border-b border-gray-200 dark:border-emerald-800 text-left text-sm text-gray-900 dark:text-emerald-300">
                {unidade.apartamento || "-"}
              </td>
              <td className="w-1/12 py-2 px-4 border-b border-gray-200 dark:border-emerald-800 text-left text-sm text-gray-900 dark:text-emerald-300">
                {unidade.tipo || "-"}
              </td>
              <td className="w-1/12 py-2 px-4 border-b border-gray-200 dark:border-emerald-800 text-left text-sm text-gray-900 dark:text-emerald-300">
                {unidade.status}
              </td>
              <td className="w-2/12 py-2 px-4 border-b border-gray-200 dark:border-emerald-800 text-left text-sm text-gray-900 dark:text-emerald-300">
                {unidade.proprietario || "-"}
              </td>
              <td className="w-2/12 py-2 px-4 border-b border-gray-200 dark:border-emerald-800 text-left text-sm text-gray-900 dark:text-emerald-300">
                {unidade.morador?.nome || "-"}
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
                          to: "/condominio/unidades/$id/edit",
                          params: { id: unidade.id },
                        });
                      }}
                    >
                      {t("condominio.unidades.table.editar")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                        openDeleteDialog(unidade.id);
                      }}
                    >
                      {t("condominio.unidades.table.excluir")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ModalDeleteUnidade
        unidadeToDelete={unidadeToDelete}
        closeDeleteDialog={closeDeleteDialog}
        onDelete={onDelete}
      />
    </div>
  );
}
