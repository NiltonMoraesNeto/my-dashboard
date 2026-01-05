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
import { schemaReuniaoNew } from "../../../schemas/reuniao-schema";
import { createReuniao } from "../../../services/reunioes";

export function ReuniaoNew() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
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

      toast.success(t("condominio.reunioes.new.success"));
      reset();
      navigate({ to: "/condominio/reunioes" });
    } catch (error: unknown) {
      console.error("Erro ao criar reunião:", error);
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || t("condominio.reunioes.new.error");
      toast.error(t("condominio.reunioes.new.error"), {
        description: message,
      });
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-full bg-white rounded-lg shadow-md p-6 dark:bg-emerald-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-300">
            {t("condominio.reunioes.new.title")}
          </h1>
          <Button
            type="button"
            variant="ghost"
            className="text-lg text-emerald-600 dark:text-emerald-300 flex items-center gap-2"
            onClick={() => navigate({ to: "/condominio/reunioes" })}
          >
            <ArrowLeft /> {t("condominio.reunioes.new.back")}
          </Button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="space-y-2">
            <Label htmlFor="titulo">{t("condominio.reunioes.new.titulo")} *</Label>
            <Input
              id="titulo"
              placeholder={t("condominio.reunioes.new.tituloPlaceholder")}
              {...register("titulo")}
            />
            <FormErrorMessage message={errors.titulo?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="data">{t("condominio.reunioes.new.data")} *</Label>
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
            <Label htmlFor="hora">{t("condominio.reunioes.new.hora")} *</Label>
            <Input id="hora" type="time" {...register("hora")} />
            <FormErrorMessage message={errors.hora?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="local">{t("condominio.reunioes.new.local")}</Label>
            <Input
              id="local"
              placeholder={t("condominio.reunioes.new.localPlaceholder")}
              {...register("local")}
            />
            <FormErrorMessage message={errors.local?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo">{t("condominio.reunioes.new.tipo")}</Label>
            <Input
              id="tipo"
              placeholder={t("condominio.reunioes.new.tipoPlaceholder")}
              {...register("tipo")}
            />
            <FormErrorMessage message={errors.tipo?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">{t("condominio.reunioes.new.status")}</Label>
            <Input
              id="status"
              placeholder={t("condominio.reunioes.new.statusPlaceholder")}
              {...register("status")}
            />
            <FormErrorMessage message={errors.status?.message} />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="pauta">{t("condominio.reunioes.new.pauta")}</Label>
            <textarea
              id="pauta"
              placeholder={t("condominio.reunioes.new.pautaPlaceholder")}
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
              {isSubmitting ? t("condominio.reunioes.new.saving") : t("condominio.reunioes.new.save")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/condominio/reunioes" })}
            >
              {t("condominio.reunioes.new.cancel")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
