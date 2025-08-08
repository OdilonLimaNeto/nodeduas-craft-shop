import { AuthenticatedUser } from "@/interfaces/authenticated-user";
import axiosInstance from "@/lib/api";
import { AxiosResponse } from "axios";

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<AxiosResponse<AuthenticatedUser>> {
  return await axiosInstance.post<AuthenticatedUser>("/auth", {
    email,
    password,
  });
}
