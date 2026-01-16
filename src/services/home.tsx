import api from "./api";

export interface MovimentacaoMensal {
  mes: number;
  valor: number;
}

export interface FetchMovimentacoesParams {
  ano: number;
  tipo?: "Entrada" | "Saída";
  condominioId?: string;
}

export const fetchMovimentacoesMensal = async (
  params: FetchMovimentacoesParams
): Promise<MovimentacaoMensal[]> => {
  try {
    const queryParams: Record<string, string> = {
      ano: params.ano.toString(),
    };

    if (params.tipo) {
      queryParams.tipo = params.tipo;
    }

    if (params.condominioId) {
      queryParams.condominioId = params.condominioId;
    }

    const response = await api.get<MovimentacaoMensal[]>(
      "/condominio/balancete/movimentacoes/mensal",
      { params: queryParams }
    );

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar movimentações mensais:", error);
    throw error;
  }
};
