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
  const { t } = useTranslation();
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
        toast.error(t("condominio.unidades.edit.notFound"));
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
        toast.error(t("condominio.unidades.edit.errorLoad"));
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

      toast.success(t("condominio.unidades.edit.success"));
      navigate({ to: "/condominio/unidades" });
    } catch (error: unknown) {
      console.error("Erro ao atualizar unidade:", error);
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || t("condominio.unidades.edit.error");
      toast.error(t("condominio.unidades.edit.error"), {
        description: message,
      });
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-full bg-white rounded-lg shadow-md p-6 dark:bg-emerald-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-300">
            {t("condominio.unidades.edit.title")}
          </h1>
          <Button
            type="button"
            variant="ghost"
            className="text-lg text-emerald-600 dark:text-emerald-300 flex items-center gap-2"
            onClick={() => navigate({ to: "/condominio/unidades" })}
          >
            <ArrowLeft /> {t("condominio.unidades.edit.back")}
          </Button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="space-y-2">
            <Label htmlFor="numero">{t("condominio.unidades.edit.numero")} *</Label>
            <Input id="numero" placeholder={t("condominio.unidades.edit.numeroPlaceholder")} {...register("numero")} />
            <FormErrorMessage message={errors.numero?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bloco">{t("condominio.unidades.edit.bloco")}</Label>
            <Input
              id="bloco"
              placeholder={t("condominio.unidades.edit.blocoPlaceholder")}
              {...register("bloco")}
            />
            <FormErrorMessage message={errors.bloco?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="apartamento">{t("condominio.unidades.edit.apartamento")}</Label>
            <Input
              id="apartamento"
              placeholder={t("condominio.unidades.edit.apartamentoPlaceholder")}
              {...register("apartamento")}
            />
            <FormErrorMessage message={errors.apartamento?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo">{t("condominio.unidades.edit.tipo")}</Label>
            <Controller
              name="tipo"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={(value) => field.onChange(value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("condominio.unidades.edit.tipoPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Apartamento">{t("condominio.unidades.edit.tipoApartamento")}</SelectItem>
                    <SelectItem value="Cobertura">{t("condominio.unidades.edit.tipoCobertura")}</SelectItem>
                    <SelectItem value="Loja">{t("condominio.unidades.edit.tipoLoja")}</SelectItem>
                    <SelectItem value="Garagem">{t("condominio.unidades.edit.tipoGaragem")}</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FormErrorMessage message={errors.tipo?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">{t("condominio.unidades.edit.status")}</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("condominio.unidades.edit.statusPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">{t("condominio.unidades.edit.statusAtivo")}</SelectItem>
                    <SelectItem value="Inativo">{t("condominio.unidades.edit.statusInativo")}</SelectItem>
                    <SelectItem value="Alugado">{t("condominio.unidades.edit.statusAlugado")}</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FormErrorMessage message={errors.status?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="moradorId">{t("condominio.unidades.edit.morador")}</Label>
            {isLoadingMoradores ? (
              <span className="text-sm text-emerald-500">
                {t("condominio.unidades.edit.loadingMoradores")}
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
                        <SelectValue placeholder={t("condominio.unidades.edit.moradorPlaceholder")} />
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
            <Label htmlFor="proprietario">{t("condominio.unidades.edit.proprietario")}</Label>
            <Input
              id="proprietario"
              placeholder={t("condominio.unidades.edit.proprietarioPlaceholder")}
              {...register("proprietario")}
            />
            <FormErrorMessage message={errors.proprietario?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone">{t("condominio.unidades.edit.telefone")}</Label>
            <Input
              id="telefone"
              placeholder={t("condominio.unidades.edit.telefonePlaceholder")}
              {...register("telefone")}
            />
            <FormErrorMessage message={errors.telefone?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t("condominio.unidades.edit.email")}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t("condominio.unidades.edit.emailPlaceholder")}
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
              {isSubmitting ? t("condominio.unidades.edit.saving") : t("condominio.unidades.edit.save")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/condominio/unidades" })}
            >
              {t("condominio.unidades.edit.cancel")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
