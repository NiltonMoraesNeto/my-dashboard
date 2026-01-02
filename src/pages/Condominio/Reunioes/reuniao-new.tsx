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
import { schemaReuniaoNew } from "../../../schemas/reuniao-schema";
import { createReuniao } from "../../../services/reunioes";

export function ReuniaoNew() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<z.infer<typeof schemaReuniaoNew>>({
    resolver: zodResolver(schemaReuniaoNew),
    defaultValues: {
      titulo: "",
      data: "",
      hora: "",
      local: "",
      tipo: "Assembleia",
      pauta: "",
      status: "Agendada",
    },
  });

  const onSubmit = async (data: z.infer<typeof schemaReuniaoNew>) => {
    try {
      await createReuniao({
        titulo: data.titulo,
        data: data.data,
        hora: data.hora,
        local: data.local || undefined,
        tipo: data.tipo || "Assembleia",
        pauta: data.pauta || undefined,
        status: data.status || "Agendada",
      });

      toast.success("Reunião criada com sucesso!");
      reset();
      navigate({ to: "/condominio/reunioes" });
    } catch (error: any) {
      console.error("Erro ao criar reunião:", error);
      const message = error?.response?.data?.message || "Erro ao criar reunião";
      toast.error("Erro ao criar reunião", {
        description: message,
      });
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-full bg-white rounded-lg shadow-md p-6 dark:bg-emerald-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-300">
            Adicionar Nova Reunião
          </h1>
          <Button
            type="button"
            variant="ghost"
            className="text-lg text-emerald-600 dark:text-emerald-300 flex items-center gap-2"
            onClick={() => navigate({ to: "/condominio/reunioes" })}
          >
            <ArrowLeft /> Voltar
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título *</Label>
            <Input id="titulo" placeholder="Digite o título da reunião" {...register("titulo")} />
            <FormErrorMessage message={errors.titulo?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="data">Data *</Label>
            <Input id="data" type="date" {...register("data")} />
            <FormErrorMessage message={errors.data?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hora">Hora *</Label>
            <Input id="hora" type="time" {...register("hora")} />
            <FormErrorMessage message={errors.hora?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="local">Local (opcional)</Label>
            <Input id="local" placeholder="Digite o local da reunião" {...register("local")} />
            <FormErrorMessage message={errors.local?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo (opcional)</Label>
            <Input id="tipo" placeholder="Ex: Assembleia, Ordinária" {...register("tipo")} />
            <FormErrorMessage message={errors.tipo?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status (opcional)</Label>
            <Input id="status" placeholder="Ex: Agendada, Realizada" {...register("status")} />
            <FormErrorMessage message={errors.status?.message} />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="pauta">Pauta (opcional)</Label>
            <textarea
              id="pauta"
              placeholder="Digite a pauta da reunião"
              {...register("pauta")}
              rows={4}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <FormErrorMessage message={errors.pauta?.message} />
          </div>

          <div className="md:col-span-2 flex gap-4">
            <Button type="submit" disabled={isSubmitting} className="bg-emerald-500 text-white">
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/condominio/reunioes" })}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

