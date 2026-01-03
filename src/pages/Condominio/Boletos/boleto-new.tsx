import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import type { z } from "zod";
import { FormErrorMessage } from "../../../components/form-error-message";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { InputDate } from "../../../components/ui/input-date";
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
      mes: new Date().getMonth() + 1,
      ano: new Date().getFullYear(),
      valor: 0,
      vencimento: "",
      codigoBarras: "",
      nossoNumero: "",
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
        toast.error("Erro ao carregar unidades");
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
        mes: data.mes,
        ano: data.ano,
        valor: data.valor,
        vencimento: data.vencimento,
        codigoBarras: data.codigoBarras || undefined,
        nossoNumero: data.nossoNumero || undefined,
        status: data.status || "Pendente",
        dataPagamento: data.dataPagamento || undefined,
        observacoes: data.observacoes || undefined,
      });

      toast.success("Boleto criado com sucesso!");
      reset();
      navigate({ to: "/condominio/boletos" });
    } catch (error: unknown) {
      console.error("Erro ao criar boleto:", error);
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Erro ao criar boleto";
      toast.error("Erro ao criar boleto", {
        description: message,
      });
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-full bg-white rounded-lg shadow-md p-6 dark:bg-emerald-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-300">
            Adicionar Novo Boleto
          </h1>
          <Button
            type="button"
            variant="ghost"
            className="text-lg text-emerald-600 dark:text-emerald-300 flex items-center gap-2"
            onClick={() => navigate({ to: "/condominio/boletos" })}
          >
            <ArrowLeft /> Voltar
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="unidadeId">Unidade *</Label>
            {loadingUnidades ? (
              <div>Carregando unidades...</div>
            ) : (
              <Controller
                name="unidadeId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma unidade" />
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

          <div className="space-y-2">
            <Label htmlFor="mes">Mês *</Label>
            <Input
              id="mes"
              type="number"
              min="1"
              max="12"
              {...register("mes", { valueAsNumber: true })}
            />
            <FormErrorMessage message={errors.mes?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ano">Ano *</Label>
            <Input
              id="ano"
              type="number"
              min="2000"
              {...register("ano", { valueAsNumber: true })}
            />
            <FormErrorMessage message={errors.ano?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="valor">Valor *</Label>
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
            <Label htmlFor="vencimento">Data de Vencimento *</Label>
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
            <Label htmlFor="status">Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pendente">Pendente</SelectItem>
                      <SelectItem value="Pago">Pago</SelectItem>
                      <SelectItem value="Vencido">Vencido</SelectItem>
                      <SelectItem value="Cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            <FormErrorMessage message={errors.status?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="codigoBarras">Código de Barras (opcional)</Label>
            <Input id="codigoBarras" {...register("codigoBarras")} />
            <FormErrorMessage message={errors.codigoBarras?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nossoNumero">Nosso Número (opcional)</Label>
            <Input id="nossoNumero" {...register("nossoNumero")} />
            <FormErrorMessage message={errors.nossoNumero?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataPagamento">Data de Pagamento (opcional)</Label>
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
                  placeholder="Selecione a data de pagamento"
                />
              )}
            />
            <FormErrorMessage message={errors.dataPagamento?.message} />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="observacoes">Observações (opcional)</Label>
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
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/condominio/boletos" })}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

