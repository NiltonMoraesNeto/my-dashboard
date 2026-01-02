import { isSuccessRequest } from "../utils/response-request";
import api from "./api";

interface CreateMoradorPayload {
  nome: string;
  email: string;
  password?: string;
  cep?: string;
}

interface UpdateMoradorPayload {
  nome?: string;
  email?: string;
  password?: string;
  cep?: string;
}

export const createMorador = async (payload: CreateMoradorPayload) => {
  try {
    const response = await api.post("/condominio/moradores", payload);
    return response;
  } catch (error) {
    console.error("Erro ao criar morador:", error);
    throw error;
  }
};

export const fetchMoradorById = async (id: string) => {
  try {
    const response = await api.get(`/condominio/moradores/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar morador:", error);
    throw error;
  }
};

export const updateMorador = async (id: string, payload: UpdateMoradorPayload) => {
  try {
    const response = await api.patch(`/condominio/moradores/${id}`, payload);
    return response;
  } catch (error) {
    console.error("Erro ao atualizar morador:", error);
    throw error;
  }
};

export const fetchMoradoresList = async (page: number, totalItemsByPage: number, search: string) => {
  try {
    const response = await api.get("/condominio/moradores", {
      params: { page, totalItemsByPage, search },
    });

    if (response.data) {
      return response.data;
    }
    return false;
  } catch (error) {
    console.error("Erro ao buscar moradores:", error);
    return false;
  }
};

export const deleteMorador = async (id: string) => {
  try {
    const response = await api.delete(`/condominio/moradores/${id}`);

    if (isSuccessRequest(response.status)) {
      return response;
    }
    return false;
  } catch (error) {
    console.error("Erro ao deletar o morador", error);
    throw error;
  }
};

