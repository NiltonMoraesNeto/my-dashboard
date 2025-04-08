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
