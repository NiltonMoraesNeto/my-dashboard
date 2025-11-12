import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import type { ProfileList } from "../model/profile-model";
import { schemaSignUp } from "../schemas/sign-up-schema";
import api from "../services/api";
import { fetchProfileList } from "../services/profile";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface ModalSignUpProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function ModalSignUp({ open, setOpen }: ModalSignUpProps) {
  const [profiles, setProfiles] = useState<ProfileList[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof schemaSignUp>>({
    resolver: zodResolver(schemaSignUp),
    defaultValues: {
      nome: "",
      email: "",
      password: "",
      confirmPassword: "",
      perfilId: undefined,
      cep: "",
    },
  });

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        const response = await fetchProfileList(1, 100, "");
        if (response?.data) {
          setProfiles(response.data);
        } else if (Array.isArray(response)) {
          setProfiles(response);
        }
      } catch (error) {
        console.error("Erro ao carregar perfis:", error);
        toast.error("Erro ao carregar perfis");
      }
    };

    if (open) {
      loadProfiles();
    }
  }, [open]);

  const onSubmit = async (data: z.infer<typeof schemaSignUp>) => {
    setIsLoading(true);
    try {
      const response = await api.post("/users", {
        nome: data.nome,
        email: data.email,
        password: data.password,
        perfilId: data.perfilId,
        cep: data.cep || undefined,
      });

      if (response.status === 201) {
        toast.success("Sucesso", {
          description: "Usuário criado com sucesso! Faça login para continuar.",
        });
        reset();
        setOpen(false);
      }
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao criar usuário. Tente novamente.";
      toast.error("Erro", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto"
        onPointerDownOutside={(e) => {
          // Permite fechar apenas clicando fora, não durante submit
          if (isLoading) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-indigo-600 dark:text-indigo-300">
            Criar Nova Conta
          </DialogTitle>
          <DialogDescription>Preencha os dados abaixo para criar sua conta</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-indigo-600 dark:text-white">
              Nome Completo *
            </Label>
            <Input
              id="nome"
              {...register("nome")}
              placeholder="Digite seu nome completo"
              className="border-indigo-200 focus-visible:ring-indigo-500"
            />
            {errors.nome && <p className="text-sm text-red-500">{errors.nome.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-indigo-600 dark:text-white">
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="seu@email.com"
              className="border-indigo-200 focus-visible:ring-indigo-500"
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-indigo-600 dark:text-white">
              Senha *
            </Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              placeholder="Mínimo 6 caracteres"
              className="border-indigo-200 focus-visible:ring-indigo-500"
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-indigo-600 dark:text-white">
              Confirmar Senha *
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              placeholder="Digite a senha novamente"
              className="border-indigo-200 focus-visible:ring-indigo-500"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="perfilId" className="text-indigo-600 dark:text-white">
              Perfil *
            </Label>
            <select
              id="perfilId"
              {...register("perfilId", { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-indigo-900 dark:text-white"
            >
              <option value="">Selecione um perfil</option>
              {profiles.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.descricao}
                </option>
              ))}
            </select>
            {errors.perfilId && <p className="text-sm text-red-500">{errors.perfilId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cep" className="text-indigo-600 dark:text-white">
              CEP (Opcional)
            </Label>
            <Input
              id="cep"
              {...register("cep")}
              placeholder="00000-000"
              maxLength={8}
              className="border-indigo-200 focus-visible:ring-indigo-500"
            />
            {errors.cep && <p className="text-sm text-red-500">{errors.cep.message}</p>}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setOpen(false);
              }}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-indigo-500 text-white hover:bg-indigo-600"
            >
              {isLoading ? "Criando..." : "Criar Conta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
