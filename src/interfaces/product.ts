import { ProductImage } from "./product-image";
import { Promotion } from "./promotion";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  category: string;
  isActive: true;
  isFeatured: true;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
  promotions: Promotion[];
}
