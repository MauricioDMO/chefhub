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
    }    const row = result.rows[0] as Record<string, unknown>;

    // Transform the result to match the Recipe interface
    const recipe: Recipe & { instructions?: string; chef: Recipe['chef'] & { bio?: string } } = {
      id: row.id as number,
      title: row.title as string,
      description: (row.description as string) || '',
      thumbnailUrl: (row.thumbnailUrl as string) || '',
      videoUrl: (row.videoUrl as string) || undefined,
      instructions: (row.instructions as string) || undefined,
      chef: {
        id: row.chefId as number,
        name: row.chefName as string,
        avatar: (row.chefAvatar as string) || '',
        verified: Boolean(row.chefVerified),
        bio: (row.chefBio as string) || undefined
      },
      duration: (row.duration as number) || 0,
      difficulty: ((row.difficulty as number) as 1 | 2 | 3) || 1,
      viewCount: row.viewCount as number,
      likeCount: row.likeCount as number,
      dislikeCount: row.dislikeCount as number,
      servings: (row.servings as number) || 1,
      createdAt: row.createdAt as string,
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
