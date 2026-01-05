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
import { schemaBoletoEdit } from "../../../schemas/boleto-schema";
import {
  fetchBoletoById,
  updateBoleto,
  type UpdateBoletoPayload,
} from "../../../services/boletos";
import { fetchUnidadesList } from "../../../services/unidades";

interface BoletoResponse {
  id: string;
  unidadeId: string;
  descricao: string;
  valor: number;
  vencimento: string;
  arquivoPdf?: string;
  status: string;
  dataPagamento?: string;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

interface UnidadeOption {
  id: string;
  numero: string;
  bloco?: string;
  apartamento?: string;
}

export function BoletoEdit() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams({ strict: false });
  const [unidades, setUnidades] = useState<UnidadeOption[]>([]);
  const [loadingUnidades, setLoadingUnidades] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<z.infer<typeof schemaBoletoEdit>>({
    resolver: zodResolver(schemaBoletoEdit),
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
        toast.error(t("condominio.boletos.edit.errorLoadUnidades"));
      } finally {
        setLoadingUnidades(false);
      }
    };
    loadUnidades();
  }, []);

  useEffect(() => {
    const loadBoleto = async () => {
      if (!id) {
        toast.error(t("condominio.boletos.edit.notFound"));
        navigate({ to: "/condominio/boletos" });
        return;
      }

      try {
        const boleto: BoletoResponse = await fetchBoletoById(id);
        const vencimentoFormatada = boleto.vencimento
          ? new Date(boleto.vencimento).toISOString().split("T")[0]
          : "";
        const dataPagamentoFormatada = boleto.dataPagamento
          ? new Date(boleto.dataPagamento).toISOString().split("T")[0]
          : "";
        reset({
          unidadeId: boleto.unidadeId || "",
          descricao: boleto.descricao || "",
          valor: boleto.valor || 0,
          vencimento: vencimentoFormatada,
          arquivo: boleto.arquivoPdf || undefined,
          status: boleto.status || "Pendente",
          dataPagamento: dataPagamentoFormatada,
          observacoes: boleto.observacoes || "",
        });
      } catch (error) {
        console.error("Erro ao carregar boleto:", error);
        toast.error(t("condominio.boletos.edit.errorLoadBoleto"));
        navigate({ to: "/condominio/boletos" });
      }
    };
    loadBoleto();
  }, [id, reset, navigate]);

  const onSubmit = async (data: z.infer<typeof schemaBoletoEdit>) => {
    if (!id) return;

    try {
      const payload: UpdateBoletoPayload = {};
      if (data.unidadeId !== undefined) payload.unidadeId = data.unidadeId;
      if (data.descricao !== undefined) payload.descricao = data.descricao;
      if (data.valor !== undefined) payload.valor = data.valor;
      if (data.vencimento !== undefined) payload.vencimento = data.vencimento;
      if (data.arquivo !== undefined) {
        if (data.arquivo instanceof File) {
          payload.arquivo = data.arquivo;
        }
      }
      if (data.status !== undefined) payload.status = data.status || undefined;
      if (data.dataPagamento !== undefined)
        payload.dataPagamento = data.dataPagamento || undefined;
      if (data.observacoes !== undefined)
        payload.observacoes = data.observacoes || undefined;

      await updateBoleto(id, payload);

      toast.success(t("condominio.boletos.edit.success"));
      navigate({ to: "/condominio/boletos" });
    } catch (error: unknown) {
      console.error("Erro ao atualizar boleto:", error);
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || t("condominio.boletos.edit.error");
      toast.error(t("condominio.boletos.edit.error"), {
        description: message,
      });
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-full bg-white rounded-lg shadow-md p-6 dark:bg-emerald-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-300">
            {t("condominio.boletos.edit.title")}
          </h1>
          <Button
            type="button"
            variant="ghost"
            className="text-lg text-emerald-600 dark:text-emerald-300 flex items-center gap-2"
            onClick={() => navigate({ to: "/condominio/boletos" })}
          >
            <ArrowLeft /> {t("condominio.boletos.edit.back")}
          </Button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="space-y-2">
            <Label htmlFor="unidadeId">{t("condominio.boletos.edit.unidade")} *</Label>
            {loadingUnidades ? (
              <div>{t("condominio.boletos.edit.loadingUnidades")}</div>
            ) : (
              <Controller
                name="unidadeId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("condominio.boletos.edit.unidadePlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {unidades.map((unidade) => (
                        <SelectItem key={unidade.id} value={unidade.id}>
                          {unidade.numero}
                          {unidade.bloco && ` - ${t("condominio.boletos.table.bloco")} ${unidade.bloco}`}
                          {unidade.apartamento &&
                            ` - ${t("condominio.boletos.table.apt")} ${unidade.apartamento}`}
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
            <Label htmlFor="descricao">{t("condominio.boletos.edit.descricao")} *</Label>
            <Input
              id="descricao"
              {...register("descricao")}
              placeholder={t("condominio.boletos.edit.descricaoPlaceholder")}
            />
            <FormErrorMessage message={errors.descricao?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="valor">{t("condominio.boletos.edit.valor")} *</Label>
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
            <Label htmlFor="vencimento">{t("condominio.boletos.edit.vencimento")} *</Label>
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
            <Label htmlFor="arquivo">{t("condominio.boletos.edit.arquivo")}</Label>
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
            <Label htmlFor="status">{t("condominio.boletos.edit.status")}</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("condominio.boletos.edit.statusPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendente">{t("condominio.boletos.edit.statusPendente")}</SelectItem>
                    <SelectItem value="Pago">{t("condominio.boletos.edit.statusPago")}</SelectItem>
                    <SelectItem value="Vencido">{t("condominio.boletos.edit.statusVencido")}</SelectItem>
                    <SelectItem value="Cancelado">{t("condominio.boletos.edit.statusCancelado")}</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FormErrorMessage message={errors.status?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataPagamento">{t("condominio.boletos.edit.dataPagamento")}</Label>
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
                  placeholder={t("condominio.boletos.edit.dataPagamentoPlaceholder")}
                />
              )}
            />
            <FormErrorMessage message={errors.dataPagamento?.message} />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="observacoes">{t("condominio.boletos.edit.observacoes")}</Label>
            <textarea
              id="observacoes"
              {...register("observacoes")}
              rows={4}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <FormErrorMessage message={errors.observacoes?.message} />
          </div>

          <div className="md:col-span-2 flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-500 text-white"
            >
              {isSubmitting ? t("condominio.boletos.edit.saving") : t("condominio.boletos.edit.save")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/condominio/boletos" })}
            >
              {t("condominio.boletos.edit.cancel")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
