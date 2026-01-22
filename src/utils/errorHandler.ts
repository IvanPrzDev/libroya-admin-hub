import axios, { AxiosError } from "axios";
import { ApiError } from "@/types";
import { ERROR_MESSAGES, HTTP_STATUS_MESSAGES } from "@/constants/errors";

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;

    // Error de red
    if (axiosError.code === "ERR_NETWORK") {
      return ERROR_MESSAGES.NETWORK;
    }

    // Error de CORS
    if (axiosError.message.includes("CORS")) {
      return ERROR_MESSAGES.CORS;
    }

    // Mensaje del backend (prioritario)
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }

    // Mensaje por código de estado HTTP
    const status = axiosError.response?.status;
    if (status && HTTP_STATUS_MESSAGES[status]) {
      return HTTP_STATUS_MESSAGES[status];
    }

    // Error desconocido con código de estado
    return `${ERROR_MESSAGES.UNKNOWN} (${status || "desconocido"})`;
  }

  // Error genérico de conexión
  return ERROR_MESSAGES.CONNECTION;
};
