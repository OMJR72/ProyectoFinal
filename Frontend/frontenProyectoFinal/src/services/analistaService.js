import { api } from './apiService';

export const analistaService = {
  reportes: () => api.get('/analista/reportes'),
  usuarios: () => api.get('/analista/usuarios'),
  exportarTareas: () => {
    const token = sessionStorage.getItem('token');
    return fetch('http://localhost:8080/api/analista/exportar/tareas', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  exportarSesiones: () => {
    const token = sessionStorage.getItem('token');
    return fetch('http://localhost:8080/api/analista/exportar/sesiones', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
