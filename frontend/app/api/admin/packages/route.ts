import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin/requireAdmin';

export async function GET(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const db = (await import('@/lib/db/local-db')).getLocalDB();
    const packages = db.prepare('SELECT * FROM packages ORDER BY price').all();
    return NextResponse.json({ success: true, packages });
  } catch (e: any) {
    return NextResponse.json({ success: true, packages: [] });
  }
}

export async function POST(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const db = (await import('@/lib/db/local-db')).getLocalDB();
    const body = await req.json();
    const { name, description, price, original_price, currency, duration_days, features, is_popular } = body;
    db.prepare('INSERT INTO packages (name, description, price, original_price, currency, duration_days, features, is_popular) VALUES (?,?,?,?,?,?,?,?)')
      .run(name, description, price, original_price, currency, duration_days, JSON.stringify(features || []), is_popular ? 1 : 0);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const db = (await import('@/lib/db/local-db')).getLocalDB();
    const { id, name, description, price, original_price, currency, duration_days, features, is_popular } = await req.json();
    db.prepare('UPDATE packages SET name=?, description=?, price=?, original_price=?, currency=?, duration_days=?, features=?, is_popular=? WHERE id=?')
      .run(name, description, price, original_price, currency, duration_days, JSON.stringify(features || []), is_popular ? 1 : 0, id);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const db = (await import('@/lib/db/local-db')).getLocalDB();
    db.prepare('DELETE FROM packages WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
