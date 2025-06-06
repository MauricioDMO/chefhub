import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/db';
import { Recipe } from '@/types/recipe';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;
    
    // Filter parameters
    const dishTypeId = searchParams.get('dishTypeId');
    const prepTimeRangeId = searchParams.get('prepTimeRangeId');
    const countryId = searchParams.get('countryId');
    const difficulty = searchParams.get('difficulty');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    const userId = searchParams.get('userId'); // Para obtener favoritos del usuario    // Build WHERE conditions and parameters
    const whereConditions = ['r.published = 1'];
    const params: (string | number | boolean)[] = [];
    let paramIndex = 1;

    if (dishTypeId) {
      whereConditions.push(`r.dishTypeId = ?${paramIndex++}`);
      params.push(parseInt(dishTypeId));
    }
    
    if (prepTimeRangeId) {
      whereConditions.push(`r.prepTimeRangeId = ?${paramIndex++}`);
      params.push(parseInt(prepTimeRangeId));
    }
    
    if (countryId) {
      whereConditions.push(`r.countryId = ?${paramIndex++}`);
      params.push(parseInt(countryId));
    }
    
    if (difficulty) {
      whereConditions.push(`r.difficulty = ?${paramIndex++}`);
      params.push(parseInt(difficulty));
    }
    
    if (featured === 'true') {
      whereConditions.push(`r.featured = 1`);
    }
    
    if (search) {
      whereConditions.push(`(r.title LIKE ?${paramIndex} OR r.description LIKE ?${paramIndex + 1} OR u.name LIKE ?${paramIndex + 2})`);
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
      paramIndex += 3;
    }    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // LEFT JOIN para favoritos si hay userId
    const favoritesJoin = userId ? `LEFT JOIN favorites f ON r.id = f.recipeId AND f.userId = ?` : '';
    const favoritesSelect = userId ? ', CASE WHEN f.id IS NOT NULL THEN 1 ELSE 0 END as isFavorite' : ', 0 as isFavorite';
    
    // Get total count for pagination (use only WHERE params, not userId)
    const countQuery = `
      SELECT COUNT(*) as total
      FROM recipes r
      JOIN chefs ch ON r.chefId = ch.id
      JOIN user u ON ch.userId = u.id
      ${whereClause}
    `;

    const countResult = await client.execute({ sql: countQuery, args: params });
    const totalRecipes = Number(countResult.rows[0].total || 0);
    const totalPages = Math.ceil(totalRecipes / limit);

    // Main query with pagination
    const query = `
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
        ptr.id as prepTimeRangeId,        ptr.name as prepTimeRangeName,
        ptr.minMinutes,
        ptr.maxMinutes,
        co.id as countryId,
        co.name as countryName,
        co.flag as countryFlag${favoritesSelect}
      FROM recipes r
      JOIN chefs ch ON r.chefId = ch.id
      JOIN user u ON ch.userId = u.id
      LEFT JOIN dish_types dt ON r.dishTypeId = dt.id
      LEFT JOIN prep_time_ranges ptr ON r.prepTimeRangeId = ptr.id
      LEFT JOIN countries co ON r.countryId = co.id      ${favoritesJoin}
      ${whereClause}
      ORDER BY r.createdAt DESC
      LIMIT ? OFFSET ?
    `;    // Build query parameters: WHERE params + userId (if exists) + limit + offset
    const queryParams: (string | number | boolean)[] = [...params];
    if (userId) {
      queryParams.push(userId);
    }
    queryParams.push(limit, offset);
    
    const result = await client.execute({ sql: query, args: queryParams });    // Transform the results to match the Recipe interface
    const recipes: Recipe[] = result.rows.map((row: Record<string, unknown>) => ({
      id: row.id as number,
      title: row.title as string,
      description: (row.description as string) || '',
      thumbnailUrl: (row.thumbnailUrl as string) || '',
      videoUrl: (row.videoUrl as string) || undefined,
      chef: {
        id: row.chefId as number,
        name: row.chefName as string,
        avatar: (row.chefAvatar as string) || '',
        verified: Boolean(row.chefVerified)
      },
      duration: (row.duration as number) || 0,
      difficulty: ((row.difficulty as number) as 1 | 2 | 3) || 1,
      viewCount: row.viewCount as number,
      likeCount: row.likeCount as number,
      dislikeCount: row.dislikeCount as number,
      servings: (row.servings as number) || 1,      createdAt: row.createdAt as string,
      isFavorite: Boolean(row.isFavorite), // Agregar esta propiedad
      dishType: {
        id: (row.dishTypeId as number) || 0,
        name: (row.dishTypeName as string) || '',
        icon: (row.dishTypeIcon as string) || ''
      },      prepTimeRange: {
        id: (row.prepTimeRangeId as number) || 0,
        name: (row.prepTimeRangeName as string) || '',
        minMinutes: (row.minMinutes as number) || 0,
        maxMinutes: row.maxMinutes as number
      },
      country: row.countryId ? {
        id: row.countryId as number,
        name: (row.countryName as string) || '',
        flag: (row.countryFlag as string) || ''
      } : undefined,
      published: Boolean(row.published),
      featured: Boolean(row.featured)
    }));

    // Prepare pagination metadata
    const pagination = {
      page,
      limit,
      totalRecipes,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    };

    return NextResponse.json({
      success: true,
      data: recipes,
      pagination,
      filters: {
        dishTypeId: dishTypeId ? parseInt(dishTypeId) : null,
        prepTimeRangeId: prepTimeRangeId ? parseInt(prepTimeRangeId) : null,
        countryId: countryId ? parseInt(countryId) : null,
        difficulty: difficulty ? parseInt(difficulty) : null,
        featured: featured === 'true' ? true : null,
        search: search || null
      }
    });

  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch recipes',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
