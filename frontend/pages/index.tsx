import React, { useState } from 'react';
import { GetStaticProps } from 'next';
import { FoodItem } from '../types/food';
import SearchBar from '../components/SearchBar';
import FoodCard from '../components/FoodCard';
import { useAuth } from '../contexts/AuthContext';
import { Alert, AlertDescription } from '../components/ui/Alert';

interface HomeProps {
  featuredFoods: FoodItem[];
  error?: string;
}

export default function Home({ featuredFoods, error }: HomeProps) {
  const [foods, setFoods] = useState<FoodItem[]>(featuredFoods);
  const [searchError, setSearchError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useAuth();

  const handleSearch = async (query: string): Promise<void> => {
    setSearchError('');
    setIsLoading(true);

    try {
      const res = await fetch(`/api/foods/search?q=${encodeURIComponent(query.trim())}`);
      
      if (!res.ok) {
        if (res.status === 404) { //Specific error handling for 404
          setFoods([]);
          setSearchError("No foods found matching your search.");
        } else {
          throw new Error(`Search failed: ${res.status} ${res.statusText}`);
        }
      } else {
      const searchResults = await res.json();
      setFoods(searchResults);
      }
    } catch (err) {
      setSearchError('Failed to search foods. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-100">
        Healthy Food Guide
      </h1>

      <SearchBar 
        onSearch={handleSearch}
        isLoading={isLoading}
        setFoods={setFoods}
        featuredFoods={featuredFoods}
      />

      {searchError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{searchError}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {user && (
        <section className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Welcome back, {user.name}!
          </h2>
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              Here are some personalized recommendations based on your preferences.
            </p>
          </div>
        </section>
      )}

      {foods.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">
            No foods found. Try adjusting your search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {foods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      )}
    </main>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const apiUrl = process.env.API_URL || ''; // Handle missing API_URL

  if (!apiUrl) {
    console.error("API_URL environment variable not set!");
    return {
      props: {
        featuredFoods: [],
        error: 'Configuration error: API URL not set'
      }
    };
  }

  try {
    const res = await fetch(`${apiUrl}/api/foods/featured`);
    if (!res.ok) {
      throw new Error(`Failed to fetch featured foods: ${res.status} ${res.statusText}`);
    }
    const featuredFoods = await res.json();
    return {
      props: { featuredFoods },
      revalidate: 3600,
    };
  } catch (error) {
    console.error("Error fetching featured foods:", error);
    return {
      props: { featuredFoods: [], error: 'Failed to load featured foods.' },
    };
  }
};
