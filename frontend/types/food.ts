interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  nutrition: Nutrition;
  servingSize: string;
  allergens: string[];
  createdAt: string;
  updatedAt: string;
}