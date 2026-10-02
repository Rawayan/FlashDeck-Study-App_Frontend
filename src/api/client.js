import axios from "axios";
import { refreshToken } from "./auth";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let pendingRequests = [];

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    if (response?.status === 401 && !config.__isRetry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingRequests.push({ resolve, reject });
        }).then((token) => {
          config.headers.Authorization = `Bearer ${token}`;
          return client(config);
        });
      }

      config.__isRetry = true;
      isRefreshing = true;

      const storedRefresh = localStorage.getItem("refresh_token");

      if (!storedRefresh) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        isRefreshing = false;
        pendingRequests = [];
        return Promise.reject(error);
      }

      try {
        const data = await refreshToken(storedRefresh);
        localStorage.setItem("access_token", data.access);

        config.headers.Authorization = `Bearer ${data.access}`;

        pendingRequests.forEach((promise) => promise.resolve(data.access));
        pendingRequests = [];

        return client(config);
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        pendingRequests = [];
        isRefreshing = false;
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default client;