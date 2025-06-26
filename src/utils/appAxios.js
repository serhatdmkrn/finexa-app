import axios from "axios";
import router from '../router';
import store from '../store';

export const appAxios = axios.create({
  baseURL: "https://premier-beetle-serhatdmkrn-5968f094.koyeb.app",
  headers: {
    "Content-Type": "application/json"
  }
});

appAxios.interceptors.request.use(
  config => {
    const token = store.getters._token;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

appAxios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      if (error.response.status === 429) {
        this.$toastr.error(`Too many requests. Please try again later`);
      }
    }

    return Promise.reject(error);
  }
);
