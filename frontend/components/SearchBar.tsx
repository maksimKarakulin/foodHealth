import React, { useState, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { FoodItem } from '../types/food'; // Import the correct FoodItem type


interface SearchBarProps {
  onSearch: (query: string) => Promise<void>;
  setFoods: React.Dispatch<React.SetStateAction<FoodItem[]>>; // More precise type
  featuredFoods: FoodItem[];
  isLoading: boolean;
}

export default function SearchBar({ onSearch, setFoods, featuredFoods, isLoading }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setFoods(featuredFoods);
        return;
      }

      try {
        const res = await fetch(`/api/foods/search?q=${encodeURIComponent(query)}`);
        if (!res.ok) {
          console.error(`Error fetching search results: ${res.status} ${res.statusText}`);
        setFoods([]);
          return;
      }
        const searchResults = await res.json();
        setFoods(searchResults);
      } catch (error) {
        console.error("Error during search:", error);
        setFoods([]);
      }
    }, 300),
    [setFoods, featuredFoods]
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto mb-8">
      {isLoading && <div>Loading...</div>}
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search foods..."
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
  }

