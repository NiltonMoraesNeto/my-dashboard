import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TableBoleto } from "../../../components/table-boleto";
import type { BoletoList } from "../../../model/boleto-model";
import { fetchBoletosList } from "../../../services/boletos";
import { MesAnoFilter } from "../../../components/filters/mes-ano-filter";
import { useAuth } from "../../../contexts/auth-context";
import { useCondominio } from "../../../contexts/condominio-context";
import { CondominioGuard } from "../../../components/condominio-guard";

export function Boletos() {
  const { t } = useTranslation();
  const { profileUser } = useAuth();
  const { selectedCondominioId } = useCondominio();
  const isSuperAdmin = profileUser?.toLowerCase() === "superadmin";
  const [boletoList, setBoletoList] = useState<BoletoList[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [mes, setMes] = useState<number | undefined>(undefined);
  const [ano, setAno] = useState<number>(new Date().getFullYear());

  const loadBoletoData = useCallback(async () => {
    const response = await fetchBoletosList(
      page,
      limit,
      undefined,
      mes,
      ano,
      isSuperAdmin && selectedCondominioId ? selectedCondominioId : undefined
    );
    if (response) {
      if (response.data && response.total !== undefined) {
        setBoletoList(response.data);
        setTotalPages(response.totalPages || Math.ceil(response.total / limit));
      } else if (Array.isArray(response)) {
        setBoletoList(response);
        setTotalPages(Math.ceil(response.length / limit));
      }
    }
  }, [page, limit, mes, ano, isSuperAdmin, selectedCondominioId]);

  useEffect(() => {
    loadBoletoData();
  }, [loadBoletoData]);

  // Resetar página quando filtros mudarem
  useEffect(() => {
    setPage(1);
  }, [mes, ano]);

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
    <CondominioGuard>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">
          {t("condominio.boletos.title")}
        </h1>

        <MesAnoFilter
          mes={mes}
          ano={ano}
          onMesChange={setMes}
          onAnoChange={setAno}
        />

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
    </CondominioGuard>
  );
}
