import { isSuccessRequest } from "../utils/response-request";
import api from "./api";

interface CreateAvisoPayload {
  titulo: string;
  descricao: string;
  tipo?: string;
  dataInicio: string;
  dataFim?: string;
  destaque?: boolean;
}

interface UpdateAvisoPayload {
  titulo?: string;
  descricao?: string;
  tipo?: string;
  dataInicio?: string;
  dataFim?: string;
  destaque?: boolean;
}

export const createAviso = async (payload: CreateAvisoPayload) => {
  try {
    const response = await api.post("/condominio/avisos", payload);
    return response;
  } catch (error) {
    console.error("Erro ao criar aviso:", error);
    throw error;
  }
};

export const fetchAvisoById = async (id: string) => {
  try {
    const response = await api.get(`/condominio/avisos/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar aviso:", error);
    throw error;
  }
};

export const updateAviso = async (id: string, payload: UpdateAvisoPayload) => {
  try {
    const response = await api.patch(`/condominio/avisos/${id}`, payload);
    return response;
  } catch (error) {
    console.error("Erro ao atualizar aviso:", error);
    throw error;
  }
};

export const fetchAvisosList = async (
  page: number,
  totalItemsByPage: number,
  condominioId?: string
) => {
  try {
    const params: Record<string, string> = {
      page: page.toString(),
      totalItemsByPage: totalItemsByPage.toString(),
    };
    if (condominioId) {
      params.condominioId = condominioId;
    }

    const response = await api.get("/condominio/avisos", { params });

    if (response.data) {
      return response.data;
    }
    return false;
  } catch (error) {
    console.error("Erro ao buscar avisos:", error);
    return false;
  }
};

export const deleteAviso = async (id: string) => {
  try {
    const response = await api.delete(`/condominio/avisos/${id}`);

    if (isSuccessRequest(response.status)) {
      return response;
    }
    return false;
  } catch (error) {
    console.error("Erro ao deletar o aviso", error);
    throw error;
  }
};

export const countAvisosNaoLidos = async () => {
  try {
    const response = await api.get("/condominio/avisos/nao-lidos/count");
    return response.data.count || 0;
  } catch (error) {
    console.error("Erro ao contar avisos não lidos:", error);
    return 0;
  }
};

export const marcarAvisoComoLido = async (id: string) => {
  try {
    const response = await api.post(`/condominio/avisos/${id}/marcar-lido`);
    return response.data;
  } catch (error) {
    console.error("Erro ao marcar aviso como lido:", error);
    throw error;
  }
};

