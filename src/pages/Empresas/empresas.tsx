import { useEffect, useState } from "react";
import { TableEmpresa } from "../../components/table-empresa";
import type { EmpresaList } from "../../model/empresa-model";
import { fetchEmpresasList } from "../../services/empresas";

export function Empresas() {
  const [empresaList, setEmpresaList] = useState<EmpresaList[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const loadEmpresasData = async () => {
      try {
        const response = await fetchEmpresasList(page, limit, debouncedSearch);
        setEmpresaList(response.data);
        setTotalPages(response.totalPages || Math.ceil(response.total / limit));
      } catch (error) {
        console.error("Erro ao carregar empresas:", error);
      }
    };
    loadEmpresasData();
  }, [page, limit, debouncedSearch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const handleListData = () => {
    const loadEmpresasData = async () => {
      try {
        const response = await fetchEmpresasList(page, limit, debouncedSearch);
        setEmpresaList(response.data);
        setTotalPages(response.totalPages || Math.ceil(response.total / limit));
      } catch (error) {
        console.error("Erro ao carregar empresas:", error);
      }
    };
    loadEmpresasData();
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-indigo-900 p-8">
      <div className="max-w-full bg-white rounded-lg shadow-md p-6 dark:bg-indigo-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">
            Gestão de Empresas
          </h1>
        </div>
        <TableEmpresa
          search={search}
          setSearch={setSearch}
          empresaList={empresaList}
          page={page}
          totalPages={totalPages}
          setPage={setPage}
          handleListData={handleListData}
        />
      </div>
    </div>
  );
}
