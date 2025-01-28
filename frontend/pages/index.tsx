import React, { useState } from 'react';
import { GetStaticProps } from 'next';
import { FoodItem } from '../types/food';
import SearchBar from '../components/SearchBar';
import FoodCard from '../components/FoodCard';
import { useAuth } from '../contexts/AuthContext';
import { Alert, AlertDescription } from '../components/ui/Alert';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

interface HomeProps {
  featuredFoods: FoodItem[];
  error?: string;
}

export default function Home({ featuredFoods, error }: HomeProps) {
  const [foods, setFoods] = useState<FoodItem[]>(featuredFoods);
  const [searchError, setSearchError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState('foods');
  const { user } = useAuth();

  const handleSearch = async (query: string): Promise<void> => {
    setSearchError('');
    setIsLoading(true);
    try {
      const res = await fetch(`/api/foods/search?q=${encodeURIComponent(query.trim())}`);
      if (!res.ok) {
        if (res.status === 404) {
          setFoods([]);
          setSearchError("No foods found matching your search.");
        } else {
          throw new Error(`Search failed: ${res.status} ${res.statusText}`);
        }
      } else {
        const searchResults = await res.json();
        setFoods(searchResults);
      }
    } catch (err) {
      setSearchError('Failed to search foods. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), 
        url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f0f0f0' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}
    >
      <main className="container mx-auto px-4 py-8">
        <Card className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-xl mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 bg-gradient-to-r from-orange-600 to-yellow-500 bg-clip-text text-transparent">
            Healthy Food Guide
          </h1>
          
          <Tabs defaultValue="foods" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="foods">Foods</TabsTrigger>
              <TabsTrigger value="nutrients">Nutrients</TabsTrigger>
              <TabsTrigger value="meals">Meal Plans</TabsTrigger>
              <TabsTrigger value="recipes">Recipes</TabsTrigger>
            </TabsList>

            <TabsContent value="foods">
              <SearchBar
                onSearch={handleSearch}
                isLoading={isLoading}
                setFoods={setFoods}
                featuredFoods={featuredFoods}
              />
              
              {searchError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{searchError}</AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {user && (
                <section className="mb-8 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-6">
                  <h2 className="text-2xl font-semibold mb-4">
                    Welcome back, {user.name}!
                  </h2>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Here are some personalized recommendations based on your preferences.
                    </p>
                  </div>
                </section>
              )}

              {foods.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    No foods found. Try adjusting your search.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {foods.map((food) => (
                    <FoodCard key={food.id} food={food} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="nutrients">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Macronutrients</h3>
                  <ul className="space-y-2">
                    <li>Proteins</li>
                    <li>Carbohydrates</li>
                    <li>Fats</li>
                    <li>Fiber</li>
                  </ul>
                </Card>
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Micronutrients</h3>
                  <ul className="space-y-2">
                    <li>Vitamins</li>
                    <li>Minerals</li>
                    <li>Antioxidants</li>
                    <li>Phytonutrients</li>
                  </ul>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="meals">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Coming Soon!</h3>
                <p>Our meal planning feature is currently under development.</p>
              </Card>
            </TabsContent>

            <TabsContent value="recipes">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Coming Soon!</h3>
                <p>Our recipe collection is currently under development.</p>
              </Card>
            </TabsContent>
          </Tabs>
        </Card>
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const apiUrl = process.env.API_URL || '';
  if (!apiUrl) {
    console.error("API_URL environment variable not set!");
    return {
      props: {
        featuredFoods: [],
        error: 'Configuration error: API URL not set'
      }
    };
  }
  try {
    const res = await fetch(`${apiUrl}/api/foods/featured`);
    if (!res.ok) {
      throw new Error(`Failed to fetch featured foods: ${res.status} ${res.statusText}`);
    }
    const featuredFoods = await res.json();
    return {
      props: { featuredFoods },
      revalidate: 3600,
    };
  } catch (error) {
    console.error("Error fetching featured foods:", error);
    return {
      props: { featuredFoods: [], error: 'Failed to load featured foods.' },
    };
  }
};