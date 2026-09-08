const fs = require('fs');

// 1. Update sw.js for Network-First
['sw.js', 'exercise-1/frontend/sw.js', 'exercise-2/frontend/sw.js'].forEach(f => {
    if (!fs.existsSync(f)) return;
    let content = fs.readFileSync(f, 'utf8');
    
    // Bump cache name so it updates
    content = content.replace(/nihongo-cache-v\d+/, 'nihongo-cache-v5');
    
    // Replace fetch logic with Network-First
    const newFetch = `self.addEventListener('fetch', (event) => {
\tconst { request } = event;
\tif (request.method !== 'GET') return;
\tevent.respondWith(
\t\tfetch(request).then((response) => {
\t\t\tconst copy = response.clone();
\t\t\tcaches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
\t\t\treturn response;
\t\t}).catch(() => caches.match(request))
\t);
});`;
    
    content = content.replace(/self\.addEventListener\('fetch', [\s\S]*\}\);/, newFetch);
    fs.writeFileSync(f, content, 'utf8');
});

// 2. Update app.js for auto-reload on update
const newRegistration = `if ('serviceWorker' in navigator) {
\t\tnavigator.serviceWorker.register('./sw.js').then(reg => {
\t\t\treg.addEventListener('updatefound', () => {
\t\t\t\tconst newWorker = reg.installing;
\t\t\t\tnewWorker.addEventListener('statechange', () => {
\t\t\t\t\tif (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
\t\t\t\t\t\twindow.location.reload(true);
\t\t\t\t\t}
\t\t\t\t});
\t\t\t});
\t\t}).catch(() => {});
\t}`;

['app.js', 'exercise-1/frontend/app.js', 'exercise-2/frontend/app.js'].forEach(f => {
    if (!fs.existsSync(f)) return;
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/if \('serviceWorker' in navigator\).*/, newRegistration);
    fs.writeFileSync(f, content, 'utf8');
});