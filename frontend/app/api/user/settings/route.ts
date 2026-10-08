import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/requireUser';

export async function GET(req: NextRequest) {
  try {
    const user = requireUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const db = (await import('@/lib/db/local-db')).getLocalDB();

    const settings = db.prepare('SELECT * FROM user_settings WHERE user_id = ?').get(user.sub);
    return NextResponse.json({ success: true, settings: settings || null });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = requireUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const db = (await import('@/lib/db/local-db')).getLocalDB();
    const body = await req.json();
    const { theme, font_family, dark_mode, language } = body;

    // Check existing settings
    const existing = db.prepare('SELECT id FROM user_settings WHERE user_id = ?').get(user.sub) as any;

    if (existing) {
      db.prepare('UPDATE user_settings SET theme = ?, font_family = ?, dark_mode = ?, language = ?, updated_at = datetime("now") WHERE user_id = ?')
        .run(theme || 'professional-blue', font_family || 'system-ui', dark_mode || 0, language || 'en', user.sub);
    } else {
      db.prepare('INSERT INTO user_settings (user_id, theme, font_family, dark_mode, language) VALUES (?, ?, ?, ?, ?)')
        .run(user.sub, theme || 'professional-blue', font_family || 'system-ui', dark_mode || 0, language || 'en');
    }

    return NextResponse.json({ success: true, message: 'Settings saved!' });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
