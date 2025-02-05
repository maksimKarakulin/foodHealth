import { useState, useEffect } from 'react';
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
        // Placeholder for fetching featured foods if needed on this page
        // const fetchedFoods = await getFeaturedFoods();
        // setFeaturedFoods(fetchedFoods);
        setIsLoading(false); // Set loading to false once "featured foods" are (not) loaded
      } catch (fetchError: any) {
        setError(fetchError.message);
        setIsLoading(false);
      }
    };
    fetchFeaturedFoods();
  }, []);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Placeholder for actual search function - replace with your search logic
      // const results = await searchFoods(query);
      // setFoods(results);
      setFoods([]); // For now, just set foods to empty array after "search"
    } catch (searchError: any) {
      setError(searchError.message);
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
        featuredFoods={featuredFoods} // featuredFoods might be empty or not relevant here
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
