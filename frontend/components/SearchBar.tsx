import React, { useState, useCallback } from 'react';
import debounce from 'lodash/debounce';

export default function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      onSearch(query);
    }, 300),
    []
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto mb-8">
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