import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import type { z } from "zod";
import { FormErrorMessage } from "../../components/form-error-message";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useProfiles } from "../../hooks/useProfiles";
import { schemaUserNew } from "../../schemas/user-new-schema";
import { createUser, fetchCondominiosList } from "../../services/usuarios";

export function UserNew() {
  const navigate = useNavigate();
  const { profiles, isLoading: isLoadingProfiles, error: profilesError, refresh } = useProfiles();
  const [condominios, setCondominios] = useState<Array<{ id: string; nome: string; email: string }>>([]);
  const [isLoadingCondominios, setIsLoadingCondominios] = useState(false);
  
  const {
    register,
    handleSubmit,
    control,
    watch,
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
      condominioId: undefined,
    },
  });

  const selectedPerfilId = watch("perfilId");
  
  // Buscar perfil Morador
  const perfilMorador = profiles.find(
    (p) => p.descricao.toLowerCase().includes("morador")
  );
  const isMoradorProfile = perfilMorador && selectedPerfilId === perfilMorador.id;

  // Carregar condomínios quando o perfil Morador for selecionado
  useEffect(() => {
    if (isMoradorProfile) {
      setIsLoadingCondominios(true);
      fetchCondominiosList()
        .then((data) => {
          setCondominios(data);
        })
        .catch((error) => {
          console.error("Erro ao carregar condomínios:", error);
          toast.error("Erro ao carregar lista de condomínios");
        })
        .finally(() => {
          setIsLoadingCondominios(false);
        });
    } else {
      setCondominios([]);
    }
  }, [isMoradorProfile]);

  const onSubmit = async (data: z.infer<typeof schemaUserNew>) => {
    try {
      await createUser({
        nome: data.nome,
        email: data.email,
        password: data.password,
        perfilId: data.perfilId,
        cep: data.cep || undefined,
        condominioId: data.condominioId || undefined,
      });

      toast.success("Usuário criado com sucesso!");
      reset();
      navigate({ to: "/user" });
    } catch (error: unknown) {
      console.error("Erro ao criar usuário:", error);
      const errorMessage = 
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Verifique os dados informados e tente novamente";
      toast.error("Erro ao criar usuário", {
        description: errorMessage,
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
            onClick={() => navigate({ to: "/user" })}
          >
            <ArrowLeft /> Voltar
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome completo *</Label>
            <Input id="nome" placeholder="Digite o nome" {...register("nome")} />
            <FormErrorMessage message={errors.nome?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" placeholder="Digite o email" {...register("email")} />
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
            {isLoadingProfiles ? (
              <span className="text-sm text-indigo-500">Carregando perfis...</span>
            ) : (
              <>
                <Controller
                  name="perfilId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value?.toString()}
                      onValueChange={(value) => field.onChange(parseInt(value, 10))}
                      disabled={isLoadingProfiles}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um perfil" />
                      </SelectTrigger>
                      <SelectContent>
                        {profiles.map((profile) => (
                          <SelectItem key={profile.id} value={profile.id.toString()}>
                            {profile.descricao}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FormErrorMessage message={errors.perfilId?.message} />
                {profilesError && (
                  <div className="text-sm text-red-500 flex items-center gap-2">
                    <span>{profilesError}</span>
                    <Button type="button" variant="link" className="p-0 h-auto" onClick={refresh}>
                      Tentar novamente
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="cep">CEP (opcional)</Label>
            <Input id="cep" placeholder="00000000" maxLength={8} {...register("cep")} />
            <FormErrorMessage message={errors.cep?.message} />
          </div>

          {isMoradorProfile && (
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="condominioId">Condomínio *</Label>
              {isLoadingCondominios ? (
                <span className="text-sm text-indigo-500">Carregando condomínios...</span>
              ) : (
                <>
                  <Controller
                    name="condominioId"
                    control={control}
                    rules={{ required: isMoradorProfile ? "Condomínio é obrigatório para perfil Morador" : false }}
                    render={({ field }) => (
                      <Select
                        value={field.value || ""}
                        onValueChange={field.onChange}
                        disabled={isLoadingCondominios}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um condomínio" />
                        </SelectTrigger>
                        <SelectContent>
                          {condominios.length === 0 ? (
                            <SelectItem value="empty" disabled>
                              Nenhum condomínio disponível
                            </SelectItem>
                          ) : (
                            condominios.map((condominio) => (
                              <SelectItem key={condominio.id} value={condominio.id}>
                                {condominio.nome} ({condominio.email})
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FormErrorMessage message={errors.condominioId?.message} />
                </>
              )}
            </div>
          )}

          <div className="md:col-span-2 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/user" })}
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
