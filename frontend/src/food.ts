export async function getFoodDetails(id: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/foods/${id}`);
    return response.json();
    
}
export interface FoodItem {
    id: string;
    name: string;
    description: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    imageUrl: string;
    category: string;
  }
