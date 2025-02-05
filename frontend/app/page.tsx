'use client'

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/Alert"
import SearchBar from '@/components/SearchBar';
import FoodCard from '@/components/FoodCard';
import { FoodItem } from '@/types/food';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFeaturedFoods, useSearchFoods } from '@/lib/api';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { data: featuredFoods, error: fetchError, isLoading: isFetching } = useFeaturedFoods();
  const [foods, setFoods] = React.useState<FoodItem[]>([]);
  const [searchError, setSearchError] = React.useState<string>('');
  const [isLoadingSearch, setIsLoadingSearch] = React.useState<boolean>(false);
  const { user } = useAuth();
  const [deleteFoodId, setDeleteFoodId] = React.useState<string | null>(null);
  const [isDeletingFood, setIsDeletingFood] = React.useState<boolean>(false);
  const [deleteFoodError, setDeleteFoodError] = React.useState<string | null>(null);


  const handleSearch = async (query: string): Promise<void> => {
    setSearchError('');
    setIsLoadingSearch(true);
    try {
      const searchResultsData = await useSearchFoods(query).data;
      if (searchResultsData) {
        setFoods(searchResultsData);
      } else {
        setFoods([]);
        setSearchError("No foods found matching your search.");
      }
    } catch (err: any) {
      setFoods([]);
      setSearchError(`Failed to search foods: ${err.message}`);
      console.error('Search error:', err);
    } finally {
      setIsLoadingSearch(false);
    }
  };

  const handleDeleteFoodCard = async (foodIdToDelete: string) => {
    setDeleteFoodId(foodIdToDelete);
    setIsDeletingFood(true);
    setDeleteFoodError(null);
    try {
      // No need to call deleteFoodAPI here, FoodCard handles deletion and refresh
      // Just handle UI state update if needed after successful delete in FoodCard itself
    } catch (error: any) {
      setDeleteFoodError(`Failed to delete food: ${error.message}`);
    } finally {
      setIsDeletingFood(false);
      setDeleteFoodId(null);
    }
  };

  const handleFoodListUpdated = () => {
    // Re-fetch featured foods to update the list after deletion
    // or ideally, use react-query's invalidation to refetch
  };


  return (
    <div>
      <Card className="bg-card text-card-foreground shadow-sm mb-8">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-bold">
            Healthy Food Guide
          </CardTitle>
          <CardDescription>
            Explore a wide variety of foods and their nutritional benefits.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Tabs defaultValue="foods" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="foods">Foods</TabsTrigger>
              <TabsTrigger value="nutrients">Nutrients</TabsTrigger>
              <TabsTrigger value="meals">Meal Plans</TabsTrigger>
              <TabsTrigger value="recipes">Recipes</TabsTrigger>
            </TabsList>
            <TabsContent value="foods">
              <div className="mb-4 flex justify-between items-center">
                <SearchBar
                  onSearch={handleSearch}
                  isLoading={isLoadingSearch}
                  setFoods={setFoods}
                  featuredFoods={featuredFoods || []}
                />
                 <Link href="/foods/create">
                    <Button variant="primary">
                      Create Food
                    </Button>
                  </Link>
              </div>


              {searchError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{searchError}</AlertDescription>
                </Alert>
              )}
              {fetchError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{fetchError.message}</AlertDescription>
                </Alert>
              )}
              {isFetching && !searchError && (
                <Alert variant="info" className="mb-4">
                  <AlertDescription>Loading featured foods...</AlertDescription>
                </Alert>
              )}
              {deleteFoodError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{deleteFoodError}</AlertDescription>
                </Alert>
              )}


              {user && (
                <section className="mb-8 p-4 rounded-md bg-muted">
                  <h2 className="text-lg font-semibold mb-2">
                    Welcome back, {user.name}!
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Personalized recommendations are on their way!
                  </p>
                </section>
              )}

              {foods.length === 0 && !searchError && !isFetching ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No featured foods loaded.
                  </p>
                </div>
              ) : foods.length === 0 && searchError ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No foods found. Try adjusting your search.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {foods.map((food) => (
                    <FoodCard
                      key={food.id}
                      food={food}
                      onDelete={() => handleDeleteFoodCard(food.id)}
                      onFoodListUpdated={handleFoodListUpdated}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="nutrients">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <CardHeader>
                    <CardTitle>Macronutrients</CardTitle>
                    <CardDescription>Essential nutrients for energy and body function.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5">
                      <li>Proteins</li>
                      <li>Carbohydrates</li>
                      <li>Fats</li>
                      <li>Fiber</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="p-6">
                  <CardHeader>
                    <CardTitle>Micronutrients</CardTitle>
                    <CardDescription>Vitamins and minerals for overall health.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5">
                      <li>Vitamins</li>
                      <li>Minerals</li>
                      <li>Antioxidants</li>
                      <li>Phytonutrients</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="meals">
              <Card className="p-6">
                <CardHeader>
                  <CardTitle>Meal Plans</CardTitle>
                  <CardDescription>Curated meal plans for your dietary needs.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Our meal planning feature is currently under development.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recipes">
              <Card className="p-6">
                <CardHeader>
                  <CardTitle>Recipes</CardTitle>
                  <CardDescription>Delicious and healthy recipes.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Our recipe collection is currently under development.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
