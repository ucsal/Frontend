import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (username, password) => {
    const data = await authService.login(username, password);

    // O user já vem no data.user após o login
    if (data.user) {
      setUser(data.user);
    }

    return data;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const isAdmin = () => {
    return user?.role === 'ADMIN' || user?.role === 'ROLE_ADMIN';
  };

  const isProfessor = () => {
    return user?.role === 'PROFESSOR' || user?.role === 'ROLE_PROFESSOR';
  };

  const isStudent = () => {
    return user?.role === 'STUDENT' || user?.role === 'ROLE_STUDENT';
  };

  const value = {
    user,
    login,
    logout,
    isAdmin,
    isProfessor,
    isStudent,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
