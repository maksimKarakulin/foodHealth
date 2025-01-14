import React, { useState } from 'react';
import { GetStaticProps } from 'next';
import Image from 'next/image';
import SearchBar from '../components/SearchBar';
import FoodCard from '../components/FoodCard';
import { FoodItem } from '../types/food';
import { useAuth } from '../contexts/AuthContext';

interface HomeProps {
  featuredFoods: FoodItem[];
}

export default function Home({ featuredFoods }: HomeProps) {
  const [foods, setFoods] = useState(featuredFoods);
  const { user } = useAuth();

  const handleSearch = async (query: string) => {
    if (!query) {
      setFoods(featuredFoods);
      return;
    }
    
    const res = await fetch(`/api/foods/search?q=${encodeURIComponent(query)}`);
    const searchResults = await res.json();
    setFoods(searchResults);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Healthy Food Guide</h1>
      
      <SearchBar onSearch={handleSearch} />
      
      {user && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Welcome back, {user.displayName}!</h2>
          {/* Add personalized recommendations here */}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {foods.map((food) => (
          <FoodCard key={food.id} food={food} />
        ))}
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch(`${process.env.API_URL}/api/foods/featured`);
  const featuredFoods = await res.json();

  return {
    props: { featuredFoods },
    revalidate: 3600,
  };
} 