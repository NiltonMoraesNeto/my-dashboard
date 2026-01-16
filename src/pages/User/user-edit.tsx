import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState, useRef } from "react";
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
import { fetchUserById, updateUser, fetchCondominiosList } from "../../services/usuarios";
import { useAuth } from "../../contexts/auth-context";
import { fetchEmpresasForSelect } from "../../services/empresas";
import { buscarCep } from "../../services/viacep";
import { maskCpf, unmaskCpf } from "../../utils/mask-cpf";
import { InputDate } from "../../components/ui/input-date";

interface UserResponse {
  id: string;
  nome: string;
  email: string;
  perfilId: number;
  cep?: string | null;
  cpf?: string | null;
  dataNascimento?: Date | string | null;
  logradouro?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  uf?: string | null;
  condominioId?: string | null;
  empresaId?: string | null;
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
  const { profileUser } = useAuth();
  const isSuperAdmin = profileUser?.toLowerCase() === "superadmin";
  const [condominios, setCondominios] = useState<Array<{ id: string; nome: string; email: string }>>([]);
  const [isLoadingCondominios, setIsLoadingCondominios] = useState(false);
  const [empresas, setEmpresas] = useState<Array<{ id: string; nome: string }>>([]);
  const [isLoadingEmpresas, setIsLoadingEmpresas] = useState(false);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const isInitialLoad = useRef(true);
  const previousCepRef = useRef<string>("");
  
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<z.infer<typeof schemaUserEdit>>({
    resolver: zodResolver(schemaUserEdit),
    defaultValues: {
      nome: "",
      email: "",
      perfilId: 0,
      cpf: "",
      dataNascimento: undefined,
      cep: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      uf: "",
      condominioId: undefined,
      empresaId: undefined,
    },
  });
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const selectedPerfilId = watch("perfilId");
  const cepValue = watch("cep");
  
  // Buscar perfil Morador
  const perfilMorador = profiles.find(
    (p) => p.descricao.toLowerCase().includes("morador")
  );
  const isMoradorProfile = perfilMorador && selectedPerfilId === perfilMorador.id;

  // Buscar CEP quando o campo for preenchido (apenas quando o usuário digitar, não no carregamento inicial)
  useEffect(() => {
    // Ignorar se for o carregamento inicial
    if (isInitialLoad.current) {
      return;
    }

    // Ignorar se o CEP não mudou
    const cepLimpo = cepValue?.replace(/\D/g, "") || "";
    const previousCepLimpo = previousCepRef.current?.replace(/\D/g, "") || "";
    
    if (cepLimpo === previousCepLimpo) {
      return;
    }

    const buscarEndereco = async () => {
      if (cepLimpo.length === 8) {
        setIsLoadingCep(true);
        const endereco = await buscarCep(cepLimpo);
        
        if (endereco) {
          setValue("logradouro", endereco.logradouro);
          setValue("bairro", endereco.bairro);
          setValue("cidade", endereco.cidade);
          setValue("uf", endereco.uf);
          toast.success("Endereço encontrado!");
        } else {
          toast.error("CEP não encontrado. Preencha os dados manualmente.");
        }
        setIsLoadingCep(false);
      }
    };

    if (cepValue) {
      previousCepRef.current = cepValue;
      const timeoutId = setTimeout(buscarEndereco, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [cepValue, setValue]);

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
        const perfilId = response.perfilId || response.perfil?.id || 0;
        setValue("perfilId", perfilId);
        setValue("cpf", response.cpf ? maskCpf(response.cpf) : "");
        setValue("dataNascimento", response.dataNascimento ? new Date(response.dataNascimento) : undefined);
        setValue("cep", response.cep || "");
        setValue("logradouro", response.logradouro || "");
        setValue("numero", response.numero || "");
        setValue("complemento", response.complemento || "");
        setValue("bairro", response.bairro || "");
        setValue("cidade", response.cidade || "");
        setValue("uf", response.uf || "");
        setValue("condominioId", response.condominioId || undefined);
        setValue("empresaId", response.empresaId || undefined);
        
        // Marcar que o carregamento inicial foi concluído e atualizar ref do CEP
        previousCepRef.current = response.cep || "";
        isInitialLoad.current = false;
        
        // Se o perfil for Morador, carregar condomínios
        const perfilMorador = profiles.find(
          (p) => p.descricao.toLowerCase().includes("morador")
        );
        if (perfilMorador && perfilId === perfilMorador.id) {
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
        }
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        toast.error("Erro ao carregar dados do usuário");
        navigate({ to: "/user" });
      } finally {
        setIsLoadingUser(false);
      }
    };

    loadUser();
  }, [id, navigate, setValue, profiles]);

  // Carregar empresas se for SuperAdmin
  useEffect(() => {
    if (isSuperAdmin) {
      setIsLoadingEmpresas(true);
      fetchEmpresasForSelect()
        .then((data) => {
          setEmpresas(data);
        })
        .catch((error) => {
          console.error("Erro ao carregar empresas:", error);
          toast.error("Erro ao carregar lista de empresas");
        })
        .finally(() => {
          setIsLoadingEmpresas(false);
        });
    }
  }, [isSuperAdmin]);

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

  const onSubmit = async (data: z.infer<typeof schemaUserEdit>) => {
    if (!id) return;

    try {
      await updateUser(id, {
        nome: data.nome,
        email: data.email,
        perfilId: data.perfilId,
        cpf: data.cpf ? unmaskCpf(data.cpf) : undefined,
        dataNascimento: data.dataNascimento instanceof Date 
          ? data.dataNascimento.toISOString() 
          : data.dataNascimento || undefined,
        cep: data.cep,
        logradouro: data.logradouro,
        numero: data.numero,
        complemento: data.complemento || undefined,
        bairro: data.bairro,
        cidade: data.cidade,
        uf: data.uf,
        condominioId: data.condominioId || undefined,
        empresaId: data.empresaId || undefined,
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

            <div className="space-y-2">
              <Label htmlFor="dataNascimento">Data de Nascimento</Label>
              <Controller
                name="dataNascimento"
                control={control}
                render={({ field }) => (
                  <InputDate
                    id="dataNascimento"
                    value={field.value}
                    onChange={(date) => field.onChange(date)}
                    placeholder="Selecione a data de nascimento"
                  />
                )}
              />
              <FormErrorMessage message={errors.dataNascimento?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cep">CEP *</Label>
              <div className="relative">
                <Input
                  id="cep"
                  placeholder="00000000"
                  maxLength={8}
                  {...register("cep")}
                  disabled={isLoadingCep}
                />
                {isLoadingCep && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-indigo-500">
                    Buscando...
                  </span>
                )}
              </div>
              <FormErrorMessage message={errors.cep?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Controller
                name="cpf"
                control={control}
                render={({ field }) => (
                  <Input
                    id="cpf"
                    placeholder="000.000.000-00"
                    maxLength={14}
                    value={field.value || ""}
                    onChange={(e) => {
                      const masked = maskCpf(e.target.value);
                      field.onChange(masked);
                    }}
                  />
                )}
              />
              <FormErrorMessage message={errors.cpf?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logradouro">Logradouro *</Label>
              <Input id="logradouro" placeholder="Rua, Avenida, etc." {...register("logradouro")} />
              <FormErrorMessage message={errors.logradouro?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numero">Número *</Label>
              <Input id="numero" placeholder="123 ou 123A" {...register("numero")} />
              <FormErrorMessage message={errors.numero?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="complemento">Complemento (opcional)</Label>
              <Input id="complemento" placeholder="Apto, Bloco, etc." {...register("complemento")} />
              <FormErrorMessage message={errors.complemento?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bairro">Bairro *</Label>
              <Input id="bairro" placeholder="Nome do bairro" {...register("bairro")} />
              <FormErrorMessage message={errors.bairro?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade *</Label>
              <Input id="cidade" placeholder="Nome da cidade" {...register("cidade")} />
              <FormErrorMessage message={errors.cidade?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="uf">UF *</Label>
              <Input id="uf" placeholder="UF" maxLength={2} {...register("uf")} />
              <FormErrorMessage message={errors.uf?.message} />
            </div>

            {isSuperAdmin && (
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="empresaId">Empresa (opcional)</Label>
                {isLoadingEmpresas ? (
                  <span className="text-sm text-indigo-500">Carregando empresas...</span>
                ) : (
                  <>
                    <Controller
                      name="empresaId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value || ""}
                          onValueChange={field.onChange}
                          disabled={isLoadingEmpresas}
                        >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma empresa (opcional)" />
                        </SelectTrigger>
                        <SelectContent>
                          {empresas.map((empresa) => (
                            <SelectItem key={empresa.id} value={empresa.id}>
                              {empresa.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                        </Select>
                      )}
                    />
                    <FormErrorMessage message={errors.empresaId?.message} />
                  </>
                )}
              </div>
            )}

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
                {isSubmitting ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
