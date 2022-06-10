const STATIC_CACHE_NAME = 'site-static-v1.0.20';
const DYNAMIC_CACHE_NAME = 'site-dynamic-v1.0.18';
const CACHE_FILES = [
    '/',
    '/offline',
    '/manifest.json',
    '/css/main.min.css',
    '/js/modules/renderElement.js',
    '/js/sw-register.js',
    '/socket.io/socket.io.js',
    '/images/icons/Icon-72x72.png',
    '/images/icons/Icon-92x92.png',
    '/images/icons/Icon-96x96.png',
    '/images/icons/Icon-128x128.png',
    '/images/icons/Icon-144x144.png',
    '/images/icons/Icon-152x152.png',
    '/images/icons/Icon-192x192.png',
    '/images/icons/Icon-384x384.png',
    '/images/icons/Icon-512x512.png',
];

// Install service worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME).then((cache) => {
            console.log('caching shell assets');
            cache.addAll(CACHE_FILES);
        }),
    );
});

// Activate service worker
self.addEventListener('activate', (event) => {
    // console.log('Service worker has been activated');
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys
                    .filter((key) => key !== STATIC_CACHE_NAME && key !== DYNAMIC_CACHE_NAME)
                    .map((key) => caches.delete(key)),
            );
        }),
    );
});

// Fetch event
self.addEventListener('fetch', (event) => {
    if (event.request.mode !== 'navigate') return;
    console.log('fetching event');
    event.respondWith(
        caches
            .match(event.request)
            .then((cache) => {
                return (
                    cache ||
                    fetch(event.request).then((fetchRes) => {
                        return caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
                            cache.put(event.request.url, fetchRes.clone());
                            return fetchRes;
                        });
                    })
                );
            })
            .catch(() => {
                cache.match('/offline');
            }),
    );
});
