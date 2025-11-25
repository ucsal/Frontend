import api from './api';
import API_CONFIG from '../config/api.config';

export const authService = {
  async register(userData) {
    const response = await api.post(`${API_CONFIG.SERVICES.AUTH}/register`, userData);
    return response.data;
  },

  async login(username, password) {
    const response = await api.post(`${API_CONFIG.SERVICES.AUTH}/login`, {
      username,
      password,
    });

    const { accessToken, refreshToken, expiresIn } = response.data;

    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('tokenExpiresIn', expiresIn);

      // Buscar dados do usuário após login
      const user = await this.getCurrentUser();

      return { ...response.data, user };
    }

    return response.data;
  },

  async logout() {
    try {
      // Chama endpoint de logout no backend
      await api.post(`${API_CONFIG.SERVICES.AUTH}/logout`);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      // Limpa dados locais independente do resultado
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('tokenExpiresIn');
    }
  },

  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      throw new Error('Refresh token não encontrado');
    }

    const response = await api.post(`${API_CONFIG.SERVICES.AUTH}/refresh`, {
      refreshToken,
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data;

    localStorage.setItem('accessToken', accessToken);
    if (newRefreshToken) {
      localStorage.setItem('refreshToken', newRefreshToken);
    }

    return response.data;
  },

  async validate() {
    try {
      const response = await api.post(`${API_CONFIG.SERVICES.AUTH}/validate`);
      return response.data.valid;
    } catch (error) {
      return false;
    }
  },

  async getCurrentUser() {
    const userStr = localStorage.getItem('user');

    // Se já tem no localStorage, retorna
    if (userStr) {
      return JSON.parse(userStr);
    }

    // Se tem token mas não tem user, valida e busca dados
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const isValid = await this.validate();
        if (isValid) {
          // Aqui você pode fazer uma chamada para buscar dados do usuário
          // Por enquanto, vamos extrair do token (não é o ideal, mas funciona)
          const payload = JSON.parse(atob(token.split('.')[1]));
          const user = {
            username: payload.sub || payload.username,
            role: payload.role,
            email: payload.email,
          };
          localStorage.setItem('user', JSON.stringify(user));
          return user;
        }
      } catch (error) {
        console.error('Erro ao validar token:', error);
      }
    }

    return null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  },

  hasRole(role) {
    const userStr = localStorage.getItem('user');
    if (!userStr) return false;

    const user = JSON.parse(userStr);
    return user?.role === role;
  },

  isAdmin() {
    return this.hasRole('ADMIN') || this.hasRole('ROLE_ADMIN');
  },

  isProfessor() {
    return this.hasRole('PROFESSOR') || this.hasRole('ROLE_PROFESSOR');
  },

  isStudent() {
    return this.hasRole('STUDENT') || this.hasRole('ROLE_STUDENT');
  },
};
