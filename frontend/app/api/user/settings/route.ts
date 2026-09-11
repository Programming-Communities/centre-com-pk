import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const db = (await import('@/lib/db/local-db')).getLocalDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');
    
    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
    }
    
    const settings = db.prepare('SELECT * FROM user_settings WHERE user_id = ?').get(userId);
    return NextResponse.json({ success: true, settings: settings || null });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = (await import('@/lib/db/local-db')).getLocalDB();
    const body = await req.json();
    const { user_id, theme, font_family, dark_mode, language } = body;
    
    if (!user_id) {
      return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
    }
    
    // Check existing settings
    const existing = db.prepare('SELECT id FROM user_settings WHERE user_id = ?').get(user_id) as any;
    
    if (existing) {
      db.prepare('UPDATE user_settings SET theme = ?, font_family = ?, dark_mode = ?, language = ?, updated_at = datetime("now") WHERE user_id = ?')
        .run(theme || 'professional-blue', font_family || 'system-ui', dark_mode || 0, language || 'en', user_id);
    } else {
      db.prepare('INSERT INTO user_settings (user_id, theme, font_family, dark_mode, language) VALUES (?, ?, ?, ?, ?)')
        .run(user_id, theme || 'professional-blue', font_family || 'system-ui', dark_mode || 0, language || 'en');
    }
    
    return NextResponse.json({ success: true, message: 'Settings saved!' });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}