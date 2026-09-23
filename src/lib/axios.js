import axios from "axios";
import { clearSession, getToken } from "./token";

// The one shared Axios instance. Every service file imports this,
// so the token and the error handling live in exactly one place.
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://dummyjson.com",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor: attach the login token to every request.
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: turn every failure into one simple error shape
// { message, status, canceled } so the UI never has to dig through Axios internals.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject({ message: "Request canceled", status: null, canceled: true });
    }

    const status = error.response?.status ?? null;
    let message = error.response?.data?.message;

    if (!message) {
      if (error.code === "ECONNABORTED") message = "The server took too long to respond.";
      else if (!error.response) message = "Network error. Check your internet connection.";
      else message = "Something went wrong. Please try again.";
    }

    // Token expired or invalid on an authenticated call: log out.
    // The login request itself also returns 4xx, so it is skipped here.
    const isLoginCall = error.config?.url?.includes("/auth/login");
    if (status === 401 && !isLoginCall && typeof window !== "undefined") {
      clearSession();
      window.location.href = "/login?expired=1";
    }

    return Promise.reject({ message, status, canceled: false });
  }
);

export default api;
