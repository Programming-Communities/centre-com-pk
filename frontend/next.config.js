/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'date-fns',
      'lodash',
    ],
    turbopack: {
      root: __dirname,
    },
  },

  turbopack: {},

  async headers() {
    return [
      {
        source: '/_next/static/css/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400' },
          { key: 'CDN-Cache-Control', value: 'public, max-age=7200' },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: '/',
        destination: '/en',
      },
      {
        source: '/tools/:path*',
        destination: '/en/tools/:path*',
      },
      {
        source: '/blog/:path*',
        destination: '/en/blog/:path*',
      },
      {
        source: '/about',
        destination: '/en/about',
      },
      {
        source: '/contact',
        destination: '/en/contact',
      },
      {
        source: '/privacy-policy',
        destination: '/en/privacy-policy',
      },
      {
        source: '/terms',
        destination: '/en/terms',
      },
      {
        source: '/pricing',
        destination: '/en/pricing',
      },
      {
        source: '/search',
        destination: '/en/search',
      },
      {
        source: '/tutorial',
        destination: '/en/tutorial',
      },
      {
        source: '/auth/:path*',
        destination: '/en/auth/:path*',
      },
      {
        source: '/admin/:path*',
        destination: '/en/admin/:path*',
      },
      {
        source: '/dashboard/:path*',
        destination: '/en/dashboard/:path*',
      },
      { source: '/:path*.sql', destination: '/_blocked' },
      { source: '/:path*.sql.gz', destination: '/_blocked' },
      { source: '/:path*.db', destination: '/_blocked' },
      { source: '/:path*.env', destination: '/_blocked' },
      { source: '/:path*.backup', destination: '/_blocked' },
    ];
  },

  async redirects() {
    return [
      { source: '/en', destination: '/', permanent: true },
      { source: '/en/:path*', destination: '/:path*', permanent: true },
      
      {
        source: '/',
        has: [{ type: 'host', value: 'centre.com.pk' }],
        destination: 'https://www.centre.com.pk',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'centre.com.pk' }],
        destination: 'https://www.centre.com.pk/:path*',
        permanent: true,
      },
      
      {
        source: '/:lang(ur|hi|ar)/:path*',
        has: [{ type: 'host', value: 'centre.com.pk' }],
        destination: 'https://www.centre.com.pk/:lang/:path*',
        permanent: true,
      },
      
      { source: '/ur/ur/:path*', destination: '/ur/:path*', permanent: true },
      { source: '/hi/hi/:path*', destination: '/hi/:path*', permanent: true },
      { source: '/ar/ar/:path*', destination: '/ar/:path*', permanent: true },
      
      {
        source: '/sitemap-:lang.xml',
        has: [{ type: 'host', value: 'centre.com.pk' }],
        destination: 'https://www.centre.com.pk/sitemap.xml',
        permanent: true,
      },
      { source: '/sitemap-:lang.xml/:path*', destination: '/sitemap.xml', permanent: true },
    ];
  },
};

module.exports = nextConfig;