import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { useAuth } from "../contexts/auth-context";
import { schemaChangePassword } from "../schemas/change-password-schema";
import { changePassword } from "../services/usuarios";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
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
import { Label } from "./ui/label";

export function ModalProfileUser() {
  const { dataUser, profileUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof schemaChangePassword>>({
    resolver: zodResolver(schemaChangePassword),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const handleClose = () => {
    reset();
    setIsOpen(false);
  };

  const onSubmit = async (values: z.infer<typeof schemaChangePassword>) => {
    try {
      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success("Senha alterada com sucesso");
      reset();
      setIsOpen(false);
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      toast.error("Erro ao alterar senha", {
        description: "Verifique a senha atual e tente novamente",
      });
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        } else {
          setIsOpen(true);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="focus:outline-none hover:text-gray-300 dark:bg-indigo-900 dark:text-white">
          <User size={24} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dados do Usuário</DialogTitle>
          <DialogDescription asChild>
            <div className="w-full mx-auto">
              <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <div className="relative px-6 pt-12 pb-6">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="relative shrink-0">
                      <Avatar className="h-24 w-24 rounded-full border-2 border-zinc-200/80 dark:border-zinc-800/80 shadow-xs">
                        <AvatarImage
                          src={dataUser?.avatar || undefined}
                          alt={dataUser?.nome || "Avatar do usuário"}
                          className="rounded-full object-cover"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-2xl font-semibold">
                          {dataUser?.nome?.charAt(0).toUpperCase() || "U"}
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

                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                      Alterar senha
                    </h3>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Senha atual *</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          placeholder="Digite a senha atual"
                          {...register("currentPassword")}
                        />
                        {errors.currentPassword && (
                          <span className="text-sm text-red-500">
                            {errors.currentPassword.message}
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">Nova senha *</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          placeholder="Digite a nova senha"
                          {...register("newPassword")}
                        />
                        {errors.newPassword && (
                          <span className="text-sm text-red-500">{errors.newPassword.message}</span>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmNewPassword">Confirmar nova senha *</Label>
                        <Input
                          id="confirmNewPassword"
                          type="password"
                          placeholder="Confirme a nova senha"
                          {...register("confirmNewPassword")}
                        />
                        {errors.confirmNewPassword && (
                          <span className="text-sm text-red-500">
                            {errors.confirmNewPassword.message}
                          </span>
                        )}
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? "Salvando..." : "Salvar nova senha"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleClose}
                          disabled={isSubmitting}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
