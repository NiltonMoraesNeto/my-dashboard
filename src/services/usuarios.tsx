import { isSuccessRequest } from "../utils/response-request";
import api from "./api";

export const fetchLogin = async (email: string, password: string) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error: unknown) {
    console.error("Erro no fetchLogin:", error);
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 401) {
        return { error: "Email ou senha inválidos" };
      }
    }
    return { error: "Erro interno do servidor" };
  }
};

export const resetPasswordSendToken = async (email: string) => {
  try {
    const response = await api.post("/users/forgot-password", { email });
    return response.data;
  } catch (error) {
    console.error("Erro no resetPasswordSendToken:", error);
    return false;
  }
};

export const resetPassword = async (
  email: string,
  resetCode: string,
  newPassword: string
) => {
  try {
    const response = await api.put("/users/reset-password", {
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
    const response = await api.put("/users/clean-resetCode", {
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
    const response = await api.get("/users", {
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
    const response = await api.delete(`/users/${id}`);

    if (isSuccessRequest(response.status)) {
      return response;
    }
    return false;
  } catch (error) {
    console.error("Erro ao deletar o Usuário", error);
    return false;
  }
};
