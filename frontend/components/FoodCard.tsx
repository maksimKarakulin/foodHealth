import Image from 'next/image'
import { FoodItem } from '../types/food'

interface FoodCardProps {
  food: FoodItem;
}

export default function FoodCard({ food }: FoodCardProps) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-lg">
      <div className="relative h-48">
        <Image
          src={food.imageUrl}
          alt={food.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h2 className="text-xl font-semibold">{food.name}</h2>
        <p className="text-gray-600">{food.description}</p>
        <div className="mt-4">
          <h3 className="font-medium">Nutrition per serving</h3>
          <ul className="mt-2 space-y-1">
            <li>Calories: {food.nutrition.calories}kcal</li>
            <li>Protein: {food.nutrition.protein}g</li>
            <li>Carbs: {food.nutrition.carbs}g</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 