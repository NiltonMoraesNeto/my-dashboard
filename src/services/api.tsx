import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (import.meta.env.PROD && !apiBaseUrl) {
  throw new Error("VITE_API_BASE_URL must be configured in production");
}

const api = axios.create({
  baseURL: apiBaseUrl || "http://localhost:4000",
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: "csrf_token",
  xsrfHeaderName: "X-CSRF-Token",
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
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
