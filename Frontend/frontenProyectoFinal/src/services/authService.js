const BASE_URL = 'http://localhost:8080/api/auth';

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(
      `${BASE_URL}/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || 'Credenciales inválidas'
      );
    }

    if (data.token) {
      sessionStorage.setItem(
        'token',
        data.token
      );

      sessionStorage.setItem(
        'user',
        JSON.stringify({
          email,
        })
      );
    }

    return data;

  } catch (error) {
    throw error;
  }
};

export const registerUser = async (
  nombre,
  apellido,
  email,
  password
) => {
  try {
    const response = await fetch(
      `${BASE_URL}/register/user`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          apellido,
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
        'Error al registrar el usuario'
      );
    }

    return data;

  } catch (error) {
    throw error;
  }
};