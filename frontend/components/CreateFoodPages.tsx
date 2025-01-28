import { useState } from 'react';
import { useRouter } from 'next/router';
import { createFood, FoodItem } from '../types/food'; // Import API functions
import { FoodItem as FoodItemType } from '../types/food'; //Import the type definition

// Corrected FormData interface
interface FormData extends Omit<FoodItemType, 'id' | 'createdAt' | 'updatedAt'> {
  allergens: string[]; // Correctly typed as an array of strings
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

const CreateFoodPage = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    category: '',
    imageUrl: '',
    nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
    servingSize: '',
    allergens: [], // Initialize as an empty array
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'allergens') {
      // Handle allergens as an array. Split by comma.
      setFormData((prevData) => ({
        ...prevData,
        allergens: value.split(',').map((s) => s.trim()),
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleNutritionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = parseFloat(value);
    setFormData((prevData) => ({
      ...prevData,
      nutrition: { ...prevData.nutrition, [name]: isNaN(parsedValue) ? 0 : parsedValue },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const newFood = await createFood(formData);
      if (newFood) {
        router.push(`/foods/${newFood.id}`);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" name="name" value={formData.name} onChange={handleChange} />
      </label>
      <label>
        Description:
        <textarea name="description" value={formData.description} onChange={handleChange} />
      </label>
      <label>
        Category:
        <input type="text" name="category" value={formData.category} onChange={handleChange} />
      </label>
      <label>
        Image URL:
        <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
      </label>
      <label>
        Serving Size:
        <input type="text" name="servingSize" value={formData.servingSize} onChange={handleChange} />
      </label>
      <label>
        Allergens (comma-separated):
        <input type="text" name="allergens" value={formData.allergens.join(', ')} onChange={handleChange} />
      </label>
      <label>
        Calories:
        <input type="number" name="calories" value={formData.nutrition.calories} onChange={handleNutritionChange} />
      </label>
      <label>
        Protein:
        <input type="number" name="protein" value={formData.nutrition.protein} onChange={handleNutritionChange} />
      </label>
      <label>
        Carbs:
        <input type="number" name="carbs" value={formData.nutrition.carbs} onChange={handleNutritionChange} />
      </label>
      <label>
        Fat:
        <input type="number" name="fat" value={formData.nutrition.fat} onChange={handleNutritionChange} />
      </label>
      <label>
        Fiber:
        <input type="number" name="fiber" value={formData.nutrition.fiber} onChange={handleNutritionChange} />
      </label>
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Food'}
      </button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
};

export default CreateFoodPage;
