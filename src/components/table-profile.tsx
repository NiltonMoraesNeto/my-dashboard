import { Info, Search } from "lucide-react";
import type {
  Control,
  FieldErrors,
  UseFormHandleSubmit,
} from "react-hook-form";
import type { z } from "zod";
import type { ProfileList } from "../model/profile-model";
import type { schemaAddProfile } from "../schemas/profile-schema";
import { ModalAddNewProfile } from "./modal-add-new-profile";
import { Pagination } from "./pagination";
import { TableListProfile } from "./table-list-profile";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

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
    {
      descricao: string;
    }
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
  handleListData: () => void;
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
  handleListData,
}: TableProfileProps) {
  return (
    <Card className="flex flex-col mt-5 dark:bg-indigo-800">
      <CardHeader className="">
        <CardTitle className="text-xl font-sans tracking-[0.6px]">
          <div className="flex justify-between items-center mb-6 max-sm:block">
            <div className="flex items-center gap-2">
              <ModalAddNewProfile
                openModal={openModal}
                setOpenModal={setOpenModal}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                control={control}
                errors={errors}
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Label className="cursor-pointer text-indigo-600 dark:text-indigo-300">
                      <Info width={15} />
                    </Label>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Apenas o perfil Super Adm pode acessar</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
        <TableListProfile
          profileList={profileList}
          handleListData={handleListData}
        />
        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </CardContent>
    </Card>
  );
}
