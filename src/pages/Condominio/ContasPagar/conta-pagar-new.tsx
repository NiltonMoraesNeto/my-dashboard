import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
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

      toast.success("Conta a pagar criada com sucesso");
      reset();
      navigate({ to: "/condominio/contas-pagar" });
    } catch (error: unknown) {
      console.error("Erro ao criar conta a pagar:", error);
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Erro ao criar conta a pagar";
      toast.error("Erro ao criar conta a pagar", {
        description: message,
      });
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-full bg-white rounded-lg shadow-md p-6 dark:bg-emerald-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-300">
            Nova Conta a Pagar
          </h1>
          <Button
            type="button"
            variant="ghost"
            className="text-lg text-emerald-600 dark:text-emerald-300 flex items-center gap-2"
            onClick={() => navigate({ to: "/condominio/contas-pagar" })}
          >
            <ArrowLeft /> Voltar
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="descricao">Título da Despesa *</Label>
            <Input
              id="descricao"
              {...register("descricao")}
              placeholder="Ex: Manutenção do elevador"
            />
            <FormErrorMessage message={errors.descricao?.message} />
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
            <Label htmlFor="categoria">Categoria</Label>
            <Input
              id="categoria"
              {...register("categoria")}
              placeholder="Ex: Manutenção, Limpeza, Segurança"
            />
            <FormErrorMessage message={errors.categoria?.message} />
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
                    <SelectItem value="Paga">Paga</SelectItem>
                    <SelectItem value="Vencida">Vencida</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FormErrorMessage message={errors.status?.message} />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="anexo">Anexo (Nota Fiscal, Recibo, etc.)</Label>
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
            <Label htmlFor="observacoes">Observações</Label>
            <textarea
              id="observacoes"
              {...register("observacoes")}
              rows={4}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Observações adicionais sobre a conta a pagar..."
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
              onClick={() => navigate({ to: "/condominio/contas-pagar" })}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
