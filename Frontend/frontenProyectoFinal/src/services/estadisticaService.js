import { api } from './apiService';

export const estadisticaService = {
  resumen: () => api.get('/estadisticas/resumen'),
};