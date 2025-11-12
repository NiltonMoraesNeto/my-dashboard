import { isSuccessRequest } from "../utils/response-request";
import api from "./api";

export const fetchProfileList = async (page: number, totalItemsByPage: number, search: string) => {
  try {
    const response = await api.get("/profiles", {
      params: { page, totalItemsByPage, search },
    });

    if (response.data) {
      return response.data;
    }
    return false;
  } catch (error) {
    console.error("Erro", error);
    return false;
  }
};

export const fetchProfileById = async (id: number) => {
  try {
    const response = await api.get(`/profiles/${id}`);

    if (response.data) {
      return response.data;
    }
    return false;
  } catch (error) {
    console.error("Erro", error);
    return false;
  }
};

export const newProfile = async (descricao: string) => {
  try {
    const response = await api.post("/profiles", { descricao });

    if (response.data) {
      return response;
    }
    return false;
  } catch (error) {
    console.error("Erro ao adicionar o Perfil", error);
    return false;
  }
};

export const updateProfile = async (id: number, descricao: string) => {
  try {
    const response = await api.patch(`/profiles/${id}`, { descricao });

    if (isSuccessRequest(response.status)) {
      return response;
    }
    return false;
  } catch (error) {
    console.error("Erro ao atualizar o Perfil", error);
    return false;
  }
};

export const deleteProfile = async (id: number) => {
  try {
    const response = await api.delete(`/profiles/${id}`);

    if (isSuccessRequest(response.status)) {
      return response;
    }
    return false;
  } catch (error) {
    console.error("Erro ao deletar o Perfil", error);
    return false;
  }
};
