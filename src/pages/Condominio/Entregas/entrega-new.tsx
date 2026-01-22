import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
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
import { schemaEntregaNew } from "../../../schemas/entrega-schema";
import { createEntrega } from "../../../services/entregas";
import { fetchUnidadesList } from "../../../services/unidades";

interface UnidadeOption {
  id: string;
  numero: string;
  bloco?: string;
  apartamento?: string;
}

export function EntregaNew() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [unidades, setUnidades] = useState<UnidadeOption[]>([]);
  const [loadingUnidades, setLoadingUnidades] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<z.infer<typeof schemaEntregaNew>>({
    resolver: zodResolver(schemaEntregaNew),
    defaultValues: {
      titulo: t("condominio.entregas.new.tituloDefault"),
      dataHora: undefined,
      nomeRecebedor: "",
      recebidoPor: undefined,
      unidadeId: "",
      anexo: undefined,
    },
  });

  useEffect(() => {
    const loadUnidades = async () => {
      try {
        const response = await fetchUnidadesList(1, 1000, "");
        if (response?.data) {
          setUnidades(response.data);
        }
      } catch (error) {
        console.error("Erro ao carregar unidades:", error);
        toast.error(t("condominio.entregas.new.errorLoadUnidades"));
      } finally {
        setLoadingUnidades(false);
      }
    };
    loadUnidades();
  }, []);

  const onSubmit = async (data: z.infer<typeof schemaEntregaNew>) => {
    try {
      // Converter Date para ISO string
      const dataHoraISO = data.dataHora instanceof Date 
        ? data.dataHora.toISOString() 
        : typeof data.dataHora === 'string'
        ? new Date(data.dataHora).toISOString()
        : new Date().toISOString();

      await createEntrega({
        titulo: data.titulo || t("condominio.entregas.new.tituloDefault"),
        dataHora: dataHoraISO,
        nomeRecebedor: data.nomeRecebedor,
        recebidoPor: data.recebidoPor,
        unidadeId: data.unidadeId,
      }, data.anexo);

      toast.success(t("condominio.entregas.new.success"));
      reset();
      navigate({ to: "/condominio/entregas" });
    } catch (error: unknown) {
      console.error("Erro ao criar entrega:", error);
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || t("condominio.entregas.new.error");
      toast.error(t("condominio.entregas.new.error"), {
        description: message,
      });
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-full bg-white rounded-lg shadow-md p-6 dark:bg-emerald-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-300">
            {t("condominio.entregas.new.title")}
          </h1>
          <Button
            type="button"
            variant="ghost"
            className="text-lg text-emerald-600 dark:text-emerald-300 flex items-center gap-2"
            onClick={() => navigate({ to: "/condominio/entregas" })}
          >
            <ArrowLeft /> {t("condominio.entregas.new.back")}
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="titulo">{t("condominio.entregas.new.titulo")}</Label>
            <Input
              id="titulo"
              {...register("titulo")}
              placeholder={t("condominio.entregas.new.tituloPlaceholder")}
              defaultValue={t("condominio.entregas.new.tituloDefault")}
            />
            <FormErrorMessage message={errors.titulo?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataHora">{t("condominio.entregas.new.dataHora")} *</Label>
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
            <Label htmlFor="nomeRecebedor">{t("condominio.entregas.new.nomeRecebedor")} *</Label>
            <Input
              id="nomeRecebedor"
              {...register("nomeRecebedor")}
              placeholder={t("condominio.entregas.new.nomeRecebedorPlaceholder")}
            />
            <FormErrorMessage message={errors.nomeRecebedor?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recebidoPor">{t("condominio.entregas.new.recebidoPor")} *</Label>
            <Controller
              name="recebidoPor"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("condominio.entregas.new.recebidoPorPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="portaria">{t("condominio.entregas.new.recebidoPorPortaria")}</SelectItem>
                    <SelectItem value="zelador">{t("condominio.entregas.new.recebidoPorZelador")}</SelectItem>
                    <SelectItem value="morador">{t("condominio.entregas.new.recebidoPorMorador")}</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FormErrorMessage message={errors.recebidoPor?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unidadeId">{t("condominio.entregas.new.unidade")} *</Label>
            {loadingUnidades ? (
              <div>{t("condominio.entregas.new.loadingUnidades")}</div>
            ) : (
              <Controller
                name="unidadeId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("condominio.entregas.new.unidadePlaceholder")} />
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
            <Label htmlFor="anexo">{t("condominio.entregas.new.anexo")}</Label>
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
              {isSubmitting ? t("condominio.entregas.new.saving") : t("condominio.entregas.new.save")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/condominio/entregas" })}
            >
              {t("condominio.entregas.new.cancel")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
