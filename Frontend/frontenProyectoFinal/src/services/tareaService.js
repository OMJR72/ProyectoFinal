import { api } from './apiService';

export const tareaService = {
  listar: () => api.get('/tareas'),

  obtener: (id) => api.get(`/tareas/${id}`),

  crear: (data) => api.post('/tareas', data),

  actualizar: (id, data) => api.put(`/tareas/${id}`, data),

  eliminar: (id) => api.del(`/tareas/${id}`),
};
