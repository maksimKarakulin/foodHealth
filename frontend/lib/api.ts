import { useQuery } from '@tanstack/react-query';
import { FoodItem } from 'src/types/food';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const handleResponseError = async (res: Response): Promise<any> => {
  let errorMessage = `HTTP error!`;
  switch (res.status) {
    case 400:
      errorMessage += ` Bad Request. Please check your input.`;
      break;
    case 401:
      errorMessage += ` Unauthorized. Please log in.`;
      break;
    case 404:
      errorMessage += ` Not Found. The requested resource could not be found.`;
      break;
    case 500:
      errorMessage += ` Internal Server Error. Please try again later or contact support.`;
      break;
    default:
      errorMessage += ` An unexpected error occurred.`;
  }

  try {
    const errorData = await res.json();
    if (errorData && errorData.error) {
      errorMessage += ` Server message: ${errorData.error}`;
    } else if (res.statusText) {
      errorMessage += ` Status text: ${res.statusText}`;
    }
  } catch (jsonError) {
    errorMessage += ` Could not parse error details. Status text: ${res.statusText}`;
  }
  throw new Error(errorMessage);
};


export const fetchFoodDetails = async (id: string): Promise<FoodItem> => {
  const res = await fetch(`${API_URL}/foods/${id}`);
  if (!res.ok) {
    return handleResponseError(res);
  }
  return res.json();
};

export const useFoodDetails = (id: string) => {
  return useQuery({
    queryKey: ['food', id],
    queryFn: () => fetchFoodDetails(id),
    retry: 3,
    onError: (error) => {
      console.error("Failed to fetch food details:", error);
    },
  });
};

export const searchFoods = async (query: string): Promise<FoodItem[]> => {
  const res = await fetch(`${API_URL}/foods/search?q=${query}`);
  if (!res.ok) {
    return handleResponseError(res);
  }
  return res.json();
};

export const useSearchFoods = (query: string) => {
  return useQuery({
    queryKey: ['searchFoods', query],
    queryFn: () => searchFoods(query),
    enabled: !!query,
    retry: 2,
    onError: (error) => {
      console.error("Search query failed:", error);
    },
  });
};

export const fetchFeaturedFoods = async (): Promise<FoodItem[]> => {
  const res = await fetch(`${API_URL}/foods`);
  if (!res.ok) {
    return handleResponseError(res);
  }
  return res.json();
};

export const useFeaturedFoods = () => {
  return useQuery({
    queryKey: ['featuredFoods'],
    queryFn: fetchFeaturedFoods,
    initialData: [],
    retry: 3,
    onError: (error) => {
      console.error("Failed to fetch featured foods:", error);
    },
  });
};

export const createFood = async (foodData: Omit<FoodItem, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<FoodItem> => {
  const res = await fetch(`${API_URL}/foods`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(foodData),
  });
  if (!res.ok) {
    return handleResponseError(res);
  }
  return res.json();
};

export const updateFood = async (id: string, foodData: FoodItem): Promise<FoodItem> => {
  const res = await fetch(`${API_URL}/foods/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(foodData),
  });
  if (!res.ok) {
    return handleResponseError(res);
  }
  return res.json();
};

export const deleteFood = async (id: string): Promise<void> => {
  const res = await fetch(`${API_URL}/foods/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    return handleResponseError(res);
  }
};
