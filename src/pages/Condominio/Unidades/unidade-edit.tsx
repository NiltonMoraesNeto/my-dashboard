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
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { schemaUnidadeEdit } from "../../../schemas/unidade-schema";
import { fetchUnidadeById, updateUnidade } from "../../../services/unidades";
import { fetchMoradoresList } from "../../../services/moradores";
import type { MoradorList } from "../../../model/morador-model";

interface UnidadeResponse {
  id: string;
  numero: string;
  bloco?: string;
  apartamento?: string;
  tipo?: string;
  status: string;
  proprietario?: string;
  telefone?: string;
  email?: string;
  moradorId?: string;
  createdAt: string;
  updatedAt: string;
}

export function UnidadeEdit() {
  const navigate = useNavigate();
  const { id } = useParams({ strict: false });
  const [moradores, setMoradores] = useState<MoradorList[]>([]);
  const [isLoadingMoradores, setIsLoadingMoradores] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<z.infer<typeof schemaUnidadeEdit>>({
    resolver: zodResolver(schemaUnidadeEdit),
    defaultValues: {
      numero: "",
      bloco: "",
      apartamento: "",
      tipo: "",
      status: "Ativo",
      proprietario: "",
      telefone: "",
      email: "",
      moradorId: "",
    },
  });

  useEffect(() => {
    const loadMoradores = async () => {
      setIsLoadingMoradores(true);
      try {
        const response = await fetchMoradoresList(1, 100, "");
        if (response?.data) {
          setMoradores(response.data);
        }
      } catch (error) {
        console.error("Erro ao carregar moradores:", error);
      } finally {
        setIsLoadingMoradores(false);
      }
    };
    loadMoradores();
  }, []);

  useEffect(() => {
    const loadUnidade = async () => {
      if (!id) {
        toast.error("Unidade não encontrada");
        navigate({ to: "/condominio/unidades" });
        return;
      }

      try {
        const unidade: UnidadeResponse = await fetchUnidadeById(id);
        reset({
          numero: unidade.numero || "",
          bloco: unidade.bloco || "",
          apartamento: unidade.apartamento || "",
          tipo: unidade.tipo || "",
          status: unidade.status || "Ativo",
          proprietario: unidade.proprietario || "",
          telefone: unidade.telefone || "",
          email: unidade.email || "",
          moradorId: unidade.moradorId || "",
        });
      } catch (error) {
        console.error("Erro ao carregar unidade:", error);
        toast.error("Erro ao carregar dados da unidade");
        navigate({ to: "/condominio/unidades" });
      }
    };
    loadUnidade();
  }, [id, reset, navigate]);

  const onSubmit = async (data: z.infer<typeof schemaUnidadeEdit>) => {
    if (!id) return;

    try {
      await updateUnidade(id, {
        numero: data.numero,
        bloco: data.bloco || undefined,
        apartamento: data.apartamento || undefined,
        tipo: data.tipo || undefined,
        status: data.status || undefined,
        proprietario: data.proprietario || undefined,
        telefone: data.telefone || undefined,
        email: data.email || undefined,
        moradorId: data.moradorId || undefined,
      });

      toast.success("Unidade atualizada com sucesso!");
      navigate({ to: "/condominio/unidades" });
    } catch (error: unknown) {
      console.error("Erro ao atualizar unidade:", error);
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Erro ao atualizar unidade";
      toast.error("Erro ao atualizar unidade", {
        description: message,
      });
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-full bg-white rounded-lg shadow-md p-6 dark:bg-emerald-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-300">
            Editar Unidade
          </h1>
          <Button
            type="button"
            variant="ghost"
            className="text-lg text-emerald-600 dark:text-emerald-300 flex items-center gap-2"
            onClick={() => navigate({ to: "/condominio/unidades" })}
          >
            <ArrowLeft /> Voltar
          </Button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="space-y-2">
            <Label htmlFor="numero">Número *</Label>
            <Input id="numero" placeholder="Ex: 101" {...register("numero")} />
            <FormErrorMessage message={errors.numero?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bloco">Bloco (opcional)</Label>
            <Input
              id="bloco"
              placeholder="Ex: A, B, 1"
              {...register("bloco")}
            />
            <FormErrorMessage message={errors.bloco?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="apartamento">Apartamento (opcional)</Label>
            <Input
              id="apartamento"
              placeholder="Ex: 101"
              {...register("apartamento")}
            />
            <FormErrorMessage message={errors.apartamento?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo (opcional)</Label>
            <Controller
              name="tipo"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={(value) => field.onChange(value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Apartamento">Apartamento</SelectItem>
                    <SelectItem value="Cobertura">Cobertura</SelectItem>
                    <SelectItem value="Loja">Loja</SelectItem>
                    <SelectItem value="Garagem">Garagem</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FormErrorMessage message={errors.tipo?.message} />
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
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                    <SelectItem value="Alugado">Alugado</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FormErrorMessage message={errors.status?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="moradorId">Morador (opcional)</Label>
            {isLoadingMoradores ? (
              <span className="text-sm text-emerald-500">
                Carregando moradores...
              </span>
            ) : (
              <>
                <Controller
                  name="moradorId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value || ""}
                      onValueChange={(value) =>
                        field.onChange(value || undefined)
                      }
                      disabled={isLoadingMoradores}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um morador" />
                      </SelectTrigger>
                      <SelectContent>
                        {moradores.map((morador) => (
                          <SelectItem key={morador.id} value={morador.id}>
                            {morador.nome} - {morador.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FormErrorMessage message={errors.moradorId?.message} />
              </>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="proprietario">Proprietário (opcional)</Label>
            <Input
              id="proprietario"
              placeholder="Nome do proprietário"
              {...register("proprietario")}
            />
            <FormErrorMessage message={errors.proprietario?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone (opcional)</Label>
            <Input
              id="telefone"
              placeholder="(00) 00000-0000"
              {...register("telefone")}
            />
            <FormErrorMessage message={errors.telefone?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email (opcional)</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@exemplo.com"
              {...register("email")}
            />
            <FormErrorMessage message={errors.email?.message} />
          </div>

          <div className="md:col-span-2 flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-500 text-white"
            >
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/condominio/unidades" })}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
