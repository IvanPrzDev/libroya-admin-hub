import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

// ============================================
// PROTECTED ROUTE - Guard de Rutas Privadas
// ============================================

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Mientras verifica autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-libroya-green" />
      </div>
    );
  }

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, mostrar la ruta
  return <Outlet />;
};

export default ProtectedRoute;
