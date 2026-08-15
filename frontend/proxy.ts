import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // ✅ Fix double language prefix
  if (pathname.match(/^\/(en|ur|hi|ar)\/(en|ur|hi|ar)\//)) {
    const newPath = pathname.replace(/^\/(en|ur|hi|ar)\/(en|ur|hi|ar)\//, '/$2/');
    const url = request.nextUrl.clone();
    url.pathname = newPath;
    return NextResponse.redirect(url);
  }
  
  // ✅ ENGLISH DEFAULT — rewrite /tools, /blog, etc. to /en/... internally
  if (pathname.startsWith('/tools') || 
      pathname.startsWith('/blog') || 
      pathname.startsWith('/about') ||
      pathname.startsWith('/contact') ||
      pathname.startsWith('/privacy-policy') ||
      pathname.startsWith('/terms') ||
      pathname.startsWith('/pricing') ||
      pathname.startsWith('/search') ||
      pathname.startsWith('/tutorial') ||
      pathname.startsWith('/auth') ||
      pathname.startsWith('/admin') ||
      pathname.startsWith('/dashboard')) {
    
    const url = request.nextUrl.clone();
    url.pathname = `/en${pathname}`;
    return NextResponse.rewrite(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/:lang(en|ur|hi|ar)/:lang(en|ur|hi|ar)/:path*',
    '/tools/:path*',
    '/blog/:path*',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms',
    '/pricing',
    '/search',
    '/tutorial',
    '/auth/:path*',
    '/admin/:path*',
    '/dashboard/:path*',
  ],
};