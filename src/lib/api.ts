import { useLoadingStore } from "@/store/loadingStore";
import axios from "axios";
import { getCookie } from "cookies-next/client";
import { signOut } from "next-auth/react";

const axiosInterceptorInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
const { setLoading } = useLoadingStore.getState();

axiosInterceptorInstance.interceptors.request.use(
  async (config) => {
    setLoading(true);

    const token = getCookie("jwt", { httpOnly: true });

    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => {
    setLoading(false);
    throw error.response.data.message;
  },
);

axiosInterceptorInstance.interceptors.response.use(
  async (response) => {
    setLoading(false);

    if (response.status === 401) {
      await signOut();

      window.location.href = "/";
    }

    return response;
  },
  (error) => {
    setLoading(false);
    throw error.response.data.message;
  },
);

export default axiosInterceptorInstance;
