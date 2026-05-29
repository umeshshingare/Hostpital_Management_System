import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '';

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

export function getErrorMessage(error) {
  const data = error.response?.data;
  if (data?.errors) {
    return Object.values(data.errors).join(', ');
  }
  return data?.detail || error.message || 'Something went wrong';
}

export const dashboardApi = {
  stats: () => api.get('/api/dashboard/stats').then((r) => r.data),
};

export const patientsApi = {
  list: () => api.get('/api/patients').then((r) => r.data),
  create: (body) => api.post('/api/patients', body).then((r) => r.data),
};

export const doctorsApi = {
  list: () => api.get('/api/doctors').then((r) => r.data),
  create: (body) => api.post('/api/doctors', body).then((r) => r.data),
};

export const appointmentsApi = {
  list: () => api.get('/api/appointments').then((r) => r.data),
  create: (body) => api.post('/api/appointments', body).then((r) => r.data),
  remove: (id) => api.delete(`/api/appointments/${id}`),
};
