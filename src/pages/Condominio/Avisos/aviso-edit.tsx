import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "@tanstack/react-router";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import type { z } from "zod";
import { FormErrorMessage } from "../../../components/form-error-message";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { InputDate } from "../../../components/ui/input-date";
import { Label } from "../../../components/ui/label";
import { formatDateToInput } from "../../../lib/utils";
import { Checkbox } from "../../../components/ui/checkbox";
import { schemaAvisoEdit } from "../../../schemas/aviso-schema";
import { fetchAvisoById, updateAviso } from "../../../services/avisos";

interface AvisoResponse {
  id: string;
  titulo: string;
  descricao: string;
  tipo: string;
  dataInicio: string;
  dataFim?: string;
  destaque: boolean;
  createdAt: string;
  updatedAt: string;
}

export function AvisoEdit() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams({ strict: false });
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<z.infer<typeof schemaAvisoEdit>>({
    resolver: zodResolver(schemaAvisoEdit),
    defaultValues: {
      titulo: "",
      descricao: "",
      tipo: "",
      dataInicio: "",
      dataFim: "",
      destaque: false,
    },
  });

  const destaque = watch("destaque");

  useEffect(() => {
    const loadAviso = async () => {
      if (!id) {
        toast.error(t("condominio.avisos.edit.notFound"));
        navigate({ to: "/condominio/avisos" });
        return;
      }

      try {
        const aviso: AvisoResponse = await fetchAvisoById(id);
        // Formatar data para o formato YYYY-MM-DD do input date
        const dataInicioFormatada = aviso.dataInicio
          ? new Date(aviso.dataInicio).toISOString().split("T")[0]
          : "";
        const dataFimFormatada = aviso.dataFim
          ? new Date(aviso.dataFim).toISOString().split("T")[0]
          : "";
        reset({
          titulo: aviso.titulo || "",
          descricao: aviso.descricao || "",
          tipo: aviso.tipo || "",
          dataInicio: dataInicioFormatada,
          dataFim: dataFimFormatada,
          destaque: aviso.destaque || false,
        });
      } catch (error) {
        console.error("Erro ao carregar aviso:", error);
        toast.error(t("condominio.avisos.edit.errorLoad"));
        navigate({ to: "/condominio/avisos" });
      }
    };
    loadAviso();
  }, [id, reset, navigate]);

  const onSubmit = async (data: z.infer<typeof schemaAvisoEdit>) => {
    if (!id) return;

    try {
      const payload: {
        titulo?: string;
        descricao?: string;
        tipo?: string;
        dataInicio?: string;
        dataFim?: string;
        destaque?: boolean;
      } = {};
      if (data.titulo !== undefined) payload.titulo = data.titulo;
      if (data.descricao !== undefined) payload.descricao = data.descricao;
      if (data.tipo !== undefined) payload.tipo = data.tipo || undefined;
      if (data.dataInicio !== undefined) payload.dataInicio = data.dataInicio;
      if (data.dataFim !== undefined)
        payload.dataFim = data.dataFim || undefined;
      if (data.destaque !== undefined) payload.destaque = data.destaque;

      await updateAviso(id, payload);

      toast.success(t("condominio.avisos.edit.success"));
      navigate({ to: "/condominio/avisos" });
    } catch (error: unknown) {
      console.error("Erro ao atualizar aviso:", error);
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || t("condominio.avisos.edit.error");
      toast.error(t("condominio.avisos.edit.error"), {
        description: message,
      });
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-full bg-white rounded-lg shadow-md p-6 dark:bg-emerald-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-300">
            Editar Aviso
          </h1>
          <Button
            type="button"
            variant="ghost"
            className="text-lg text-emerald-600 dark:text-emerald-300 flex items-center gap-2"
            onClick={() => navigate({ to: "/condominio/avisos" })}
          >
            <ArrowLeft /> Voltar
          </Button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="titulo">Título *</Label>
            <Input
              id="titulo"
              placeholder="Digite o título do aviso"
              {...register("titulo")}
            />
            <FormErrorMessage message={errors.titulo?.message} />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="descricao">Descrição *</Label>
            <textarea
              id="descricao"
              placeholder="Digite a descrição do aviso"
              {...register("descricao")}
              rows={4}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <FormErrorMessage message={errors.descricao?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo (opcional)</Label>
            <Input
              id="tipo"
              placeholder="Ex: Informativo, Urgente"
              {...register("tipo")}
            />
            <FormErrorMessage message={errors.tipo?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataInicio">Data de Início *</Label>
            <Controller
              name="dataInicio"
              control={control}
              render={({ field }) => (
                <InputDate
                  id="dataInicio"
                  value={field.value || undefined}
                  onChange={(date) => {
                    field.onChange(date ? formatDateToInput(date) : "");
                  }}
                />
              )}
            />
            <FormErrorMessage message={errors.dataInicio?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataFim">Data de Fim (opcional)</Label>
            <Controller
              name="dataFim"
              control={control}
              render={({ field }) => (
                <InputDate
                  id="dataFim"
                  value={field.value || undefined}
                  onChange={(date) => {
                    field.onChange(date ? formatDateToInput(date) : "");
                  }}
                  placeholder="Selecione a data de fim"
                />
              )}
            />
            <FormErrorMessage message={errors.dataFim?.message} />
          </div>

          <div className="space-y-2 flex items-center gap-2">
            <Checkbox
              id="destaque"
              checked={destaque}
              onCheckedChange={(checked) => setValue("destaque", !!checked)}
            />
            <Label htmlFor="destaque" className="cursor-pointer">
              Marcar como destaque
            </Label>
            <FormErrorMessage message={errors.destaque?.message} />
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
              onClick={() => navigate({ to: "/condominio/avisos" })}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
