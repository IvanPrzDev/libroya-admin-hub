import { api } from "./api";
import { LoginRequest, LoginResponse } from "@/types";

export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>("/auth/login", credentials);

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
