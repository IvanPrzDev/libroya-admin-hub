import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as authService from "@/services/authService";
import { LoginRequest } from "@/types";
import { getErrorMessage } from "@/utils/errorHandler";
import { useToast } from "@/hooks/use-toast";

/**
 * Custom hook con la lógica completa de autenticación
 * Contiene estados, efectos y métodos de login/logout
 */
export const useAuthProvider = () => {
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
      console.log("Intentando login...", credentials.email);
      await authService.login(credentials);
      setIsAuthenticated(true);

      toast({
        title: "¡Bienvenido!",
        description: "Has iniciado sesión correctamente.",
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Error en login:", error);
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

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
};
