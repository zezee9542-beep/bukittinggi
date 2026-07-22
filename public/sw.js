const CACHE_NAME = 'heritage-hub-cache-v1';

// Static assets to pre-cache immediately
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/textured.glb',
  '/favicon.svg',
  '/ikonweb.webp'
];

// Install Event - Pre-cache core shell & 3D model
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Pre-cache warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Smart Cache First Strategy for Media & Models, Stale-While-Revalidate for Scripts/Styles
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests or browser extension requests
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // 1. Cache-First Strategy for Images, 3D Models, Media, and Fonts
  const isStaticMedia =
    request.destination === 'image' ||
    request.destination === 'font' ||
    request.destination === 'media' ||
    url.pathname.endsWith('.glb') ||
    url.pathname.endsWith('.webp') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.jpeg') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.mp3');

  if (isStaticMedia) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            // Return cached asset instantly (0 ms delay!)
            return cachedResponse;
          }
          // Fetch from network and update cache in background
          return fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
            // Offline fallback
            return cachedResponse || new Response('Offline', { status: 503, statusText: 'Offline' });
          });
        });
      })
    );
    return;
  }

  // 2. Stale-While-Revalidate Strategy for HTML, JS, CSS
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      });
    })
  );
});
