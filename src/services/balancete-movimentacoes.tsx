import api from "./api";

export interface CreateBalanceteMovimentacaoData {
  tipo: "Entrada" | "Saída";
  data: string;
  valor: number;
  motivo: string;
}

export interface UpdateBalanceteMovimentacaoData {
  tipo?: "Entrada" | "Saída";
  data?: string;
  valor?: number;
  motivo?: string;
}

export interface BalanceteMovimentacaoResponse {
  data: Array<{
    id: string;
    tipo: string;
    data: string;
    valor: number;
    motivo: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
  }>;
  total: number;
  page: number;
  totalPages: number;
}

export const createBalanceteMovimentacao = async (
  data: CreateBalanceteMovimentacaoData
) => {
  try {
    const response = await api.post(
      "/condominio/balancete/movimentacoes",
      data
    );
    return response;
  } catch (error) {
    console.error("Erro ao criar movimentação:", error);
    throw error;
  }
};

export const fetchBalanceteMovimentacaoById = async (id: string) => {
  try {
    const response = await api.get(`/condominio/balancete/movimentacoes/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar movimentação:", error);
    throw error;
  }
};

export const updateBalanceteMovimentacao = async (
  id: string,
  data: UpdateBalanceteMovimentacaoData
) => {
  try {
    const response = await api.patch(
      `/condominio/balancete/movimentacoes/${id}`,
      data
    );
    return response;
  } catch (error) {
    console.error("Erro ao atualizar movimentação:", error);
    throw error;
  }
};

export const fetchBalanceteMovimentacoesList = async (
  page: number = 1,
  limit: number = 10,
  tipo?: string
) => {
  try {
    const params: {
      page: string;
      totalItemsByPage: string;
      tipo?: string;
    } = {
      page: page.toString(),
      totalItemsByPage: limit.toString(),
    };
    if (tipo) {
      params.tipo = tipo;
    }
    const response = await api.get<BalanceteMovimentacaoResponse>(
      "/condominio/balancete/movimentacoes",
      { params }
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar movimentações:", error);
    throw error;
  }
};

export const deleteBalanceteMovimentacao = async (id: string) => {
  try {
    const response = await api.delete(
      `/condominio/balancete/movimentacoes/${id}`
    );
    return response;
  } catch (error) {
    console.error("Erro ao deletar movimentação:", error);
    throw error;
  }
};
