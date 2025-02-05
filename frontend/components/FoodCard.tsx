import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FoodItem } from '../types/food'
import { Button } from "@/components/ui/button"
import { deleteFood as deleteFoodAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Loader2 } from "lucide-react"

interface FoodCardProps {
  food: FoodItem;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export default function FoodCard({ food, onDelete, onEdit }: FoodCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${food.name}? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteFoodAPI(food.id);
      if (onDelete) {
        onDelete(food.id);
      } else {
        router.refresh();
      }
    } catch (deleteError: any) {
      setDeleteError(`Failed to delete food item: ${deleteError.message}`);
    } finally {
      setIsDeleting(false);
    }
  };


  const handleEdit = () => {
    router.push(`/foods/${food.id}/edit`);
  };


  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <CardTitle>{food.name}</CardTitle>
        <CardDescription>{food.category}</CardDescription>
      </CardHeader>
      <CardContent className="aspect-video relative">
        <Image
          src={food.imageUrl || "/placeholder-food.png"}
          alt={food.name}
          fill
          onError={(e) => {
            e.currentTarget.src = "/placeholder-food.png";
          }}
          className="object-cover rounded-md"
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link href={`/foods/${food.id}`} className="text-sm text-primary hover:underline">
          View Details
        </Link>
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm" onClick={handleEdit} disabled={isDeleting}>
             {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </CardFooter>
      {deleteError && (
        <Alert variant="destructive" className="mt-2">
          <AlertDescription>{deleteError}</AlertDescription>
        </Alert>
      )}
    </Card>
  );
}
