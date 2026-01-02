import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { ApiError } from "@/types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("authToken");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    // Token inválido o expirado. Logout automático
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }

    // Sin permisos
    if (error.response?.status === 403) {
      console.error("Acceso denegado: No tienes permisos para esta acción");
    }

    return Promise.reject(error);
  }
);

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;

    if (axiosError.code === "ERR_NETWORK") {
      return "No se puede conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:3000";
    }

    if (axiosError.message.includes("CORS")) {
      return "Error de CORS. El backend debe permitir peticiones desde el frontend.";
    }

    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }

    switch (axiosError.response?.status) {
      case 400:
        return "Datos inválidos. Verifica la información enviada.";
      case 401:
        return "Credenciales incorrectas o usuario no es administrador.";
      case 403:
        return "No tienes permisos para realizar esta acción.";
      case 404:
        return "Recurso no encontrado.";
      case 409:
        return "Ya existe un registro con estos datos.";
      case 500:
        return "Error del servidor. Inténtalo más tarde.";
      default:
        return `Error inesperado (${
          axiosError.response?.status || "desconocido"
        })`;
    }
  }

  return "Error de conexión. Verifica tu red.";
};
