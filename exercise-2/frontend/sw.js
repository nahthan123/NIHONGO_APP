const CACHE_NAME = 'nihongo-cache-v9';
const ASSETS = [
	'./',
	'./index.html',
	'./styles.css',
	'./app.js',
	'./admin.html',
	'./admin.css',
	'./admin.js',
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
	// Do not cache API requests
	if (request.url.includes('/api/')) return;

	event.respondWith(
		fetch(request).then((response) => {
			const copy = response.clone();
			caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
			return response;
		}).catch(() => caches.match(request))
	);
});
