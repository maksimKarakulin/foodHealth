'use client';

import { useFoodDetails } from 'src/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card';
import { useParams } from 'next/navigation';
import { Alert, AlertDescription } from 'src/components/ui/Alert';
import Image from 'next/image';
import { Badge } from 'src/components/ui/badge';

const FoodDetailsPage = () => {
  const params = useParams();
  const { id } = params;
  const { data: food, error, isLoading } = useFoodDetails(id as string);

  if (isLoading) {
    return <div className="text-center p-8">Loading food details...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading food details: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!food) {
    return <div>Food not found</div>;
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">{food.name}</CardTitle>
        <Badge variant="secondary">{food.category}</Badge>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="aspect-video relative rounded-md overflow-hidden">
          <Image
            src={food.imageUrl || "/placeholder-food.png"}
            alt={food.name}
            fill
            onError={(e) => {
              e.currentTarget.src = "/placeholder-food.png";
            }}
            className="object-cover"
          />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Description</h3>
          <p className="text-muted-foreground">{food.description}</p>
        </div>
        {food.nutrition && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Nutrition Facts (per serving)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p>Calories: <Badge>{food.nutrition.calories} kcal</Badge></p>
                <p>Protein: <Badge>{food.nutrition.protein} g</Badge></p>
                <p>Carbs: <Badge>{food.nutrition.carbs} g</Badge></p>
              </div>
              <div>
                <p>Fat: <Badge>{food.nutrition.fat} g</Badge></p>
                <p>Fiber: <Badge>{food.nutrition.fiber} g</Badge></p>
              </div>
            </div>
          </div>
        )}
        {food.allergens && food.allergens.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Allergens</h3>
            <div className="flex flex-wrap gap-2">
              {food.allergens.map((allergen, index) => (
                <Badge key={index} variant="destructive">{allergen}</Badge>
              ))}
            </div>
          </div>
        )}
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>Created At: {new Date(food.createdAt).toLocaleDateString()}</p>
          <p>Updated At: {new Date(food.updatedAt).toLocaleDateString()}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FoodDetailsPage;
