import { Search } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Pagination } from "./pagination";
import { TableMoradoresList } from "./table-list-morador";
import type { MoradorList } from "../model/morador-model";

interface TableMoradorProps {
  search: string;
  setSearch: (search: string) => void;
  moradorList: MoradorList[];
  page: number;
  totalPages: number;
  setPage: (value: React.SetStateAction<number>) => void;
  handleListData: () => void;
}

export function TableMorador({
  search,
  setSearch,
  moradorList,
  page,
  totalPages,
  setPage,
  handleListData,
}: TableMoradorProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <Card className="flex flex-col mt-5 dark:bg-emerald-800">
      <CardHeader className="">
        <CardTitle className="text-xl font-sans tracking-[0.6px]">
          <div className="flex justify-between items-center mb-6 max-sm:block">
            <div className="flex items-center gap-2">
              <Button variant="default" onClick={() => navigate({ to: "/condominio/moradores/new" })}>
                {t("condominio.moradores.addButton")}
              </Button>
            </div>
            <div className="relative flex items-center font-sans">
              <Input
                type="text"
                placeholder={t("condominio.moradores.searchPlaceholder")}
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
        <TableMoradoresList moradorList={moradorList} handleListData={handleListData} />
        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </CardContent>
    </Card>
  );
}

