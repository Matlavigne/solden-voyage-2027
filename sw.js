// Service worker généré par html2pwa.py
// Changez CACHE à chaque mise à jour pour forcer l'actualisation chez les utilisateurs.
const CACHE = 'solden-2027-voyage-de-ski-ffbd52cf';
const CORE = ['./', 'index.html', 'manifest.webmanifest',
              'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png',
              'voyage.json', 'hero.webp', 'installer.html'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('solden-2027-voyage-de-ski-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Page : réseau d'abord (contenu à jour), cache si hors ligne.
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(r => {
      const copy = r.clone(); caches.open(CACHE).then(c => c.put('index.html', copy)); return r;
    }).catch(() => caches.match('index.html')));
    return;
  }

  // Données JSON du même site (ex. voyage.json) : réseau d'abord pour voir les modifications, cache si hors ligne.
  if (url.origin === location.origin && url.pathname.endsWith('.json')) {
    e.respondWith(fetch(req, {cache: 'no-store'}).then(r => {
      if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(url.pathname, copy)); }
      return r;
    }).catch(() => caches.match(url.pathname)));
    return;
  }

  // Fichiers du même site : cache d'abord, puis réseau.
  if (url.origin === location.origin) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
      if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return r;
    })));
    return;
  }

  // Images externes : mises en cache au premier affichage (best effort).
  if (req.destination === 'image') {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
      const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return r;
    }).catch(() => hit)));
  }
  // Le reste (cartes en iframe, API) passe directement au réseau.
});
