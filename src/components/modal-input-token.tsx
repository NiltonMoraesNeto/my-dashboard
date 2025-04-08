import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { schemaNewPassword } from "../schemas/new-password-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { resetCodeDelete, resetPassword } from "../services/usuarios";
import { useUserStore } from "../stores/use-user";
import { isSuccessRequest } from "../utils/response-request";

interface ModalInputTokenProps {
  openModalInputToken: boolean;
  setOpenModalInputToken: React.Dispatch<React.SetStateAction<boolean>>;
  tokenIsValid: boolean;
  setTokenIsValid: (value: React.SetStateAction<boolean>) => void;
}

export function ModalInputToken({
  openModalInputToken,
  setOpenModalInputToken,
  tokenIsValid,
  setTokenIsValid,
}: ModalInputTokenProps) {
  const [valueToken, setValueToken] = useState("");
  const emailUser = useUserStore((state) => state.emailUser);
  const updateEmailUser = useUserStore((state) => state.updateEmailUser);

  const handleValidarToken = () => {
    const resetCode = localStorage.getItem("resetCode");
    if (resetCode === valueToken) {
      setTokenIsValid(true);
      toast.success("Sucesso", {
        description: "Token válido",
      });
    } else {
      toast.error("Error", {
        description: "Token inválido",
      });
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schemaNewPassword>>({
    resolver: zodResolver(schemaNewPassword),
    defaultValues: {
      newPassword: "",
      newPasswordConfirmation: "",
    },
  });

  const handleSubmitNewPassword: SubmitHandler<{
    newPassword: string;
    newPasswordConfirmation: string;
  }> = async (data) => {
    const response = (await resetPassword(
      emailUser,
      valueToken,
      data.newPassword
    )) as { status?: number };
    if (isSuccessRequest(response?.status)) {
      await resetCodeDelete(emailUser, valueToken);
      localStorage.removeItem("resetCode");
      updateEmailUser("");
      toast.success("Sucesso", {
        description: "Senha alterada com sucesso",
      });
      setOpenModalInputToken(false);
      setValueToken("");
      setTokenIsValid(false);
    } else {
      toast.error("Error", {
        description: "Erro ao alterar a Senha",
      });
    }
  };
  return (
    <Dialog open={openModalInputToken} onOpenChange={setOpenModalInputToken}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="sm:max-w-[425px] lg:max-w-[725px] w-full">
        <DialogHeader>
          <DialogTitle>Resetar a senha</DialogTitle>
          <DialogDescription>Digite seu token de validação</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {tokenIsValid ? (
            <>
              <div className="flex flex-col gap-4">
                <Label htmlFor="newPassword" className="text-right">
                  Nova Senha
                </Label>
                <div></div>
                <Controller
                  name="newPassword"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="password"
                      placeholder="Digite a nova senha"
                      className={`w-full ${
                        errors.newPassword ? "border-red-500" : ""
                      }`}
                    />
                  )}
                />
                <Label className="text-red-500">
                  {errors.newPassword?.message}
                </Label>
              </div>
              <div className="flex flex-col gap-4">
                <Label htmlFor="newPasswordConfirmation" className="text-right">
                  Confirme a Nova Senha
                </Label>
                <Controller
                  name="newPasswordConfirmation"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="password"
                      placeholder="Digite a confirmação da nova senha"
                      className={`w-full ${
                        errors.newPasswordConfirmation ? "border-red-500" : ""
                      }`}
                    />
                  )}
                />
                <Label className="text-red-500">
                  {errors.newPasswordConfirmation?.message}
                </Label>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-4">
              <Label htmlFor="token" className="text-right">
                Token
              </Label>
              <InputOTP
                maxLength={4}
                value={valueToken}
                onChange={(value) => setValueToken(value)}
                className="w-full"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          )}
        </div>
        <div className="flex justify-start mt-4">
          {tokenIsValid ? (
            <Button
              type="button"
              onClick={handleSubmit(handleSubmitNewPassword)}
            >
              Alterar Senha
            </Button>
          ) : (
            <Button type="button" onClick={handleValidarToken}>
              Validar Token
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
