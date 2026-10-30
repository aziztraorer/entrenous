/// <reference lib="webworker" />
// Service worker (injectManifest strategy) — precache géré par workbox via vite-plugin-pwa
import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';

declare const self: ServiceWorkerGlobalScope;

precacheAndRoute((self as any).__WB_MANIFEST);
cleanupOutdatedCaches();

// Fallback navigation vers l'app shell
registerRoute(
  ({ request }) => request.mode === 'navigate',
  createHandlerBoundToURL('index.html'),
);

// PROMPT 10 : JAMAIS de cache sur l'API — messages privés, jetons de session,
// données de parties. Tout passe réseau, sans fallback hors-ligne.
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/') || url.pathname.startsWith('/socket.io/'),
  async ({ request }) => fetch(request),
);

self.addEventListener('message', (event) => {
  if ((event as any).data && (event as any).data.type === 'SKIP_WAITING') self.skipWaiting();
});
