import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { UserList } from "../model/user-model";
import { Pagination } from "./pagination";
import { TableUsersList } from "./table-list-user";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";

interface TableUserProps {
  search: string;
  setSearch: (value: React.SetStateAction<string>) => void;
  userList: UserList[];
  page: number;
  totalPages: number;
  setPage: (value: React.SetStateAction<number>) => void;
  handleListData: () => void;
}

export function TableUser({
  search,
  setSearch,
  userList,
  page,
  totalPages,
  setPage,
  handleListData,
}: TableUserProps) {
  const navigate = useNavigate();
  return (
    <Card className="flex flex-col mt-5 dark:bg-indigo-800">
      <CardHeader className="">
        <CardTitle className="text-xl font-sans tracking-[0.6px]">
          <div className="flex justify-between items-center mb-6 max-sm:block">
            <div className="flex items-center gap-2">
              <Button variant="default" onClick={() => navigate("/user/new")}>
                Adicionar Usuário
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
        <TableUsersList userList={userList} handleListData={handleListData} />
        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </CardContent>
    </Card>
  );
}
