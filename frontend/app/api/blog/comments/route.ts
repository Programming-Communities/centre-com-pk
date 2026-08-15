import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';
import { cookies } from 'next/headers';

const DB_PATH = path.join(process.cwd(), 'data', 'centers-local.db');

// GET: Fetch comments for a post
export async function GET(req: NextRequest) {
  const db = new Database(DB_PATH);
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('postId');
    const parentId = searchParams.get('parentId') || null;
    
    if (!postId) {
      return NextResponse.json({ success: false, error: "postId required" }, { status: 400 });
    }
    
    let query = "SELECT * FROM comments WHERE post_id = ?";
    const params: any[] = [postId];
    
    if (parentId) {
      query += " AND parent_id = ?";
      params.push(parentId);
    } else {
      query += " AND parent_id IS NULL";
    }
    
    query += " AND status = 'approved' ORDER BY created_at DESC";
    
    const comments = db.prepare(query).all(...params);
    
    // Fetch user info for each comment
    const enriched = (comments as any[]).map((c: any) => {
      const user = db.prepare("SELECT id, name, avatar FROM users WHERE id = ?").get(c.user_id);
      return { ...c, user };
    });
    
    return NextResponse.json({ success: true, comments: enriched });
  } catch (e: any) {
    console.error('GET comments error:', e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  } finally {
    db.close();
  }
}

// POST: Create a new comment
export async function POST(req: NextRequest) {
  const db = new Database(DB_PATH);
  try {
    const body = await req.json();
    const { postId, content, parentId, name, email, userId } = body;
    
    if (!postId || !content) {
      return NextResponse.json({ success: false, error: "postId and content required" }, { status: 400 });
    }
    
    // Check if user is logged in
    let finalUserId = userId;
    let commenterName = name;
    let commenterEmail = email;
    
    if (!finalUserId) {
      // Guest comment — require name and email
      if (!name || !email) {
        return NextResponse.json({ success: false, error: "Name and email required for guests" }, { status: 400 });
      }
      // Create temp user or just store name/email in comment
      const stmt = db.prepare(`
        INSERT INTO comments (post_id, user_id, parent_id, content, status, guest_name, guest_email, created_at, updated_at)
        VALUES (?, ?, ?, ?, 'pending', ?, ?, ?, ?)
      `);
      const now = new Date().toISOString();
      stmt.run(postId, null, parentId || null, content, name, email, now, now);
    } else {
      // Registered user
      const stmt = db.prepare(`
        INSERT INTO comments (post_id, user_id, parent_id, content, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, 'approved', ?, ?)
      `);
      const now = new Date().toISOString();
      stmt.run(postId, finalUserId, parentId || null, content, now, now);
    }
    
    const result = db.prepare("SELECT last_insert_rowid() as id").get();
    return NextResponse.json({ success: true, id: (result as any).id });
  } catch (e: any) {
    console.error('POST comment error:', e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  } finally {
    db.close();
  }
}

// PUT: Update comment status (admin only)
export async function PUT(req: NextRequest) {
  const db = new Database(DB_PATH);
  try {
    const body = await req.json();
    const { id, status } = body;
    
    if (!id || !status) {
      return NextResponse.json({ success: false, error: "id and status required" }, { status: 400 });
    }
    
    db.prepare("UPDATE comments SET status = ?, updated_at = ? WHERE id = ?").run(
      status, new Date().toISOString(), id
    );
    
    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('PUT comment error:', e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  } finally {
    db.close();
  }
}

// DELETE: Delete a comment (admin only)
export async function DELETE(req: NextRequest) {
  const db = new Database(DB_PATH);
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ success: false, error: "id required" }, { status: 400 });
    }
    
    db.prepare("DELETE FROM comments WHERE id = ?").run(id);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('DELETE comment error:', e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  } finally {
    db.close();
  }
}
