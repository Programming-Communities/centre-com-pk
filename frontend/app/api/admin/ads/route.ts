import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";
import path from "path";

function getDB() {
  const dbPath = path.join(process.cwd(), "data", "centers-local.db");
  return new Database(dbPath);
}

export async function GET(request: NextRequest) {
  try {
    const db = getDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "100");

    let query = "SELECT * FROM ads";
    const params: any[] = [];

    if (userId) { query += " WHERE user_id = ?"; params.push(userId); }
    if (status && status !== 'all') { query += userId ? " AND" : " WHERE"; query += " status = ?"; params.push(status); }
    query += " ORDER BY created_at DESC LIMIT ?";
    params.push(limit);

    const ads = db.prepare(query).all(...params);
    const parsedAds = ads.map((ad: any, index: number) => {
      try { if (ad.target_locations) ad.target_locations = JSON.parse(ad.target_locations); } catch (e) {}
      return { ...ad, key: `ad-${ad.id || index}` };
    });
    db.close();
    return NextResponse.json({ success: true, ads: parsedAds });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message, ads: [] }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDB();
    const body = await request.json();
    let userId = body.user_id;
    if (!userId && body.client_email) {
      const user = db.prepare("SELECT id FROM users WHERE email = ?").get(body.client_email) as any;
      if (user) userId = user.id;
    }
    if (!body.title) { db.close(); return NextResponse.json({ success: false, error: "Title is required" }, { status: 400 }); }

    let targetLocations = body.target_locations || [];
    if (Array.isArray(targetLocations)) targetLocations = JSON.stringify(targetLocations);
    else if (typeof targetLocations === 'string') targetLocations = targetLocations || '[]';
    else targetLocations = '[]';

    const columns = db.prepare("SELECT name FROM pragma_table_info('ads') WHERE name != 'id' ORDER BY cid").all() as any[];
    const columnNames = columns.map(c => c.name);
    const values = columnNames.map(col => {
      switch(col) {
        case 'user_id': return userId || null; case 'title': return body.title || '';
        case 'description': return body.description || ''; case 'target_url': return body.target_url || '';
        case 'placement': return body.placement || 'header'; case 'size': return body.size || '728x90';
        case 'ad_type': return body.ad_type || 'client'; case 'image_url': return body.image_url || '';
        case 'custom_html': return body.custom_html || ''; case 'price': return body.price || 0;
        case 'budget': return body.budget || 0; case 'client_name': return body.client_name || '';
        case 'client_company': return body.client_company || ''; case 'client_email': return body.client_email || '';
        case 'start_date': return body.start_date || ''; case 'end_date': return body.end_date || '';
        case 'max_impressions': return body.max_impressions || 10000; case 'max_clicks': return body.max_clicks || 1000;
        case 'target_country': return body.target_country || ''; case 'target_device': return body.target_device || '';
        case 'bg_color': return body.bg_color || '#3b82f6'; case 'text_color': return body.text_color || '#ffffff';
        case 'font_size': return body.font_size || 18; case 'animation': return body.animation || 'none';
        case 'status': return 'pending'; case 'impressions': return 0; case 'clicks': return 0;
        case 'created_at': return new Date().toISOString(); case 'updated_at': return new Date().toISOString();
        case 'target_city': return body.target_city || ''; case 'target_state': return body.target_state || '';
        case 'target_address': return body.target_address || ''; case 'target_locations': return targetLocations;
        case 'geo_type': return body.geo_type || 'all'; case 'target_street': return body.target_street || '';
        case 'target_radius': return body.target_radius || 0; case 'target_lat': return body.target_lat || 0;
        case 'target_lng': return body.target_lng || 0; default: return '';
      }
    });

    const placeholders = columnNames.map(() => '?').join(', ');
    const insertSQL = `INSERT INTO ads (${columnNames.join(', ')}) VALUES (${placeholders})`;
    db.prepare(insertSQL).run(...values);
    db.close();
    return NextResponse.json({ success: true, message: "Ad submitted" });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "Ad ID required" }, { status: 400 });
    const db = getDB();
    db.prepare("DELETE FROM ads WHERE id = ?").run(id);
    db.close();
    return NextResponse.json({ success: true, message: "Ad deleted" });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const db = getDB();
    const body = await request.json();
    const id = body.id;
    if (!id) { db.close(); return NextResponse.json({ success: false, error: "Ad ID required" }, { status: 400 }); }

    let targetLocations = body.target_locations || [];
    if (Array.isArray(targetLocations)) targetLocations = JSON.stringify(targetLocations);
    else if (typeof targetLocations === 'string') targetLocations = targetLocations || '[]';
    else targetLocations = '[]';

    const columns = db.prepare("SELECT name FROM pragma_table_info('ads') WHERE name != 'id' AND name != 'created_at' ORDER BY cid").all() as any[];
    const columnNames = columns.map(c => c.name);
    const setClause = columnNames.map(col => `${col} = ?`).join(', ');
    const updateSQL = `UPDATE ads SET ${setClause}, updated_at = datetime('now') WHERE id = ?`;

    const values = columnNames.map(col => {
      switch(col) {
        case 'user_id': return body.user_id || null; case 'title': return body.title || '';
        case 'description': return body.description || ''; case 'target_url': return body.target_url || '';
        case 'placement': return body.placement || 'header'; case 'size': return body.size || '728x90';
        case 'ad_type': return body.ad_type || 'client'; case 'image_url': return body.image_url || '';
        case 'custom_html': return body.custom_html || ''; case 'price': return body.price || 0;
        case 'budget': return body.budget || 0; case 'client_name': return body.client_name || '';
        case 'client_company': return body.client_company || ''; case 'client_email': return body.client_email || '';
        case 'start_date': return body.start_date || ''; case 'end_date': return body.end_date || '';
        case 'max_impressions': return body.max_impressions || 10000; case 'max_clicks': return body.max_clicks || 1000;
        case 'target_country': return body.target_country || ''; case 'target_device': return body.target_device || '';
        case 'bg_color': return body.bg_color || '#3b82f6'; case 'text_color': return body.text_color || '#ffffff';
        case 'font_size': return body.font_size || 18; case 'animation': return body.animation || 'none';
        case 'status': return body.status || 'pending'; case 'impressions': return body.impressions || 0;
        case 'clicks': return body.clicks || 0; case 'target_city': return body.target_city || '';
        case 'target_state': return body.target_state || ''; case 'target_address': return body.target_address || '';
        case 'target_locations': return targetLocations; case 'geo_type': return body.geo_type || 'all';
        case 'target_street': return body.target_street || ''; case 'target_radius': return body.target_radius || 0;
        case 'target_lat': return body.target_lat || 0; case 'target_lng': return body.target_lng || 0;
        default: return '';
      }
    });

    db.prepare(updateSQL).run(...values, id);
    db.close();
    return NextResponse.json({ success: true, message: "Ad updated" });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
