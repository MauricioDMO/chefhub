'use client';

import { useState, useEffect } from 'react';
import { Recipe, DishType } from '@/types/recipe';
import { RecipeGrid } from './RecipeGrid';
import { authClient } from '@/lib/authClient';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    totalRecipes: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  filters?: {
    dishTypeId: number | null;
    prepTimeRangeId: number | null;
    countryId: number | null;
    difficulty: number | null;
    featured: boolean | null;
    search: string | null;
  };
}

interface FiltersResponse {
  dishTypes: DishType[];
  prepTimeRanges: Array<{
    id: number;
    name: string;
    minMinutes: number;
    maxMinutes: number | null;
  }>;
  countries: Array<{
    id: number;
    name: string;
    flag: string;
  }>;
}

export function RecipeGridWrapper() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [dishTypes, setDishTypes] = useState<DishType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  // Get user session
  useEffect(() => {
    const getSession = async () => {
      try {
        const session = await authClient.getSession();
        setUserId(session?.data?.user?.id || null);
      } catch (error) {
        console.error('Error getting session:', error);
      }
    };
    getSession();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);        // Fetch recipes and filters in parallel
        const [recipesResponse, filtersResponse] = await Promise.all([
          fetch(`/api/recipes?limit=20${userId ? `&userId=${userId}` : ''}`),
          fetch('/api/recipes/filters')
        ]);

        if (!recipesResponse.ok) {
          throw new Error(`Failed to fetch recipes: ${recipesResponse.status}`);
        }

        if (!filtersResponse.ok) {
          throw new Error(`Failed to fetch filters: ${filtersResponse.status}`);
        }        const recipesData: ApiResponse<Recipe[]> = await recipesResponse.json();
        const filtersData: ApiResponse<FiltersResponse> = await filtersResponse.json();

        console.log('Recipes API Response:', recipesData);
        console.log('Filters API Response:', filtersData);

        if (!recipesData.success || !recipesData.data) {
          throw new Error(recipesData.error || 'Failed to fetch recipes');
        }

        if (!filtersData.success || !filtersData.data) {
          throw new Error(filtersData.error || 'Failed to fetch filters');
        }

        console.log('Setting recipes:', recipesData.data);
        console.log('Setting dish types:', filtersData.data.dishTypes);

        setRecipes(recipesData.data);
        setDishTypes(filtersData.data.dishTypes);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    }    fetchData();
  }, [userId]); // Re-fetch when userId changes

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            Cargando recetas...
          </h2>
          <p className="text-gray-500">
            Obteniendo las mejores recetas para ti
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">
          Error al cargar las recetas
        </h2>
        <p className="text-gray-500 mb-4">
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  return <RecipeGrid recipes={recipes} dishTypes={dishTypes} />;
}
