import { useState, useEffect } from 'react';
import { isAuthenticated, logout } from '../services/authService';

export function useAuth() {
  const [isAuth, setIsAuth] = useState(isAuthenticated());

  const checkAuth = () => {
    setIsAuth(isAuthenticated());
  };

  useEffect(() => {
    // Verificar autenticación en cambios del localStorage
    window.addEventListener('storage', checkAuth);

    // También verificar periódicamente por si acaso
    const interval = setInterval(checkAuth, 1000);

    return () => {
      window.removeEventListener('storage', checkAuth);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsAuth(false);
  };

  const forceCheck = () => {
    checkAuth();
  };

  return {
    isAuthenticated: isAuth,
    logout: handleLogout,
    forceCheck
  };
}
