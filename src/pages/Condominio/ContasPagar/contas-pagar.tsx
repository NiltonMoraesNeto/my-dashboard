import { useCallback, useEffect, useState } from "react";
import { TableContaPagar } from "../../../components/table-conta-pagar";
import type { ContaPagar } from "../../../services/contas-pagar";
import { fetchContasPagarList } from "../../../services/contas-pagar";

export function ContasPagar() {
  const [contaPagarList, setContaPagarList] = useState<ContaPagar[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [mes, _setMes] = useState<number | undefined>(undefined);
  const [ano, _setAno] = useState<number | undefined>(undefined);

  const loadContasPagarData = useCallback(async () => {
    try {
      const response = await fetchContasPagarList(page, limit, mes, ano);
      if (response) {
        setContaPagarList(response.data);
        setTotalPages(response.totalPages || Math.ceil(response.total / limit));
      }
    } catch (error) {
      console.error("Erro ao carregar contas a pagar:", error);
    }
  }, [page, limit, mes, ano]);

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
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Contas a Pagar</h1>
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
  );
}
