import { Product } from "@/interfaces/product";
import axiosInstance from "@/lib/api";

export const getFeaturedProducts = async (): Promise<Product[]> => {
  //adiciona loading de 10 segundos antes de retornar os dados
  await new Promise((resolve) => setTimeout(resolve, 10000));
  const { data } = await axiosInstance.get<Product[]>("products/featured/");
  return data;
};
