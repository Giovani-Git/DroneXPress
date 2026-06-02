const API = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://dronexpress.onrender.com/api' : '/api');

function getToken() {
  return localStorage.getItem('token');
}

function headers() {
  const h = { 'Content-Type': 'application/json' };
  const t = getToken();

  if (t) {
    h['Authorization'] = `Bearer ${t}`;
  }

  return h;
}

async function request(method, path, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: headers(),
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(
      `Erro inesperado do servidor (${res.status}): ${text.slice(0, 200)}`
    );
  }

  if (!res.ok) {
    throw new Error(data.error || 'Erro na requisição');
  }

  return data;
}

export const api = {
  login: (email, password) =>
    request('POST', '/auth/login', { email, password }),

  register: (name, email, password) =>
    request('POST', '/auth/register', { name, email, password }),

  getProfile: () =>
    request('GET', '/auth/profile'),

  updateProfile: (data) =>
    request('PUT', '/auth/profile', data),

  deleteProfile: () =>
    request('DELETE', '/auth/profile'),

  getDrones: () =>
    request('GET', '/drones'),

  getDrone: (id) =>
    request('GET', `/drones/${id}`),

  getAvailableDrones: (weight) =>
    request('GET', `/deliveries/available-drones?weight=${weight}`),

  simulateDelivery: (origin, destination, weight) =>
    request('POST', '/deliveries/simulate', {
      origin,
      destination,
      weight,
    }),

  createDelivery: (
    origin,
    destination,
    weight,
    drone_id,
    description,
    company
  ) =>
    request('POST', '/deliveries', {
      origin,
      destination,
      weight,
      drone_id,
      description,
      company,
    }),

  getDeliveries: () =>
    request('GET', '/deliveries'),

  getDelivery: (id) =>
    request('GET', `/deliveries/${id}`),

  updateDeliveryStatus: (id, status, progress) =>
    request('PATCH', `/deliveries/${id}`, {
      status,
      progress,
    }),

  getReports: () =>
    request('GET', '/reports'),

  createReport: (data) =>
    request('POST', '/reports', data),

  deleteReport: (id) =>
    request('DELETE', `/reports/${id}`),

  admin: {
    getUsers: () =>
      request('GET', '/admin/users'),

    updateUser: (id, data) =>
      request('PUT', `/admin/users/${id}`, data),

    deleteUser: (id) =>
      request('DELETE', `/admin/users/${id}`),

    getDrones: () =>
      request('GET', '/admin/drones'),

    updateDrone: (id, data) =>
      request('PUT', `/admin/drones/${id}`, data),

    getDeliveries: () =>
      request('GET', '/admin/deliveries'),

    updateDelivery: (id, data) =>
      request('PUT', `/admin/deliveries/${id}`, data),

    deleteDelivery: (id) =>
      request('DELETE', `/admin/deliveries/${id}`),

    getStats: () =>
      request('GET', '/admin/stats'),

    getReports: () =>
      request('GET', '/reports'),

    updateReport: (id, data) =>
      request('PUT', `/reports/${id}`, data),

    deleteReport: (id) =>
      request('DELETE', `/reports/${id}`),
  },
};