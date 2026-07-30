import { api } from './apiService';

export const loginUser = async (email, password) => {
  const data = await api.post('/auth/login', { email, password });

  if (data.token) {
    sessionStorage.setItem('token', data.token);
    sessionStorage.setItem(
      'user',
      JSON.stringify({
        id: data.id,
        email: data.email,
        nombre: data.nombre,
        apellido: data.apellido,
        rol: data.rol,
      })
    );
  }

  return data;
};

export const registerUser = async (nombre, apellido, email, password) => {
  return api.post('/auth/register/user', { nombre, apellido, email, password });
};
