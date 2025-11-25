import api from './api';
import API_CONFIG from '../config/api.config';

const BASE_PATH = API_CONFIG.SERVICES.MONITORING;

export const monitoriaService = {
  async getAll() {
    const response = await api.get(`${BASE_PATH}/monitorias`);
    return response.data;
  },

  async getEmAndamento() {
    const response = await api.get(`${BASE_PATH}/monitorias/em-andamento`);
    return response.data;
  },

  async getByProfessor(professorId) {
    const response = await api.get(`${BASE_PATH}/monitorias/professor/${professorId}`);
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`${BASE_PATH}/monitorias/${id}`);
    return response.data;
  },

  async create(monitoriaData) {
    const response = await api.post(`${BASE_PATH}/monitorias`, monitoriaData);
    return response.data;
  },

  async update(id, monitoriaData) {
    const response = await api.put(`${BASE_PATH}/monitorias/${id}`, monitoriaData);
    return response.data;
  },

  async iniciar(id) {
    const response = await api.patch(`${BASE_PATH}/monitorias/${id}/iniciar`);
    return response.data;
  },

  async finalizar(id) {
    const response = await api.patch(`${BASE_PATH}/monitorias/${id}/finalizar`);
    return response.data;
  },

  async cancelar(id) {
    const response = await api.patch(`${BASE_PATH}/monitorias/${id}/cancelar`);
    return response.data;
  },

  async associarAluno(monitoriaId, alunoId) {
    const response = await api.post(`${BASE_PATH}/monitorias/associar-aluno`, {
      monitoriaId,
      alunoId,
    });
    return response.data;
  },

  async removerAluno(monitorId) {
    const response = await api.delete(`${BASE_PATH}/monitor/${monitorId}`);
    return response.data;
  },

  async getQuantidadeAlunos(id) {
    const response = await api.get(`${BASE_PATH}/monitorias/${id}/quantidade-alunos`);
    return response.data;
  },
};
