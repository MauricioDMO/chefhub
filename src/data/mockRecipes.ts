import { Recipe, DishType, PrepTimeRange } from '@/types/recipe';

export const mockDishTypes: DishType[] = [
  { id: 1, name: "Entradas", description: "Entradas y aperitivos", icon: "🥗", order: 1, active: true },
  { id: 2, name: "Plato Principal", description: "Platos principales", icon: "🍽️", order: 2, active: true },
  { id: 3, name: "Postres", description: "Postres y dulces", icon: "🍰", order: 3, active: true },
  { id: 4, name: "Bebidas", description: "Bebidas y refrescos", icon: "🥤", order: 4, active: true },
  { id: 5, name: "Bocadillos", description: "Bocadillos y antojitos", icon: "🍿", order: 5, active: true },
  { id: 6, name: "Sopas", description: "Sopas y caldos", icon: "🍲", order: 6, active: true },
  { id: 7, name: "Salsas", description: "Salsas y condimentos", icon: "🥄", order: 7, active: true },
];

export const mockPrepTimeRanges: PrepTimeRange[] = [
  { id: 1, name: "Rápido", minMinutes: 0, maxMinutes: 30, description: "Menos de 30 minutos", order: 1, active: true },
  { id: 2, name: "Medio", minMinutes: 31, maxMinutes: 60, description: "Entre 30 y 60 minutos", order: 2, active: true },
  { id: 3, name: "Largo", minMinutes: 61, maxMinutes: 120, description: "Entre 1 y 2 horas", order: 3, active: true },
  { id: 4, name: "Extendido", minMinutes: 121, maxMinutes: null, description: "Más de 2 horas", order: 4, active: true },
];

export const mockRecipes: Recipe[] = [
  {
    id: 1,
    title: "Las 5 Salsas Madre de La Cocina",
    description: "Aprende las 5 salsas fundamentales que todo chef debe conocer: Béchamel, Velouté, Española, Tomate y Holandesa",
    thumbnailUrl: "https://img.youtube.com/vi/AixiViEtYSo/maxresdefault.jpg",
    videoUrl: "https://iframe.mediadelivery.net/play/449925/e536ba93-b3b6-4137-92cf-2d570871a557",
    chef: {
      id: 1,
      name: "Mauricio Martinez",
      avatar: "https://lh3.googleusercontent.com/a/ACg8ocIRXSopsmZvLc7uwqdM6DKeG3IuIirPitlcvOZgzJvtbNzGdQA=s96-c",
      verified: true
    },
    duration: 30,
    difficulty: 1,
    viewCount: 1250,
    likeCount: 89,
    dislikeCount: 3,
    servings: 30,
    createdAt: "2025-06-04T16:17:58Z",
    dishType: { id: 7, name: "Salsas", icon: "🥄" },
    prepTimeRange: { id: 1, name: "Rápido", minMinutes: 0, maxMinutes: 30 },
    published: true,
    featured: true
  },
  {
    id: 2,
    title: "Pasta Carbonara Auténtica",
    description: "La verdadera receta italiana de carbonara con huevos, panceta y parmesano",
    thumbnailUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=800&h=450&fit=crop",
    chef: {
      id: 2,
      name: "Chef Isabella Romano",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      verified: true
    },
    duration: 25,
    difficulty: 2,
    viewCount: 8420,
    likeCount: 342,
    dislikeCount: 12,
    servings: 4,
    createdAt: "2025-06-03T14:30:00Z",
    dishType: { id: 2, name: "Plato Principal", icon: "🍽️" },
    prepTimeRange: { id: 1, name: "Rápido", minMinutes: 0, maxMinutes: 30 },
    country: { id: 1, name: "Italia", flag: "🇮🇹" },
    published: true,
    featured: false
  },
  {
    id: 3,
    title: "Sushi Roll California",
    description: "Aprende a hacer el famoso California Roll con cangrejo, aguacate y pepino",
    thumbnailUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=450&fit=crop",
    chef: {
      id: 3,
      name: "Chef Hiroshi Tanaka",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      verified: true
    },
    duration: 45,
    difficulty: 3,
    viewCount: 15680,
    likeCount: 567,
    dislikeCount: 23,
    servings: 6,
    createdAt: "2025-06-02T09:15:00Z",
    dishType: { id: 2, name: "Plato Principal", icon: "🍽️" },
    prepTimeRange: { id: 2, name: "Medio", minMinutes: 31, maxMinutes: 60 },
    country: { id: 2, name: "Japón", flag: "🇯🇵" },
    published: true,
    featured: true
  },
  {
    id: 4,
    title: "Tiramisu Clásico",
    description: "El postre italiano más famoso del mundo con mascarpone, café y cacao",
    thumbnailUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&h=450&fit=crop",
    chef: {
      id: 4,
      name: "Chef Sofia Bianchi",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b547?w=100&h=100&fit=crop&crop=face",
      verified: false
    },
    duration: 20,
    difficulty: 2,
    viewCount: 4321,
    likeCount: 198,
    dislikeCount: 8,
    servings: 8,
    createdAt: "2025-06-01T16:45:00Z",
    dishType: { id: 3, name: "Postres", icon: "🍰" },
    prepTimeRange: { id: 1, name: "Rápido", minMinutes: 0, maxMinutes: 30 },
    country: { id: 1, name: "Italia", flag: "🇮🇹" },
    published: true,
    featured: false
  },
  {
    id: 5,
    title: "Tacos de Carnitas Mexicanos",
    description: "Auténticos tacos de carnitas con cebolla, cilantro y salsa verde",
    thumbnailUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=450&fit=crop",
    chef: {
      id: 5,
      name: "Chef Carlos Mendoza",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      verified: true
    },
    duration: 90,
    difficulty: 2,
    viewCount: 12450,
    likeCount: 421,
    dislikeCount: 15,
    servings: 8,
    createdAt: "2025-05-31T12:20:00Z",
    dishType: { id: 2, name: "Plato Principal", icon: "🍽️" },
    prepTimeRange: { id: 3, name: "Largo", minMinutes: 61, maxMinutes: 120 },
    country: { id: 3, name: "México", flag: "🇲🇽" },
    published: true,
    featured: true
  },
  {
    id: 6,
    title: "Gazpacho Andaluz",
    description: "Refrescante sopa fría de tomate perfecta para el verano",
    thumbnailUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=450&fit=crop",
    chef: {
      id: 6,
      name: "Chef María García",
      avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&h=100&fit=crop&crop=face",
      verified: true
    },
    duration: 15,
    difficulty: 1,
    viewCount: 3210,
    likeCount: 156,
    dislikeCount: 5,
    servings: 4,
    createdAt: "2025-05-30T10:30:00Z",
    dishType: { id: 6, name: "Sopas", icon: "🍲" },
    prepTimeRange: { id: 1, name: "Rápido", minMinutes: 0, maxMinutes: 30 },
    country: { id: 4, name: "España", flag: "🇪🇸" },
    published: true,
    featured: false
  },
  {
    id: 7,
    title: "Pad Thai Auténtico",
    description: "El plato tailandés más popular con fideos de arroz, tamarindo y cacahuetes",
    thumbnailUrl: "https://images.unsplash.com/photo-1559314809-0f31657def5e?w=800&h=450&fit=crop",
    chef: {
      id: 7,
      name: "Chef Siriporn Thana",
      avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100&h=100&fit=crop&crop=face",
      verified: true
    },
    duration: 35,
    difficulty: 2,
    viewCount: 9876,
    likeCount: 287,
    dislikeCount: 11,
    servings: 2,
    createdAt: "2025-05-29T18:15:00Z",
    dishType: { id: 2, name: "Plato Principal", icon: "🍽️" },
    prepTimeRange: { id: 2, name: "Medio", minMinutes: 31, maxMinutes: 60 },
    country: { id: 5, name: "Tailandia", flag: "🇹🇭" },
    published: true,
    featured: false
  },
  {
    id: 8,
    title: "Croissants de Mantequilla",
    description: "La técnica francesa perfecta para hacer croissants hojaldrados",
    thumbnailUrl: "https://images.unsplash.com/photo-1555507036-ab794f575c8f?w=800&h=450&fit=crop",
    chef: {
      id: 8,
      name: "Chef Pierre Dubois",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face",
      verified: true
    },
    duration: 240,
    difficulty: 3,
    viewCount: 6543,
    likeCount: 234,
    dislikeCount: 18,
    servings: 12,
    createdAt: "2025-05-28T08:00:00Z",
    dishType: { id: 5, name: "Bocadillos", icon: "🍿" },
    prepTimeRange: { id: 4, name: "Extendido", minMinutes: 121, maxMinutes: null },
    country: { id: 6, name: "Francia", flag: "🇫🇷" },    published: true,
    featured: true
  }
];
