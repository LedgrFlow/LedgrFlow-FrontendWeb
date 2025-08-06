import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const useAuthRedirect = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // Si está autenticado y está en login, redirigir al dashboard
        if (window.location.pathname === '/login') {
          navigate('/', { replace: true });
        }
      } else {
        // Si no está autenticado y no está en login, redirigir al login
        if (window.location.pathname !== '/login') {
          navigate('/login', { replace: true });
        }
      }
    }
  }, [isAuthenticated, isLoading, navigate]);

  return { isAuthenticated, isLoading };
}; 