import { createContext, useState, useEffect } from 'react';
import { refreshToken } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ loading: true, isAuthenticated: false });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await refreshToken();
        setAuth({ loading: false, isAuthenticated: true });
      } catch {
        setAuth({ loading: false, isAuthenticated: false });
      }
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};