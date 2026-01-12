import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Input } from "../components/ui/input";
import { Search, Plus, Pencil, Trash2, Power, PowerOff } from "lucide-react";
import type { EmpresaList } from "../model/empresa-model";
import { deleteEmpresa, toggleEmpresaStatus } from "../services/empresas";
import { toast } from "sonner";

interface TableEmpresaProps {
  search: string;
  setSearch: (search: string) => void;
  empresaList: EmpresaList[];
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
  handleListData: () => void;
}

export function TableEmpresa({
  search,
  setSearch,
  empresaList,
  page,
  totalPages,
  setPage,
  handleListData,
}: TableEmpresaProps) {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isToggling, setIsToggling] = useState<string | null>(null);

  const handleDelete = async (id: string, nome: string) => {
    if (!confirm(`Tem certeza que deseja excluir a empresa "${nome}"?`)) {
      return;
    }

    setIsDeleting(id);
    try {
      await deleteEmpresa(id);
      toast.success("Empresa excluída com sucesso!");
      handleListData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao excluir empresa");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleToggleStatus = async (id: string) => {
    setIsToggling(id);
    try {
      await toggleEmpresaStatus(id);
      toast.success("Status da empresa atualizado com sucesso!");
      handleListData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao alterar status da empresa");
    } finally {
      setIsToggling(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Buscar empresas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          type="button"
          onClick={() => navigate({ to: "/admin/empresas/new" })}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Empresa
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {empresaList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500">
                  Nenhuma empresa encontrada
                </TableCell>
              </TableRow>
            ) : (
              empresaList.map((empresa) => (
                <TableRow key={empresa.id}>
                  <TableCell className="font-medium">{empresa.nome}</TableCell>
                  <TableCell>{empresa.cnpj || "-"}</TableCell>
                  <TableCell>{empresa.email || "-"}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        empresa.ativa
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {empresa.ativa ? "Ativa" : "Inativa"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(empresa.id)}
                        disabled={isToggling === empresa.id}
                        title={empresa.ativa ? "Desativar" : "Ativar"}
                      >
                        {isToggling === empresa.id ? (
                          <div className="w-4 h-4 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin" />
                        ) : empresa.ativa ? (
                          <PowerOff className="w-4 h-4 text-red-600" />
                        ) : (
                          <Power className="w-4 h-4 text-green-600" />
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate({ to: `/admin/empresas/${empresa.id}/edit` })}
                      >
                        <Pencil className="w-4 h-4 text-indigo-600" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(empresa.id, empresa.nome)}
                        disabled={isDeleting === empresa.id}
                      >
                        {isDeleting === empresa.id ? (
                          <div className="w-4 h-4 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4 text-red-600" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Página {page} de {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              Anterior
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
