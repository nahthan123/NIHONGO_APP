const CACHE_NAME = 'nihongo-cache-v2';
const ASSETS = [
	'./',
	'./index.html',
	'./styles.css',
	'./app.js',
	'./manifest.webmanifest',
];

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
	);
	self.skipWaiting();
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then((keys) =>
			Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : undefined)))
		)
	);
	self.clients.claim();
});

self.addEventListener('fetch', (event) => {
	const { request } = event;
	if (request.method !== 'GET') return;
	event.respondWith(
		caches.match(request).then((cached) =>
			cached || fetch(request).then((response) => {
				const copy = response.clone();
				caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
				return response;
			}).catch(() => cached)
		)
	);
});


