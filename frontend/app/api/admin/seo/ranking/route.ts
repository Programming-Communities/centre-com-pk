import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ rankings: [], avgPosition: 0, trend: "stable" });
}

export async function POST(req: NextRequest) {
  const { action } = await req.json();
  if (action === "update-rankings") {
    return NextResponse.json({ success: true, updated: 53, date: new Date().toISOString().split('T')[0] });
  }
  return NextResponse.json({ success: true });
}
