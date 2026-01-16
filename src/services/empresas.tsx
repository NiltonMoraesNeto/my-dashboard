import api from "./api";

export interface Empresa {
  id: string;
  nome: string;
  cnpj?: string;
  razaoSocial?: string;
  nomeFantasia?: string;
  situacaoCadastral?: string;
  dataSituacaoCadastral?: Date | string;
  matrizFilial?: string;
  dataInicioAtividade?: Date | string;
  cnaePrincipal?: string;
  cnaesSecundarios?: string;
  naturezaJuridica?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cep?: string;
  uf?: string;
  municipio?: string;
  email?: string;
  telefone?: string;
  telefones?: string;
  capitalSocial?: string;
  porteEmpresa?: string;
  opcaoSimples?: string;
  dataOpcaoSimples?: Date | string;
  opcaoMei?: string;
  dataOpcaoMei?: Date | string;
  qsa?: string;
  ativa: boolean;
  dataInicio: Date;
  dataFim?: Date;
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEmpresaDto {
  nome: string;
  cnpj?: string;
  razaoSocial?: string;
  nomeFantasia?: string;
  situacaoCadastral?: string;
  dataSituacaoCadastral?: Date | string;
  matrizFilial?: string;
  dataInicioAtividade?: Date | string;
  cnaePrincipal?: string;
  cnaesSecundarios?: string;
  naturezaJuridica?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cep?: string;
  uf?: string;
  municipio?: string;
  email?: string;
  telefone?: string;
  telefones?: string;
  capitalSocial?: string;
  porteEmpresa?: string;
  opcaoSimples?: string;
  dataOpcaoSimples?: Date | string;
  opcaoMei?: string;
  dataOpcaoMei?: Date | string;
  qsa?: string;
  ativa?: boolean;
  dataInicio?: Date;
  dataFim?: Date;
  observacoes?: string;
}

export interface UpdateEmpresaDto {
  nome?: string;
  cnpj?: string;
  razaoSocial?: string;
  nomeFantasia?: string;
  situacaoCadastral?: string;
  dataSituacaoCadastral?: Date | string;
  matrizFilial?: string;
  dataInicioAtividade?: Date | string;
  cnaePrincipal?: string;
  cnaesSecundarios?: string;
  naturezaJuridica?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cep?: string;
  uf?: string;
  municipio?: string;
  email?: string;
  telefone?: string;
  telefones?: string;
  capitalSocial?: string;
  porteEmpresa?: string;
  opcaoSimples?: string;
  dataOpcaoSimples?: Date | string;
  opcaoMei?: string;
  dataOpcaoMei?: Date | string;
  qsa?: string;
  ativa?: boolean;
  dataInicio?: Date;
  dataFim?: Date;
  observacoes?: string;
}

export interface EmpresasListResponse {
  data: Empresa[];
  total: number;
  page: number;
  totalPages: number;
}

export interface EmpresaOption {
  id: string;
  nome: string;
}

export async function fetchEmpresasList(
  page: number = 1,
  limit: number = 10,
  search: string = ""
): Promise<EmpresasListResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    totalItemsByPage: limit.toString(),
    ...(search && { search }),
  });

  const response = await api.get<EmpresasListResponse>(
    `/empresas?${params.toString()}`
  );
  return response.data;
}

export async function fetchEmpresasForSelect(): Promise<EmpresaOption[]> {
  // Buscar todas as empresas (usar limite alto para pegar todas)
  const response = await api.get<EmpresasListResponse>(
    `/empresas?page=1&totalItemsByPage=1000`
  );
  return response.data.data.map((empresa) => ({
    id: empresa.id,
    nome: empresa.nome,
  }));
}

export async function fetchEmpresa(id: string): Promise<Empresa> {
  const response = await api.get<Empresa>(`/empresas/${id}`);
  return response.data;
}

export async function createEmpresa(
  data: CreateEmpresaDto
): Promise<Empresa> {
  const response = await api.post<Empresa>("/empresas", data);
  return response.data;
}

export async function updateEmpresa(
  id: string,
  data: UpdateEmpresaDto
): Promise<Empresa> {
  const response = await api.patch<Empresa>(`/empresas/${id}`, data);
  return response.data;
}

export async function deleteEmpresa(id: string): Promise<void> {
  await api.delete(`/empresas/${id}`);
}

export async function toggleEmpresaStatus(id: string): Promise<Empresa> {
  const response = await api.put<Empresa>(`/empresas/${id}/toggle-ativa`);
  return response.data;
}
