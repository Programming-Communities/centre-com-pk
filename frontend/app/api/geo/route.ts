import { NextRequest, NextResponse } from 'next/server';
import { detectUserLocation, GeoLocation } from '@/lib/geo/geoService';

export async function GET(request: NextRequest) {
  try {
    // Get user IP from headers
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : '127.0.0.1';

    // Detect location
    const location = await detectUserLocation();

    return NextResponse.json({
      success: true,
      location: {
        ...location,
        ip,
        detected: location.ip !== 'browser' ? 'ip' : 'browser',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
