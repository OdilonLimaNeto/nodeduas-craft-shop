import { useLoadingStore } from "@/store/loadingStore";
import axios from "axios";
import { getCookie, setCookie } from "cookies-next/client";
import { signOut } from "next-auth/react";
import { refresh as refreshTokens } from "@/services/auth-service";

const axiosInterceptorInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
const { setLoading } = useLoadingStore.getState();

axiosInterceptorInstance.interceptors.request.use(
  async (config) => {
    setLoading(true);

    const token = getCookie("jwt");

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
    setLoading(false);
    return response;
  },
  async (error) => {
    setLoading(false);

    const originalRequest = error.config as (typeof error)["config"] & {
      _retry?: boolean;
    };
    const status = error?.response?.status;

    if (status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      const refreshToken = getCookie("refresh_token");

      if (refreshToken) {
        const refreshResponse = await refreshTokens(String(refreshToken));
        const { access_token, refresh_token } = refreshResponse.data || {};

        if (access_token) {
          setCookie("jwt", access_token);
          if (refresh_token) {
            setCookie("refresh_token", refresh_token);
          }

          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return axiosInterceptorInstance(originalRequest);
        }
      }

      await signOut();
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }

    throw error?.response?.data?.message ?? error;
  }
);

export default axiosInterceptorInstance;
