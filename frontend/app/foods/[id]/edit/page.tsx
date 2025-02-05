'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { fetchFoodDetails, updateFood } from '@/lib/api';
import { FoodItem as FoodItemType, Nutrition } from '@/types/food';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Loader2 } from "lucide-react"


interface FormData extends Omit<FoodItemType, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> {
  allergens: string[];
  nutrition: Nutrition;
  imageUrl?: string;
}

const EditFoodPage = () => {
  const params = useParams();
  const foodId = params.id as string;
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);


  useEffect(() => {
    const loadFoodDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const foodDetails = await fetchFoodDetails(foodId);
        setFormData({
          name: foodDetails.name,
          description: foodDetails.description,
          category: foodDetails.category,
          imageUrl: foodDetails.imageUrl || '',
          nutrition: foodDetails.nutrition || { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
          servingSize: foodDetails.servingSize || '',
          allergens: foodDetails.allergens || [],
        });
      } catch (fetchError: any) {
        setError(`Failed to load food details: ${fetchError.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    if (foodId) {
      loadFoodDetails();
    }
  }, [foodId]);

  if (isLoading) {
    return <div className="text-center p-8">Loading food details...</div>;
  }

  if (!formData) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Could not load food details. Please check the Food ID or try again.</AlertDescription>
      </Alert>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'allergens') {
      setFormData((prevData) => ({
        ...prevData!,
        allergens: value.split(',').map((s) => s.trim()),
      }));
    } else {
      setFormData((prevData) => ({ ...prevData!, [name]: value }));
    }
  };

  const handleNutritionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = parseFloat(value);
    setFormData((prevData) => ({
      ...prevData!,
      nutrition: { ...prevData!.nutrition, [name]: isNaN(parsedValue) ? 0 : parsedValue },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

     if (!formData.name.trim()) {
      setError("Food Name is required.");
      setIsSubmitting(false);
      return;
    }
    if (!formData.category.trim()) {
      setError("Category is required.");
      setIsSubmitting(false);
      return;
    }

     const nutritionValues = formData.nutrition;
    for (const key in nutritionValues) {
      if (isNaN(Number(nutritionValues[key]))) {
        setError(`Nutrition value for ${key} must be a valid number.`);
        setIsSubmitting(false);
        return;
      }
       if (Number(nutritionValues[key]) < 0) {
        setError(`Nutrition value for ${key} cannot be negative.`);
        setIsSubmitting(false);
        return;
      }
    }

    try {
      if (formData) {
        const updatedFood = await updateFood(foodId, { ...formData, id: foodId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), deletedAt: null } as FoodItemType);
        if (updatedFood) {
          setSuccessMessage(`${updatedFood.name} updated successfully!`);
          router.push(`/foods/${foodId}`);
        }
      }
    } catch (updateError: any) { // More specific error variable name
      setError(`Failed to update food item: ${updateError.message}`); // More informative error message
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Edit Food Item</CardTitle>
        <CardDescription>Modify the details of the food item.</CardDescription>
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
            <Input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Input type="text" id="category" name="category" value={formData.category} onChange={handleChange} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input type="text" id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="servingSize">Serving Size</Label>
            <Input type="text" id="servingSize" name="servingSize" value={formData.servingSize} onChange={handleChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="allergens">Allergens (comma-separated)</Label>
            <Input type="text" id="allergens" name="allergens" value={formData.allergens.join(', ')} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="calories">Calories</Label>
              <Input type="number" id="calories" name="calories" value={formData.nutrition.calories} onChange={handleNutritionChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="protein">Protein</Label>
              <Input type="number" id="protein" name="protein" value={formData.nutrition.protein} onChange={handleNutritionChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="carbs">Carbs</Label>
              <Input type="number" id="carbs" name="carbs" value={formData.nutrition.carbs} onChange={handleNutritionChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fat">Fat</Label>
              <Input type="number" id="fat" name="fat" value={formData.nutrition.fat} onChange={handleNutritionChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fiber">Fiber</Label>
              <Input type="number" id="fiber" name="fiber" value={formData.nutrition.fiber} onChange={handleNutritionChange} />
            </div>
          </div>
          <Button type="submit" disabled={isSubmitting}>
             {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isSubmitting ? 'Updating...' : 'Update Food'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditFoodPage;
```
