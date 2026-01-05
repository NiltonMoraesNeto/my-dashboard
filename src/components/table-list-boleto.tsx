import { EllipsisVertical, Download } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import type { BoletoList } from "../model/boleto-model";
import { deleteBoleto, downloadBoletoPdf } from "../services/boletos";
import { isSuccessRequest } from "../utils/response-request";
import { ModalDeleteBoleto } from "./modal-delete-boleto";
import { ModalBoleto } from "./modal-boleto";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface TableBoletosListProps {
  boletoList: BoletoList[];
  handleListData: () => void;
  isMorador?: boolean;
}

export function TableBoletosList({
  boletoList,
  handleListData,
  isMorador = false,
}: TableBoletosListProps) {
  const { t } = useTranslation();
  const [boletoToDelete, setBoletoToDelete] = useState<string | null>(null);
  const [boletoToView, setBoletoToView] = useState<BoletoList | null>(null);
  const [modalBoletoOpen, setModalBoletoOpen] = useState(false);
  const navigate = useNavigate();

  const openDeleteDialog = (id: string) => {
    setBoletoToDelete(id);
  };

  const closeDeleteDialog = () => {
    setBoletoToDelete(null);
  };

  const openBoletoModal = (boleto: BoletoList) => {
    setBoletoToView(boleto);
    setModalBoletoOpen(true);
  };

  async function onDelete(id: string) {
    try {
      const response = await deleteBoleto(id);
      if (response && isSuccessRequest(response.status)) {
        toast.success("Sucesso", {
          description: "Boleto deletado com sucesso",
        });
        closeDeleteDialog();
        handleListData();
      } else {
        toast.error("Error", {
          description: "Erro ao deletar o boleto",
        });
      }
    } catch (error: unknown) {
      console.error("Erro ao deletar boleto:", error);
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Erro ao deletar o boleto";
      toast.error("Error", {
        description: message,
      });
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pago":
        return "text-green-600 bg-green-50 dark:bg-green-900/20";
      case "Vencido":
        return "text-red-600 bg-red-50 dark:bg-red-900/20";
      case "Pendente":
        return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20";
      default:
        return "text-gray-600 bg-gray-50 dark:bg-gray-900/20";
    }
  };

  const handleDownloadPdf = async (boleto: BoletoList, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!boleto.arquivoPdf) {
      toast.error("Arquivo PDF não disponível");
      return;
    }
    try {
      const response = await downloadBoletoPdf(boleto.id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `boleto-${boleto.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("PDF baixado com sucesso!");
    } catch (error) {
      console.error("Erro ao baixar PDF:", error);
      toast.error("Erro ao baixar PDF");
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed bg-white dark:bg-emerald-600 rounded-lg overflow-hidden shadow-lg">
          <thead>
            <tr>
              <th className="w-1/6 py-3 px-4 border-b border-gray-200 dark:border-emerald-800 dark:bg-emerald-600 dark:text-emerald-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
                {t("condominio.boletos.table.unidade")}
              </th>
              <th className="w-1/6 py-3 px-4 border-b border-gray-200 dark:border-emerald-800 dark:bg-emerald-600 dark:text-emerald-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
                {t("condominio.boletos.table.descricao")}
              </th>
              <th className="w-1/6 py-3 px-4 border-b border-gray-200 dark:border-emerald-800 dark:bg-emerald-600 dark:text-emerald-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
                {t("condominio.boletos.table.valor")}
              </th>
              <th className="w-1/6 py-3 px-4 border-b border-gray-200 dark:border-emerald-800 dark:bg-emerald-600 dark:text-emerald-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
                {t("condominio.boletos.table.vencimento")}
              </th>
              <th className="w-1/6 py-3 px-4 border-b border-gray-200 dark:border-emerald-800 dark:bg-emerald-600 dark:text-emerald-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
                {t("condominio.boletos.table.status")}
              </th>
              {isMorador && (
                <th className="w-1/6 py-3 px-4 border-b border-gray-200 dark:border-emerald-800 dark:bg-emerald-600 dark:text-emerald-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
                  {t("condominio.boletos.table.download")}
                </th>
              )}
              {!isMorador && (
                <th className="w-1/6 py-3 px-4 border-b border-gray-200 dark:border-emerald-800 dark:bg-emerald-600 dark:text-emerald-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
                  {t("condominio.boletos.table.acao")}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {boletoList?.map((boleto) => (
              <tr
                key={boleto.id}
                className={`hover:bg-gray-50 dark:hover:bg-emerald-700 transition-colors ${
                  isMorador ? "cursor-pointer" : ""
                }`}
                onClick={() => {
                  if (isMorador) {
                    openBoletoModal(boleto);
                  }
                }}
              >
                <td className="py-3 px-4 border-b border-gray-200 dark:border-emerald-700 text-gray-900 dark:text-emerald-100 text-sm">
                  {boleto.unidade?.numero || boleto.unidadeId}
                  {boleto.unidade?.bloco && ` - ${t("condominio.boletos.table.bloco")} ${boleto.unidade.bloco}`}
                  {boleto.unidade?.apartamento &&
                    ` - ${t("condominio.boletos.table.apt")} ${boleto.unidade.apartamento}`}
                </td>
                <td className="py-3 px-4 border-b border-gray-200 dark:border-emerald-700 text-gray-900 dark:text-emerald-100 text-sm">
                  {boleto.descricao}
                </td>
                <td className="py-3 px-4 border-b border-gray-200 dark:border-emerald-700 text-gray-900 dark:text-emerald-100 text-sm font-semibold">
                  {formatCurrency(boleto.valor)}
                </td>
                <td className="py-3 px-4 border-b border-gray-200 dark:border-emerald-700 text-gray-900 dark:text-emerald-100 text-sm">
                  {formatDate(boleto.vencimento)}
                </td>
                <td className="py-3 px-4 border-b border-gray-200 dark:border-emerald-700 text-gray-900 dark:text-emerald-100 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(boleto.status)}`}
                  >
                    {boleto.status}
                  </span>
                </td>
                {isMorador && (
                  <td className="py-3 px-4 border-b border-gray-200 dark:border-emerald-700 text-gray-900 dark:text-emerald-100 text-sm">
                    {boleto.arquivoPdf ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => handleDownloadPdf(boleto, e)}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        {t("condominio.boletos.table.baixarPdf")}
                      </Button>
                    ) : (
                      <span className="text-gray-400 text-xs">Sem arquivo</span>
                    )}
                  </td>
                )}
                {!isMorador && (
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
                              to: `/condominio/boletos/${boleto.id}/edit`,
                            })
                          }
                        >
                          {t("condominio.boletos.table.editar")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openDeleteDialog(boleto.id)}
                          className="text-red-600"
                        >
                          {t("condominio.boletos.table.excluir")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {boletoList?.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-emerald-200">
            Nenhum boleto encontrado.
          </div>
        )}
      </div>
      {!isMorador && (
        <ModalDeleteBoleto
          boletoToDelete={boletoToDelete}
          closeDeleteDialog={closeDeleteDialog}
          onDelete={onDelete}
        />
      )}
      {isMorador && (
        <ModalBoleto
          open={modalBoletoOpen}
          onOpenChange={setModalBoletoOpen}
          boleto={boletoToView}
        />
      )}
    </>
  );
}
