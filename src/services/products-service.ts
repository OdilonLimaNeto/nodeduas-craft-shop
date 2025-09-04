import { Product } from "@/interfaces/product";
import axiosInstance from "@/lib/api";

export const getFeaturedProducts = async (): Promise<Product[]> => {
  const { data } = await axiosInstance.get<Product[]>("products/featured/");
  return data;
};
