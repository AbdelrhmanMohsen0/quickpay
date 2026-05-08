import axios from "axios";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  exp: number;
  role?: string;
};

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

      try {
        const { role } = jwtDecode<JwtPayload>(token);
        if (role) config.headers["X-User-Role"] = "admin";
      } catch {
        // malformed token — let the request go without the role header
      }
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
        window.location.href = "/admin/auth";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
