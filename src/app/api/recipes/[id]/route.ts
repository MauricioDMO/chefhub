import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/db';
import { Recipe } from '@/types/recipe';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const recipeId = parseInt((await params).id);

    if (isNaN(recipeId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid recipe ID' },
        { status: 400 }
      );
    }
    // Get the recipe with all related data using direct SQL
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
          r.instructions,
          -- Chef info
          ch.id as chefId,
          u.name as chefName,
          u.image as chefAvatar,
          ch.verified as chefVerified,
          ch.bio as chefBio,
          -- Dish type info
          dt.id as dishTypeId,
          dt.name as dishTypeName,
          dt.icon as dishTypeIcon,
          -- Prep time range info
          ptr.id as prepTimeRangeId,
          ptr.name as prepTimeRangeName,
          ptr.minMinutes,
          ptr.maxMinutes,
          -- Country info
          co.id as countryId,
          co.name as countryName,
          co.flag as countryFlag
        FROM recipes r
        INNER JOIN chefs ch ON r.chefId = ch.id
        INNER JOIN user u ON ch.userId = u.id
        LEFT JOIN dish_types dt ON r.dishTypeId = dt.id
        LEFT JOIN prep_time_ranges ptr ON r.prepTimeRangeId = ptr.id
        LEFT JOIN countries co ON r.countryId = co.id
        WHERE r.id = ? AND r.published = 1
      `,
      args: [recipeId]
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Recipe not found' },
        { status: 404 }
      );
    }

    const row = result.rows[0] as any;    // Transform the result to match the Recipe interface
    const recipe: Recipe & { instructions?: string; chef: Recipe['chef'] & { bio?: string } } = {
      id: row.id,
      title: row.title,
      description: row.description || '',
      thumbnailUrl: row.thumbnailUrl || '',
      videoUrl: row.videoUrl || undefined,
      instructions: row.instructions || undefined,      chef: {
        id: row.chefId,
        name: row.chefName,
        avatar: row.chefAvatar || '',
        verified: Boolean(row.chefVerified),
        bio: row.chefBio || undefined
      },
      duration: row.duration || 0,
      difficulty: (row.difficulty as 1 | 2 | 3) || 1,
      viewCount: row.viewCount,
      likeCount: row.likeCount,
      dislikeCount: row.dislikeCount,
      servings: row.servings || 1,
      createdAt: row.createdAt,
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
        name: row.countryName || '',
        flag: row.countryFlag || ''
      } : undefined,
      published: Boolean(row.published),
      featured: Boolean(row.featured)
    };

    // Increment view count (fire and forget)
    client.execute({
      sql: 'UPDATE recipes SET viewCount = viewCount + 1 WHERE id = ?',
      args: [recipeId]
    }).catch(console.error);

    return NextResponse.json({
      success: true,
      data: recipe
    });

  } catch (error) {
    console.error('Error fetching recipe:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch recipe',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
