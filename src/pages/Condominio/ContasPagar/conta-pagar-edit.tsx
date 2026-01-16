import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "@tanstack/react-router";
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
import { schemaContaPagarEdit } from "../../../schemas/conta-pagar-schema";
import { fetchContaPagar, updateContaPagar } from "../../../services/contas-pagar";

export function ContaPagarEdit() {
  const navigate = useNavigate();
  const { id } = useParams({ strict: false });
  const [loading, setLoading] = useState(true);
  const [currentAnexo, setCurrentAnexo] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof schemaContaPagarEdit>>({
    resolver: zodResolver(schemaContaPagarEdit),
    defaultValues: {
      descricao: "",
      valor: 0,
      vencimento: "",
      categoria: "",
      status: "Pendente",
      observacoes: "",
    },
  });

  useEffect(() => {
    const loadContaPagar = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const contaPagar = await fetchContaPagar(id);
        
        reset({
          descricao: contaPagar.descricao,
          valor: contaPagar.valor,
          vencimento: formatDateToInput(contaPagar.vencimento),
          categoria: contaPagar.categoria || "",
          status: contaPagar.status,
          observacoes: contaPagar.observacoes || "",
        });

        if (contaPagar.anexo) {
          setCurrentAnexo(contaPagar.anexo);
        }
      } catch (error) {
        console.error("Erro ao carregar conta a pagar:", error);
        toast.error("Erro ao carregar conta a pagar");
        navigate({ to: "/condominio/contas-pagar" });
      } finally {
        setLoading(false);
      }
    };

    loadContaPagar();
  }, [id, reset, navigate]);

  const onSubmit = async (data: z.infer<typeof schemaContaPagarEdit>) => {
    if (!id) return;

    try {
      // Extrair mês e ano da data de vencimento
      let mes: number | undefined;
      let ano: number | undefined;
      
      if (data.vencimento) {
        const date = new Date(data.vencimento);
        if (!isNaN(date.getTime())) {
          mes = date.getMonth() + 1;
          ano = date.getFullYear();
        }
      }

      await updateContaPagar(
        id,
        {
          descricao: data.descricao,
          valor: data.valor,
          vencimento: data.vencimento,
          mes,
          ano,
          categoria: data.categoria || undefined,
          status: data.status || undefined,
          observacoes: data.observacoes || undefined,
        },
        data.anexo
      );

      toast.success("Conta a pagar atualizada com sucesso");
      navigate({ to: "/condominio/contas-pagar" });
    } catch (error: unknown) {
      console.error("Erro ao atualizar conta a pagar:", error);
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Erro ao atualizar conta a pagar";
      toast.error("Erro ao atualizar conta a pagar", {
        description: message,
      });
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600 dark:text-gray-300">
            Carregando...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-full bg-white rounded-lg shadow-md p-6 dark:bg-emerald-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-300">
            Editar Conta a Pagar
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
            {currentAnexo && (
              <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                Anexo atual: {currentAnexo.split("/").pop()}
              </div>
            )}
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
            <p className="text-xs text-gray-500">
              Deixe em branco para manter o anexo atual ou selecione um novo arquivo para substituir
            </p>
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
