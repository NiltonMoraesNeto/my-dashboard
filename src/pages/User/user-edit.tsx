import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import { schemaUserEdit } from "../../schemas/user-edit-schema";
import { ProfileList } from "../../model/profile-model";
import { fetchProfileList } from "../../services/profile";
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
  const { id } = useParams<{ id: string }>();
  const [profiles, setProfiles] = useState<ProfileList[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
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

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        const response = await fetchProfileList(1, 100, "");
        if (response && response.data) {
          setProfiles(response.data);
        } else if (Array.isArray(response)) {
          setProfiles(response);
        }
      } catch (error) {
        console.error("Erro ao carregar perfis:", error);
        toast.error("Erro ao carregar perfis");
      }
    };

    loadProfiles();
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      if (!id) {
        toast.error("Usuário não encontrado");
        navigate("/user");
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
        navigate("/user");
      } finally {
        setIsLoadingUser(false);
      }
    };

    loadUser();
  }, [id, navigate, setValue]);

  const onSubmit = async (data: z.infer<typeof schemaUserEdit>) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await updateUser(id, {
        nome: data.nome,
        email: data.email,
        perfilId: data.perfilId,
        cep: data.cep || undefined,
      });

      toast.success("Usuário atualizado com sucesso!");
      reset(data);
      navigate("/user");
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      toast.error("Erro ao atualizar usuário");
    } finally {
      setIsSubmitting(false);
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
            onClick={() => navigate("/user")}
          >
            <ArrowLeft /> Voltar
          </Button>
        </div>

        {isLoadingUser ? (
          <div className="text-center text-indigo-600 dark:text-indigo-300">
            Carregando dados do usuário...
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="space-y-2">
              <Label htmlFor="nome">Nome completo *</Label>
              <Input
                id="nome"
                placeholder="Digite o nome"
                {...register("nome")}
              />
              {errors.nome && (
                <span className="text-sm text-red-500">
                  {errors.nome.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Digite o email"
                {...register("email")}
              />
              {errors.email && (
                <span className="text-sm text-red-500">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="perfilId">Perfil *</Label>
              <select
                id="perfilId"
                className="w-full px-3 py-2 border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-indigo-900 dark:text-white"
                {...register("perfilId", { valueAsNumber: true })}
              >
                <option value="0">Selecione um perfil</option>
                {profiles.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.descricao}
                  </option>
                ))}
              </select>
              {errors.perfilId && (
                <span className="text-sm text-red-500">
                  {errors.perfilId.message}
                </span>
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
              {errors.cep && (
                <span className="text-sm text-red-500">
                  {errors.cep.message}
                </span>
              )}
            </div>

            <div className="md:col-span-2 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/user")}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
