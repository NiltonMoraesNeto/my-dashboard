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
import { schemaEntregaEdit } from "../../../schemas/entrega-schema";
import { fetchEntrega, updateEntrega } from "../../../services/entregas";
import { fetchUnidadesList } from "../../../services/unidades";

interface UnidadeOption {
  id: string;
  numero: string;
  bloco?: string;
  apartamento?: string;
}

export function EntregaEdit() {
  const navigate = useNavigate();
  const { id } = useParams({ strict: false });
  const [unidades, setUnidades] = useState<UnidadeOption[]>([]);
  const [loadingUnidades, setLoadingUnidades] = useState(true);
  const [loadingEntrega, setLoadingEntrega] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<z.infer<typeof schemaEntregaEdit>>({
    resolver: zodResolver(schemaEntregaEdit),
    defaultValues: {
      titulo: "",
      dataHora: "",
      nomeRecebedor: "",
      recebidoPor: undefined,
      unidadeId: "",
    },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        // Carregar unidades
        const unidadesResponse = await fetchUnidadesList(1, 1000, "");
        if (unidadesResponse?.data) {
          setUnidades(unidadesResponse.data);
        }

        // Carregar entrega
        if (id) {
          const entrega = await fetchEntrega(id);
          const dataHoraLocal = new Date(entrega.dataHora);

          reset({
            titulo: entrega.titulo,
            dataHora: dataHoraLocal.toISOString(),
            nomeRecebedor: entrega.nomeRecebedor,
            recebidoPor: entrega.recebidoPor as "portaria" | "zelador" | "morador",
            unidadeId: entrega.unidadeId,
            anexo: entrega.anexo || undefined,
          });
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar dados");
      } finally {
        setLoadingUnidades(false);
        setLoadingEntrega(false);
      }
    };
    loadData();
  }, [id, reset]);

  const onSubmit = async (data: z.infer<typeof schemaEntregaEdit>) => {
    if (!id) return;

    try {
      const updateData: {
        titulo?: string;
        dataHora?: string;
        nomeRecebedor?: string;
        recebidoPor?: "portaria" | "zelador" | "morador";
        unidadeId?: string;
      } = {};

      if (data.titulo !== undefined) {
        updateData.titulo = data.titulo;
      }
      if (data.dataHora) {
        const dataHoraDate = data.dataHora instanceof Date 
          ? data.dataHora 
          : typeof data.dataHora === 'string'
          ? new Date(data.dataHora)
          : new Date();
        updateData.dataHora = dataHoraDate.toISOString();
      }
      if (data.nomeRecebedor !== undefined) {
        updateData.nomeRecebedor = data.nomeRecebedor;
      }
      if (data.recebidoPor !== undefined) {
        updateData.recebidoPor = data.recebidoPor;
      }
      if (data.unidadeId !== undefined) {
        updateData.unidadeId = data.unidadeId;
      }

      // Enviar anexo apenas se for um novo arquivo (File), não se for string (arquivo existente)
      const anexoToSend = data.anexo instanceof File ? data.anexo : undefined;

      await updateEntrega(id, updateData, anexoToSend);

      toast.success("Entrega atualizada com sucesso");
      navigate({ to: "/condominio/entregas" });
    } catch (error: unknown) {
      console.error("Erro ao atualizar entrega:", error);
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Erro ao atualizar entrega";
      toast.error("Erro ao atualizar entrega", {
        description: message,
      });
    }
  };

  if (loadingEntrega) {
    return <div className="p-6">Carregando...</div>;
  }

  return (
    <div className="p-6">
      <div className="max-w-full bg-white rounded-lg shadow-md p-6 dark:bg-emerald-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-300">
            Editar Entrega
          </h1>
          <Button
            type="button"
            variant="ghost"
            className="text-lg text-emerald-600 dark:text-emerald-300 flex items-center gap-2"
            onClick={() => navigate({ to: "/condominio/entregas" })}
          >
            <ArrowLeft /> Voltar
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              {...register("titulo")}
              placeholder="Nova entrega"
            />
            <FormErrorMessage message={errors.titulo?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataHora">Data e Hora</Label>
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
            <Label htmlFor="nomeRecebedor">Nome do Recebedor</Label>
            <Input
              id="nomeRecebedor"
              {...register("nomeRecebedor")}
              placeholder="Nome completo"
            />
            <FormErrorMessage message={errors.nomeRecebedor?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recebidoPor">Recebido Por</Label>
            <Controller
              name="recebidoPor"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione quem recebeu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="portaria">Portaria</SelectItem>
                    <SelectItem value="zelador">Zelador</SelectItem>
                    <SelectItem value="morador">Morador</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FormErrorMessage message={errors.recebidoPor?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unidadeId">Unidade</Label>
            {loadingUnidades ? (
              <div>Carregando unidades...</div>
            ) : (
              <Controller
                name="unidadeId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a unidade" />
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
            <Label htmlFor="anexo">Foto do Produto (Anexo)</Label>
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
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/condominio/entregas" })}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
