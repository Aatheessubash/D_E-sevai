import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
export const SERVER_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

const http = axios.create({
  baseURL: API_BASE_URL,
});

http.interceptors.request.use((config) => {
  const auth = localStorage.getItem("esevai-auth");

  if (auth) {
    const parsed = JSON.parse(auth);

    if (parsed?.token) {
      config.headers.Authorization = `Bearer ${parsed.token}`;
    }
  }

  return config;
});

export default http;
