import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { schemaResetPassword } from "../schemas/reset-password-schema";
import { resetPasswordSendToken } from "../services/usuarios";
import { useUserStore } from "../stores/use-user";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface ModalResetPasswordProps {
  openModalResetPassword: boolean;
  setOpenModalResetPassword: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenModalInputToken: (value: React.SetStateAction<boolean>) => void;
}

export function ModalResetPassword({
  openModalResetPassword,
  setOpenModalResetPassword,
  setOpenModalInputToken,
}: ModalResetPasswordProps) {
  const updateEmailUser = useUserStore((state) => state.updateEmailUser);
  const handleOpenModalToken = () => {
    setOpenModalResetPassword(false);
    setOpenModalInputToken(true);
  };

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof schemaResetPassword>>({
    resolver: zodResolver(schemaResetPassword),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmitResetPassword: SubmitHandler<{ email: string }> = async (data) => {
    try {
      updateEmailUser(data.email);
      const response = await resetPasswordSendToken(data.email);
      if (response) {
        localStorage.setItem("resetCode", response.resetCode);
        toast.success("Sucesso", {
          description: "Token enviado com sucesso",
        });
        setValue("email", "");
        setOpenModalResetPassword(false);
        setOpenModalInputToken(true);
      } else {
        toast.error("Error", {
          description: "Email não encontrado",
        });
      }
    } catch (error) {
      console.error("Erro ao enviar solicitação", error);
      toast.error("Error", {
        description: "Email não encontrado",
      });
    }
  };
  return (
    <Dialog open={openModalResetPassword} onOpenChange={setOpenModalResetPassword}>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className="text-sm font-medium text-orange-400 hover:text-orange-500"
        >
          Esqueceu a senha?
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] lg:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>Resetar a senha</DialogTitle>
          <DialogDescription>
            Digite seu email cadastrado para receber o token de validação
          </DialogDescription>
        </DialogHeader>
        <div className="gap-4 py-4">
          <div className="items-center gap-4">
            <Label htmlFor="name" className="text-right mb-4">
              Email
            </Label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="email"
                  placeholder="Digite o seu email"
                  className={`w-full ${errors.email ? "border-red-500" : ""}`}
                />
              )}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="link" onClick={handleOpenModalToken}>
            Já tem o token? Clique aqui para validar e trocar a senha
          </Button>
          <Button type="button" onClick={handleSubmit(handleSubmitResetPassword)}>
            Enviar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
