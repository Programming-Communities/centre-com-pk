import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";
import path from "path";
import { submitToIndexNow } from '@/lib/seo/indexnow';

const DB_PATH = path.join(process.cwd(), "data", "centers-local.db");

export async function GET() {
  try {
    const db = new Database(DB_PATH);
    const tools = db.prepare("SELECT * FROM tools ORDER BY category, name").all();
    return NextResponse.json({ tools });
  } catch (e: any) {
    return NextResponse.json({ tools: [], error: e.message });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;
    const db = new Database(DB_PATH);

    if (action === "add") {
      const { slug, category, name, icon, content } = body;
      if (!slug || !category || !name) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

      const existing = db.prepare("SELECT id FROM tools WHERE slug=?").get(slug);
      if (existing) return NextResponse.json({ error: "Tool slug already exists" }, { status: 409 });

      const r = db.prepare("INSERT INTO tools (slug, category, name, icon) VALUES (?,?,?,?)").run(slug, category, name, icon || "🔧");
      const toolId = r.lastInsertRowid;

      if (content) {
        for (const lang of ["en", "ur", "hi", "ar"]) {
          const c = content[lang] || {};
          db.prepare("INSERT INTO tool_content (tool_id, lang, title, description, seo_title, seo_description, seo_keywords) VALUES (?,?,?,?,?,?,?)")
            .run(toolId, lang, c.title || "", c.description || "", c.seo_title || "", c.seo_description || "", c.seo_keywords || "");
        }
      }

      // ✅ INDEXNOW AUTO-SUBMIT
      const toolUrl = `https://www.centre.com.pk/tools/${category}/${slug}`;
      await submitToIndexNow(toolUrl);

      return NextResponse.json({ success: true, id: toolId, indexed: true });
    }

    if (action === "delete") {
      db.prepare("DELETE FROM tools WHERE id=?").run(body.id);
      return NextResponse.json({ success: true });
    }

    if (action === "toggle") {
      db.prepare("UPDATE tools SET status=? WHERE id=?").run(body.status, body.id);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}