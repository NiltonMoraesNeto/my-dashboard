import { useEffect, useState } from "react";
import { TableEntrega } from "../../../components/table-entrega";
import type { Entrega } from "../../../services/entregas";
import { fetchEntregasList } from "../../../services/entregas";
import { useCondominio } from "../../../contexts/condominio-context";
import { CondominioGuard } from "../../../components/condominio-guard";
import { useAuth } from "../../../contexts/auth-context";

export function Entregas() {
  const { profileUser } = useAuth();
  const { selectedCondominioId } = useCondominio();
  const isSuperAdmin = profileUser?.toLowerCase() === "superadmin";
  const [entregaList, setEntregaList] = useState<Entrega[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const loadEntregasData = async () => {
      const response = await fetchEntregasList(
        page,
        limit,
        undefined,
        isSuperAdmin && selectedCondominioId ? selectedCondominioId : undefined
      );
      if (response) {
        setEntregaList(response.data);
        setTotalPages(response.totalPages || Math.ceil(response.total / limit));
      }
    };
    loadEntregasData();
  }, [page, limit, isSuperAdmin, selectedCondominioId]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  // Filtrar entregas pelo search (client-side)
  const filteredEntregaList = entregaList.filter((entrega) => {
    if (!debouncedSearch) return true;
    const searchLower = debouncedSearch.toLowerCase();
    return (
      entrega.titulo?.toLowerCase().includes(searchLower) ||
      entrega.nomeRecebedor?.toLowerCase().includes(searchLower) ||
      entrega.recebidoPor?.toLowerCase().includes(searchLower) ||
      entrega.unidade?.numero?.toLowerCase().includes(searchLower) ||
      entrega.unidade?.bloco?.toLowerCase().includes(searchLower) ||
      entrega.unidade?.apartamento?.toLowerCase().includes(searchLower)
    );
  });

  const handleListData = () => {
    const loadEntregasData = async () => {
      const response = await fetchEntregasList(
        page,
        limit,
        undefined,
        isSuperAdmin && selectedCondominioId ? selectedCondominioId : undefined
      );
      if (response) {
        setEntregaList(response.data);
        setTotalPages(response.totalPages || Math.ceil(response.total / limit));
      }
    };
    loadEntregasData();
  };

  return (
    <CondominioGuard>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Entregas</h1>
        <TableEntrega
          search={search}
          setSearch={setSearch}
          entregaList={filteredEntregaList}
          page={page}
          totalPages={totalPages}
          setPage={setPage}
          handleListData={handleListData}
        />
      </div>
    </CondominioGuard>
  );
}
