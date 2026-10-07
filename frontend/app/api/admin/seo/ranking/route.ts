import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from '@/lib/admin/requireAdmin';

export async function GET(request: NextRequest) {
  const admin = requireAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return NextResponse.json({ rankings: [], avgPosition: 0, trend: "stable" });
}

export async function POST(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { action } = await req.json();
  if (action === "update-rankings") {
    return NextResponse.json({ success: true, updated: 53, date: new Date().toISOString().split('T')[0] });
  }
  return NextResponse.json({ success: true });
}
