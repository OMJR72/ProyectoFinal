import { api } from './apiService';

export const usuarioService = {
  obtenerPerfil: () => api.get('/usuarios/perfil'),

  actualizarPerfil: (data) => api.put('/usuarios/perfil', data),

  cambiarPassword: (data) => api.post('/usuarios/cambiar-password', data),

  subirFoto: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.upload('/usuarios/subir-foto', formData);
  },
};