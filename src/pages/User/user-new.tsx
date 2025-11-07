import { useEffect, useState } from "react";
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
import { ProfileList } from "../../model/profile-model";
import { fetchProfileList } from "../../services/profile";
import { createUser } from "../../services/usuarios";

export function UserNew() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<ProfileList[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
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

  const onSubmit = async (data: z.infer<typeof schemaUserNew>) => {
    setIsSubmitting(true);
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
      toast.error("Erro ao criar usuário");
    } finally {
      setIsSubmitting(false);
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
            <Input
              id="nome"
              placeholder="Digite o nome"
              {...register("nome")}
            />
            {errors.nome && (
              <span className="text-sm text-red-500">{errors.nome.message}</span>
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
              <span className="text-sm text-red-500">{errors.email.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha provisória *</Label>
            <Input
              id="password"
              type="password"
              placeholder="Digite a senha provisória"
              {...register("password")}
            />
            {errors.password && (
              <span className="text-sm text-red-500">{errors.password.message}</span>
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
              <span className="text-sm text-red-500">{errors.cep.message}</span>
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
              {isSubmitting ? "Salvando..." : "Salvar Usuário"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
