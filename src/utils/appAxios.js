import axios from "axios";
import router from '../router';
import store from '../store';
import { toastr } from '@/utils/toastr';


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
  response => response,
  error => {
    if (error.response) {
      const status = error.response.status;

      if (status === 429) {
        toastr.error("Fazla istek atıldı. Lütfen tekrar deneyiniz.");
      } else if (status === 401) {
        store.commit('logoutUser')
        router.push({ path: '/' })
      } else {
        toastr.error(error.response?.data?.message || 'Bir hata oluştu!')        
      }
    }

    return Promise.reject(error);
  }
);
