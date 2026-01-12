import {
  type Control,
  Controller,
  type FieldErrors,
  type UseFormHandleSubmit,
} from "react-hook-form";
import type { z } from "zod";
import { useAuth } from "../contexts/auth-context";
import type { schemaAddProfile } from "../schemas/profile-schema";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";

interface ModalAddNewProfileProps {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
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
}

export function ModalAddNewProfile({
  openModal,
  setOpenModal,
  handleSubmit,
  onSubmit,
  control,
  errors,
}: ModalAddNewProfileProps) {
  const { profileUser } = useAuth();
  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogTrigger asChild>
        <Button disabled={profileUser !== "SuperAdmin"} className="max-sm:mb-4">
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
                            className={`${errors.descricao ? "border-red-500" : ""}`}
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
                    <Button type="submit" className="bg-emerald-500 text-white">
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
  );
}
