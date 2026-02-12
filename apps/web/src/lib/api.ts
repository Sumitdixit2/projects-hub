import axios from "axios";

const api = axios.create({

  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://localhost:4000/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await api.post('/token/refresh-token');
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
