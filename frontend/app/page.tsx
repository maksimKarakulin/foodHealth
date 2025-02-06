'use client'

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'src/components/ui/card'
import { Alert, AlertDescription } from 'src/components/ui/Alert'
import SearchBar from 'src/components/SearchBar';
import FoodCard from 'src/components/FoodCard';
import { FoodItem } from 'src/types/food';
import { useAuth } from 'src/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/components/ui/tabs';
import { useFeaturedFoods, useSearchFoods } from 'src/lib/api';
import CreateFoodPage from 'src/components/CreateFoodPages';
import MealPlanner from 'src/components/MealPlanner';
import { Button } from 'src/components/ui/button';

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
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="foods">Foods</TabsTrigger>
              <TabsTrigger value="create">Create</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="foods">
              <div className="mb-4 flex justify-between items-center">
                <SearchBar
                  onSearch={handleSearch}
                  isLoading={isLoadingSearch}
                  setFoods={setFoods}
                  featuredFoods={featuredFoods || []}
                />
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

            <TabsContent value="create">
              <CreateFoodPage />
            </TabsContent>

            <TabsContent value="about">
              <Card className="p-6">
                <CardHeader>
                  <CardTitle>About</CardTitle>
                  <CardDescription>Learn about our app.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Welcome to the Food Health App! This application is designed to help you explore a wide variety of foods and understand their nutritional content and health benefits.</p>
                  <p><b>Key Features:</b></p>
                  <ul className="list-disc pl-5">
                    <li><b>Extensive Food Database:</b> Search and discover detailed information on thousands of food items.</li>
                    <li><b>Nutritional Information:</b> Get comprehensive nutritional facts, including calories, macronutrients, and micronutrients.</li>
                    <li><b>Create Food Items:</b> Add new food items to our database to expand our knowledge base.</li>
                    <li><b>Meal Planning Tools:</b> (Coming Soon) Plan your daily or weekly meals to meet your dietary goals.</li>
                  </ul>
                  <p>Our mission is to empower you to make informed food choices for a healthier lifestyle. Explore, learn, and enjoy the journey to better health with Food Health App!</p>
                  <MealPlanner />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="info">
              <Card className="p-6">
                <CardHeader>
                  <CardTitle>Info</CardTitle>
                  <CardDescription>Useful information about nutrition.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p><b>Understanding Nutrition:</b></p>
                  <p>Nutrition is the study of nutrients in food, how the body uses them, and the relationship between diet, health, and disease. Good nutrition is fundamental to health and well-being.</p>
                  <p><b>Key Nutritional Components:</b></p>
                  <ul className="list-disc pl-5">
                    <li><b>Macronutrients:</b> Carbohydrates, fats, and proteins are essential for energy and various bodily functions.</li>
                    <li><b>Micronutrients:</b> Vitamins and minerals are vital for development, disease prevention, and wellbeing.</li>
                    <li><b>Water:</b> Essential for hydration, nutrient transport, and body temperature regulation.</li>
                    <li><b>Fiber:</b> Important for digestive health, blood sugar control, and cholesterol management.</li>
                  </ul>
                  <p>For personalized dietary advice, always consult with a healthcare professional or a registered dietitian.</p>
                  <Button variant="secondary" onClick={() => window.open('https://www.who.int/news-room/fact-sheets/detail/healthy-diet', '_blank')}>
                    Learn More from WHO
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="signup">
              <Card className="p-6">
                <CardHeader>
                  <CardTitle>Sign Up</CardTitle>
                  <CardDescription>Sign up for our service.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p><b>Sign Up for Enhanced Features!</b></p>
                  <p>By signing up, you'll unlock additional features to personalize your experience and get even more out of the Food Health App:</p>
                  <ul className="list-disc pl-5">
                    <li><b>Personalized Recommendations:</b> Receive food suggestions tailored to your dietary preferences and health goals.</li>
                    <li><b>Meal Planning:</b> Utilize our advanced meal planner to create and save custom meal plans.</li>
                    <li><b>Favorite Foods:</b> Keep track of your favorite food items for quick access and meal planning.</li>
                    <li><b>Progress Tracking:</b> Monitor your nutritional intake and health progress over time.</li>
                  </ul>
                  <p>Stay tuned! Sign-up functionality is coming soon. Enter your email below to be notified when registration opens:</p>
                  <input type="email" placeholder="Your Email Address" className="mt-4 p-2 border rounded w-full max-w-sm" />
                  <Button variant="primary" className="mt-2">Notify Me</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
