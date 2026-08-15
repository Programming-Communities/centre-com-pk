// lib/performance/cache-optimizer.ts
// Service Worker Registration for offline caching

export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then(
        (registration) => console.log('SW registered:', registration.scope),
        (err) => console.log('SW registration failed:', err)
      );
    });
  }
}

// Cache-first strategy for static assets
// sw.js should cache:
// - /_next/static/* (JS/CSS bundles)
// - /fonts/* (Font files)
// - /og-images/* (OG images)
// - /api/og-image?* (Generated OG images)
