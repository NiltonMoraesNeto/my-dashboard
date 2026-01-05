import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "@tanstack/react-router";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import type { z } from "zod";
import { FormErrorMessage } from "../../../components/form-error-message";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { schemaMoradorEdit } from "../../../schemas/morador-schema";
import { fetchMoradorById, updateMorador } from "../../../services/moradores";

interface MoradorResponse {
  id: string;
  nome: string;
  email: string;
  cep?: string;
  createdAt: string;
  updatedAt: string;
}

export function MoradorEdit() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams({ strict: false });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<z.infer<typeof schemaMoradorEdit>>({
    resolver: zodResolver(schemaMoradorEdit),
    defaultValues: {
      nome: "",
      email: "",
      password: "",
      cep: "",
    },
  });

  useEffect(() => {
    const loadMorador = async () => {
      if (!id) {
        toast.error(t("condominio.moradores.edit.notFound"));
        navigate({ to: "/condominio/moradores" });
        return;
      }

      try {
        const morador: MoradorResponse = await fetchMoradorById(id);
        reset({
          nome: morador.nome || "",
          email: morador.email || "",
          cep: morador.cep || "",
          password: "",
        });
      } catch (error) {
        console.error("Erro ao carregar morador:", error);
        toast.error(t("condominio.moradores.edit.errorLoad"));
        navigate({ to: "/condominio/moradores" });
      }
    };
    loadMorador();
  }, [id, reset, navigate]);

  const onSubmit = async (data: z.infer<typeof schemaMoradorEdit>) => {
    if (!id) return;

    try {
      const payload: {
        nome?: string;
        email?: string;
        cep?: string;
        password?: string;
      } = {
        nome: data.nome,
        email: data.email,
        cep: data.cep || undefined,
      };

      if (data.password && data.password.length > 0) {
        payload.password = data.password;
      }

      await updateMorador(id, payload);

      toast.success(t("condominio.moradores.edit.success"));
      navigate({ to: "/condominio/moradores" });
    } catch (error: unknown) {
      console.error("Erro ao atualizar morador:", error);
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || t("condominio.moradores.edit.error");
      toast.error(t("condominio.moradores.edit.error"), {
        description: message,
      });
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-full bg-white rounded-lg shadow-md p-6 dark:bg-emerald-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-300">
            {t("condominio.moradores.edit.title")}
          </h1>
          <Button
            type="button"
            variant="ghost"
            className="text-lg text-emerald-600 dark:text-emerald-300 flex items-center gap-2"
            onClick={() => navigate({ to: "/condominio/moradores" })}
          >
            <ArrowLeft /> {t("condominio.moradores.edit.back")}
          </Button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="space-y-2">
            <Label htmlFor="nome">{t("condominio.moradores.edit.nome")} *</Label>
            <Input
              id="nome"
              placeholder={t("condominio.moradores.edit.nomePlaceholder")}
              {...register("nome")}
            />
            <FormErrorMessage message={errors.nome?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t("condominio.moradores.edit.email")} *</Label>
            <Input
              id="email"
              type="email"
              placeholder={t("condominio.moradores.edit.emailPlaceholder")}
              {...register("email")}
            />
            <FormErrorMessage message={errors.email?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t("condominio.moradores.edit.password")}</Label>
            <Input
              id="password"
              type="password"
              placeholder={t("condominio.moradores.edit.passwordPlaceholder")}
              {...register("password")}
            />
            <FormErrorMessage message={errors.password?.message} />
            <p className="text-sm text-gray-500">
              {t("condominio.moradores.edit.passwordHint")}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cep">{t("condominio.moradores.edit.cep")}</Label>
            <Input id="cep" placeholder={t("condominio.moradores.edit.cepPlaceholder")} {...register("cep")} />
            <FormErrorMessage message={errors.cep?.message} />
          </div>

          <div className="md:col-span-2 flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-500 text-white"
            >
              {isSubmitting ? t("condominio.moradores.edit.saving") : t("condominio.moradores.edit.save")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/condominio/moradores" })}
            >
              {t("condominio.moradores.edit.cancel")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
