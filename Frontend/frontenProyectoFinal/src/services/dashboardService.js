import { api } from './apiService';

export const dashboardService = {
  resumen: () => api.get('/dashboard/resumen'),
};