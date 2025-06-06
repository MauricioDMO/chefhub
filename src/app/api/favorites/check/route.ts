import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// GET /api/favorites/check?recipeId=123 - Verificar si una receta está en favoritos
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user?.id) {
      return NextResponse.json({ isFavorite: false });
    }

    const { searchParams } = new URL(request.url);
    const recipeId = searchParams.get('recipeId');

    if (!recipeId) {
      return NextResponse.json(
        { error: 'ID de receta requerido' },
        { status: 400 }
      );
    }

    const result = await client.execute({
      sql: 'SELECT id FROM favorites WHERE userId = ? AND recipeId = ?',
      args: [session.user.id, parseInt(recipeId)]
    });

    return NextResponse.json({
      isFavorite: result.rows.length > 0
    });

  } catch (error) {
    console.error('Error checking favorite status:', error);
    return NextResponse.json({ isFavorite: false });
  }
}
