export interface BoletoList {
  id: string;
  unidadeId: string;
  descricao: string;
  valor: number;
  vencimento: string;
  arquivoPdf?: string;
  status: string;
  dataPagamento?: string;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
  unidade?: {
    id: string;
    numero: string;
    bloco?: string;
    apartamento?: string;
  };
}

