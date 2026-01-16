import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { FormErrorMessage } from "../../components/form-error-message";
import {
  empresaSchema,
  type EmpresaFormData,
} from "../../schemas/empresa-schema";
import { createEmpresa } from "../../services/empresas";
import { toast } from "sonner";
import { maskCnpj, unmaskCnpj } from "../../utils/mask-cnpj";
import { maskTelefone, unmaskTelefone } from "../../utils/mask-telefone";
import { buscarCnpj } from "../../services/minha-receita";
import { InputDate } from "../../components/ui/input-date";
import { formatCurrency, unformatCurrency } from "../../utils/format-currency";

export function EmpresaNew() {
  const navigate = useNavigate();
  const [isLoadingCnpj, setIsLoadingCnpj] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EmpresaFormData>({
    resolver: zodResolver(empresaSchema),
    defaultValues: {
      nome: "",
      cnpj: "",
      razaoSocial: "",
      nomeFantasia: "",
      situacaoCadastral: "",
      dataSituacaoCadastral: undefined,
      matrizFilial: "",
      dataInicioAtividade: undefined,
      cnaePrincipal: "",
      cnaesSecundarios: "",
      naturezaJuridica: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cep: "",
      uf: "",
      municipio: "",
      email: "",
      telefone: "",
      telefones: "",
      capitalSocial: "",
      porteEmpresa: "",
      opcaoSimples: "",
      dataOpcaoSimples: undefined,
      opcaoMei: "",
      dataOpcaoMei: undefined,
      qsa: "",
      ativa: true,
      observacoes: "",
    },
  });

  const cnpjValue = watch("cnpj");

  // Buscar CNPJ quando o campo for preenchido
  useEffect(() => {
    const buscarDadosCnpj = async () => {
      const cnpjLimpo = cnpjValue?.replace(/\D/g, "") || "";

      if (cnpjLimpo.length === 14) {
        setIsLoadingCnpj(true);
        const dados = await buscarCnpj(cnpjLimpo);

        if (dados) {
          // Preencher campos básicos
          setValue("razaoSocial", dados.razao_social || "");
          setValue("nomeFantasia", dados.nome_fantasia || "");
          setValue("nome", dados.nome_fantasia || dados.razao_social || "");
          setValue("situacaoCadastral", dados.descricao_situacao_cadastral || "");
          setValue(
            "dataSituacaoCadastral",
            dados.data_situacao_cadastral
              ? new Date(dados.data_situacao_cadastral)
              : undefined
          );
          setValue("matrizFilial", dados.descricao_identificador_matriz_filial || "");
          setValue(
            "dataInicioAtividade",
            dados.data_inicio_atividade
              ? new Date(dados.data_inicio_atividade)
              : undefined
          );
          setValue("cnaePrincipal", dados.cnae_fiscal?.toString() || "");
          setValue(
            "cnaesSecundarios",
            dados.cnaes_secundarios
              ? JSON.stringify(dados.cnaes_secundarios)
              : ""
          );
          setValue("naturezaJuridica", dados.natureza_juridica || "");

          // Preencher endereço
          setValue("logradouro", dados.logradouro || "");
          setValue("numero", dados.numero || "");
          setValue("complemento", dados.complemento || "");
          setValue("bairro", dados.bairro || "");
          setValue("cep", dados.cep || "");
          setValue("uf", dados.uf || "");
          setValue("municipio", dados.municipio || "");

          // Preencher contatos
          setValue("email", dados.email || "");
          if (dados.ddd_telefone_1) {
            const telefoneFormatado = dados.ddd_telefone_1.length === 11 
              ? `(${dados.ddd_telefone_1.slice(0, 2)}) ${dados.ddd_telefone_1.slice(2)}`
              : dados.ddd_telefone_1;
            setValue("telefone", maskTelefone(telefoneFormatado));
          }
          const telefonesArray = [];
          if (dados.ddd_telefone_1) {
            telefonesArray.push({
              ddd: dados.ddd_telefone_1.slice(0, 2),
              numero: dados.ddd_telefone_1.slice(2),
              is_fax: false,
            });
          }
          if (dados.ddd_telefone_2) {
            telefonesArray.push({
              ddd: dados.ddd_telefone_2.slice(0, 2),
              numero: dados.ddd_telefone_2.slice(2),
              is_fax: false,
            });
          }
          if (telefonesArray.length > 0) {
            setValue("telefones", JSON.stringify(telefonesArray));
          }

          // Preencher dados financeiros
          setValue("capitalSocial", dados.capital_social ? formatCurrency(dados.capital_social) : "");
          setValue("porteEmpresa", dados.codigo_porte?.toString() || "");
          setValue("opcaoSimples", dados.opcao_pelo_simples ? "Sim" : "Não");
          setValue(
            "dataOpcaoSimples",
            dados.data_opcao_pelo_simples
              ? new Date(dados.data_opcao_pelo_simples)
              : undefined
          );
          setValue("opcaoMei", dados.opcao_pelo_mei ? "Sim" : "Não");
          setValue(
            "dataOpcaoMei",
            dados.data_opcao_pelo_mei ? new Date(dados.data_opcao_pelo_mei) : undefined
          );

          // Preencher QSA
          setValue("qsa", dados.qsa ? JSON.stringify(dados.qsa) : "");

          toast.success("Dados do CNPJ encontrados!");
        } else {
          toast.error("CNPJ não encontrado na base da Receita Federal");
        }
        setIsLoadingCnpj(false);
      }
    };

    if (cnpjValue) {
      const timeoutId = setTimeout(buscarDadosCnpj, 1500);
      return () => clearTimeout(timeoutId);
    }
  }, [cnpjValue, setValue]);

  const onSubmit = async (data: EmpresaFormData) => {
    try {
      await createEmpresa({
        nome: data.nome,
        cnpj: data.cnpj ? unmaskCnpj(data.cnpj) : undefined,
        razaoSocial: data.razaoSocial || undefined,
        nomeFantasia: data.nomeFantasia || undefined,
        situacaoCadastral: data.situacaoCadastral || undefined,
        dataSituacaoCadastral:
          data.dataSituacaoCadastral instanceof Date
            ? data.dataSituacaoCadastral.toISOString()
            : data.dataSituacaoCadastral || undefined,
        matrizFilial: data.matrizFilial || undefined,
        dataInicioAtividade:
          data.dataInicioAtividade instanceof Date
            ? data.dataInicioAtividade.toISOString()
            : data.dataInicioAtividade || undefined,
        cnaePrincipal: data.cnaePrincipal || undefined,
        cnaesSecundarios: data.cnaesSecundarios || undefined,
        naturezaJuridica: data.naturezaJuridica || undefined,
        logradouro: data.logradouro || undefined,
        numero: data.numero || undefined,
        complemento: data.complemento || undefined,
        bairro: data.bairro || undefined,
        cep: data.cep || undefined,
        uf: data.uf || undefined,
        municipio: data.municipio || undefined,
        email: data.email || undefined,
        telefone: data.telefone ? unmaskTelefone(data.telefone) : undefined,
        telefones: data.telefones || undefined,
        capitalSocial: data.capitalSocial ? unformatCurrency(data.capitalSocial).toString() : undefined,
        porteEmpresa: data.porteEmpresa || undefined,
        opcaoSimples: data.opcaoSimples || undefined,
        dataOpcaoSimples:
          data.dataOpcaoSimples instanceof Date
            ? data.dataOpcaoSimples.toISOString()
            : data.dataOpcaoSimples || undefined,
        opcaoMei: data.opcaoMei || undefined,
        dataOpcaoMei:
          data.dataOpcaoMei instanceof Date
            ? data.dataOpcaoMei.toISOString()
            : data.dataOpcaoMei || undefined,
        qsa: data.qsa || undefined,
        ativa: data.ativa,
        observacoes: data.observacoes || undefined,
      });
      toast.success("Empresa criada com sucesso!");
      navigate({ to: "/admin/empresas" });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao criar empresa");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-indigo-900 p-8">
      <div className="max-w-full bg-white rounded-lg shadow-md p-6 dark:bg-indigo-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">
            Nova Empresa
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

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="space-y-2">
            <Label htmlFor="nome">Nome da Empresa *</Label>
            <Input
              id="nome"
              placeholder="Digite o nome da empresa"
              {...register("nome")}
            />
            <FormErrorMessage message={errors.nome?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cnpj">CNPJ</Label>
            <div className="relative">
              <Controller
                name="cnpj"
                control={control}
                render={({ field }) => (
                  <Input
                    id="cnpj"
                    placeholder="00.000.000/0000-00"
                    maxLength={18}
                    value={field.value || ""}
                    onChange={(e) => {
                      const masked = maskCnpj(e.target.value);
                      field.onChange(masked);
                    }}
                    disabled={isLoadingCnpj}
                  />
                )}
              />
              {isLoadingCnpj && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-indigo-500">
                  Buscando...
                </span>
              )}
            </div>
            <FormErrorMessage message={errors.cnpj?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Digite o email"
              {...register("email")}
            />
            <FormErrorMessage message={errors.email?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Controller
              name="telefone"
              control={control}
              render={({ field }) => (
                <Input
                  id="telefone"
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                  value={field.value || ""}
                  onChange={(e) => {
                    const masked = maskTelefone(e.target.value);
                    field.onChange(masked);
                  }}
                />
              )}
            />
            <FormErrorMessage message={errors.telefone?.message} />
          </div>

          {/* Campos da API CNPJ */}
          <div className="space-y-2 md:col-span-2">
            <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-300 mt-4 mb-2">
              Dados da Receita Federal
            </h3>
          </div>

          <div className="space-y-2">
            <Label htmlFor="razaoSocial">Razão Social</Label>
            <Input
              id="razaoSocial"
              placeholder="Razão social"
              {...register("razaoSocial")}
            />
            <FormErrorMessage message={errors.razaoSocial?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
            <Input
              id="nomeFantasia"
              placeholder="Nome fantasia"
              {...register("nomeFantasia")}
            />
            <FormErrorMessage message={errors.nomeFantasia?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="situacaoCadastral">Situação Cadastral</Label>
            <Input
              id="situacaoCadastral"
              placeholder="Situação cadastral"
              {...register("situacaoCadastral")}
            />
            <FormErrorMessage message={errors.situacaoCadastral?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataSituacaoCadastral">Data Situação Cadastral</Label>
            <Controller
              name="dataSituacaoCadastral"
              control={control}
              render={({ field }) => (
                <InputDate
                  id="dataSituacaoCadastral"
                  value={field.value}
                  onChange={(date) => field.onChange(date)}
                  placeholder="Selecione a data"
                />
              )}
            />
            <FormErrorMessage message={errors.dataSituacaoCadastral?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="matrizFilial">Matriz/Filial</Label>
            <Input
              id="matrizFilial"
              placeholder="Matriz ou Filial"
              {...register("matrizFilial")}
            />
            <FormErrorMessage message={errors.matrizFilial?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataInicioAtividade">Data de Abertura</Label>
            <Controller
              name="dataInicioAtividade"
              control={control}
              render={({ field }) => (
                <InputDate
                  id="dataInicioAtividade"
                  value={field.value}
                  onChange={(date) => field.onChange(date)}
                  placeholder="Selecione a data"
                />
              )}
            />
            <FormErrorMessage message={errors.dataInicioAtividade?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cnaePrincipal">CNAE Principal</Label>
            <Input
              id="cnaePrincipal"
              placeholder="CNAE principal"
              {...register("cnaePrincipal")}
            />
            <FormErrorMessage message={errors.cnaePrincipal?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cnaesSecundarios">CNAEs Secundários</Label>
            <Input
              id="cnaesSecundarios"
              placeholder="CNAEs secundários"
              {...register("cnaesSecundarios")}
            />
            <FormErrorMessage message={errors.cnaesSecundarios?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="naturezaJuridica">Natureza Jurídica</Label>
            <Input
              id="naturezaJuridica"
              placeholder="Natureza jurídica"
              {...register("naturezaJuridica")}
            />
            <FormErrorMessage message={errors.naturezaJuridica?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logradouro">Logradouro</Label>
            <Input
              id="logradouro"
              placeholder="Logradouro"
              {...register("logradouro")}
            />
            <FormErrorMessage message={errors.logradouro?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="numero">Número</Label>
            <Input
              id="numero"
              placeholder="Número"
              {...register("numero")}
            />
            <FormErrorMessage message={errors.numero?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="complemento">Complemento</Label>
            <Input
              id="complemento"
              placeholder="Complemento"
              {...register("complemento")}
            />
            <FormErrorMessage message={errors.complemento?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bairro">Bairro</Label>
            <Input
              id="bairro"
              placeholder="Bairro"
              {...register("bairro")}
            />
            <FormErrorMessage message={errors.bairro?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cep">CEP</Label>
            <Input
              id="cep"
              placeholder="CEP"
              {...register("cep")}
            />
            <FormErrorMessage message={errors.cep?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="uf">UF</Label>
            <Input
              id="uf"
              placeholder="UF"
              maxLength={2}
              {...register("uf")}
            />
            <FormErrorMessage message={errors.uf?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="municipio">Município</Label>
            <Input
              id="municipio"
              placeholder="Município"
              {...register("municipio")}
            />
            <FormErrorMessage message={errors.municipio?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="capitalSocial">Capital Social</Label>
            <Controller
              name="capitalSocial"
              control={control}
              render={({ field }) => (
                <Input
                  id="capitalSocial"
                  placeholder="R$ 0,00"
                  value={field.value || ""}
                  onChange={(e) => {
                    const formatted = formatCurrency(e.target.value);
                    field.onChange(formatted);
                  }}
                />
              )}
            />
            <FormErrorMessage message={errors.capitalSocial?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="porteEmpresa">Porte da Empresa</Label>
            <Input
              id="porteEmpresa"
              placeholder="Porte da empresa"
              {...register("porteEmpresa")}
            />
            <FormErrorMessage message={errors.porteEmpresa?.message} />
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
              {isSubmitting ? "Criando..." : "Criar Empresa"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
