import { useEffect } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { FormErrorMessage } from "../../components/form-error-message";
import { empresaSchema, type EmpresaFormData } from "../../schemas/empresa-schema";
import { fetchEmpresa, updateEmpresa } from "../../services/empresas";
import { toast } from "sonner";

export function EmpresaEdit() {
  const navigate = useNavigate();
  const { id } = useParams({ strict: false });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EmpresaFormData>({
    resolver: zodResolver(empresaSchema),
  });

  useEffect(() => {
    const loadEmpresa = async () => {
      try {
        const empresa = await fetchEmpresa(id);
        reset({
          nome: empresa.nome,
          cnpj: empresa.cnpj || "",
          email: empresa.email || "",
          telefone: empresa.telefone || "",
          ativa: empresa.ativa,
          observacoes: empresa.observacoes || "",
        });
      } catch (error: any) {
        toast.error("Erro ao carregar dados da empresa");
        navigate({ to: "/admin/empresas" });
      }
    };
    loadEmpresa();
  }, [id, reset, navigate]);

  const onSubmit = async (data: EmpresaFormData) => {
    try {
      await updateEmpresa(id, {
        nome: data.nome,
        cnpj: data.cnpj || undefined,
        email: data.email || undefined,
        telefone: data.telefone || undefined,
        ativa: data.ativa,
        observacoes: data.observacoes || undefined,
      });
      toast.success("Empresa atualizada com sucesso!");
      navigate({ to: "/admin/empresas" });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao atualizar empresa");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-indigo-900 p-8">
      <div className="max-w-full bg-white rounded-lg shadow-md p-6 dark:bg-indigo-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">
            Editar Empresa
          </h1>
          <Button
            type="button"
            variant="ghost"
            className="text-lg text-indigo-600 dark:text-indigo-300 flex items-center gap-2"
            onClick={() => navigate({ to: "/admin/empresas" })}
          >
            <ArrowLeft /> Voltar
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome da Empresa *</Label>
            <Input id="nome" placeholder="Digite o nome da empresa" {...register("nome")} />
            <FormErrorMessage message={errors.nome?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cnpj">CNPJ</Label>
            <Input id="cnpj" placeholder="Digite o CNPJ" {...register("cnpj")} />
            <FormErrorMessage message={errors.cnpj?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Digite o email" {...register("email")} />
            <FormErrorMessage message={errors.email?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input id="telefone" placeholder="Digite o telefone" {...register("telefone")} />
            <FormErrorMessage message={errors.telefone?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ativa">Status</Label>
            <select
              id="ativa"
              className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-indigo-700 dark:border-indigo-600 dark:text-white"
              {...register("ativa", {
                setValueAs: (v) => v === "true" || v === true,
              })}
            >
              <option value="true">Ativa</option>
              <option value="false">Inativa</option>
            </select>
            <FormErrorMessage message={errors.ativa?.message} />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="observacoes">Observações</Label>
            <textarea
              id="observacoes"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-indigo-700 dark:border-indigo-600 dark:text-white"
              placeholder="Digite observações sobre a empresa"
              {...register("observacoes")}
            />
            <FormErrorMessage message={errors.observacoes?.message} />
          </div>

          <div className="md:col-span-2 flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/admin/empresas" })}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
