const STATIC_CACHE_NAME = 'site-static-v1.1.3';
const DYNAMIC_CACHE_NAME = 'site-dynamic-v1.1.2';
const CACHE_FILES = [
    '/images/Personal.svg',
    '/images/best.svg',
    '/images/000000.svg',
    '/images/9F522A.svg',
    '/images/46BD54.svg',
    '/images/251304.svg',
    '/images/733519.svg',
    '/images/C7D751.svg',
    '/images/C08337.svg',
    '/images/D3A940.svg',
    '/images/EAD649.svg',
    '/images/FFFFFF.svg',
    '/',
    '/map',
    '/offline',
    '/manifest.json',
    '/css/main.min.css',
    '/js/modules/renderElement.js',
    '/images/ListButton.svg',
    '/images/search.svg',
    '/images/powerplant.svg',
    '/images/refinery.svg',
    '/images/right-arrow.svg',
    '/images/solar-panel.svg',
    '/images/wind-power.scg',
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
