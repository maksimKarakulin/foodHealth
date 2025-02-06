import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createFood } from 'src/lib/api';
import { FoodItem as FoodItemType, Nutrition } from 'src/types/food';
import { Input } from 'src/components/ui/input'
import { Label } from 'src/components/ui/label'
import { Textarea } from 'src/components/ui/textarea'
import { Button } from 'src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'src/components/ui/card'
import { Alert, AlertDescription } from 'src/components/ui/Alert'
import { Loader2 } from 'lucide-react'

interface FormData extends Omit<FoodItemType, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> {
  allergens: string[];
  nutrition: Nutrition;
  imageUrl?: string;
}

const CreateFoodPage = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    category: '',
    imageUrl: '',
    nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
    servingSize: '',
    allergens: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
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
    setSuccessMessage(null);

    if (!formData.name.trim()) {
      setError("Food Name is required.");
      setIsLoading(false);
      return;
    } else if (formData.name.trim().length < 2) {
      setError("Food Name must be at least 2 characters long.");
      setIsLoading(false);
      return;
    }

    if (!formData.category.trim()) {
      setError("Category is required.");
      setIsLoading(false);
      return;
    }

    const nutritionValues = formData.nutrition;
    for (const key in nutritionValues) {
      if (isNaN(Number(nutritionValues[key]))) {
        setError(`Nutrition value for ${key} must be a valid number.`);
        setIsLoading(false);
        return;
      }
      if (Number(nutritionValues[key]) < 0) {
        setError(`Nutrition value for ${key} cannot be negative.`);
        setIsLoading(false);
        return;
      }
    }


    try {
      const newFood = await createFood(formData);
      if (newFood) {
        setSuccessMessage(`${newFood.name} created successfully!`);
        setFormData({
          name: '',
          description: '',
          category: '',
          imageUrl: '',
          nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
          servingSize: '',
          allergens: [],
        });
         router.push(`/foods/${newFood.id}`);
      }
    } catch (apiError: any) {
      setError(apiError instanceof Error ? apiError.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create New Food Item</CardTitle>
        <CardDescription>Fill in the details below to add a new food to the database.</CardDescription>
      </CardHeader>
      <CardContent>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {successMessage && (
        <Alert variant="success" className="mb-4">
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., Apple"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g., A crisp and juicy red apple"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              placeholder="e.g., Fruits"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              type="text"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="e.g., http://example.com/apple.jpg"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="servingSize">Serving Size</Label>
            <Input
              type="text"
              id="servingSize"
              name="servingSize"
              value={formData.servingSize}
              onChange={handleChange}
              placeholder="e.g., 1 medium apple"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="allergens">Allergens (comma-separated)</Label>
            <Input
              type="text"
              id="allergens"
              name="allergens"
              value={formData.allergens.join(', ')}
              onChange={handleChange}
              placeholder="e.g., Gluten, Nuts"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="calories">Calories</Label>
              <Input
                type="number"
                id="calories"
                name="calories"
                value={formData.nutrition.calories}
                onChange={handleNutritionChange}
                placeholder="Calories"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="protein">Protein (g)</Label>
              <Input
                type="number"
                id="protein"
                name="protein"
                value={formData.nutrition.protein}
                onChange={handleNutritionChange}
                placeholder="Protein"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="carbs">Carbs (g)</Label>
              <Input
                type="number"
                id="carbs"
                name="carbs"
                value={formData.nutrition.carbs}
                onChange={handleNutritionChange}
                placeholder="Carbs"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fat">Fat (g)</Label>
              <Input
                type="number"
                id="fat"
                name="fat"
                value={formData.nutrition.fat}
                onChange={handleNutritionChange}
                placeholder="Fat"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fiber">Fiber (g)</Label>
              <Input
                type="number"
                id="fiber"
                name="fiber"
                value={formData.nutrition.fiber}
                onChange={handleNutritionChange}
                placeholder="Fiber"
              />
            </div>
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isLoading ? 'Creating...' : 'Create Food'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateFoodPage;
