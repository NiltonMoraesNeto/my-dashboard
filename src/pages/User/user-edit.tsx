import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "@tanstack/react-router";
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
import { schemaUserEdit } from "../../schemas/user-edit-schema";
import { fetchUserById, updateUser } from "../../services/usuarios";

interface UserResponse {
  id: string;
  nome: string;
  email: string;
  perfilId: number;
  cep?: string | null;
  perfil?: {
    id: number;
    descricao: string;
  };
}

export function UserEdit() {
  const navigate = useNavigate();
  const { id } = useParams({
    from: "/authenticated/user/$id/edit",
  });
  const { profiles, isLoading: isLoadingProfiles, error: profilesError, refresh } = useProfiles();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<z.infer<typeof schemaUserEdit>>({
    resolver: zodResolver(schemaUserEdit),
    defaultValues: {
      nome: "",
      email: "",
      perfilId: 0,
      cep: "",
    },
  });
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!id) {
        toast.error("Usuário não encontrado");
        navigate({ to: "/user" });
        return;
      }

      try {
        const response: UserResponse = await fetchUserById(id);
        setValue("nome", response.nome);
        setValue("email", response.email);
        setValue("perfilId", response.perfilId || response.perfil?.id || 0);
        setValue("cep", response.cep || "");
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        toast.error("Erro ao carregar dados do usuário");
        navigate({ to: "/user" });
      } finally {
        setIsLoadingUser(false);
      }
    };

    loadUser();
  }, [id, navigate, setValue]);

  const onSubmit = async (data: z.infer<typeof schemaUserEdit>) => {
    if (!id) return;

    try {
      await updateUser(id, {
        nome: data.nome,
        email: data.email,
        perfilId: data.perfilId,
        cep: data.cep || undefined,
      });

      toast.success("Usuário atualizado com sucesso!");
      reset(data);
      navigate({ to: "/user" });
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      toast.error("Erro ao atualizar usuário", {
        description: "Verifique os dados informados e tente novamente",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-indigo-900 p-8">
      <div className="max-w-full bg-white rounded-lg shadow-md p-6 dark:bg-indigo-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">
            Editar Usuário
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

        {isLoadingUser ? (
          <div className="text-center text-indigo-600 dark:text-indigo-300">
            Carregando dados do usuário...
          </div>
        ) : (
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
                {isSubmitting ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
