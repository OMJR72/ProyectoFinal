import { api } from './apiService';

export const sesionService = {
  listar: () => api.get('/sesiones'),

  obtener: (id) => api.get(`/sesiones/${id}`),

  crear: (data) => api.post('/sesiones', data),

  actualizar: (id, data) => api.put(`/sesiones/${id}`, data),

  eliminar: (id) => api.del(`/sesiones/${id}`),
};
