import { Product } from "@/interfaces/product";
import axiosInstance from "@/lib/api";

export const getFeaturedProducts = async (): Promise<Product[]> => {
  const { data } = await axiosInstance.get<Product[]>("admin/products/featured/");
  return data;
};
export const findAllProducts = async (): Promise<Product[]> => {
  const { data } = await axiosInstance.get<Product[]>("admin/products/");
  return data;
};