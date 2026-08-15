import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";
import path from "path";
const DB_PATH = path.join(process.cwd(), "data", "centers-local.db");

export async function GET() {
  const db = new Database(DB_PATH);
  try {
    const affiliates = db.prepare("SELECT a.*, u.name as user_name FROM affiliates a LEFT JOIN users u ON a.user_id=u.id").all();
    return NextResponse.json({ affiliates });
  } catch (e: any) {
    return NextResponse.json({ affiliates: [] });
  }
}
