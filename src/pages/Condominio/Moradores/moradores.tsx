import { useEffect, useState } from "react";
import { TableMorador } from "../../../components/table-morador";
import type { MoradorList } from "../../../model/morador-model";
import { fetchMoradoresList } from "../../../services/moradores";

export function Moradores() {
  const [moradorList, setMoradorList] = useState<MoradorList[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const loadMoradorData = async () => {
      const response = await fetchMoradoresList(page, limit, debouncedSearch);
      if (response) {
        if (response.data && response.total !== undefined) {
          setMoradorList(response.data);
          setTotalPages(response.totalPages || Math.ceil(response.total / limit));
        } else if (Array.isArray(response)) {
          setMoradorList(response);
          setTotalPages(Math.ceil(response.length / limit));
        }
      }
    };
    loadMoradorData();
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
    const loadMoradorData = async () => {
      const response = await fetchMoradoresList(page, limit, debouncedSearch);
      if (response) {
        if (response.data && response.total !== undefined) {
          setMoradorList(response.data);
          setTotalPages(response.totalPages || Math.ceil(response.total / limit));
        } else if (Array.isArray(response)) {
          setMoradorList(response);
          setTotalPages(Math.ceil(response.length / limit));
        }
      }
    };
    loadMoradorData();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Moradores</h1>
      <TableMorador
        search={search}
        setSearch={setSearch}
        moradorList={moradorList}
        page={page}
        totalPages={totalPages}
        setPage={setPage}
        handleListData={handleListData}
      />
    </div>
  );
}

