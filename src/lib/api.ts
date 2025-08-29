// Cliente Axios com interceptors para anexar token e tentar refresh automático
import { useLoadingStore } from "@/store/loadingStore";
import axios from "axios";
import { getCookie, setCookie } from "cookies-next/client";
import { signOut } from "next-auth/react";
import { refresh as refreshTokens } from "@/services/auth-service";

// Instância com baseURL da API
const axiosInterceptorInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
const { setLoading } = useLoadingStore.getState();

axiosInterceptorInstance.interceptors.request.use(
  async (config) => {
    // Indica carregamento global
    setLoading(true);

    // Recupera token de acesso salvo em cookie (lado cliente)
    const token = getCookie("jwt");

    // Anexa o Bearer token ao header
    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => {
    setLoading(false);
    throw error.response.data.message;
  }
);

axiosInterceptorInstance.interceptors.response.use(
  async (response) => {
    // Finaliza carregamento quando resposta é bem-sucedida
    setLoading(false);
    return response;
  },
  async (error) => {
    // Finaliza carregamento também em erros
    setLoading(false);

    // Guardamos a requisição original para possivelmente reexecutá-la
    const originalRequest = error.config as (typeof error)["config"] & {
      _retry?: boolean;
    };
    const status = error?.response?.status;

    // Se for 401 e ainda não tentamos, tentamos refresh usando o serviço centralizado
    if (status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      const refreshToken = getCookie("refresh_token");

      if (refreshToken) {
        const refreshResponse = await refreshTokens(String(refreshToken));
        const { access_token, refresh_token } = refreshResponse.data || {};

        if (access_token) {
          // Atualiza cookies e reexecuta a requisição original com o novo access token
          setCookie("jwt", access_token);
          if (refresh_token) {
            setCookie("refresh_token", refresh_token);
          }

          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return axiosInterceptorInstance(originalRequest);
        }
      }

      // Se não conseguimos renovar, fazemos sign out e redirecionamos
      await signOut();
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }

    // Propaga o erro original após tentar o refresh
    throw error?.response?.data?.message ?? error;
  }
);

export default axiosInterceptorInstance;
