import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/requireUser';
import { getLocalDB } from '@/lib/db/local-db';

// GET /api/me/ads — list only the signed-in user's own ads.
export async function GET(req: NextRequest) {
  const user = requireUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const db = getLocalDB();
    const ads = db
      .prepare('SELECT * FROM ads WHERE user_id = ? ORDER BY created_at DESC')
      .all(Number(user.sub)) as any[];
    const parsedAds = ads.map((ad: any) => {
      try { if (ad.target_locations) ad.target_locations = JSON.parse(ad.target_locations); } catch {}
      return ad;
    });
    return NextResponse.json({ success: true, ads: parsedAds });
  } catch (e: any) {
    console.error('[me/ads] GET error:', e);
    return NextResponse.json({ success: false, error: 'Request failed', ads: [] }, { status: 500 });
  }
}

// POST /api/me/ads — submit a new ad for admin approval.
// user_id, status and ad_type are FORCED server-side; body values are ignored.
export async function POST(req: NextRequest) {
  const user = requireUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const db = getLocalDB();
    const body = await req.json();
    if (!body.title) return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 });

    let targetLocations = body.target_locations || [];
    if (Array.isArray(targetLocations)) targetLocations = JSON.stringify(targetLocations);
    else if (typeof targetLocations === 'string') targetLocations = targetLocations || '[]';
    else targetLocations = '[]';

    const columns = db.prepare("SELECT name FROM pragma_table_info('ads') WHERE name != 'id' ORDER BY cid").all() as any[];
    const columnNames = columns.map((c: any) => c.name);
    const values = columnNames.map((col: string) => {
      switch (col) {
        case 'user_id': return Number(user.sub);          // FORCED — ignore body.user_id
        case 'title': return body.title || '';
        case 'description': return body.description || '';
        case 'target_url': return body.target_url || '';
        case 'placement': return body.placement || 'header';
        case 'size': return body.size || '728x90';
        case 'ad_type': return 'client';                  // FORCED
        case 'image_url': return body.image_url || '';
        case 'custom_html': return body.custom_html || '';
        case 'price': return body.price || 0;
        case 'budget': return body.budget || 0;
        case 'client_name': return body.client_name || '';
        case 'client_company': return body.client_company || '';
        case 'client_email': return body.client_email || user.email || '';
        case 'start_date': return body.start_date || '';
        case 'end_date': return body.end_date || '';
        case 'max_impressions': return body.max_impressions || 10000;
        case 'max_clicks': return body.max_clicks || 1000;
        case 'target_country': return body.target_country || '';
        case 'target_device': return body.target_device || '';
        case 'bg_color': return body.bg_color || '#3b82f6';
        case 'text_color': return body.text_color || '#ffffff';
        case 'font_size': return body.font_size || 18;
        case 'animation': return body.animation || 'none';
        case 'status': return 'pending';                  // FORCED
        case 'impressions': return 0;
        case 'clicks': return 0;
        case 'created_at': return new Date().toISOString();
        case 'updated_at': return new Date().toISOString();
        case 'target_city': return body.target_city || '';
        case 'target_state': return body.target_state || '';
        case 'target_address': return body.target_address || '';
        case 'target_locations': return targetLocations;
        case 'geo_type': return body.geo_type || 'all';
        case 'target_street': return body.target_street || '';
        case 'target_radius': return body.target_radius || 0;
        case 'target_lat': return body.target_lat || 0;
        case 'target_lng': return body.target_lng || 0;
        default: return '';
      }
    });

    const placeholders = columnNames.map(() => '?').join(', ');
    const insertSQL = `INSERT INTO ads (${columnNames.join(', ')}) VALUES (${placeholders})`;
    db.prepare(insertSQL).run(...values);
    return NextResponse.json({ success: true, message: 'Ad submitted' });
  } catch (e: any) {
    console.error('[me/ads] POST error:', e);
    return NextResponse.json({ success: false, error: 'Request failed' }, { status: 500 });
  }
}

// DELETE /api/me/ads?id=<id> — delete only the signed-in user's own ad (IDOR-safe).
export async function DELETE(req: NextRequest) {
  const user = requireUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const db = getLocalDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

    const info = db.prepare('DELETE FROM ads WHERE id = ? AND user_id = ?').run(id, Number(user.sub));
    if (info.changes === 0) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Ad deleted' });
  } catch (e: any) {
    console.error('[me/ads] DELETE error:', e);
    return NextResponse.json({ success: false, error: 'Request failed' }, { status: 500 });
  }
}
