import axios from "axios";

// ================================
// Axios Instance
// ================================
const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ================================
// Token Helpers
// ================================
const getAccessToken = () => localStorage.getItem("access_token");
const removeAccessToken = () => localStorage.removeItem("access_token");

// ================================
// Request Interceptor
// ================================
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ================================
// Response Interceptor
// ================================ 
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeAccessToken();
      const isLoginRequest = error.config.url?.includes("/auth");

      if (!isLoginRequest) {
        window.location.href = "/auth";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
