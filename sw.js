/* ==========================================================================
   MATETIC - Service Worker Offline-First
   Archivo: sw.js
   Deriva el nombre del caché automáticamente de js/version.js y la lista de
   recursos de js/precache-manifest.js.
   ========================================================================== */

importScripts('js/version.js', 'js/precache-manifest.js');

const VERSION_INFO = self.MatInteractivaVersion || {};
const CACHE_PREFIX = `${String(VERSION_INFO.APP_NAME || 'MateTic').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-`;
const CACHE_NAME = typeof VERSION_INFO.getCacheName === 'function'
  ? VERSION_INFO.getCacheName()
  : `${CACHE_PREFIX}v${VERSION_INFO.APP_VERSION || '0.0.0'}`;
const PRECACHE_ASSETS = Array.isArray(self.MATETIC_PRECACHE_ASSETS)
  ? self.MATETIC_PRECACHE_ASSETS
  : ['./', 'index.html'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
      .catch((err) => caches.delete(CACHE_NAME).then(() => { throw err; }))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

function isCacheableSameOriginResponse(res) {
  return Boolean(res && res.ok && res.status === 200 && res.type === 'basic');
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const reqUrl = new URL(event.request.url);
  if (reqUrl.origin !== self.location.origin) return;

  const isStaticVendorOrFont =
    reqUrl.pathname.includes('/vendor/') ||
    reqUrl.pathname.includes('/icons/') ||
    reqUrl.pathname.endsWith('.woff2');

  if (isStaticVendorOrFont) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request)
          .then((networkRes) => {
            if (isCacheableSameOriginResponse(networkRes)) {
              const copy = networkRes.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
            }
            return networkRes;
          })
          .catch(() =>
            new Response('Recurso estático no disponible sin conexión.', {
              status: 503,
              statusText: 'Offline',
              headers: { 'Content-Type': 'text/plain; charset=utf-8' }
            })
          );
      })
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkRes) => {
        if (isCacheableSameOriginResponse(networkRes)) {
          const copy = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return networkRes;
      })
      .catch(async () => {
        const cached = await caches.match(event.request);
        if (cached) return cached;
        if (event.request.mode === 'navigate') {
          const shell = (await caches.match('./')) || (await caches.match('index.html'));
          if (shell) return shell;
        }
        return new Response('Recurso no disponible sin conexión.', {
          status: 503,
          statusText: 'Offline',
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      })
  );
});
