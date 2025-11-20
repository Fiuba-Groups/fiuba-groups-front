import { useState, useEffect } from 'react';
import { isAuthenticated, logout } from '../services/authService';

export function useAuth() {
  const [isAuth, setIsAuth] = useState(isAuthenticated());

  useEffect(() => {
    // Verificar autenticación en cambios del localStorage
    const checkAuth = () => {
      setIsAuth(isAuthenticated());
    };

    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    logout();
    setIsAuth(false);
  };

  return {
    isAuthenticated: isAuth,
    logout: handleLogout
  };
}
