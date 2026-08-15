// C:\Users\AamirAli\Desktop\Final-centers\lib\seo\security-headers.ts
// 🆕 NEW: Centralized security header configuration

export interface SecurityHeaders {
  key: string;
  value: string;
}

/**
 * Comprehensive security headers for Next.js
 * 
 * WHY THESE HEADERS?
 * - X-Frame-Options: Prevents clickjacking
 * - X-Content-Type-Options: Prevents MIME sniffing
 * - X-XSS-Protection: Extra XSS protection for older browsers
 * - Referrer-Policy: Controls referrer information
 * - Permissions-Policy: Restricts browser features
 * - Content-Security-Policy: Prevents XSS and data injection
 */
export const securityHeaders: SecurityHeaders[] = [
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'geolocation=(), camera=(), microphone=(), payment=(), usb=(), interest-cohort=()',
  },
];

/**
 * Content Security Policy - Tiered approach
 * 
 * LEVEL 1 (STRICT): Default - Most secure
 * LEVEL 2 (MODERATE): Allows Google Analytics
 * LEVEL 3 (PERMISSIVE): For tools needing eval
 */
export function getCSPPolicy(level: 'strict' | 'moderate' | 'permissive' = 'moderate'): string {
  const basePolicies = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self'",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
  ];

  switch (level) {
    case 'strict':
      return basePolicies.join('; ');
    
    case 'moderate':
      return [
        ...basePolicies,
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
        "connect-src 'self' https://www.google-analytics.com https://analytics.google.com",
        "img-src 'self' data: https: https://www.google-analytics.com",
      ].join('; ');
    
    case 'permissive':
      return [
        ...basePolicies,
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
        "connect-src 'self' https:",
        "img-src 'self' data: https:",
      ].join('; ');
  }
}

/**
 * Cache headers for static assets
 */
export const cacheHeaders: SecurityHeaders[] = [
  {
    key: 'Cache-Control',
    value: 'public, max-age=31536000, immutable',
  },
];

/**
 * Generate all headers for Next.js config
 */
export function getAllHeaders(env: 'development' | 'production' = 'production'): SecurityHeaders[] {
  const headers = [...securityHeaders];
  
  // Add CSP
  headers.push({
    key: 'Content-Security-Policy',
    value: getCSPPolicy(env === 'production' ? 'moderate' : 'strict'),
  });
  
  // Add HSTS in production
  if (env === 'production') {
    headers.push({
      key: 'Strict-Transport-Security',
      value: 'max-age=63072000; includeSubDomains; preload',
    });
  }
  
  return headers;
}