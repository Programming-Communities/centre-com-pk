import { NextRequest, NextResponse } from "next/server";
import { getLocalDB, getUserIdFromRequest } from "@/lib/db/local-db";

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const db = getLocalDB();
    const body = await request.json();
    
    if (request.url.includes("/save")) {
      const { id, data } = body;
      if (id) {
        db.prepare("UPDATE cv_resumes SET data=?, updated_at=datetime('now') WHERE id=? AND user_id=?").run(JSON.stringify(data), id, userId);
        return NextResponse.json({ success: true, id });
      } else {
        const result = db.prepare("INSERT INTO cv_resumes (user_id, data) VALUES (?,?)").run(userId, JSON.stringify(data));
        return NextResponse.json({ success: true, id: result.lastInsertRowid });
      }
    }
    
    if (request.url.includes("/delete")) {
      db.prepare("DELETE FROM cv_resumes WHERE id=? AND user_id=?").run(body.id, userId);
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ error: "Unknown" }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const db = getLocalDB();
    
    if (request.url.includes("/list")) {
      const resumes = db.prepare("SELECT id, updated_at FROM cv_resumes WHERE user_id=? ORDER BY updated_at DESC").all(userId);
      return NextResponse.json({ resumes });
    }
    
    if (request.url.includes("/load")) {
      const id = new URL(request.url).searchParams.get("id");
      const resume = db.prepare("SELECT * FROM cv_resumes WHERE id=? AND user_id=?").get(id, userId);
      return NextResponse.json({ resume });
    }
    
    return NextResponse.json({ error: "Unknown" }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
