import { ReactNode } from "react";
import { LoginRequest } from "./api";

/**
 * Tipo del contexto de autenticación
 */
export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
}

/**
 * Props del AuthProvider
 */
export interface AuthProviderProps {
  children: ReactNode;
}
