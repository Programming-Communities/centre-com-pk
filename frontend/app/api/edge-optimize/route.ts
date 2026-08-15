// C:\Users\AamirAli\Desktop\Final-centers\app\api\edge-optimize\route.ts
import { NextRequest, NextResponse } from 'next/server';


export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;
  const searchParams = url.searchParams;
  
  // Get geo info from Cloudflare headers
  const country = request.headers.get('cf-ipcountry') || 'unknown';
  const region = request.headers.get('cf-region') || 'auto';
  const city = request.headers.get('cf-city') || 'unknown';
  
  // Performance data
  const performanceData = {
    timestamp: new Date().toISOString(),
    region,
    country,
    city,
    pathname,
    queryParams: Object.fromEntries(searchParams),
    edge: true,
    cacheStrategy: 'stale-while-revalidate',
    ttl: 3600,
    swr: 7200,
  };
  
  // Cache headers for edge
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=3600',
    'X-Edge-Region': region,
    'X-Edge-Country': country,
    'X-Edge-City': city,
    'Access-Control-Allow-Origin': '*',
  });
  
  return new NextResponse(JSON.stringify(performanceData, null, 2), {
    status: 200,
    headers,
  });
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
