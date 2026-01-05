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
import { schemaBoletoNew } from "../../../schemas/boleto-schema";
import { createBoleto } from "../../../services/boletos";
import { fetchUnidadesList } from "../../../services/unidades";

interface UnidadeOption {
  id: string;
  numero: string;
  bloco?: string;
  apartamento?: string;
}

export function BoletoNew() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [unidades, setUnidades] = useState<UnidadeOption[]>([]);
  const [loadingUnidades, setLoadingUnidades] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<z.infer<typeof schemaBoletoNew>>({
    resolver: zodResolver(schemaBoletoNew),
    defaultValues: {
      unidadeId: "",
      descricao: "",
      valor: 0,
      vencimento: "",
      status: "Pendente",
      observacoes: "",
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
        toast.error(t("condominio.boletos.new.errorLoadUnidades"));
      } finally {
        setLoadingUnidades(false);
      }
    };
    loadUnidades();
  }, []);

  const onSubmit = async (data: z.infer<typeof schemaBoletoNew>) => {
    try {
      await createBoleto({
        unidadeId: data.unidadeId,
        descricao: data.descricao,
        valor: data.valor,
        vencimento: data.vencimento,
        arquivo: data.arquivo,
        status: data.status || "Pendente",
        dataPagamento: data.dataPagamento || undefined,
        observacoes: data.observacoes || undefined,
      });

      toast.success(t("condominio.boletos.new.success"));
      reset();
      navigate({ to: "/condominio/boletos" });
    } catch (error: unknown) {
      console.error("Erro ao criar boleto:", error);
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || t("condominio.boletos.new.error");
      toast.error(t("condominio.boletos.new.error"), {
        description: message,
      });
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-full bg-white rounded-lg shadow-md p-6 dark:bg-emerald-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-300">
            {t("condominio.boletos.new.title")}
          </h1>
          <Button
            type="button"
            variant="ghost"
            className="text-lg text-emerald-600 dark:text-emerald-300 flex items-center gap-2"
            onClick={() => navigate({ to: "/condominio/boletos" })}
          >
            <ArrowLeft /> {t("condominio.boletos.new.back")}
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="unidadeId">{t("condominio.boletos.new.unidade")} *</Label>
            {loadingUnidades ? (
              <div>{t("condominio.boletos.new.loadingUnidades")}</div>
            ) : (
              <Controller
                name="unidadeId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("condominio.boletos.new.unidadePlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {unidades.map((unidade) => (
                        <SelectItem key={unidade.id} value={unidade.id}>
                          {unidade.numero}
                          {unidade.bloco && ` - ${t("condominio.boletos.table.bloco")} ${unidade.bloco}`}
                          {unidade.apartamento && ` - ${t("condominio.boletos.table.apt")} ${unidade.apartamento}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            )}
            <FormErrorMessage message={errors.unidadeId?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">{t("condominio.boletos.new.descricao")} *</Label>
            <Input
              id="descricao"
              {...register("descricao")}
              placeholder={t("condominio.boletos.new.descricaoPlaceholder")}
            />
            <FormErrorMessage message={errors.descricao?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="valor">{t("condominio.boletos.new.valor")} *</Label>
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
            <Label htmlFor="vencimento">{t("condominio.boletos.new.vencimento")} *</Label>
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

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="arquivo">{t("condominio.boletos.new.arquivo")} *</Label>
            <Controller
              name="arquivo"
              control={control}
              render={({ field }) => (
                <InputFile
                  id="arquivo"
                  accept=".pdf,application/pdf"
                  value={field.value || null}
                  onChange={(file) => field.onChange(file)}
                />
              )}
            />
            <FormErrorMessage message={errors.arquivo?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">{t("condominio.boletos.new.status")}</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("condominio.boletos.new.statusPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pendente">{t("condominio.boletos.new.statusPendente")}</SelectItem>
                      <SelectItem value="Pago">{t("condominio.boletos.new.statusPago")}</SelectItem>
                      <SelectItem value="Vencido">{t("condominio.boletos.new.statusVencido")}</SelectItem>
                      <SelectItem value="Cancelado">{t("condominio.boletos.new.statusCancelado")}</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            <FormErrorMessage message={errors.status?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataPagamento">{t("condominio.boletos.new.dataPagamento")}</Label>
            <Controller
              name="dataPagamento"
              control={control}
              render={({ field }) => (
                <InputDate
                  id="dataPagamento"
                  value={field.value || undefined}
                  onChange={(date) => {
                    field.onChange(date ? formatDateToInput(date) : "");
                  }}
                  placeholder={t("condominio.boletos.new.dataPagamentoPlaceholder")}
                />
              )}
            />
            <FormErrorMessage message={errors.dataPagamento?.message} />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="observacoes">{t("condominio.boletos.new.observacoes")}</Label>
            <textarea
              id="observacoes"
              {...register("observacoes")}
              rows={4}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <FormErrorMessage message={errors.observacoes?.message} />
          </div>

          <div className="md:col-span-2 flex gap-4">
            <Button type="submit" disabled={isSubmitting} className="bg-emerald-500 text-white">
              {isSubmitting ? t("condominio.boletos.new.saving") : t("condominio.boletos.new.save")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/condominio/boletos" })}
            >
              {t("condominio.boletos.new.cancel")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

