import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const recipeId = parseInt(id);

    if (isNaN(recipeId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid recipe ID' },
        { status: 400 }
      );
    }    // Get ingredients for the recipe
    const result = await client.execute({
      sql: `
        SELECT 
          ri.id,
          ri.quantity,
          ri.unit,
          ri.notes,
          ri."order" as ingredient_order,
          i.id as ingredientId,
          i.name as ingredientName,
          i.commonUnit
        FROM recipe_ingredients ri
        INNER JOIN ingredients i ON ri.ingredientId = i.id
        WHERE ri.recipeId = ?
        ORDER BY ri."order", ri.id
      `,
      args: [recipeId]
    });    const ingredients = result.rows.map((row: Record<string, unknown>) => ({
      id: row.id as number,
      quantity: row.quantity as number,
      unit: row.unit as string,
      notes: (row.notes as string) || undefined,
      order: row.ingredient_order as number,
      ingredient: {
        id: row.ingredientId as number,
        name: row.ingredientName as string,
        commonUnit: row.commonUnit as string
      }
    }));

    return NextResponse.json({
      success: true,
      data: ingredients
    });

  } catch (error) {
    console.error('Error fetching recipe ingredients:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch ingredients',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
