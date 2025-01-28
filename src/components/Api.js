import axios from "axios";

// Создаем экземпляр axios
const api = axios.create(
  {baseURL: process.env.REACT_APP_BASE_URL}
);

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