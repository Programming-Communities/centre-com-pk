import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { adSpaceId, duration, companyName, contactEmail } = body;

  // In production: process payment, save to DB, notify admin
  return NextResponse.json({
    success: true,
    message: "Ad purchase request received! We'll contact you at " + contactEmail,
    reference: "AD-" + Date.now()
  });
}
