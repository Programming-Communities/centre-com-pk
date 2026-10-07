import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from '@/lib/admin/requireAdmin';
import Database from "better-sqlite3";
import path from "path";

function getDB() {
  const dbPath = path.join(process.cwd(), "data", "centers-local.db");
  return new Database(dbPath);
}

// GET — List all pending/approved ads
export async function GET(request: NextRequest) {
  const admin = requireAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const db = getDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "pending";
    const user_id = searchParams.get("user_id");

    let query = "SELECT * FROM ads";
    const params: any[] = [];

    if (user_id) {
      query += " WHERE user_id = ?";
      params.push(user_id);
    } else {
      query += " WHERE status = ?";
      params.push(status);
    }

    query += " ORDER BY created_at DESC";

    const ads = db.prepare(query).all(...params);
    db.close();

    return NextResponse.json({ success: true, ads });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

// PUT — Approve/Reject ad
export async function PUT(request: NextRequest) {
  const admin = requireAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const db = getDB();
    const body = await request.json();
    const { id, status, admin_notes } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Ad ID required" }, { status: 400 });
    }

    const stmt = db.prepare(`
      UPDATE ads SET status = ?, updated_at = datetime('now')
      WHERE id = ?
    `);

    stmt.run(status || 'pending', id);
    db.close();

    return NextResponse.json({ 
      success: true, 
      message: `Ad ${status === 'approved' ? 'approved' : 'rejected'} successfully` 
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
