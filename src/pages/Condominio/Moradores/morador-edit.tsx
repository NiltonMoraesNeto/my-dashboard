import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "@tanstack/react-router";
import { toast } from "sonner";
import type { z } from "zod";
import { FormErrorMessage } from "../../../components/form-error-message";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { schemaMoradorEdit } from "../../../schemas/morador-schema";
import { fetchMoradorById, updateMorador } from "../../../services/moradores";

interface MoradorResponse {
  id: string;
  nome: string;
  email: string;
  cep?: string;
  createdAt: string;
  updatedAt: string;
}

export function MoradorEdit() {
  const navigate = useNavigate();
  const { id } = useParams({ strict: false });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<z.infer<typeof schemaMoradorEdit>>({
    resolver: zodResolver(schemaMoradorEdit),
    defaultValues: {
      nome: "",
      email: "",
      password: "",
      cep: "",
    },
  });

  useEffect(() => {
    const loadMorador = async () => {
      if (!id) {
        toast.error("Morador não encontrado");
        navigate({ to: "/condominio/moradores" });
        return;
      }

      try {
        const morador: MoradorResponse = await fetchMoradorById(id);
        reset({
          nome: morador.nome || "",
          email: morador.email || "",
          cep: morador.cep || "",
          password: "",
        });
      } catch (error) {
        console.error("Erro ao carregar morador:", error);
        toast.error("Erro ao carregar dados do morador");
        navigate({ to: "/condominio/moradores" });
      }
    };
    loadMorador();
  }, [id, reset, navigate]);

  const onSubmit = async (data: z.infer<typeof schemaMoradorEdit>) => {
    if (!id) return;

    try {
      const payload: any = {
        nome: data.nome,
        email: data.email,
        cep: data.cep || undefined,
      };

      if (data.password && data.password.length > 0) {
        payload.password = data.password;
      }

      await updateMorador(id, payload);

      toast.success("Morador atualizado com sucesso!");
      navigate({ to: "/condominio/moradores" });
    } catch (error: any) {
      console.error("Erro ao atualizar morador:", error);
      const message = error?.response?.data?.message || "Erro ao atualizar morador";
      toast.error("Erro ao atualizar morador", {
        description: message,
      });
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-full bg-white rounded-lg shadow-md p-6 dark:bg-emerald-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-300">
            Editar Morador
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
            <Label htmlFor="password">Nova senha (opcional)</Label>
            <Input
              id="password"
              type="password"
              placeholder="Deixe em branco para manter a senha atual"
              {...register("password")}
            />
            <FormErrorMessage message={errors.password?.message} />
            <p className="text-sm text-gray-500">Deixe em branco para manter a senha atual</p>
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

