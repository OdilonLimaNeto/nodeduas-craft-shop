import { AuthenticatedUser } from "@/interfaces/authenticated-user";
import axiosInstance from "@/lib/api";
import { AxiosResponse } from "axios";

export const login = async (
  email: string,
  password: string
): Promise<AxiosResponse<AuthenticatedUser>> => {
  return await axiosInstance.post<AuthenticatedUser>("/auth/login", {
    email,
    password,
  });
};

export const refresh = async (refresh_token: string): Promise<
  AxiosResponse<{
    access_token: string;
    refresh_token: string;
  }>
> => {
  return await axiosInstance.post<{
    access_token: string;
    refresh_token: string;
  }>("/auth/refresh", {
    refresh_token,
  });
};

export const logout = async (
  refresh_token: string
): Promise<AxiosResponse<{ message: string }>> => {
  return await axiosInstance.post<{ message: string }>("/auth/logout", {
    refresh_token,
  });
};

export const logoutAll = async (): Promise<AxiosResponse<void>> => {
  return await axiosInstance.post<void>("/auth/logout-all");
};

export const profile = async (): Promise<AxiosResponse<AuthenticatedUser>> => {
  return await axiosInstance.get<AuthenticatedUser>("/auth/profile");
};
