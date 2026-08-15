// lib/performance/lighthouse-config.ts
// Configuration for optimal Lighthouse scores

export const lighthouseConfig = {
  // ✅ Performance Targets
  targets: {
    FCP: '0.4s',    // First Contentful Paint
    LCP: '2.0s',    // Largest Contentful Paint  
    TBT: '0ms',     // Total Blocking Time
    CLS: '0',       // Cumulative Layout Shift
    SI: '0.4s',     // Speed Index
  },
  
  // ✅ Optimization Checklist
  checklist: [
    '✓ Use next/image for all images',
    '✓ Dynamic imports for heavy components',
    '✓ Preload critical fonts (woff2)',
    '✓ Inline critical CSS (<style> in <head>)',
    '✓ Defer non-critical JavaScript',
    '✓ Cache static assets (immutable)',
    '✓ Enable compression (gzip/brotli)',
    '✓ Remove unused CSS/JS',
    '✓ Use CDN for static assets',
    '✓ Minimize main-thread work',
    '✓ Avoid layout shifts (set dimensions)',
    '✓ Use efficient cache policies',
  ],
};
