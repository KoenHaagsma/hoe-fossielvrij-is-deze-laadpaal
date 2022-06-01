const CORE_CACHE_VERSION = 'core-v1';
const DYNAMIC_CACHE_VERSION = 'dynamic-v1';
const CACHE_FILES = ['/css/style.css', '/manifest.json', '/js/script.js', '/offline', '/'];

self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(CORE_CACHE_VERSION).then((cache) => cache.addAll(CACHE_FILES)));
    console.log('Serviceworker installed');
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys
                    .filter((key) => key !== CORE_CACHE_VERSION && key !== DYNAMIC_CACHE_VERSION)
                    .map((key) => caches.delete(key)),
            );
        }),
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches
            .match(event.request)
            .then((cacheRes) => {
                return (
                    cacheRes ||
                    fetch(event.request).then((fetchRes) => {
                        return caches.open(DYNAMIC_CACHE_VERSION).then((cache) => {
                            cache.put(event.request.url, fetchRes.clone());
                            return fetchRes;
                        });
                    })
                );
            })
            .catch(() => caches.match('/offline')),
    );
});
