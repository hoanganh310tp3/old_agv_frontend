import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true // Important for handling cookies/sessions
});

// Add request interceptor to include JWT token if available
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance; 