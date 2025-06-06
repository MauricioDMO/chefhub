import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// GET /api/favorites - Obtener las recetas favoritas del usuario
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;    // Obtener recetas favoritas
    const result = await client.execute({
      sql: `
        SELECT 
          r.id,
          r.title,
          r.description,
          r.thumbnailUrl,
          r.videoUrl,
          r.duration,
          r.difficulty,
          r.viewCount,
          r.likeCount,
          r.dislikeCount,
          r.servings,
          r.createdAt,
          r.published,
          r.featured,
          ch.id as chefId,
          u.name as chefName,
          u.image as chefAvatar,
          ch.verified as chefVerified,
          dt.id as dishTypeId,
          dt.name as dishTypeName,
          dt.icon as dishTypeIcon,
          ptr.id as prepTimeRangeId,
          ptr.name as prepTimeRangeName,
          ptr.minMinutes,
          ptr.maxMinutes,
          co.id as countryId,
          co.name as countryName,
          co.flag as countryFlag,
          f.createdAt as favoriteDate
        FROM favorites f
        JOIN recipes r ON f.recipeId = r.id
        JOIN chefs ch ON r.chefId = ch.id
        JOIN user u ON ch.userId = u.id
        LEFT JOIN countries co ON r.countryId = co.id
        LEFT JOIN dish_types dt ON r.dishTypeId = dt.id
        LEFT JOIN prep_time_ranges ptr ON r.prepTimeRangeId = ptr.id
        WHERE f.userId = ? AND r.published = 1
        ORDER BY f.createdAt DESC
        LIMIT ? OFFSET ?
      `,
      args: [session.user.id, limit, offset]
    });// Contar total de favoritos
    const countResult = await client.execute({
      sql: `
        SELECT COUNT(*) as total
        FROM favorites f
        JOIN recipes r ON f.recipeId = r.id
        WHERE f.userId = ? AND r.published = 1
      `,
      args: [session.user.id]
    });

    const total = countResult.rows[0]?.total as number || 0;
    const totalPages = Math.ceil(total / limit);    const recipes = result.rows.map((row: any) => ({
      id: row.id as number,
      title: row.title as string,
      description: row.description as string,
      thumbnailUrl: row.thumbnailUrl as string,
      videoUrl: row.videoUrl || undefined,
      chef: {
        id: row.chefId,
        name: row.chefName as string,
        avatar: row.chefAvatar as string,
        verified: Boolean(row.chefVerified)
      },
      duration: row.duration as number,
      difficulty: (row.difficulty as number) as 1 | 2 | 3,
      viewCount: row.viewCount as number,
      likeCount: row.likeCount as number,
      dislikeCount: row.dislikeCount as number,
      servings: row.servings as number,
      createdAt: row.createdAt as string,
      dishType: {
        id: row.dishTypeId || 0,
        name: row.dishTypeName || '',
        icon: row.dishTypeIcon || ''
      },
      prepTimeRange: {
        id: row.prepTimeRangeId || 0,
        name: row.prepTimeRangeName || '',
        minMinutes: row.minMinutes || 0,
        maxMinutes: row.maxMinutes
      },
      country: row.countryId ? {
        id: row.countryId,
        name: row.countryName as string,
        flag: row.countryFlag as string
      } : undefined,
      published: Boolean(row.published),
      featured: Boolean(row.featured)
    }));    return NextResponse.json({
      success: true,
      data: recipes,
      pagination: {
        page,
        limit,
        totalRecipes: total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST /api/favorites - Agregar una receta a favoritos
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { recipeId } = await request.json();

    if (!recipeId || typeof recipeId !== 'number') {
      return NextResponse.json(
        { error: 'ID de receta requerido' },
        { status: 400 }
      );
    }

    // Verificar que la receta existe y está publicada
    const recipeResult = await client.execute({
      sql: 'SELECT id FROM recipes WHERE id = ? AND published = 1',
      args: [recipeId]
    });

    if (recipeResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Receta no encontrada' },
        { status: 404 }
      );
    }

    // Verificar si ya está en favoritos
    const existingFavorite = await client.execute({
      sql: 'SELECT id FROM favorites WHERE userId = ? AND recipeId = ?',
      args: [session.user.id, recipeId]
    });

    if (existingFavorite.rows.length > 0) {
      return NextResponse.json(
        { error: 'La receta ya está en favoritos' },
        { status: 409 }
      );
    }

    // Agregar a favoritos
    await client.execute({
      sql: 'INSERT INTO favorites (userId, recipeId, createdAt) VALUES (?, ?, CURRENT_TIMESTAMP)',
      args: [session.user.id, recipeId]
    });

    return NextResponse.json(
      { message: 'Receta agregada a favoritos' },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error adding to favorites:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE /api/favorites - Remover una receta de favoritos
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const recipeId = searchParams.get('recipeId');

    if (!recipeId) {
      return NextResponse.json(
        { error: 'ID de receta requerido' },
        { status: 400 }
      );
    }

    // Verificar que existe en favoritos
    const existingFavorite = await client.execute({
      sql: 'SELECT id FROM favorites WHERE userId = ? AND recipeId = ?',
      args: [session.user.id, parseInt(recipeId)]
    });

    if (existingFavorite.rows.length === 0) {
      return NextResponse.json(
        { error: 'La receta no está en favoritos' },
        { status: 404 }
      );
    }

    // Remover de favoritos
    await client.execute({
      sql: 'DELETE FROM favorites WHERE userId = ? AND recipeId = ?',
      args: [session.user.id, parseInt(recipeId)]
    });

    return NextResponse.json(
      { message: 'Receta removida de favoritos' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error removing from favorites:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
