import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loading } from "@/components/ui/loading";
import { RoutesConfig } from "@/config/routes.config";
const { rootPaths } = RoutesConfig;

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loading message="Verificando autenticación..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to={rootPaths?.auth.login.href} replace />;
  }

  return <>{children}</>;
};

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loading message="Verificando sesión..." />;
  }

  // Si está autenticado, redirige al dashboard
  if (isAuthenticated) {
    return <Navigate to={rootPaths?.menu.darhboard.href} replace />;
  }

  return <>{children}</>;
};
