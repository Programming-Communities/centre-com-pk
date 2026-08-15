import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";
import path from "path";

function getDB() {
  const dbPath = path.join(process.cwd(), "data", "centers-local.db");
  return new Database(dbPath);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDB();
    const ad = db.prepare("SELECT * FROM ads WHERE id = ?").get(id);
    db.close();
    return NextResponse.json({ success: true, ad });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = getDB();

    const stmt = db.prepare(`
      UPDATE ads SET
        title = ?, description = ?, target_url = ?, placement = ?, size = ?, ad_type = ?,
        image_url = ?, custom_html = ?, price = ?, budget = ?, client_name = ?, client_company = ?,
        client_email = ?, start_date = ?, end_date = ?, max_impressions = ?, max_clicks = ?,
        target_country = ?, target_device = ?, bg_color = ?, text_color = ?, font_size = ?,
        animation = ?, status = ?, updated_at = datetime('now')
      WHERE id = ?
    `);

    stmt.run(
      body.title || '',
      body.description || '',
      body.target_url || '',
      body.placement || 'header',
      body.size || '728x90',
      body.ad_type || 'client',
      body.image_url || '',
      body.custom_html || '',
      body.price || 0,
      body.budget || 0,
      body.client_name || '',
      body.client_company || '',
      body.client_email || '',
      body.start_date || '',
      body.end_date || '',
      body.max_impressions || 10000,
      body.max_clicks || 1000,
      body.target_country || '',
      body.target_device || '',
      body.bg_color || '#3b82f6',
      body.text_color || '#ffffff',
      body.font_size || 18,
      body.animation || 'none',
      body.status || 'pending',
      id
    );

    db.close();
    return NextResponse.json({ success: true, message: "Ad updated" });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDB();
    db.prepare("DELETE FROM ads WHERE id = ?").run(id);
    db.close();
    return NextResponse.json({ success: true, message: "Ad deleted" });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
