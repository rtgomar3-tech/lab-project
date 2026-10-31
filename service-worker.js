const CACHE_NAME = 'smart-lab-v1';
const ASSETS = [
  './index.html',
  './patient.html',
  './results.html',
  './css/style.css',
  './js/main.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request)));
});