'use client';

import { useState, useEffect } from 'react';
import { Recipe, RecipeIngredient } from '@/types/recipe';
import Image from 'next/image';
import { 
  IconClock, 
  IconUsers, 
  IconChefHat, 
  IconEye,
  IconArrowLeft,
  IconCheckbox,
  IconSquare
} from '@tabler/icons-react';
import Link from 'next/link';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface RecipeDetailClientProps {
  recipeId: string;
}

export function RecipeDetailClient({ recipeId }: RecipeDetailClientProps) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecipeData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch recipe details and ingredients in parallel
        const [recipeResponse, ingredientsResponse] = await Promise.all([
          fetch(`/api/recipes/${recipeId}`),
          fetch(`/api/recipes/${recipeId}/ingredients`)
        ]);

        if (!recipeResponse.ok) {
          throw new Error(`Failed to fetch recipe: ${recipeResponse.status}`);
        }

        const recipeData: ApiResponse<Recipe> = await recipeResponse.json();

        if (!recipeData.success || !recipeData.data) {
          throw new Error(recipeData.error || 'Recipe not found');
        }

        setRecipe(recipeData.data);        // Ingredients might not exist for all recipes
        if (ingredientsResponse.ok) {
          const ingredientsData: ApiResponse<RecipeIngredient[]> = await ingredientsResponse.json();
          if (ingredientsData.success && ingredientsData.data) {
            setIngredients(ingredientsData.data);
          }
        }

      } catch (err) {
        console.error('Error fetching recipe data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchRecipeData();
  }, [recipeId]);

  const toggleIngredient = (ingredientId: number) => {
    setCheckedIngredients(prev => {
      const newSet = new Set(prev);
      if (newSet.has(ingredientId)) {
        newSet.delete(ingredientId);
      } else {
        newSet.add(ingredientId);
      }
      return newSet;
    });
  };

  const getDifficultyText = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'Fácil';
      case 2: return 'Medio';
      case 3: return 'Difícil';
      default: return 'Desconocido';
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'text-green-600 bg-green-100';
      case 2: return 'text-yellow-600 bg-yellow-100';
      case 3: return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              Cargando receta...
            </h2>
          </div>
        </div>
      </div>
    );
  }
  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-red-600 mb-4">
              Error al cargar la receta
            </h2>
            <p className="text-gray-500 mb-4">
              {error || 'Receta no encontrada'}
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <IconArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors"
          >
            <IconArrowLeft className="w-4 h-4 mr-2" />
            Volver a recetas
          </Link>
        </div><div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Video and main content */}
          <div className="xl:col-span-2 space-y-6">            {/* Video player */}
            {recipe.videoUrl ? (
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src={recipe.videoUrl}
                  className="size-full border-0 absolute top-0 left-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  title={`Video de ${recipe.title}`}
                />
              </div>
            ) : (
              <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden shadow-lg flex items-center justify-center">
                <div className="text-center">
                  <IconEye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">Video no disponible</h3>
                  <p className="text-gray-500">Esta receta no tiene video asociado</p>
                </div>
              </div>
            )}{/* Recipe info */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                {recipe.title}
              </h1>
              
              <p className="text-gray-600 mb-6">
                {recipe.description}
              </p>              {/* Chef info */}
              <div className="flex items-center mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                  <Image
                    src={recipe.chef.avatar}
                    alt={recipe.chef.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center">
                    <h3 className="font-semibold text-gray-900">
                      {recipe.chef.name}
                    </h3>
                    {recipe.chef.verified && (
                      <IconChefHat className="w-4 h-4 ml-2 text-green-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500">Chef verificado</p>
                </div>
              </div>

              {/* Recipe stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <IconClock className="w-5 h-5 text-green-600 mx-auto mb-1" />
                  <p className="text-sm font-medium text-gray-900">{recipe.duration} min</p>
                  <p className="text-xs text-gray-500">Duración</p>
                </div>
                
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <IconUsers className="w-5 h-5 text-green-600 mx-auto mb-1" />
                  <p className="text-sm font-medium text-gray-900">{recipe.servings}</p>
                  <p className="text-xs text-gray-500">Porciones</p>
                </div>
                
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                    {getDifficultyText(recipe.difficulty)}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">Dificultad</p>
                </div>
                
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <IconEye className="w-5 h-5 text-green-600 mx-auto mb-1" />
                  <p className="text-sm font-medium text-gray-900">{recipe.viewCount.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Vistas</p>
                </div>
              </div>

              {/* Category and country */}
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <span className="mr-1">{recipe.dishType.icon}</span>
                  {recipe.dishType.name}
                </span>
                
                {recipe.country && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    <span className="mr-1">{recipe.country.flag}</span>
                    {recipe.country.name}
                  </span>
                )}
                
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {recipe.prepTimeRange.name}
                </span>
              </div>
            </div>
          </div>          {/* Ingredients sidebar */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 sticky top-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center">
                <IconChefHat className="w-5 h-5 mr-2 text-green-600" />
                Ingredientes
              </h2>              {ingredients.length > 0 ? (
                <div className="space-y-1">
                  {ingredients.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center px-2 py-1.5 rounded border transition-all cursor-pointer ${
                        checkedIngredients.has(item.id)
                          ? 'border-green-200 bg-green-50'
                          : 'border-gray-200 hover:border-green-200'
                      }`}
                      onClick={() => toggleIngredient(item.id)}
                    >
                      <div className="flex-shrink-0 mr-1.5">
                        {checkedIngredients.has(item.id) ? (
                          <IconCheckbox className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <IconSquare className="w-3.5 h-3.5 text-gray-400" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className={`text-xs font-medium ${
                          checkedIngredients.has(item.id) 
                            ? 'text-green-800 line-through' 
                            : 'text-gray-900'
                        }`}>
                          {item.quantity} {item.unit}
                        </div>
                        <div className={`text-xs ${
                          checkedIngredients.has(item.id) 
                            ? 'text-green-600' 
                            : 'text-gray-600'
                        }`}>
                          {item.ingredient.name}
                        </div>
                        {item.notes && (
                          <div className="text-xs text-gray-500">
                            {item.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}                  
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <div className="text-xs text-gray-600">
                      {checkedIngredients.size} de {ingredients.length} seleccionados
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                      <div 
                        className="bg-green-600 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${(checkedIngredients.size / ingredients.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <IconChefHat className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">
                    No hay ingredientes disponibles para esta receta
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
