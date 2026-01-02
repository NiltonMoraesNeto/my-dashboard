import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import type { z } from "zod";
import { FormErrorMessage } from "../../../components/form-error-message";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { schemaMoradorNew } from "../../../schemas/morador-schema";
import { createMorador } from "../../../services/moradores";

export function MoradorNew() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<z.infer<typeof schemaMoradorNew>>({
    resolver: zodResolver(schemaMoradorNew),
    defaultValues: {
      nome: "",
      email: "",
      password: "",
      cep: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof schemaMoradorNew>) => {
    try {
      await createMorador({
        nome: data.nome,
        email: data.email,
        password: data.password || undefined,
        cep: data.cep || undefined,
      });

      toast.success("Morador criado com sucesso!");
      reset();
      navigate({ to: "/condominio/moradores" });
    } catch (error: any) {
      console.error("Erro ao criar morador:", error);
      const message = error?.response?.data?.message || "Erro ao criar morador";
      toast.error("Erro ao criar morador", {
        description: message,
      });
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-full bg-white rounded-lg shadow-md p-6 dark:bg-emerald-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-300">
            Adicionar Novo Morador
          </h1>
          <Button
            type="button"
            variant="ghost"
            className="text-lg text-emerald-600 dark:text-emerald-300 flex items-center gap-2"
            onClick={() => navigate({ to: "/condominio/moradores" })}
          >
            <ArrowLeft /> Voltar
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome completo *</Label>
            <Input id="nome" placeholder="Digite o nome" {...register("nome")} />
            <FormErrorMessage message={errors.nome?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" placeholder="Digite o email" {...register("email")} />
            <FormErrorMessage message={errors.email?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha provisória (opcional)</Label>
            <Input
              id="password"
              type="password"
              placeholder="Deixe em branco para usar senha padrão (123456)"
              {...register("password")}
            />
            <FormErrorMessage message={errors.password?.message} />
            <p className="text-sm text-gray-500">Se não informada, a senha padrão será 123456</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cep">CEP (opcional)</Label>
            <Input id="cep" placeholder="Digite o CEP" {...register("cep")} />
            <FormErrorMessage message={errors.cep?.message} />
          </div>

          <div className="md:col-span-2 flex gap-4">
            <Button type="submit" disabled={isSubmitting} className="bg-emerald-500 text-white">
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/condominio/moradores" })}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

