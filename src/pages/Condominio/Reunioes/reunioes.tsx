import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TableReuniao } from "../../../components/table-reuniao";
import type { ReuniaoList } from "../../../model/reuniao-model";
import { fetchReunioesList } from "../../../services/reunioes";
import { useCondominio } from "../../../contexts/condominio-context";
import { CondominioGuard } from "../../../components/condominio-guard";
import { useAuth } from "../../../contexts/auth-context";

export function Reunioes() {
  const { t } = useTranslation();
  const { profileUser } = useAuth();
  const { selectedCondominioId } = useCondominio();
  const isSuperAdmin = profileUser?.toLowerCase() === "superadmin";
  const [reuniaoList, setReuniaoList] = useState<ReuniaoList[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const loadReuniaoData = async () => {
      const response = await fetchReunioesList(
        page,
        limit,
        isSuperAdmin && selectedCondominioId ? selectedCondominioId : undefined
      );
      if (response) {
        if (response.data && response.total !== undefined) {
          setReuniaoList(response.data);
          setTotalPages(
            response.totalPages || Math.ceil(response.total / limit)
          );
        } else if (Array.isArray(response)) {
          setReuniaoList(response);
          setTotalPages(Math.ceil(response.length / limit));
        }
      }
    };
    loadReuniaoData();
  }, [page, limit, isSuperAdmin, selectedCondominioId]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const handleListData = () => {
    const loadReuniaoData = async () => {
      const response = await fetchReunioesList(
        page,
        limit,
        isSuperAdmin && selectedCondominioId ? selectedCondominioId : undefined
      );
      if (response) {
        if (response.data && response.total !== undefined) {
          setReuniaoList(response.data);
          setTotalPages(
            response.totalPages || Math.ceil(response.total / limit)
          );
        } else if (Array.isArray(response)) {
          setReuniaoList(response);
          setTotalPages(Math.ceil(response.length / limit));
        }
      }
    };
    loadReuniaoData();
  };

  // Filtrar reuniões pelo search (client-side por enquanto, já que o backend não suporta search)
  const filteredReuniaoList = reuniaoList.filter((reuniao) => {
    if (!debouncedSearch) return true;
    const searchLower = debouncedSearch.toLowerCase();
    return (
      reuniao.titulo.toLowerCase().includes(searchLower) ||
      reuniao.tipo?.toLowerCase().includes(searchLower) ||
      reuniao.status?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <CondominioGuard>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">
          {t("condominio.reunioes.title")}
        </h1>
        <TableReuniao
          search={search}
          setSearch={setSearch}
          reuniaoList={filteredReuniaoList}
          page={page}
          totalPages={totalPages}
          setPage={setPage}
          handleListData={handleListData}
        />
      </div>
    </CondominioGuard>
  );
}
