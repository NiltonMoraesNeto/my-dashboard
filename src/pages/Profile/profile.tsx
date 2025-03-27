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
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

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
            Profile
          </h1>
        </div>
        <Card className="flex flex-col mt-5">
          <CardHeader className="">
            <CardTitle className="text-xl font-sans text-blackDefault-secondary tracking-[0.6px] dark:text-white">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-sans text-blackDefault-secondary tracking-[0.6px] dark:text-white">
                    Titulo
                  </h2>
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
            <div className="overflow-hidden">
              <div className="flex gap-4">
                <div className="text-black rounded-lg flex-[3] grid grid-cols-[1fr_1fr_120px]">
                  <div className="p-4 font-medium uppercase text-sm font-sans">
                    ID
                  </div>
                  <div className="p-4 font-medium uppercase text-sm font-sans">
                    Nome Perfil
                  </div>
                  <div className="p-4 font-medium uppercase text-sm font-sans">
                    Ação
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-200 mt-4">
                {profileList.map((profile) => (
                  <div
                    key={profile.id}
                    className="grid grid-cols-[2fr_1fr_1fr_120px] hover:bg-gray-50 dark:hover:bg-blackDefault-secondary"
                  >
                    <div className="p-4 flex items-center gap-3">
                      <span className="font-medium font-sans">
                        {profile.id}
                      </span>
                    </div>
                    <div className="p-4 flex items-center font-sans">
                      {profile.descricao}
                    </div>
                    <div className="p-4 flex items-center font-sans">
                      Editar
                    </div>
                  </div>
                ))}
              </div>
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
