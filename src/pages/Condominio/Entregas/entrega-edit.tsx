import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "@tanstack/react-router";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import type { z } from "zod";
import { FormErrorMessage } from "../../../components/form-error-message";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { InputDateTime } from "../../../components/ui/input-datetime";
import { InputFile } from "../../../components/ui/input-file";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { schemaEntregaEdit } from "../../../schemas/entrega-schema";
import { fetchEntrega, updateEntrega } from "../../../services/entregas";
import { fetchUnidadesList } from "../../../services/unidades";

interface UnidadeOption {
  id: string;
  numero: string;
  bloco?: string;
  apartamento?: string;
}

export function EntregaEdit() {
  const navigate = useNavigate();
  const { id } = useParams({ strict: false });
  const { t } = useTranslation();
  const [unidades, setUnidades] = useState<UnidadeOption[]>([]);
  const [loadingUnidades, setLoadingUnidades] = useState(true);
  const [loadingEntrega, setLoadingEntrega] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<z.infer<typeof schemaEntregaEdit>>({
    resolver: zodResolver(schemaEntregaEdit),
    defaultValues: {
      titulo: "",
      dataHora: "",
      nomeRecebedor: "",
      recebidoPor: undefined,
      unidadeId: "",
    },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        // Carregar unidades
        const unidadesResponse = await fetchUnidadesList(1, 1000, "");
        if (unidadesResponse?.data) {
          setUnidades(unidadesResponse.data);
        }

        // Carregar entrega
        if (id) {
          const entrega = await fetchEntrega(id);
          const dataHoraLocal = new Date(entrega.dataHora);

          reset({
            titulo: entrega.titulo,
            dataHora: dataHoraLocal.toISOString(),
            nomeRecebedor: entrega.nomeRecebedor,
            recebidoPor: entrega.recebidoPor as "portaria" | "zelador" | "morador",
            unidadeId: entrega.unidadeId,
            anexo: entrega.anexo || undefined,
          });
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error(t("condominio.entregas.edit.errorLoad"));
      } finally {
        setLoadingUnidades(false);
        setLoadingEntrega(false);
      }
    };
    loadData();
  }, [id, reset]);

  const onSubmit = async (data: z.infer<typeof schemaEntregaEdit>) => {
    if (!id) return;

    try {
      const updateData: {
        titulo?: string;
        dataHora?: string;
        nomeRecebedor?: string;
        recebidoPor?: "portaria" | "zelador" | "morador";
        unidadeId?: string;
      } = {};

      if (data.titulo !== undefined) {
        updateData.titulo = data.titulo;
      }
      if (data.dataHora) {
        const dataHoraDate = data.dataHora instanceof Date 
          ? data.dataHora 
          : typeof data.dataHora === 'string'
          ? new Date(data.dataHora)
          : new Date();
        updateData.dataHora = dataHoraDate.toISOString();
      }
      if (data.nomeRecebedor !== undefined) {
        updateData.nomeRecebedor = data.nomeRecebedor;
      }
      if (data.recebidoPor !== undefined) {
        updateData.recebidoPor = data.recebidoPor;
      }
      if (data.unidadeId !== undefined) {
        updateData.unidadeId = data.unidadeId;
      }

      // Enviar anexo apenas se for um novo arquivo (File), não se for string (arquivo existente)
      const anexoToSend = data.anexo instanceof File ? data.anexo : undefined;

      await updateEntrega(id, updateData, anexoToSend);

      toast.success(t("condominio.entregas.edit.success"));
      navigate({ to: "/condominio/entregas" });
    } catch (error: unknown) {
      console.error("Erro ao atualizar entrega:", error);
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || t("condominio.entregas.edit.error");
      toast.error(t("condominio.entregas.edit.error"), {
        description: message,
      });
    }
  };

  if (loadingEntrega) {
    return <div className="p-6">{t("condominio.entregas.edit.loading")}</div>;
  }

  return (
    <div className="p-6">
      <div className="max-w-full bg-white rounded-lg shadow-md p-6 dark:bg-emerald-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-300">
            {t("condominio.entregas.edit.title")}
          </h1>
          <Button
            type="button"
            variant="ghost"
            className="text-lg text-emerald-600 dark:text-emerald-300 flex items-center gap-2"
            onClick={() => navigate({ to: "/condominio/entregas" })}
          >
            <ArrowLeft /> {t("condominio.entregas.edit.back")}
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="titulo">{t("condominio.entregas.edit.titulo")}</Label>
            <Input
              id="titulo"
              {...register("titulo")}
              placeholder={t("condominio.entregas.edit.tituloPlaceholder")}
            />
            <FormErrorMessage message={errors.titulo?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataHora">{t("condominio.entregas.edit.dataHora")}</Label>
            <Controller
              name="dataHora"
              control={control}
              render={({ field }) => (
                <InputDateTime
                  id="dataHora"
                  value={field.value ? (typeof field.value === 'string' ? new Date(field.value) : field.value) : undefined}
                  onChange={(date) => {
                    field.onChange(date || undefined);
                  }}
                />
              )}
            />
            <FormErrorMessage message={errors.dataHora?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nomeRecebedor">{t("condominio.entregas.edit.nomeRecebedor")}</Label>
            <Input
              id="nomeRecebedor"
              {...register("nomeRecebedor")}
              placeholder={t("condominio.entregas.edit.nomeRecebedorPlaceholder")}
            />
            <FormErrorMessage message={errors.nomeRecebedor?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recebidoPor">{t("condominio.entregas.edit.recebidoPor")}</Label>
            <Controller
              name="recebidoPor"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("condominio.entregas.edit.recebidoPorPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="portaria">{t("condominio.entregas.edit.recebidoPorPortaria")}</SelectItem>
                    <SelectItem value="zelador">{t("condominio.entregas.edit.recebidoPorZelador")}</SelectItem>
                    <SelectItem value="morador">{t("condominio.entregas.edit.recebidoPorMorador")}</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FormErrorMessage message={errors.recebidoPor?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unidadeId">{t("condominio.entregas.edit.unidade")}</Label>
            {loadingUnidades ? (
              <div>{t("condominio.entregas.edit.loadingUnidades")}</div>
            ) : (
              <Controller
                name="unidadeId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("condominio.entregas.edit.unidadePlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {unidades.map((unidade) => (
                        <SelectItem key={unidade.id} value={unidade.id}>
                          {unidade.numero}
                          {unidade.bloco && ` - Bloco ${unidade.bloco}`}
                          {unidade.apartamento && ` - Apt ${unidade.apartamento}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            )}
            <FormErrorMessage message={errors.unidadeId?.message} />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="anexo">{t("condominio.entregas.edit.anexo")}</Label>
            <Controller
              name="anexo"
              control={control}
              render={({ field }) => (
                <InputFile
                  id="anexo"
                  accept="image/*,.jpg,.jpeg,.png"
                  value={field.value || null}
                  onChange={(file) => field.onChange(file || undefined)}
                />
              )}
            />
            <FormErrorMessage message={errors.anexo?.message} />
          </div>

          <div className="md:col-span-2 flex gap-4">
            <Button type="submit" disabled={isSubmitting} className="bg-emerald-500 text-white">
              {isSubmitting ? t("condominio.entregas.edit.saving") : t("condominio.entregas.edit.save")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/condominio/entregas" })}
            >
              {t("condominio.entregas.edit.cancel")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
