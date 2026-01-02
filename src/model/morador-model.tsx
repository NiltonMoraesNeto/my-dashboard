export interface MoradorList {
  id: string;
  nome: string;
  email: string;
  perfilId: number;
  cep?: string;
  avatar?: string;
  condominioId?: string;
  createdAt: string;
  updatedAt: string;
  perfil?: {
    id: number;
    descricao: string;
  };
}

