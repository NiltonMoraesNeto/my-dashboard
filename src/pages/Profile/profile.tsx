import { useEffect, useState } from "react";
import { ProfileList } from "../../model/profile-model";
import { fetchProfileList } from "../../services/profile";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  Search,
} from "lucide-react";
import { Button } from "../../components/ui/button";

export function Profile() {
  const [profileList, setProfileList] = useState<ProfileList[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(2);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const loadProfileData = async () => {
      const data = await fetchProfileList(page, limit, debouncedSearch);
      setProfileList(data.perfil);
      setTotalPages(Math.ceil(data.total / limit));
    };
    loadProfileData();
  }, [page, limit, debouncedSearch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-indigo-900 p-8">
      <div className="max-w-full bg-white rounded-lg shadow-md p-6 dark:bg-indigo-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">
            Lista de Perfis
          </h1>
        </div>
        <Card className="flex flex-col mt-5 dark:bg-indigo-800">
          <CardHeader className="">
            <CardTitle className="text-xl font-sans tracking-[0.6px]">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Button>Adicionar Novo</Button>
                </div>
                <div className="relative w-64 flex items-center font-sans">
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
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-indigo-600 rounded-lg overflow-hidden shadow-lg">
                <thead>
                  <tr>
                    <th className="py-3 px-4 border-b border-gray-200 dark:border-indigo-800 dark:bg-indigo-600 dark:text-indigo-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
                      ID
                    </th>
                    <th className="py-3 px-4 border-b border-gray-200 dark:border-indigo-800 dark:bg-indigo-600 dark:text-indigo-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
                      Nome do Perfil
                    </th>
                    <th className="py-3 px-4 border-b border-gray-200 dark:border-indigo-800 dark:bg-indigo-600 dark:text-indigo-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
                      Ação
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {profileList?.map((profile) => (
                    <tr
                      key={profile.id}
                      className="hover:bg-gray-100 dark:hover:bg-indigo-700"
                    >
                      <td className="py-2 px-4 border-b border-gray-200 dark:border-indigo-800 text-left text-sm text-gray-900 dark:text-indigo-300">
                        {profile.id}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200 dark:border-indigo-800 text-left text-sm text-gray-900 dark:text-indigo-300">
                        {profile.descricao}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200 dark:border-indigo-800 text-left text-sm text-gray-900 dark:text-indigo-300">
                        <Button
                          variant="link"
                          onClick={() => console.log(profile.id)}
                          className="dark:text-indigo-300"
                        >
                          <EllipsisVertical />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end items-center mt-6">
              <span className="text-sm text-gray-600 mr-4 font-sans">
                {page} de {totalPages}
              </span>
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 text-gray-700 font-medium mr-4"
              >
                <ChevronLeft />
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 text-gray-700 font-medium"
              >
                <ChevronRight />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
