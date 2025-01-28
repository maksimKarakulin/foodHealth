import { useState, useEffect } from 'react';
import { searchFoods, getFeaturedFoods } from "../types/food"
import SearchBar from '../components/SearchBar';
import { FoodItem } from '../types/food';

function FoodSearchPage() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [featuredFoods, setFeaturedFoods] = useState<FoodItem[]>([]);

  useEffect(() => {
    const fetchFeaturedFoods = async () => {
      try {
        const fetchedFoods = await getFeaturedFoods();
        setFeaturedFoods(fetchedFoods);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false); 
      }
    };
    fetchFeaturedFoods();
  }, []);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await searchFoods(query);
      setFoods(results);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Food Search</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {isLoading && <div>Loading...</div>}
      <SearchBar
        onSearch={handleSearch}
        isLoading={isLoading}
        setFoods={setFoods}
        featuredFoods={featuredFoods}
      />
      <ul>
        {foods.map((food) => (
          <li key={food.id}>{food.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default FoodSearchPage;

