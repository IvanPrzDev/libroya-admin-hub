/* eslint-disable react-refresh/only-export-components */ import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import * as authService from "@/services/authService";
import { LoginRequest } from "@/types";
import { getErrorMessage } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

// ============================================
// CONTEXT DE AUTENTICACIÓN
// ============================================

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================
// PROVIDER
// ============================================

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Verificar si hay token al cargar
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Login
  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      console.log("🔐 Intentando login...", credentials.email);
      await authService.login(credentials);
      setIsAuthenticated(true);

      toast({
        title: "¡Bienvenido!",
        description: "Has iniciado sesión correctamente.",
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("❌ Error en login:", error);
      const message = getErrorMessage(error);

      toast({
        title: "Error al iniciar sesión",
        description: message,
        variant: "destructive",
      });

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    navigate("/login");

    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// hook
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }

  return context;
};
