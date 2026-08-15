// app/api/payments/methods/route.ts
import { NextRequest, NextResponse } from 'next/server';


export async function GET(request: NextRequest) {
  try {
    // @ts-ignore
    const db = (process.env as any).centers_db || (globalThis as any).centers_db;
    if (!db) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }

    const methods = await db.prepare(
      'SELECT * FROM payment_methods WHERE is_active = 1'
    ).all();

    return NextResponse.json({
      success: true,
      methods: methods.results,
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
