import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import { schemaUserNew } from "../../schemas/user-new-schema";
import { createUser } from "../../services/usuarios";
import { FormErrorMessage } from "../../components/form-error-message";
import { useProfiles } from "../../hooks/useProfiles";

export function UserNew() {
  const navigate = useNavigate();
  const {
    profiles,
    isLoading: isLoadingProfiles,
    error: profilesError,
    refresh,
  } = useProfiles();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<z.infer<typeof schemaUserNew>>({
    resolver: zodResolver(schemaUserNew),
    defaultValues: {
      nome: "",
      email: "",
      password: "",
      perfilId: 0,
      cep: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof schemaUserNew>) => {
    try {
      await createUser({
        nome: data.nome,
        email: data.email,
        password: data.password,
        perfilId: data.perfilId,
        cep: data.cep || undefined,
      });

      toast.success("Usuário criado com sucesso!");
      reset();
      navigate("/user");
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      toast.error("Erro ao criar usuário", {
        description: "Verifique os dados informados e tente novamente",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-indigo-900 p-8">
      <div className="max-w-full bg-white rounded-lg shadow-md p-6 dark:bg-indigo-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">
            Adicionar Novo Usuário
          </h1>
          <Button
            type="button"
            variant="ghost"
            className="text-lg text-indigo-600 dark:text-indigo-300 flex items-center gap-2"
            onClick={() => navigate("/user")}
          >
            <ArrowLeft /> Voltar
          </Button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="space-y-2">
            <Label htmlFor="nome">Nome completo *</Label>
            <Input id="nome" placeholder="Digite o nome" {...register("nome")} />
            <FormErrorMessage message={errors.nome?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="Digite o email"
              {...register("email")}
            />
            <FormErrorMessage message={errors.email?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha provisória *</Label>
            <Input
              id="password"
              type="password"
              placeholder="Digite a senha provisória"
              {...register("password")}
            />
            <FormErrorMessage message={errors.password?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="perfilId">Perfil *</Label>
            <select
              id="perfilId"
              className="w-full px-3 py-2 border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-indigo-900 dark:text-white"
              {...register("perfilId", { valueAsNumber: true })}
              disabled={isLoadingProfiles}
            >
              <option value="0">Selecione um perfil</option>
              {profiles.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.descricao}
                </option>
              ))}
            </select>
            {isLoadingProfiles ? (
              <span className="text-sm text-indigo-500">Carregando perfis...</span>
            ) : (
              <FormErrorMessage message={errors.perfilId?.message} />
            )}
            {profilesError && (
              <div className="text-sm text-red-500 flex items-center gap-2">
                <span>{profilesError}</span>
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto"
                  onClick={refresh}
                >
                  Tentar novamente
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="cep">CEP (opcional)</Label>
            <Input
              id="cep"
              placeholder="00000000"
              maxLength={8}
              {...register("cep")}
            />
            <FormErrorMessage message={errors.cep?.message} />
          </div>

          <div className="md:col-span-2 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/user")}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoadingProfiles}>
              {isSubmitting ? "Salvando..." : "Salvar Usuário"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
