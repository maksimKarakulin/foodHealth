export interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface FoodItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  name: string;
  description: string;
  category: string;
  imageUrl: string | null;
  nutrition?: Nutrition;
  servingSize?: string;
  allergens?: string[];
}
