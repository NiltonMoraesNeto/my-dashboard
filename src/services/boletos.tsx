import { isSuccessRequest } from "../utils/response-request";
import api from "./api";

interface CreateBoletoPayload {
  unidadeId: string;
  mes: number;
  ano: number;
  valor: number;
  vencimento: string;
  codigoBarras?: string;
  nossoNumero?: string;
  status?: string;
  dataPagamento?: string;
  observacoes?: string;
}

interface UpdateBoletoPayload {
  unidadeId?: string;
  mes?: number;
  ano?: number;
  valor?: number;
  vencimento?: string;
  codigoBarras?: string;
  nossoNumero?: string;
  status?: string;
  dataPagamento?: string;
  observacoes?: string;
}

export const createBoleto = async (payload: CreateBoletoPayload) => {
  try {
    const response = await api.post("/condominio/boletos", payload);
    return response;
  } catch (error) {
    console.error("Erro ao criar boleto:", error);
    throw error;
  }
};

export const fetchBoletoById = async (id: string) => {
  try {
    const response = await api.get(`/condominio/boletos/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar boleto:", error);
    throw error;
  }
};

export const updateBoleto = async (id: string, payload: UpdateBoletoPayload) => {
  try {
    const response = await api.patch(`/condominio/boletos/${id}`, payload);
    return response;
  } catch (error) {
    console.error("Erro ao atualizar boleto:", error);
    throw error;
  }
};

export const fetchBoletosList = async (
  page: number,
  totalItemsByPage: number,
  mes?: number,
  ano?: number,
  unidadeId?: string
) => {
  try {
    const params: any = { page, totalItemsByPage };
    if (mes !== undefined) params.mes = mes;
    if (ano !== undefined) params.ano = ano;
    if (unidadeId) params.unidadeId = unidadeId;

    const response = await api.get("/condominio/boletos", { params });

    if (response.data) {
      return response.data;
    }
    return false;
  } catch (error) {
    console.error("Erro ao buscar boletos:", error);
    return false;
  }
};

export const deleteBoleto = async (id: string) => {
  try {
    const response = await api.delete(`/condominio/boletos/${id}`);

    if (isSuccessRequest(response.status)) {
      return response;
    }
    return false;
  } catch (error) {
    console.error("Erro ao deletar o boleto", error);
    throw error;
  }
};

