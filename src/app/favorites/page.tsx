import { getSessionWithChefStatus } from '@/lib/auth-helpers';
import { client } from '@/lib/db';
import { Recipe } from '@/types/recipe';
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { IconHeart, IconHeartOff } from '@tabler/icons-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

// Función para obtener las recetas favoritas del usuario
async function getUserFavoriteRecipes(userId: string): Promise<Recipe[]> {
  try {    const result = await client.execute({
      sql: `
        SELECT 
          r.id,
          r.title,
          r.description,
          r.thumbnailUrl,
          r.duration,
          r.difficulty,
          r.servings,
          r.viewCount,
          r.likeCount,
          r.dislikeCount,
          r.createdAt,
          r.published,
          r.featured,
          ch.id as chefId,
          u.name as chefName,
          u.image as chefAvatar,
          ch.verified as chefVerified,
          co.id as countryId,
          co.name as countryName,
          co.flag as countryFlag,
          dt.id as dishTypeId,
          dt.name as dishTypeName,
          dt.icon as dishTypeIcon,
          ptr.id as prepTimeRangeId,
          ptr.name as prepTimeRangeName,
          ptr.minMinutes,
          ptr.maxMinutes
        FROM favorites f
        JOIN recipes r ON f.recipeId = r.id
        JOIN chefs ch ON r.chefId = ch.id
        JOIN user u ON ch.userId = u.id
        LEFT JOIN countries co ON r.countryId = co.id
        LEFT JOIN dish_types dt ON r.dishTypeId = dt.id
        LEFT JOIN prep_time_ranges ptr ON r.prepTimeRangeId = ptr.id
        WHERE f.userId = ? AND r.published = 1
        ORDER BY f.createdAt DESC
      `,
      args: [userId]
    });return result.rows.map((row: any) => ({
      id: row.id as number,
      title: row.title as string,
      description: row.description as string,
      thumbnailUrl: row.thumbnailUrl as string,
      duration: row.duration as number,
      difficulty: (row.difficulty as number) as 1 | 2 | 3,
      servings: row.servings as number,
      viewCount: row.viewCount as number,
      likeCount: row.likeCount as number,
      dislikeCount: row.dislikeCount as number,
      createdAt: row.createdAt as string,
      published: Boolean(row.published),
      featured: Boolean(row.featured),      chef: {
        id: row.chefId as number,
        name: row.chefName as string,
        avatar: row.chefAvatar as string,
        verified: Boolean(row.chefVerified)
      },
      country: row.countryName ? {
        id: row.countryId as number,
        name: row.countryName as string,
        flag: row.countryFlag as string
      } : undefined,
      dishType: {
        id: row.dishTypeId as number,
        name: row.dishTypeName as string,
        icon: row.dishTypeIcon as string
      },
      prepTimeRange: {
        id: row.prepTimeRangeId as number,
        name: row.prepTimeRangeName as string,
        minMinutes: row.minMinutes as number,
        maxMinutes: row.maxMinutes as number | null
      }
    }));
  } catch (error) {
    console.error('Error fetching user favorite recipes:', error);
    return [];
  }
}

export default async function FavoritesPage() {
  const { session } = await getSessionWithChefStatus();

  // Redireccionar a sign-in si no hay sesión
  if (!session) {
    redirect('/sign-in');
  }

  const favoriteRecipes = await getUserFavoriteRecipes(session.user.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-full">
              <IconHeart className="w-6 h-6 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Mis Recetas Favoritas
            </h1>
          </div>
          <p className="text-gray-600">
            Aquí encontrarás todas las recetas que has marcado como favoritas.
          </p>
        </div>

        {/* Contenido */}
        {favoriteRecipes.length === 0 ? (
          <div className="text-center py-16">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gray-100 rounded-full">
                <IconHeartOff className="w-16 h-16 text-gray-400" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              No tienes recetas favoritas aún
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Explora nuestras deliciosas recetas y marca las que más te gusten 
              para encontrarlas fácilmente aquí.
            </p>
            <Link
              href="/recipes"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              <IconHeart className="w-5 h-5" />
              Explorar Recetas
            </Link>
          </div>
        ) : (
          <>
            {/* Estadísticas */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Total de Favoritas
                  </h2>
                  <p className="text-3xl font-bold text-green-600">
                    {favoriteRecipes.length}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <IconHeart className="w-8 h-8 text-red-600" />
                </div>
              </div>
            </div>            {/* Grid de Recetas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteRecipes.map((recipe) => (
                <div key={recipe.id} className="relative">
                  <Link 
                    href={`/recipes/${recipe.id}`}
                    className="block"
                  >
                    <RecipeCard 
                      recipe={recipe} 
                      showFavoriteButton={true}
                      isFavorite={true}
                    />
                  </Link>
                </div>
              ))}
            </div>

            {/* Footer con enlace para explorar más */}
            <div className="text-center mt-12 pt-8 border-t border-gray-200">
              <p className="text-gray-600 mb-4">
                ¿Quieres descubrir más recetas increíbles?
              </p>
              <Link
                href="/recipes"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                Explorar Más Recetas
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
