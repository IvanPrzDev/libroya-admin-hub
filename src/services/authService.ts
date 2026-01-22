import { api } from "@/config/axios";
import { LoginRequest, LoginResponse } from "@/types";
import { AUTH_ENDPOINTS } from "@/constants/endpoints";

export const login = async (
  credentials: LoginRequest,
): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>(
    AUTH_ENDPOINTS.LOGIN,
    credentials,
  );

  // Guardar token en localStorage
  if (data.accessToken) {
    localStorage.setItem("authToken", data.accessToken);
  }

  return data;
};

export const logout = (): void => {
  localStorage.removeItem("authToken");
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("authToken");
};

export const getToken = (): string | null => {
  return localStorage.getItem("authToken");
};
