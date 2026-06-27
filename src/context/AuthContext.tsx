import React, { createContext, useContext, useState } from 'react';
import type { User } from '../interfaces';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe utilizarse dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('powerfit_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = (username: string, password: string): boolean => {
    // Normalizar credenciales
    const normalizedUsername = username.trim().toLowerCase();
    
    if (normalizedUsername === 'admin' && password === 'admin123') {
      const adminUser: User = {
        username: 'Administrador',
        email: 'admin@powerfit.com',
        role: 'admin'
      };
      setUser(adminUser);
      localStorage.setItem('powerfit_session', JSON.stringify(adminUser));
      return true;
    } else if (normalizedUsername === 'cliente' && password === 'cliente123') {
      const clientUser: User = {
        username: 'Cliente Demo',
        email: 'cliente@powerfit.com',
        role: 'client'
      };
      setUser(clientUser);
      localStorage.setItem('powerfit_session', JSON.stringify(clientUser));
      return true;
    } else if (normalizedUsername.length >= 3 && password.length >= 4) {
      // Permitir registro/login rápido para cualquier otro usuario de prueba
      const customUser: User = {
        username: username.trim(),
        email: `${normalizedUsername}@powerfit.com`,
        role: 'client'
      };
      setUser(customUser);
      localStorage.setItem('powerfit_session', JSON.stringify(customUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('powerfit_session');
  };

  const isAuthenticated = user !== null;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
