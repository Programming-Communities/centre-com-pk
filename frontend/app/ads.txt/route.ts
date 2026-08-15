import { NextResponse } from 'next/server';

export async function GET() {
  const content = `google.com, pub-2850749507378090, DIRECT, f08c47fec0942fa0`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
