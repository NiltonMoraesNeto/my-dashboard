import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000",
});

// Interceptador para incluir o token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptador para tratar respostas e erros de autenticação
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido - apenas remove o token se não for a rota de login
      if (!error.config?.url?.includes("/auth/login")) {
        localStorage.removeItem("auth_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
