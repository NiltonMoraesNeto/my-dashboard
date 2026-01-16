import { isSuccessRequest } from "../utils/response-request";
import api from "./api";

interface CreateUnidadePayload {
  numero: string;
  bloco?: string;
  apartamento?: string;
  tipo?: string;
  status?: string;
  proprietario?: string;
  telefone?: string;
  email?: string;
  moradorId?: string;
}

interface UpdateUnidadePayload {
  numero?: string;
  bloco?: string;
  apartamento?: string;
  tipo?: string;
  status?: string;
  proprietario?: string;
  telefone?: string;
  email?: string;
  moradorId?: string;
}

export const createUnidade = async (payload: CreateUnidadePayload) => {
  try {
    const response = await api.post("/condominio/unidades", payload);
    return response;
  } catch (error) {
    console.error("Erro ao criar unidade:", error);
    throw error;
  }
};

export const fetchUnidadeById = async (id: string) => {
  try {
    const response = await api.get(`/condominio/unidades/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar unidade:", error);
    throw error;
  }
};

export const updateUnidade = async (id: string, payload: UpdateUnidadePayload) => {
  try {
    const response = await api.patch(`/condominio/unidades/${id}`, payload);
    return response;
  } catch (error) {
    console.error("Erro ao atualizar unidade:", error);
    throw error;
  }
};

export const fetchUnidadesList = async (
  page: number,
  totalItemsByPage: number,
  search: string,
  condominioId?: string
) => {
  try {
    const params: Record<string, string> = {
      page: page.toString(),
      totalItemsByPage: totalItemsByPage.toString(),
      search,
    };
    if (condominioId) {
      params.condominioId = condominioId;
    }

    const response = await api.get("/condominio/unidades", { params });

    if (response.data) {
      return response.data;
    }
    return false;
  } catch (error) {
    console.error("Erro ao buscar unidades:", error);
    return false;
  }
};

export const deleteUnidade = async (id: string) => {
  try {
    const response = await api.delete(`/condominio/unidades/${id}`);

    if (isSuccessRequest(response.status)) {
      return response;
    }
    return false;
  } catch (error) {
    console.error("Erro ao deletar a unidade", error);
    throw error;
  }
};

