import api from './api';
import API_CONFIG from '../config/api.config';

const BASE_PATH = API_CONFIG.SERVICES.ACADEMIC;

export const disciplinaService = {
  async getAll() {
    const response = await api.get(`${BASE_PATH}/disciplinas`);
    return response.data;
  },

  async getAtivas() {
    const response = await api.get(`${BASE_PATH}/disciplinas/ativas`);
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`${BASE_PATH}/disciplinas/${id}`);
    return response.data;
  },

  async create(disciplinaData) {
    // Transforma os dados do formulário para o formato do backend
    const payload = {
      nome: disciplinaData.nome,
      codigo: disciplinaData.sigla, // Frontend usa "sigla" mas backend espera "codigo"
      cargaHoraria: parseInt(disciplinaData.cargaHoraria),
      ementa: disciplinaData.descricao, // Frontend usa "descricao" mas backend espera "ementa"
      escolaId: parseInt(disciplinaData.escolaId),
      professorId: parseInt(disciplinaData.professorId),
      curso: disciplinaData.curso,
      semestre: disciplinaData.matrizVinculada, // Frontend usa "matrizVinculada" mas backend espera "semestre"
    };

    console.log('Payload sendo enviado para disciplina:', payload);
    const response = await api.post(`${BASE_PATH}/disciplinas`, payload);
    return response.data;
  },

  async update(id, disciplinaData) {
    // Transforma os dados do formulário para o formato do backend
    const payload = {
      nome: disciplinaData.nome,
      codigo: disciplinaData.sigla,
      cargaHoraria: parseInt(disciplinaData.cargaHoraria),
      ementa: disciplinaData.descricao,
      escolaId: parseInt(disciplinaData.escolaId),
      professorId: parseInt(disciplinaData.professorId),
      curso: disciplinaData.curso,
      semestre: disciplinaData.matrizVinculada,
    };

    const response = await api.put(`${BASE_PATH}/disciplinas/${id}`, payload);
    return response.data;
  },

  async inativar(id) {
    const response = await api.patch(`${BASE_PATH}/disciplinas/${id}/inativar`);
    return response.data;
  },

  async ativar(id) {
    const response = await api.patch(`${BASE_PATH}/disciplinas/${id}/ativar`);
    return response.data;
  },

  async deletar(id) {
    const response = await api.delete(`${BASE_PATH}/disciplinas/${id}`);
    return response.data;
  },
};
