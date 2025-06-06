'use client';

import { useEffect, useState } from 'react';
import { Recipe, DishType } from '@/types/recipe';
import { RecipeCard } from './RecipeCard';
import { IconSearch } from '@tabler/icons-react';
import { authClient } from '@/lib/authClient';

interface RecipeGridProps {
  recipes: Recipe[];
  dishTypes: DishType[];
}

export function RecipeGrid({ recipes, dishTypes }: RecipeGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [session, setSession] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const sessionData = await authClient.getSession();
        setSession(sessionData)
      } catch (error) {
        console.error('Error fetching session:', error);
      }
    };

    fetchSession();
  }, [])

  // Validar que tenemos datos
  if (!recipes || recipes.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-600 mb-2">
          No hay recetas disponibles
        </h2>
        <p className="text-gray-500">
          No se encontraron recetas para mostrar.
        </p>
      </div>
    );
  }  // Filtrar recetas
  const filteredRecipes = recipes.filter(recipe => {
    const matchesCategory = selectedCategory === null || 
      (recipe.dishType && recipe.dishType.id === selectedCategory);
    const matchesSearch = searchQuery === '' || 
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.chef.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });
  const handleRecipeClick = (recipe: Recipe) => {
    // Navigate to recipe detail page
    window.location.href = `/recipes/${recipe.id}`;
  };

  return (
    <div className="space-y-6">
      {/* Header con búsqueda */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            Descubre Recetas Increíbles
          </h1>
          <div className="text-sm text-gray-500">
            {filteredRecipes.length} {filteredRecipes.length === 1 ? 'receta' : 'recetas'}
          </div>
        </div>
        
        {/* Barra de búsqueda */}        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <IconSearch className="h-5 w-5 text-gray-400" />
          </div><input
            type="text"
            placeholder="Buscar recetas, chefs o ingredientes..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filtros de categorías */}
      <div className="flex gap-2 overflow-x-auto pb-2">        <button
          onClick={() => setSelectedCategory(null)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === null
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Todas
        </button>
        {dishTypes.map((dishType) => (
          <button
            key={dishType.id}
            onClick={() => setSelectedCategory(dishType.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
              selectedCategory === dishType.id
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>{dishType.icon}</span>
            {dishType.name}
          </button>
        ))}
      </div>

      {/* Grid de recetas */}
      {filteredRecipes.length > 0 ? (        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onClick={() => handleRecipeClick(recipe)}
              showFavoriteButton={ session !== null }
              isFavorite={recipe.isFavorite}
            />
          ))}
        </div>
      ) : (        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
            <IconSearch className="w-full h-full" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron recetas</h3>
          <p className="text-gray-500">
            {searchQuery 
              ? `No hay recetas que coincidan con "${searchQuery}"`
              : 'No hay recetas en esta categoría'
            }
          </p>
        </div>
      )}
    </div>
  );
}
