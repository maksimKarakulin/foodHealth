import React, { useState } from 'react';

export interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  nutrition: Nutrition;
  servingSize: string;
  allergens: string[];
  createdAt: string;
  updatedAt: string;
}
const [food, setFood] = useState<FoodItem | null>(null);

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/foods'; 

export async function getFoodDetails(id: string): Promise<FoodItem | undefined> {
  try {
    const response = await fetch(`${apiUrl}/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        return undefined; 
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching food details:", error);
    return undefined;
  }
}

export async function getAllFoods(): Promise<FoodItem[]> {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching all foods:", error);
    return []; // returns empty array on error
  }
}


export async function searchFoods(query: string): Promise<FoodItem[]> {
  try {
    const response = await fetch(`${apiUrl}?q=${query}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error searching foods:", error);
    return [];
  }
}

export async function createFood(food: Omit<FoodItem, 'id' | 'createdAt' | 'updatedAt'>):Promise<FoodItem | undefined> {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(food),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error("Error creating food:", error);
      return undefined;
    }
  }

export async function updateFood(food: FoodItem): Promise<FoodItem | undefined> {
  try {
    const response = await fetch(`${apiUrl}/${food.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(food),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error updating food:", error);
    return undefined;
  }
}

export async function deleteFood(id: string): Promise<void> {
  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error deleting food:", error);
  }
}

export async function getFeaturedFoods(): Promise<FoodItem[]> {
  try {
    const response = await fetch(`${apiUrl}/featured`); //need to figure this out. 
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching featured foods:", error);
    return []; // Returns an empty array on error
  }
}


