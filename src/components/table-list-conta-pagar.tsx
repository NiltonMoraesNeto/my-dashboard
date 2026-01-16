import { Edit, Trash2, Download } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { useState } from "react";
import { toast } from "sonner";
import type { ContaPagar } from "../services/contas-pagar";
import {
  deleteContaPagar,
  downloadContaPagarAnexo,
} from "../services/contas-pagar";
import { formatCurrency } from "../utils/format-currency";
import { formatDateDisplay } from "../lib/utils";

interface TableContasPagarListProps {
  contaPagarList: ContaPagar[];
  handleListData: () => void;
}

export function TableContasPagarList({
  contaPagarList,
  handleListData,
}: TableContasPagarListProps) {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contaPagarToDelete, setContaPagarToDelete] =
    useState<ContaPagar | null>(null);

  const handleDelete = async () => {
    if (!contaPagarToDelete) return;

    try {
      await deleteContaPagar(contaPagarToDelete.id);
      toast.success("Conta a pagar excluída com sucesso");
      handleListData();
      setDeleteDialogOpen(false);
      setContaPagarToDelete(null);
    } catch (error) {
      console.error("Erro ao excluir conta a pagar:", error);
      toast.error("Erro ao excluir conta a pagar");
    }
  };

  const handleDownloadAnexo = async (anexoPath: string) => {
    try {
      await downloadContaPagarAnexo(anexoPath);
      toast.success("Anexo baixado com sucesso");
    } catch (error) {
      console.error("Erro ao baixar anexo:", error);
      toast.error("Erro ao baixar anexo");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paga":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Vencida":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "Pendente":
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    }
  };

  const meses = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

  if (contaPagarList.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        Nenhuma conta a pagar encontrada
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border dark:border-gray-700">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Mês/Ano</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Anexo</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contaPagarList.map((contaPagar) => (
              <TableRow key={contaPagar.id}>
                <TableCell className="font-medium">
                  {contaPagar.descricao}
                </TableCell>
                <TableCell>{formatCurrency(contaPagar.valor)}</TableCell>
                <TableCell>
                  {formatDateDisplay(contaPagar.vencimento)}
                </TableCell>
                <TableCell>
                  {meses[contaPagar.mes - 1]} / {contaPagar.ano}
                </TableCell>
                <TableCell>{contaPagar.categoria || "-"}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(contaPagar.status)}`}
                  >
                    {contaPagar.status}
                  </span>
                </TableCell>
                <TableCell>
                  {contaPagar.anexo ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadAnexo(contaPagar.anexo!)}
                      className="h-8 w-8 p-0"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        navigate({
                          to: "/condominio/contas-pagar/$id/edit",
                          params: { id: contaPagar.id },
                        })
                      }
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setContaPagarToDelete(contaPagar);
                        setDeleteDialogOpen(true);
                      }}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir conta a pagar</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a conta a pagar "
              {contaPagarToDelete?.descricao}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
