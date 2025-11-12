import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000",
  withCredentials: true, // Envia cookies automaticamente
});

// Interceptador para tratar respostas e erros de autenticação
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido - redireciona para login
      if (
        !error.config?.url?.includes("/auth/login") &&
        !error.config?.url?.includes("/auth/check")
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
