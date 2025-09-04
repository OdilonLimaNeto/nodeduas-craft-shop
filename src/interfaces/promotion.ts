export interface Promotion {
  id: string;
  productId: string;
  title: string;
  description: string;
  discountPercentage: number;
  isHeroPromotion: boolean;
  isActive: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}
