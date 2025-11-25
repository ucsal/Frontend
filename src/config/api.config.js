// Configuração dos microserviços
export const API_CONFIG = {
  // API Gateway - Ponto único de entrada
  GATEWAY_URL: 'http://localhost:8080',

  // Prefixos dos microserviços
  SERVICES: {
    AUTH: '/auth-service/api/auth',
    ACADEMIC: '/academic-service/api/admin',
    STUDENT: '/student-service/api/professor',
    MONITORING: '/monitoring-service/api/professor',
  },

  // Timeout padrão para requisições
  TIMEOUT: 30000,

  // Headers padrão
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

// Helper para construir URLs completas
export const buildUrl = (service, endpoint) => {
  return `${API_CONFIG.GATEWAY_URL}${service}${endpoint}`;
};

export default API_CONFIG;
