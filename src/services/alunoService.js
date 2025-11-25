import api from './api';
import API_CONFIG from '../config/api.config';

const BASE_PATH = API_CONFIG.SERVICES.STUDENT;

export const alunoService = {
  async getAll() {
    const response = await api.get(`${BASE_PATH}/alunos`);
    return response.data;
  },

  async getAtivos() {
    const response = await api.get(`${BASE_PATH}/alunos/ativos`);
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`${BASE_PATH}/alunos/${id}`);
    return response.data;
  },

  async create(alunoData) {
    const response = await api.post(`${BASE_PATH}/alunos`, alunoData);
    return response.data;
  },

  async update(id, alunoData) {
    const response = await api.put(`${BASE_PATH}/alunos/${id}`, alunoData);
    return response.data;
  },

  async inativar(id) {
    const response = await api.patch(`${BASE_PATH}/alunos/${id}/inativar`);
    return response.data;
  },

  async ativar(id) {
    const response = await api.patch(`${BASE_PATH}/alunos/${id}/ativar`);
    return response.data;
  },

  async deletar(id) {
    const response = await api.delete(`${BASE_PATH}/alunos/${id}`);
    return response.data;
  },
};
