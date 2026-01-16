import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TableUnidade } from "../../../components/table-unidade";
import type { UnidadeList } from "../../../model/unidade-model";
import { fetchUnidadesList } from "../../../services/unidades";
import { useCondominio } from "../../../contexts/condominio-context";
import { CondominioGuard } from "../../../components/condominio-guard";
import { useAuth } from "../../../contexts/auth-context";

export function Unidades() {
  const { t } = useTranslation();
  const { profileUser } = useAuth();
  const { selectedCondominioId } = useCondominio();
  const isSuperAdmin = profileUser?.toLowerCase() === "superadmin";
  const [unidadeList, setUnidadeList] = useState<UnidadeList[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const loadUnidadeData = async () => {
      const response = await fetchUnidadesList(
        page,
        limit,
        debouncedSearch,
        isSuperAdmin && selectedCondominioId ? selectedCondominioId : undefined
      );
      if (response) {
        if (response.data && response.total !== undefined) {
          setUnidadeList(response.data);
          setTotalPages(
            response.totalPages || Math.ceil(response.total / limit)
          );
        } else if (Array.isArray(response)) {
          setUnidadeList(response);
          setTotalPages(Math.ceil(response.length / limit));
        }
      }
    };
    loadUnidadeData();
  }, [page, limit, debouncedSearch, isSuperAdmin, selectedCondominioId]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const handleListData = () => {
    const loadUnidadeData = async () => {
      const response = await fetchUnidadesList(
        page,
        limit,
        debouncedSearch,
        isSuperAdmin && selectedCondominioId ? selectedCondominioId : undefined
      );
      if (response) {
        if (response.data && response.total !== undefined) {
          setUnidadeList(response.data);
          setTotalPages(
            response.totalPages || Math.ceil(response.total / limit)
          );
        } else if (Array.isArray(response)) {
          setUnidadeList(response);
          setTotalPages(Math.ceil(response.length / limit));
        }
      }
    };
    loadUnidadeData();
  };

  return (
    <CondominioGuard>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">
          {t("condominio.unidades.title")}
        </h1>
        <TableUnidade
          search={search}
          setSearch={setSearch}
          unidadeList={unidadeList}
          page={page}
          totalPages={totalPages}
          setPage={setPage}
          handleListData={handleListData}
        />
      </div>
    </CondominioGuard>
  );
}
