import { api } from './apiService';

export const usuarioService = {
  obtenerPerfil: () => api.get('/usuarios/perfil'),

  actualizarPerfil: (data) => api.put('/usuarios/perfil', data),
};