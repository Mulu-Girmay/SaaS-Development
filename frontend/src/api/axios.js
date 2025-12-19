import axios from "axios";

const api = axios.create({
  baseURL:"http://localhost:5000/api"
})
api.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  if (auth?.accessToken) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`;
  }
  return config;
});
export default api;