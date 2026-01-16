import { useCallback, useEffect, useState } from "react";
import { TableContaPagar } from "../../../components/table-conta-pagar";
import type { ContaPagar } from "../../../services/contas-pagar";
import { fetchContasPagarList } from "../../../services/contas-pagar";
import { MesAnoFilter } from "../../../components/filters/mes-ano-filter";
import { useAuth } from "../../../contexts/auth-context";
import { useCondominio } from "../../../contexts/condominio-context";
import { CondominioGuard } from "../../../components/condominio-guard";

export function ContasPagar() {
  const { profileUser } = useAuth();
  const { selectedCondominioId } = useCondominio();
  const isSuperAdmin = profileUser?.toLowerCase() === "superadmin";
  const [contaPagarList, setContaPagarList] = useState<ContaPagar[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [mes, setMes] = useState<number | undefined>(undefined);
  const [ano, setAno] = useState<number>(new Date().getFullYear());

  const loadContasPagarData = useCallback(async () => {
    try {
      const response = await fetchContasPagarList(
        page,
        limit,
        mes,
        ano,
        isSuperAdmin && selectedCondominioId ? selectedCondominioId : undefined
      );
      if (response) {
        setContaPagarList(response.data);
        setTotalPages(response.totalPages || Math.ceil(response.total / limit));
      }
    } catch (error) {
      console.error("Erro ao carregar contas a pagar:", error);
    }
  }, [page, limit, mes, ano, isSuperAdmin, selectedCondominioId]);

  useEffect(() => {
    loadContasPagarData();
  }, [loadContasPagarData]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  // Filtrar contas a pagar pelo search (client-side)
  const filteredContaPagarList = contaPagarList.filter((contaPagar) => {
    if (!debouncedSearch) return true;
    const searchLower = debouncedSearch.toLowerCase();
    return (
      contaPagar.descricao?.toLowerCase().includes(searchLower) ||
      contaPagar.categoria?.toLowerCase().includes(searchLower) ||
      contaPagar.status?.toLowerCase().includes(searchLower) ||
      contaPagar.observacoes?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <CondominioGuard>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Contas a Pagar</h1>
      
      <MesAnoFilter
        mes={mes}
        ano={ano}
        onMesChange={setMes}
        onAnoChange={setAno}
      />

      <TableContaPagar
        search={search}
        setSearch={setSearch}
        contaPagarList={filteredContaPagarList}
        page={page}
        totalPages={totalPages}
        setPage={setPage}
        handleListData={loadContasPagarData}
      />
      </div>
    </CondominioGuard>
  );
}
