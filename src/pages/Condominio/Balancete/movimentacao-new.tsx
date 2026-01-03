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
import { schemaBalanceteMovimentacaoNew } from "../../../schemas/balancete-movimentacao-schema";
import { createBalanceteMovimentacao } from "../../../services/balancete-movimentacoes";

export function MovimentacaoNew() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<z.infer<typeof schemaBalanceteMovimentacaoNew>>({
    resolver: zodResolver(schemaBalanceteMovimentacaoNew),
    defaultValues: {
      tipo: "Entrada",
      data: formatDateToInput(new Date()),
      valor: 0,
      motivo: "",
    },
  });

  const onSubmit = async (
    data: z.infer<typeof schemaBalanceteMovimentacaoNew>
  ) => {
    try {
      await createBalanceteMovimentacao({
        tipo: data.tipo as "Entrada" | "Saída",
        data: data.data,
        valor: data.valor,
        motivo: data.motivo,
      });

      toast.success("Movimentação criada com sucesso!");
      reset();
      navigate({ to: "/condominio/balancete" });
    } catch (error: unknown) {
      console.error("Erro ao criar movimentação:", error);
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Erro ao criar movimentação";
      toast.error("Erro ao criar movimentação", {
        description: message,
      });
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-full bg-white rounded-lg shadow-md p-6 dark:bg-emerald-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-300">
            Adicionar Nova Movimentação
          </h1>
          <Button
            type="button"
            variant="ghost"
            className="text-lg text-emerald-600 dark:text-emerald-300 flex items-center gap-2"
            onClick={() => navigate({ to: "/condominio/balancete" })}
          >
            <ArrowLeft /> Voltar
          </Button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo *</Label>
            <Controller
              name="tipo"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entrada">Entrada</SelectItem>
                    <SelectItem value="Saída">Saída</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.tipo && <FormErrorMessage message={errors.tipo.message} />}
          </div>

          <div className="space-y-2">
            <Label htmlFor="data">Data *</Label>
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
                  className={errors.data ? "border-red-500" : ""}
                />
              )}
            />
            {errors.data && <FormErrorMessage message={errors.data.message} />}
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
                  className={errors.valor ? "border-red-500" : ""}
                />
              )}
            />
            {errors.valor && (
              <FormErrorMessage message={errors.valor.message} />
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="motivo">Motivo *</Label>
            <Input
              id="motivo"
              type="text"
              {...register("motivo")}
              className={errors.motivo ? "border-red-500" : ""}
              placeholder="Descreva o motivo da movimentação"
            />
            {errors.motivo && (
              <FormErrorMessage message={errors.motivo.message} />
            )}
          </div>

          <div className="md:col-span-2 flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/condominio/balancete" })}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
