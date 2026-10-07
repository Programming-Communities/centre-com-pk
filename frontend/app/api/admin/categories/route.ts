import { NextRequest, NextResponse } from 'next/server';
import { getLocalDB } from '@/lib/db/local-db';
import { requireAdmin } from '@/lib/admin/requireAdmin';

export async function GET(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const db = getLocalDB();
    const categories = db.prepare('SELECT * FROM categories ORDER BY type, name').all();
    return NextResponse.json({ success: true, categories });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const db = getLocalDB();
    const body = await req.json();
    const { name, slug, type, icon, description, lang, parent_id } = body;
    
    db.prepare('INSERT INTO categories (name, slug, type, icon, description, lang, parent_id) VALUES (?,?,?,?,?,?,?)')
      .run(name, slug, type || 'blog', icon || '', description || '', lang || 'en', parent_id || null);
    
    return NextResponse.json({ success: true, message: 'Category created' });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const db = getLocalDB();
    const body = await req.json();
    const { id, name, slug, type, icon, description, lang, parent_id } = body;
    
    db.prepare('UPDATE categories SET name=?, slug=?, type=?, icon=?, description=?, lang=?, parent_id=? WHERE id=?')
      .run(name, slug, type, icon, description, lang, parent_id, id);
    
    return NextResponse.json({ success: true, message: 'Category updated' });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const db = getLocalDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    db.prepare('DELETE FROM categories WHERE id=?').run(id);
    return NextResponse.json({ success: true, message: 'Category deleted' });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
