export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { getLocalDB } from "@/lib/db/local-db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    if (!username || username.length < 3) {
      return NextResponse.json({ available: false });
    }

    const db = getLocalDB();
    const existing = db.prepare("SELECT id FROM users WHERE username = ?").get(username);
    return NextResponse.json({ available: !existing });
  } catch (error) {
    return NextResponse.json({ available: false, error: "Service error" });
  }
}
