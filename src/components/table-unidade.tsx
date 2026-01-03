import { Search } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Pagination } from "./pagination";
import { TableUnidadesList } from "./table-list-unidade";
import type { UnidadeList } from "../model/unidade-model";

interface TableUnidadeProps {
  search: string;
  setSearch: (search: string) => void;
  unidadeList: UnidadeList[];
  page: number;
  totalPages: number;
  setPage: (value: React.SetStateAction<number>) => void;
  handleListData: () => void;
}

export function TableUnidade({
  search,
  setSearch,
  unidadeList,
  page,
  totalPages,
  setPage,
  handleListData,
}: TableUnidadeProps) {
  const navigate = useNavigate();
  return (
    <Card className="flex flex-col mt-5 dark:bg-emerald-800">
      <CardHeader className="">
        <CardTitle className="text-xl font-sans tracking-[0.6px]">
          <div className="flex justify-between items-center mb-6 max-sm:block">
            <div className="flex items-center gap-2">
              <Button variant="default" onClick={() => navigate({ to: "/condominio/unidades/new" })}>
                Adicionar Unidade
              </Button>
            </div>
            <div className="relative flex items-center font-sans">
              <Input
                type="text"
                placeholder="Pesquisar"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-10"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-500" />
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between">
        <TableUnidadesList unidadeList={unidadeList} handleListData={handleListData} />
        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </CardContent>
    </Card>
  );
}

