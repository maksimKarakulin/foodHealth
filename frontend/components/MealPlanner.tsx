import React, { useState } from 'react';
import { FoodItem } from '../types/food';

interface Meal {
  id: string;
  name: string;
  foods: FoodItem[];
  time: string;
}

export default function MealPlanner() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const addMeal = (meal: Meal) => {
    setMeals([...meals, meal]);
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Meal Planner</h2>
        <input
          type="date"
          value={selectedDate.toISOString().split('T')[0]}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          className="px-4 py-2 border rounded"
        />
      </div>
      
      <div className="grid gap-4">
        {meals.map((meal) => (
          <div key={meal.id} className="p-4 border rounded-lg">
            <h3 className="text-xl font-semibold">{meal.name}</h3>
            <p className="text-gray-600">{meal.time}</p>
            <ul className="mt-2">
              {meal.foods.map((food) => (
                <li key={food.id} className="flex justify-between items-center py-2">
                  <span>{food.name}</span>
                  <span>{food.nutrition.calories} kcal</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
} 