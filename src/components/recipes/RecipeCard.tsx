import { Recipe, formatDuration, formatViews, getDifficultyText, getDifficultyColor } from '@/types/recipe';
import { IconRosetteDiscountCheck } from '@tabler/icons-react';
import { FavoriteButton } from './FavoriteButton';

// Función para formatear tiempo relativo en español
function formatTimeAgo(date: string): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return 'hace unos segundos';
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `hace ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `hace ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `hace ${diffInDays} ${diffInDays === 1 ? 'día' : 'días'}`;
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `hace ${diffInMonths} ${diffInMonths === 1 ? 'mes' : 'meses'}`;
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `hace ${diffInYears} ${diffInYears === 1 ? 'año' : 'años'}`;
}

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
  showFavoriteButton?: boolean;
  isFavorite?: boolean;
}

export function RecipeCard({ recipe, onClick, showFavoriteButton = true, isFavorite }: RecipeCardProps) {
  // Use the isFavorite prop if provided, otherwise fall back to recipe.isFavorite
  const isRecipeFavorite = isFavorite !== undefined ? isFavorite : recipe.isFavorite || false;
  return (
    <div 
      className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1"
      onClick={onClick}
    >      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-200 overflow-hidden">
        <img
          src={recipe.thumbnailUrl}
          alt={recipe.title}
          className="w-full object-cover group-hover:scale-105 transition-transform duration-200"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
          {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
          {formatDuration(recipe.duration)}
        </div>        {/* Favorite Button */}
        {showFavoriteButton && (
          <div className="absolute top-2 right-2">
            <FavoriteButton 
              recipeId={recipe.id} 
              initialIsFavorite={isRecipeFavorite}
              className="bg-white/90 p-2 rounded-full shadow-sm hover:bg-white"
            />
          </div>
        )}
          {/* Featured Badge */}
        {recipe.featured && (
          <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded font-medium">
            Destacado
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
          {recipe.title}
        </h3>        {/* Chef Info */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full overflow-hidden relative">
            {/* */}
            <img
              src={recipe.chef.avatar || '/default-avatar.png'}
              alt={recipe.chef.name}
              width={32}
              height={32}
              className="object-cover"
            />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-600 text-sm">{recipe.chef.name}</span>
            {recipe.chef.verified && (
              <IconRosetteDiscountCheck className="w-4 h-4 text-blue-500" />
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-4">
            <span>{formatViews(recipe.viewCount)} vistas</span>
            <span>👍 {recipe.likeCount}</span>
          </div>          <span>
            {formatTimeAgo(recipe.createdAt)}
          </span>
        </div>        {/* Tags */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
              {recipe.dishType?.name || 'General'}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(recipe.difficulty)}`}>
              {getDifficultyText(recipe.difficulty)}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            {recipe.servings} {recipe.servings === 1 ? 'porción' : 'porciones'}
          </div>
        </div>
      </div>
    </div>
  );
}
