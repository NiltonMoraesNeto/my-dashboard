import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import type { BoletoList } from "../model/boleto-model";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

interface ModalBoletoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  boleto: BoletoList | null;
}

export function ModalBoleto({ open, onOpenChange, boleto }: ModalBoletoProps) {
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

  const getMonthName = (mes: number) => {
    const months = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
    return months[mes - 1] || "";
  };

  if (!boleto) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Detalhes do Boleto</span>
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
                Unidade
              </Label>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {boleto.unidade?.numero || boleto.unidadeId}
                {boleto.unidade?.bloco && ` - Bloco ${boleto.unidade.bloco}`}
                {boleto.unidade?.apartamento &&
                  ` - Apt ${boleto.unidade.apartamento}`}
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Mês/Ano
              </Label>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {getMonthName(boleto.mes)}/{boleto.ano}
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Valor
              </Label>
              <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                {formatCurrency(boleto.valor)}
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Vencimento
              </Label>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {formatDate(boleto.vencimento)}
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Status
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
                  Data de Pagamento
                </Label>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {formatDate(boleto.dataPagamento)}
                </p>
              </div>
            )}
          </div>

          {boleto.codigoBarras && (
            <div>
              <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Código de Barras
              </Label>
              <p className="mt-1 text-sm font-mono text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                {boleto.codigoBarras}
              </p>
            </div>
          )}

          {boleto.nossoNumero && (
            <div>
              <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Nosso Número
              </Label>
              <p className="mt-1 text-sm font-mono text-gray-900 dark:text-gray-100">
                {boleto.nossoNumero}
              </p>
            </div>
          )}

          {boleto.observacoes && (
            <div>
              <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Observações
              </Label>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                {boleto.observacoes}
              </p>
            </div>
          )}

          {/* Área reservada para implementação futura do boleto */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Funcionalidade de visualização/baixar boleto será implementada em
              breve
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
