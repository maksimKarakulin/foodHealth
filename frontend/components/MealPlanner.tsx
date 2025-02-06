import React, { useState } from 'react';
import { FoodItem } from '../types/food';
import { Calendar } from 'src/components/ui/calendar'
import { Button } from 'src/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from 'src/components/ui/card'


interface Meal {
  id: string;
  name: string;
  foods: FoodItem[];
  time: string;
}

export default function MealPlanner() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const addMeal = (meal: Meal) => {
    setMeals([...meals, meal]);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Meal Planner</CardTitle>
        <CardDescription>Plan your meals for the day.</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
          />
        </div>

        <div className="grid gap-4">
          {meals.map((meal) => (
            <Card key={meal.id} className="border">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">{meal.name}</CardTitle>
                <CardDescription>{meal.time}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="mt-2">
                  {meal.foods.map((food) => (
                    <li key={food.id} className="flex justify-between items-center py-2">
                      <span>{food.name}</span>
                      <span className="text-sm text-muted-foreground">{food.nutrition?.calories} kcal</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" size="sm">Edit Meal</Button>
                <Button variant="destructive" size="sm">Delete Meal</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>
      <CardFooter>
         <Button>Add Meal</Button>
      </CardFooter>
    </Card>
  );
}
