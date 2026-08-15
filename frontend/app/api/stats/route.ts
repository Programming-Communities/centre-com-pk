// app/api/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCacheStats } from '@/lib/edge-cache';


export async function GET(request: NextRequest) {
  try {
    const stats = getCacheStats();
    
    const responseData = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      cache: {
        ...stats,
        edge: true,
      },
      requestInfo: {
        method: request.method,
        url: request.url,
        geo: {
          country: request.headers.get('cf-ipcountry') || 'unknown',
          region: request.headers.get('cf-region') || 'unknown',
          city: request.headers.get('cf-city') || 'unknown',
        },
        userAgent: request.headers.get('user-agent')?.substring(0, 100) || 'unknown',
      },
    };
    
    return new NextResponse(JSON.stringify(responseData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'X-Cache-Stats': 'true',
        'X-Edge-Runtime': 'true',
      },
    });
    
  } catch (error) {
    console.error('[Stats] Error:', error);
    
    return new NextResponse(
      JSON.stringify({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        edge: true,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'X-Edge-Error': 'true',
        },
      }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'X-Edge-Runtime': 'true',
    },
  });
}
