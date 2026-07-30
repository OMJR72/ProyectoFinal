const BASE_URL = '/api';

function getToken() {
  return sessionStorage.getItem('token');
}

function authHeaders() {
  const token = getToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

async function request(method, path, body) {
  const url = `${BASE_URL}${path}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const text = await response.text().catch(() => null);
    let message;
    try { message = JSON.parse(text).message; } catch { message = text || `Error ${response.status}`; }
    throw new Error(message);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

async function uploadFile(path, formData) {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: authHeaders(),
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => null);
    let message;
    try { message = JSON.parse(text).error; } catch { message = text || `Error ${response.status}`; }
    throw new Error(message);
  }

  return response.json();
}

export const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
  del: (path) => request('DELETE', path),
  upload: (path, formData) => uploadFile(path, formData),
};
