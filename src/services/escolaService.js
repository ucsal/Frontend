import api from './api';
import API_CONFIG from '../config/api.config';

const BASE_PATH = API_CONFIG.SERVICES.ACADEMIC;

export const escolaService = {
  async getAll() {
    const response = await api.get(`${BASE_PATH}/escolas`);
    return response.data;
  },

  async getAtivas() {
    // Se não existir endpoint específico, filtra as ativas do getAll
    const response = await api.get(`${BASE_PATH}/escolas`);
    return response.data.filter(escola => escola.isAtiva !== false);
  },

  async getById(id) {
    const response = await api.get(`${BASE_PATH}/escolas/${id}`);
    return response.data;
  },

  async create(escolaData) {
    const response = await api.post(`${BASE_PATH}/escolas`, escolaData);
    return response.data;
  },

  async update(id, escolaData) {
    const response = await api.put(`${BASE_PATH}/escolas/${id}`, escolaData);
    return response.data;
  },

  async inativar(id) {
    const response = await api.patch(`${BASE_PATH}/escolas/${id}/inativar`);
    return response.data;
  },

  async ativar(id) {
    const response = await api.patch(`${BASE_PATH}/escolas/${id}/ativar`);
    return response.data;
  },

  async deletar(id) {
    // Pode ser DELETE ou usar inativar como alternativa
    const response = await api.delete(`${BASE_PATH}/escolas/${id}`);
    return response.data;
  },
};
