import { isSuccessRequest } from "../utils/response-request";
import api from "./api";

interface CreateReuniaoPayload {
  titulo: string;
  data: string;
  hora: string;
  local?: string;
  tipo?: string;
  pauta?: string;
  status?: string;
}

interface UpdateReuniaoPayload {
  titulo?: string;
  data?: string;
  hora?: string;
  local?: string;
  tipo?: string;
  pauta?: string;
  status?: string;
}

export const createReuniao = async (payload: CreateReuniaoPayload) => {
  try {
    const response = await api.post("/condominio/reunioes", payload);
    return response;
  } catch (error) {
    console.error("Erro ao criar reunião:", error);
    throw error;
  }
};

export const fetchReuniaoById = async (id: string) => {
  try {
    const response = await api.get(`/condominio/reunioes/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar reunião:", error);
    throw error;
  }
};

export const updateReuniao = async (id: string, payload: UpdateReuniaoPayload) => {
  try {
    const response = await api.patch(`/condominio/reunioes/${id}`, payload);
    return response;
  } catch (error) {
    console.error("Erro ao atualizar reunião:", error);
    throw error;
  }
};

export const fetchReunioesList = async (page: number, totalItemsByPage: number) => {
  try {
    const response = await api.get("/condominio/reunioes", {
      params: { page, totalItemsByPage },
    });

    if (response.data) {
      return response.data;
    }
    return false;
  } catch (error) {
    console.error("Erro ao buscar reuniões:", error);
    return false;
  }
};

export const deleteReuniao = async (id: string) => {
  try {
    const response = await api.delete(`/condominio/reunioes/${id}`);

    if (isSuccessRequest(response.status)) {
      return response;
    }
    return false;
  } catch (error) {
    console.error("Erro ao deletar a reunião", error);
    throw error;
  }
};

