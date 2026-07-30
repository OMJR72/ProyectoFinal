import { api } from './apiService';

export const actividadService = {
  listar: () => api.get('/actividades'),

  obtener: (id) => api.get(`/actividades/${id}`),

  crear: (data) => api.post('/actividades', data),

  actualizar: (id, data) => api.put(`/actividades/${id}`, data),

  eliminar: (id) => api.del(`/actividades/${id}`),
};
