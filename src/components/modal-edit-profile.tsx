import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { schemaAddProfile } from "../schemas/profile-schema";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { updateProfile } from "../services/profile";
import { isSuccessRequest } from "../utils/response-request";
import { toast } from "sonner";

interface ModalEditProfileProps {
  profileToEdit: { id: number; descricao: string } | null;
  closeEditDialog: () => void;
  handleListData: () => void;
}

export function ModalEditProfile({
  profileToEdit,
  closeEditDialog,
  handleListData,
}: ModalEditProfileProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<z.infer<typeof schemaAddProfile>>({
    resolver: zodResolver(schemaAddProfile),
    defaultValues: {
      descricao: profileToEdit ? profileToEdit.descricao : "",
    },
  });

  useEffect(() => {
    if (profileToEdit) {
      setValue("descricao", profileToEdit.descricao);
    }
  }, [profileToEdit, setValue]);

  async function onSubmit(values: z.infer<typeof schemaAddProfile>) {
    console.log("🚀 values - ", values);

    try {
      const response = await updateProfile(
        profileToEdit?.id !== undefined ? profileToEdit.id : 0,
        values.descricao
      );
      if (response && isSuccessRequest(response.status)) {
        toast.success("Sucesso", {
          description: "Perfil editado com sucesso",
        });
        closeEditDialog();
        handleListData();
      } else {
        toast.error("Error", {
          description: "Erro ao editar o Perfil",
        });
      }
    } catch (error) {
      console.error("Erro ao deletar perfil:", error);
      toast.error("Error", {
        description: "Erro ao editar o Perfil",
      });
    }
  }

  return (
    <Dialog
      open={profileToEdit !== null}
      onOpenChange={(open) => !open && closeEditDialog()}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
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
                    <Button type="submit" className="bg-emerald-500 text-white">
                      Salvar
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
