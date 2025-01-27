import axios from "axios";
import { useNavigate } from "react-router-dom";

// Создаем экземпляр axios
const api = axios.create();

// Интерцептор ответа
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

export default api;