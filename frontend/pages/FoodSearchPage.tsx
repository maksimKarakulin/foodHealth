import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import { FoodItem } from '../types/food';

const sampleFoods: FoodItem[] = [
  {
    id: '1',
    name: 'Apple',
    description: 'A crisp and juicy fruit.',
    category: 'Fruit',
    imageUrl: '/images/apple.jpg', // Replace with actual image path
    nutrition: { calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 2.4 },
    servingSize: '1 medium',
    allergens: [],
    createdAt: '2024-07-26T12:00:00Z',
    updatedAt: '2024-07-26T12:00:00Z',
  },
  {
    id: '2',
    name: 'Banana',
    description: 'A sweet and yellow fruit.',
    category: 'Fruit',
    imageUrl: '/images/banana.jpg', // Replace with actual image path
    nutrition: { calories: 105, protein: 1.3, carbs: 27, fat: 0.3, fiber: 3.1 },
    servingSize: '1 medium',
    allergens: [],
    createdAt: '2024-07-26T12:00:00Z',
    updatedAt: '2024-07-26T12:00:00Z',
  },
  // Add more sample foods here...
];

export default function FoodSearchPage() {
  const [foods, setFoods] = useState<FoodItem[]>(sampleFoods); // Initialize with sample data
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    // Simulate API call (replace with your actual API call)
    // For demonstration we'll just filter the sample data
    const filteredFoods = sampleFoods.filter(food =>
      food.name.toLowerCase().includes(query.toLowerCase())
    );
    setFoods(filteredFoods);
    setIsLoading(false);
  };

  return (
    <div>
      <h1>Food Search</h1>
      <SearchBar
        onSearch={handleSearch}
        setFoods={setFoods}
        featuredFoods={sampleFoods.slice(0, 3)} // First 3 as featured
        isLoading={isLoading}
      />
      <ul>
        {foods.map(food => (
          <li key={food.id}>{food.name}</li>
        ))}
      </ul>
    </div>
  );
}
