export interface UnidadeList {
  id: string;
  numero: string;
  bloco?: string;
  apartamento?: string;
  tipo?: string;
  status: string;
  proprietario?: string;
  telefone?: string;
  email?: string;
  userId: string;
  moradorId?: string;
  createdAt: string;
  updatedAt: string;
  morador?: {
    id: string;
    nome: string;
    email: string;
  };
}

