import axios from "axios";

const api = axios.create({
  baseURL: typeof window === "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1')
    : '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  },
});

api.interceptors.request.use(
  (config) => {
    if (config.url && config.url.startsWith("/")) {
      config.url = config.url.slice(1);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await api.post('/token/refreshAccessToken');
        console.log("post request has been sent!");
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
