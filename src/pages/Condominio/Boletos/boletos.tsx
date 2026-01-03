import { useCallback, useEffect, useState } from "react";
import { TableBoleto } from "../../../components/table-boleto";
import type { BoletoList } from "../../../model/boleto-model";
import { fetchBoletosList } from "../../../services/boletos";

export function Boletos() {
  const [boletoList, setBoletoList] = useState<BoletoList[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const loadBoletoData = useCallback(async () => {
    const response = await fetchBoletosList(page, limit);
    if (response) {
      if (response.data && response.total !== undefined) {
        setBoletoList(response.data);
        setTotalPages(response.totalPages || Math.ceil(response.total / limit));
      } else if (Array.isArray(response)) {
        setBoletoList(response);
        setTotalPages(Math.ceil(response.length / limit));
      }
    }
  }, [page, limit]);

  useEffect(() => {
    loadBoletoData();
  }, [loadBoletoData]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  // Filtrar boletos pelo search (client-side)
  const filteredBoletoList = boletoList.filter((boleto) => {
    if (!debouncedSearch) return true;
    const searchLower = debouncedSearch.toLowerCase();
    const unidadeNum = boleto.unidade?.numero?.toLowerCase() || "";
    const status = boleto.status?.toLowerCase() || "";
    return (
      unidadeNum.includes(searchLower) ||
      status.includes(searchLower) ||
      boleto.observacoes?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Boletos</h1>
      <TableBoleto
        search={search}
        setSearch={setSearch}
        boletoList={filteredBoletoList}
        page={page}
        totalPages={totalPages}
        setPage={setPage}
        handleListData={loadBoletoData}
        isMorador={false}
      />
    </div>
  );
}
