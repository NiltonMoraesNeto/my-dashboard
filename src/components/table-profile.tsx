import { EllipsisVertical, Info, Search } from "lucide-react";
import { useAuth } from "../contexts/auth-context";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { ProfileList } from "../model/profile-model";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormHandleSubmit,
} from "react-hook-form";
import { schemaAddProfile } from "../schemas/profile-schema";
import { z } from "zod";
import { Pagination } from "./pagination";

interface TableProfileProps {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  search: string;
  setSearch: (value: React.SetStateAction<string>) => void;
  profileList: ProfileList[];
  page: number;
  totalPages: number;
  setPage: (value: React.SetStateAction<number>) => void;
  handleSubmit: UseFormHandleSubmit<
    {
      descricao: string;
    },
    undefined
  >;
  onSubmit(values: z.infer<typeof schemaAddProfile>): Promise<void>;
  control: Control<
    {
      descricao: string;
    },
    unknown
  >;
  errors: FieldErrors<{
    descricao: string;
  }>;
}

export function TableProfile({
  openModal,
  setOpenModal,
  search,
  setSearch,
  profileList,
  page,
  totalPages,
  setPage,
  handleSubmit,
  onSubmit,
  control,
  errors,
}: TableProfileProps) {
  const { profileUser } = useAuth();
  return (
    <Card className="flex flex-col mt-5 dark:bg-indigo-800">
      <CardHeader className="">
        <CardTitle className="text-xl font-sans tracking-[0.6px]">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Dialog open={openModal} onOpenChange={setOpenModal}>
                <DialogTrigger asChild>
                  <Button
                    disabled={profileUser === "Adminstrador" ? false : true}
                  >
                    Adicionar Novo
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Perfil</DialogTitle>
                    <DialogDescription asChild>
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="w-full mx-auto">
                          <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
                            <div className="relative px-6 pt-12 pb-6">
                              <div className="relative shrink-0 mb-2">
                                Nome do Perfil *
                              </div>
                              <div className="relative shrink-0">
                                <Controller
                                  name="descricao"
                                  control={control}
                                  render={({ field }) => (
                                    <Input
                                      {...field}
                                      placeholder="Digite o nome do perfil"
                                      className={`${
                                        errors.descricao ? "border-red-500" : ""
                                      }`}
                                    />
                                  )}
                                />
                              </div>
                              <div className="relative shrink-0 mt-2">
                                {errors.descricao && (
                                  <p className="text-red-500">
                                    {errors.descricao.message}
                                  </p>
                                )}
                              </div>

                              <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-6" />
                              <Button
                                type="submit"
                                className="bg-emerald-500 text-white"
                              >
                                Adicionar
                              </Button>
                            </div>
                          </div>
                        </div>
                      </form>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Label className="cursor-pointer text-indigo-600 dark:text-indigo-300">
                      <Info width={15} />
                    </Label>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Apenas o perfil Administrador pode acessar</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
          <table className="min-w-full table-fixed bg-white dark:bg-indigo-600 rounded-lg overflow-hidden shadow-lg">
            <thead>
              <tr>
                <th className="w-1/6 py-3 px-4 border-b border-gray-200 dark:border-indigo-800 dark:bg-indigo-600 dark:text-indigo-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
                  ID
                </th>
                <th className="w-4/6 py-3 px-4 border-b border-gray-200 dark:border-indigo-800 dark:bg-indigo-600 dark:text-indigo-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
                  Nome do Perfil
                </th>
                <th className="w-1/6 py-3 px-4 border-b border-gray-200 dark:border-indigo-800 dark:bg-indigo-600 dark:text-indigo-300 text-gray-700 bg-gray-50 text-left text-sm font-medium">
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
                  <td className="w-1/6 py-2 px-4 border-b border-gray-200 dark:border-indigo-800 text-left text-sm text-gray-900 dark:text-indigo-300">
                    {profile.id}
                  </td>
                  <td className="w-4/6 py-2 px-4 border-b border-gray-200 dark:border-indigo-800 text-left text-sm text-gray-900 dark:text-indigo-300">
                    {profile.descricao}
                  </td>
                  <td className="w-1/6 py-2 px-4 border-b border-gray-200 dark:border-indigo-800 text-left text-sm text-gray-900 dark:text-indigo-300">
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

        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </CardContent>
    </Card>
  );
}
