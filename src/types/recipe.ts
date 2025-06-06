export interface Recipe {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl?: string;
  chef: {
    id: number;
    name: string;
    avatar: string;
    verified: boolean;
  };
  duration: number; // en minutos
  difficulty: 1 | 2 | 3; // 1: Fácil, 2: Medio, 3: Difícil
  viewCount: number;
  likeCount: number;
  dislikeCount: number;
  servings: number;
  createdAt: string;
  isFavorite?: boolean; // Agregar esta propiedad opcional
  dishType: {
    id: number;
    name: string;
    icon: string;
  };
  prepTimeRange: {
    id: number;
    name: string;
    minMinutes: number;
    maxMinutes: number | null;
  };
  country?: {
    id: number;
    name: string;
    flag: string;
  };
  published: boolean;
  featured: boolean;
}

export interface DishType {
  id: number;
  name: string;
  description: string;
  icon: string;
  order: number;
  active: boolean;
}

export interface PrepTimeRange {
  id: number;
  name: string;
  minMinutes: number;
  maxMinutes: number | null;
  description: string;
  order: number;
  active: boolean;
}

export interface Ingredient {
  id: number;
  name: string;
  commonUnit: string;
}

export interface RecipeIngredient {
  id: number;
  quantity: string;
  unit: string;
  notes?: string;
  order: number;
  ingredient: Ingredient;
}

// Función para formatear el tiempo
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

// Función para formatear las vistas
export const formatViews = (views: number): string => {
  if (views < 1000) return views.toString();
  if (views < 1000000) return `${(views / 1000).toFixed(1)}K`;
  return `${(views / 1000000).toFixed(1)}M`;
};

// Función para obtener el nivel de dificultad
export const getDifficultyText = (level: 1 | 2 | 3): string => {
  switch (level) {
    case 1: return 'Fácil';
    case 2: return 'Medio';
    case 3: return 'Difícil';
    default: return 'Fácil';
  }
};

// Función para obtener el color de la dificultad
export const getDifficultyColor = (level: 1 | 2 | 3): string => {
  switch (level) {
    case 1: return 'text-green-600 bg-green-100';
    case 2: return 'text-yellow-600 bg-yellow-100';
    case 3: return 'text-red-600 bg-red-100';
    default: return 'text-green-600 bg-green-100';
  }
};
