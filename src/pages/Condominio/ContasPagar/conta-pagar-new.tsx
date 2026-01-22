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
import { InputFile } from "../../../components/ui/input-file";
import { InputMoney } from "../../../components/ui/input-money";
import { Label } from "../../../components/ui/label";
import { formatDateToInput } from "../../../lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { schemaContaPagarNew } from "../../../schemas/conta-pagar-schema";
import { createContaPagar } from "../../../services/contas-pagar";

export function ContaPagarNew() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<z.infer<typeof schemaContaPagarNew>>({
    resolver: zodResolver(schemaContaPagarNew),
    defaultValues: {
      descricao: "",
      valor: 0,
      vencimento: "",
      categoria: "",
      status: "Pendente",
      observacoes: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof schemaContaPagarNew>) => {
    try {
      // Extrair mês e ano da data de vencimento
      const date = new Date(data.vencimento);
      const mes = date.getMonth() + 1;
      const ano = date.getFullYear();

      await createContaPagar(
        {
          descricao: data.descricao,
          valor: data.valor,
          vencimento: data.vencimento,
          mes,
          ano,
          categoria: data.categoria || undefined,
          status: data.status || "Pendente",
          observacoes: data.observacoes || undefined,
        },
        data.anexo
      );

      toast.success(t("condominio.contasPagar.new.success"));
      reset();
      navigate({ to: "/condominio/contas-pagar" });
    } catch (error: unknown) {
      console.error("Erro ao criar conta a pagar:", error);
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || t("condominio.contasPagar.new.error");
      toast.error(t("condominio.contasPagar.new.error"), {
        description: message,
      });
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-full bg-white rounded-lg shadow-md p-6 dark:bg-emerald-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-300">
            {t("condominio.contasPagar.new.title")}
          </h1>
          <Button
            type="button"
            variant="ghost"
            className="text-lg text-emerald-600 dark:text-emerald-300 flex items-center gap-2"
            onClick={() => navigate({ to: "/condominio/contas-pagar" })}
          >
            <ArrowLeft /> {t("condominio.contasPagar.new.back")}
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="descricao">{t("condominio.contasPagar.new.descricao")} *</Label>
            <Input
              id="descricao"
              {...register("descricao")}
              placeholder={t("condominio.contasPagar.new.descricaoPlaceholder")}
            />
            <FormErrorMessage message={errors.descricao?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="valor">{t("condominio.contasPagar.new.valor")} *</Label>
            <Controller
              name="valor"
              control={control}
              render={({ field }) => (
                <InputMoney
                  id="valor"
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                />
              )}
            />
            <FormErrorMessage message={errors.valor?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vencimento">{t("condominio.contasPagar.new.vencimento")} *</Label>
            <Controller
              name="vencimento"
              control={control}
              render={({ field }) => (
                <InputDate
                  id="vencimento"
                  value={field.value || undefined}
                  onChange={(date) => {
                    field.onChange(date ? formatDateToInput(date) : "");
                  }}
                />
              )}
            />
            <FormErrorMessage message={errors.vencimento?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoria">{t("condominio.contasPagar.new.categoria")}</Label>
            <Input
              id="categoria"
              {...register("categoria")}
              placeholder={t("condominio.contasPagar.new.categoriaPlaceholder")}
            />
            <FormErrorMessage message={errors.categoria?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">{t("condominio.contasPagar.new.status")}</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("condominio.contasPagar.new.statusPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendente">{t("condominio.contasPagar.new.statusPendente")}</SelectItem>
                    <SelectItem value="Paga">{t("condominio.contasPagar.new.statusPaga")}</SelectItem>
                    <SelectItem value="Vencida">{t("condominio.contasPagar.new.statusVencida")}</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FormErrorMessage message={errors.status?.message} />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="anexo">{t("condominio.contasPagar.new.anexo")}</Label>
            <Controller
              name="anexo"
              control={control}
              render={({ field }) => (
                <InputFile
                  id="anexo"
                  accept=".pdf,.jpg,.jpeg,.png,image/*,application/pdf"
                  value={field.value || null}
                  onChange={(file) => field.onChange(file || undefined)}
                />
              )}
            />
            <FormErrorMessage message={errors.anexo?.message} />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="observacoes">{t("condominio.contasPagar.new.observacoes")}</Label>
            <textarea
              id="observacoes"
              {...register("observacoes")}
              rows={4}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder={t("condominio.contasPagar.new.observacoesPlaceholder")}
            />
            <FormErrorMessage message={errors.observacoes?.message} />
          </div>

          <div className="md:col-span-2 flex gap-4">
            <Button type="submit" disabled={isSubmitting} className="bg-emerald-500 text-white">
              {isSubmitting ? t("condominio.contasPagar.new.saving") : t("condominio.contasPagar.new.save")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/condominio/contas-pagar" })}
            >
              {t("condominio.contasPagar.new.cancel")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
