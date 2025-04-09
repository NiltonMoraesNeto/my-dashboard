import { isSuccessRequest } from "../utils/response-request";
import api from "./api";

export const fetchLogin = async (email: string, password: string) => {
  try {
    const response = await api.post("/usuarios/login", { email, password });
    return response.data;
  } catch (error) {
    console.error("Erro no fetchLogin:", error);
    return false;
  }
};

export const resetPasswordSendToken = async (email: string) => {
  try {
    const response = await api.post("/usuarios/forgot-password", { email });
    return response.data;
  } catch (error) {
    console.error("Erro no fetchLogin:", error);
    return false;
  }
};

export const resetPassword = async (
  email: string,
  resetCode: string,
  newPassword: string
) => {
  try {
    const response = await api.put("/usuarios/reset-password", {
      email,
      resetCode,
      newPassword,
    });
    return response;
  } catch (error) {
    console.error("Erro no resetPassword:", error);
    return error;
  }
};

export const resetCodeDelete = async (email: string, resetCode: string) => {
  try {
    const response = await api.put("/usuarios/clean-resetCode", {
      email,
      resetCode,
    });
    return response;
  } catch (error) {
    console.error("Erro no resetCode Delete:", error);
    return error;
  }
};

export const fetchUserList = async (
  page: number,
  totalItemsByPage: number,
  search: string
) => {
  try {
    const response = await api.get("usuarios/list", {
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

export const deleteUser = async (id: string) => {
  try {
    const response = await api.delete(`/usuarios/delete/${id}`);

    if (isSuccessRequest(response.status)) {
      return response;
    }
    return false;
  } catch (error) {
    console.error("Erro ao deletar o Usuário", error);
    return false;
  }
};
