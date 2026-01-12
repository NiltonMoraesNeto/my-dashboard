export interface Empresa {
  id: string;
  nome: string;
  cnpj?: string;
  email?: string;
  telefone?: string;
  ativa: boolean;
  dataInicio: Date;
  dataFim?: Date;
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmpresaList extends Empresa {}
