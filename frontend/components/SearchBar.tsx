'use client'

import React, { useState, useCallback } from 'react'
import { Command } from 'cmdk'
import { SearchIcon, X } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { cn } from '@/lib/utils'
import { FoodItem } from '@/types/food'

interface SearchBarProps {
  onSearch: (query: string) => Promise<void>
  setFoods: React.Dispatch<React.SetStateAction<FoodItem[]>>
  featuredFoods: FoodItem[]
  isLoading: boolean
}

export default function SearchBar({ onSearch, setFoods, featuredFoods, isLoading }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [open, setOpen] = React.useState(false)
  const [searchResults, setSearchResults] = React.useState<FoodItem[]>([])
  const [is реальноLoading, setIsLoading] = React.useState(false);


  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchTerm(query);
    if (query.trim()) {
      setIsLoading(true);
      onSearch(query)
        .finally(() => setIsLoading(false));
    } else {
      setFoods(featuredFoods);
    }
  };


  const handleClearSearch = () => {
    setSearchTerm('')
    setFoods(featuredFoods)
  }

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search for food..."
          value={searchTerm}
          onChange={handleSearchInput}
          className="pl-10 shadow-sm"
        />
        <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        {searchTerm && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {isLoading && <div>Loading search results...</div>}
    </div>
  )
}
