import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "@tanstack/react-router";
import { toast } from "sonner";
import type { z } from "zod";
import { FormErrorMessage } from "../../../components/form-error-message";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { InputDate } from "../../../components/ui/input-date";
import { Label } from "../../../components/ui/label";
import { formatDateToInput } from "../../../lib/utils";
import { schemaReuniaoEdit } from "../../../schemas/reuniao-schema";
import { fetchReuniaoById, updateReuniao } from "../../../services/reunioes";

interface ReuniaoResponse {
  id: string;
  titulo: string;
  data: string;
  hora: string;
  local?: string;
  tipo: string;
  pauta?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export function ReuniaoEdit() {
  const navigate = useNavigate();
  const { id } = useParams({ strict: false });
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<z.infer<typeof schemaReuniaoEdit>>({
    resolver: zodResolver(schemaReuniaoEdit),
    defaultValues: {
      titulo: "",
      data: "",
      hora: "",
      local: "",
      tipo: "",
      pauta: "",
      status: "",
    },
  });

  useEffect(() => {
    const loadReuniao = async () => {
      if (!id) {
        toast.error("Reunião não encontrada");
        navigate({ to: "/condominio/reunioes" });
        return;
      }

      try {
        const reuniao: ReuniaoResponse = await fetchReuniaoById(id);
        // Formatar data para o formato YYYY-MM-DD do input date
        const dataFormatada = reuniao.data
          ? new Date(reuniao.data).toISOString().split("T")[0]
          : "";
        reset({
          titulo: reuniao.titulo || "",
          data: dataFormatada,
          hora: reuniao.hora || "",
          local: reuniao.local || "",
          tipo: reuniao.tipo || "",
          pauta: reuniao.pauta || "",
          status: reuniao.status || "",
        });
      } catch (error) {
        console.error("Erro ao carregar reunião:", error);
        toast.error("Erro ao carregar dados da reunião");
        navigate({ to: "/condominio/reunioes" });
      }
    };
    loadReuniao();
  }, [id, reset, navigate]);

  const onSubmit = async (data: z.infer<typeof schemaReuniaoEdit>) => {
    if (!id) return;

    try {
      const payload: {
        titulo?: string;
        data?: string;
        hora?: string;
        local?: string;
        tipo?: string;
        pauta?: string;
        status?: string;
      } = {};
      if (data.titulo !== undefined) payload.titulo = data.titulo;
      if (data.data !== undefined) payload.data = data.data;
      if (data.hora !== undefined) payload.hora = data.hora;
      if (data.local !== undefined) payload.local = data.local || undefined;
      if (data.tipo !== undefined) payload.tipo = data.tipo || undefined;
      if (data.pauta !== undefined) payload.pauta = data.pauta || undefined;
      if (data.status !== undefined) payload.status = data.status || undefined;

      await updateReuniao(id, payload);

      toast.success("Reunião atualizada com sucesso!");
      navigate({ to: "/condominio/reunioes" });
    } catch (error: unknown) {
      console.error("Erro ao atualizar reunião:", error);
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Erro ao atualizar reunião";
      toast.error("Erro ao atualizar reunião", {
        description: message,
      });
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-full bg-white rounded-lg shadow-md p-6 dark:bg-emerald-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-300">
            Editar Reunião
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

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="space-y-2">
            <Label htmlFor="titulo">Título *</Label>
            <Input
              id="titulo"
              placeholder="Digite o título da reunião"
              {...register("titulo")}
            />
            <FormErrorMessage message={errors.titulo?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="data">Data *</Label>
            <Controller
              name="data"
              control={control}
              render={({ field }) => (
                <InputDate
                  id="data"
                  value={field.value || undefined}
                  onChange={(date) => {
                    field.onChange(date ? formatDateToInput(date) : "");
                  }}
                />
              )}
            />
            <FormErrorMessage message={errors.data?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hora">Hora *</Label>
            <Input id="hora" type="time" {...register("hora")} />
            <FormErrorMessage message={errors.hora?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="local">Local (opcional)</Label>
            <Input
              id="local"
              placeholder="Digite o local da reunião"
              {...register("local")}
            />
            <FormErrorMessage message={errors.local?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo (opcional)</Label>
            <Input
              id="tipo"
              placeholder="Ex: Assembleia, Ordinária"
              {...register("tipo")}
            />
            <FormErrorMessage message={errors.tipo?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status (opcional)</Label>
            <Input
              id="status"
              placeholder="Ex: Agendada, Realizada"
              {...register("status")}
            />
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
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-500 text-white"
            >
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
