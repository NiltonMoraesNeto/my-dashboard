import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TableAviso } from "../../../components/table-aviso";
import type { AvisoList } from "../../../model/aviso-model";
import { fetchAvisosList } from "../../../services/avisos";
import { useCondominio } from "../../../contexts/condominio-context";
import { CondominioGuard } from "../../../components/condominio-guard";
import { useAuth } from "../../../contexts/auth-context";

export function Avisos() {
  const { t } = useTranslation();
  const { profileUser } = useAuth();
  const { selectedCondominioId } = useCondominio();
  const isSuperAdmin = profileUser?.toLowerCase() === "superadmin";
  const [avisoList, setAvisoList] = useState<AvisoList[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const loadAvisoData = useCallback(async () => {
    const response = await fetchAvisosList(
      page,
      limit,
      isSuperAdmin && selectedCondominioId ? selectedCondominioId : undefined
    );
    if (response) {
      if (response.data && response.total !== undefined) {
        setAvisoList(response.data);
        setTotalPages(response.totalPages || Math.ceil(response.total / limit));
      } else if (Array.isArray(response)) {
        setAvisoList(response);
        setTotalPages(Math.ceil(response.length / limit));
      }
    }
  }, [page, limit, isSuperAdmin, selectedCondominioId]);

  useEffect(() => {
    loadAvisoData();
  }, [loadAvisoData]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const handleMarkAsRead = () => {
    // Disparar evento customizado para atualizar o badge no header
    window.dispatchEvent(new CustomEvent("avisosUpdated"));
    // Recarregar lista
    loadAvisoData();
  };

  // Filtrar avisos pelo search (client-side por enquanto)
  const filteredAvisoList = avisoList.filter((aviso) => {
    if (!debouncedSearch) return true;
    const searchLower = debouncedSearch.toLowerCase();
    return (
      aviso.titulo.toLowerCase().includes(searchLower) ||
      aviso.descricao.toLowerCase().includes(searchLower) ||
      aviso.tipo?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <CondominioGuard>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">
          {t("condominio.avisos.title")}
        </h1>
        <TableAviso
          search={search}
          setSearch={setSearch}
          avisoList={filteredAvisoList}
          page={page}
          totalPages={totalPages}
          setPage={setPage}
          handleListData={loadAvisoData}
          onMarkAsRead={handleMarkAsRead}
        />
      </div>
    </CondominioGuard>
  );
}
