import { NextResponse } from 'next/server';
import { client } from '@/lib/db';

export async function GET() {
  try {
    // Get dish types
    const dishTypesResult = await client.execute({
      sql: 'SELECT id, name, description, icon, "order" FROM dish_types WHERE active = 1 ORDER BY "order" ASC',
      args: []
    });

    // Get prep time ranges
    const prepTimeRangesResult = await client.execute({
      sql: 'SELECT id, name, minMinutes, maxMinutes, description, "order" FROM prep_time_ranges WHERE active = 1 ORDER BY "order" ASC',
      args: []
    });

    // Get countries
    const countriesResult = await client.execute({
      sql: 'SELECT id, name, flag, code FROM countries WHERE active = 1 ORDER BY name ASC',
      args: []
    });

    return NextResponse.json({
      success: true,
      data: {
        dishTypes: dishTypesResult.rows.map((row: any) => ({
          id: row.id,
          name: row.name,
          description: row.description || '',
          icon: row.icon || '',
          order: row.order || 1,
          active: true
        })),
        prepTimeRanges: prepTimeRangesResult.rows.map((row: any) => ({
          id: row.id,
          name: row.name,
          minMinutes: row.minMinutes,
          maxMinutes: row.maxMinutes,
          description: row.description || '',
          order: row.order || 1,
          active: true
        })),
        countries: countriesResult.rows.map((row: any) => ({
          id: row.id,
          name: row.name,
          flag: row.flag || '',
          code: row.code
        }))
      }
    });

  } catch (error) {
    console.error('Error fetching filters:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch filter options',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
