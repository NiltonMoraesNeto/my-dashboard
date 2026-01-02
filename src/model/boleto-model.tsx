export interface BoletoList {
  id: string;
  unidadeId: string;
  mes: number;
  ano: number;
  valor: number;
  vencimento: string;
  codigoBarras?: string;
  nossoNumero?: string;
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

