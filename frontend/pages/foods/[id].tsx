import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getFoodDetails, FoodItem } from '../../types/food';

const FoodDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [food, setFood] = useState<FoodItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFood = async () => {
      if (typeof id === 'string' && typeof window !== 'undefined') {
        try {
          const fetchedFood = await getFoodDetails(id);
          setFood(fetchedFood ?? null); 
        } catch (error: any) {
          setError(error.message);
          setFood(null);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchFood();
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  if (!food) {
    return <div>Food not found</div>;
  }

  return (
    <div>
      <h1>{food.name}</h1>
      <p>Description: {food.description}</p>
      <p>Calories: {food.nutrition.calories}</p>
      <p>Protein: {food.nutrition.protein}</p>
      <p>Carbs: {food.nutrition.carbs}</p>
      <p>Fat: {food.nutrition.fat}</p>
      <p>Fiber: {food.nutrition.fiber}</p>
      <p>Serving Size: {food.servingSize}</p>
      <p>Allergens: {food.allergens.join(', ')}</p>
      <p>Created At: {food.createdAt}</p>
      <p>Updated At: {food.updatedAt}</p>

    </div>
  );
};

export default FoodDetailsPage;


