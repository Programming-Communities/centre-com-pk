// app/api/ads/sponsor/route.ts
import { NextResponse } from 'next/server';

// ✅ MUST HAVE - Edge Runtime

export async function POST(request: Request) {
  // ✅ ADS DISABLED - Return disabled message
  return NextResponse.json({
    success: false,
    message: 'Ads are currently disabled',
    disabled: true
  }, { status: 403 });
}

export async function GET() {
  // ✅ ADS DISABLED
  return NextResponse.json({
    success: false,
    message: 'Ads API is disabled',
    disabled: true
  });
}