// public/sw.js - OPTIMIZED VERSION
const CACHE_NAME = 'centre-com-pk-v1';
const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v2';

// Critical assets for 150ms first load
const CRITICAL_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/icon.svg',
];

// Static assets to cache
const STATIC_ASSETS = [
  '/_next/static/css/app/layout.css',
  '/_next/static/media/*.woff2',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(CRITICAL_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
          .map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip Chrome extensions
  if (url.protocol === 'chrome-extension:') return;
  
  // Skip analytics and external resources
  if (url.hostname.includes('google') || url.hostname.includes('gtag')) {
    return;
  }
  
  // Network-first for API calls
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/_next/data/')) {
    event.respondWith(networkFirst(request));
    return;
  }
  
  // Cache-first for static assets
  if (url.pathname.startsWith('/_next/static/') || 
      url.pathname.includes('.woff2') ||
      url.pathname.includes('.woff') ||
      url.pathname.includes('.ttf')) {
    event.respondWith(cacheFirst(request));
    return;
  }
  
  // Stale-while-revalidate for HTML pages
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }
  
  // Default: try cache, fallback to network
  event.respondWith(cacheWithNetworkFallback(request));
});

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || Response.error();
  }
}

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) return cachedResponse;
  
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(STATIC_CACHE);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    return Response.error();
  }
}

async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  // Always fetch in background
  const fetchPromise = fetch(request).then(async (networkResponse) => {
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => null);
  
  // Return cached response immediately, update in background
  return cachedResponse || fetchPromise;
}

async function cacheWithNetworkFallback(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) return cachedResponse;
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok && request.method === 'GET') {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return Response.error();
  }
}