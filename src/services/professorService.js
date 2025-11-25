import api from './api';
import API_CONFIG from '../config/api.config';

const BASE_PATH = API_CONFIG.SERVICES.ACADEMIC;

export const professorService = {
  async getAll() {
    const response = await api.get(`${BASE_PATH}/professores`);
    return response.data;
  },

  async getAtivos() {
    const response = await api.get(`${BASE_PATH}/professores/ativos`);
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`${BASE_PATH}/professores/${id}`);
    return response.data;
  },

  async create(professorData) {
    // Transforma os dados do formulário para o formato do backend
    const payload = {
      nome: professorData.nomeCompleto,
      cpf: professorData.numeroRegistro, // Usando numeroRegistro como CPF
      email: professorData.email,
      telefone: professorData.telefone || '', // Campo opcional
      formacao: professorData.formacao,
      titulacao: professorData.nomeCurso, // Usando nomeCurso como titulação
      escolaId: parseInt(professorData.escolaId),
    };

    console.log('Payload sendo enviado:', payload);
    const response = await api.post(`${BASE_PATH}/professores`, payload);
    return response.data;
  },

  async update(id, professorData) {
    const response = await api.put(`${BASE_PATH}/professores/${id}`, professorData);
    return response.data;
  },

  async inativar(id) {
    const response = await api.patch(`${BASE_PATH}/professores/${id}/inativar`);
    return response.data;
  },

  async ativar(id) {
    const response = await api.patch(`${BASE_PATH}/professores/${id}/ativar`);
    return response.data;
  },

  async deletar(id) {
    const response = await api.delete(`${BASE_PATH}/professores/${id}`);
    return response.data;
  },
};
