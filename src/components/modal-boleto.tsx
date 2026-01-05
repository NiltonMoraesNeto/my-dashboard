import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import type { BoletoList } from "../model/boleto-model";
import { X, Download } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { downloadBoletoPdf } from "../services/boletos";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface ModalBoletoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  boleto: BoletoList | null;
}

export function ModalBoleto({ open, onOpenChange, boleto }: ModalBoletoProps) {
  const { t } = useTranslation();
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

  const handleDownloadPdf = async () => {
    if (!boleto?.arquivoPdf) {
      toast.error(t("condominio.boletos.modal.errorPdf"));
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
      toast.success(t("condominio.boletos.modal.successDownload"));
    } catch (error) {
      console.error("Erro ao baixar PDF:", error);
      toast.error(t("condominio.boletos.modal.errorDownload"));
    }
  };

  if (!boleto) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{t("condominio.boletos.modal.title")}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {t("condominio.boletos.modal.unidade")}
              </Label>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {boleto.unidade?.numero || boleto.unidadeId}
                {boleto.unidade?.bloco && ` - ${t("condominio.boletos.table.bloco")} ${boleto.unidade.bloco}`}
                {boleto.unidade?.apartamento &&
                  ` - ${t("condominio.boletos.table.apt")} ${boleto.unidade.apartamento}`}
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {t("condominio.boletos.modal.descricao")}
              </Label>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {boleto.descricao}
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {t("condominio.boletos.modal.valor")}
              </Label>
              <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                {formatCurrency(boleto.valor)}
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {t("condominio.boletos.modal.vencimento")}
              </Label>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {formatDate(boleto.vencimento)}
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {t("condominio.boletos.modal.status")}
              </Label>
              <p className="mt-1">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(boleto.status)}`}
                >
                  {boleto.status}
                </span>
              </p>
            </div>

            {boleto.dataPagamento && (
              <div>
                <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t("condominio.boletos.modal.dataPagamento")}
                </Label>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {formatDate(boleto.dataPagamento)}
                </p>
              </div>
            )}
          </div>

          {boleto.observacoes && (
            <div>
              <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {t("condominio.boletos.modal.observacoes")}
              </Label>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                {boleto.observacoes}
              </p>
            </div>
          )}

          {boleto.arquivoPdf && (
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                onClick={handleDownloadPdf}
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-white hover:bg-emerald-600"
              >
                <Download className="h-4 w-4" />
                {t("condominio.boletos.modal.baixarPdf")}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
