export interface AvisoList {
  id: string;
  titulo: string;
  descricao: string;
  tipo: string;
  dataInicio: string;
  dataFim?: string;
  destaque: boolean;
  lido?: boolean;
  createdAt: string;
  updatedAt: string;
}

