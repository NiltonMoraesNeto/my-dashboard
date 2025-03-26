import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { fetchProfileById } from "../../services/profile";

type TokenPayload = {
  id: string;
  email: string;
  nome: string;
  exp: number;
  perfil: string;
};

export function Profile() {
  const [dataUser, setDataUser] = useState<TokenPayload | undefined>();
  const [profileUser, setProfileUser] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    if (token) {
      const decoded = jwtDecode<TokenPayload>(token);
      setDataUser(decoded);

      const loadPerfil = async () => {
        const response = await fetchProfileById(decoded.perfil);
        setProfileUser(response.descricao);
      };

      loadPerfil();
    }
  }, []);
  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
        <div className="relative px-6 pt-12 pb-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="relative shrink-0">
              <Avatar className="h-24 w-24 rounded-full border-2 border-zinc-200/80 dark:border-zinc-800/80 shadow-xs">
                <AvatarImage
                  src="https://upload.wikimedia.org/wikipedia/commons/2/22/Logo_Flamengo_crest_1980-2018.png"
                  className="rounded-full object-cover"
                />
                <AvatarFallback className="bg-zinc-100 dark:bg-zinc-900">
                  N
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                {dataUser?.nome}
              </h2>
            </div>
          </div>
          <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-6" />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {dataUser?.nome}
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {dataUser?.email}
              </span>
            </div>
            <div className="flex items-center">
              {dataUser && (
                <span className="text-sm text-zinc-500 dark:text-zinc-400 mr-2">
                  Perfil - {profileUser}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
