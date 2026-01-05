import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
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
import { schemaAvisoNew } from "../../../schemas/aviso-schema";
import { createAviso } from "../../../services/avisos";

export function AvisoNew() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<z.infer<typeof schemaAvisoNew>>({
    resolver: zodResolver(schemaAvisoNew),
    defaultValues: {
      titulo: "",
      descricao: "",
      tipo: "Informativo",
      dataInicio: "",
      dataFim: "",
      destaque: false,
    },
  });

  const destaque = watch("destaque");

  const onSubmit = async (data: z.infer<typeof schemaAvisoNew>) => {
    try {
      await createAviso({
        titulo: data.titulo,
        descricao: data.descricao,
        tipo: data.tipo || "Informativo",
        dataInicio: data.dataInicio,
        dataFim: data.dataFim || undefined,
        destaque: data.destaque || false,
      });

      toast.success(t("condominio.avisos.new.success"));
      reset();
      navigate({ to: "/condominio/avisos" });
    } catch (error: unknown) {
      console.error("Erro ao criar aviso:", error);
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || t("condominio.avisos.new.error");
      toast.error(t("condominio.avisos.new.error"), {
        description: message,
      });
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-full bg-white rounded-lg shadow-md p-6 dark:bg-emerald-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-300">
            {t("condominio.avisos.new.title")}
          </h1>
          <Button
            type="button"
            variant="ghost"
            className="text-lg text-emerald-600 dark:text-emerald-300 flex items-center gap-2"
            onClick={() => navigate({ to: "/condominio/avisos" })}
          >
            <ArrowLeft /> {t("condominio.avisos.new.back")}
          </Button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="titulo">{t("condominio.avisos.new.titulo")} *</Label>
            <Input
              id="titulo"
              placeholder={t("condominio.avisos.new.tituloPlaceholder")}
              {...register("titulo")}
            />
            <FormErrorMessage message={errors.titulo?.message} />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="descricao">{t("condominio.avisos.new.descricao")} *</Label>
            <textarea
              id="descricao"
              placeholder={t("condominio.avisos.new.descricaoPlaceholder")}
              {...register("descricao")}
              rows={4}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <FormErrorMessage message={errors.descricao?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo">{t("condominio.avisos.new.tipo")}</Label>
            <Input
              id="tipo"
              placeholder={t("condominio.avisos.new.tipoPlaceholder")}
              {...register("tipo")}
            />
            <FormErrorMessage message={errors.tipo?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataInicio">{t("condominio.avisos.new.dataInicio")} *</Label>
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
            <Label htmlFor="dataFim">{t("condominio.avisos.new.dataFim")}</Label>
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
                  placeholder={t("condominio.avisos.new.dataFimPlaceholder")}
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
              {t("condominio.avisos.new.destaque")}
            </Label>
            <FormErrorMessage message={errors.destaque?.message} />
          </div>

          <div className="md:col-span-2 flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-500 text-white"
            >
              {isSubmitting ? t("condominio.avisos.new.saving") : t("condominio.avisos.new.save")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/condominio/avisos" })}
            >
              {t("condominio.avisos.new.cancel")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
