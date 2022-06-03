const STATIC_CACHE_NAME = 'site-static-v1.0.2';
const DYNAMIC_CACHE_NAME = 'site-dynamic-v1.0.0';
const CACHE_FILES = [
    '/',
    '/manifest.json',
    '/css/main.min.css',
    '/js/script.js',
    '/js/modules/renderElement.js',
    '/js/sw-register.js',
    '/images/icons/Icon-72x72.png',
    '/images/icons/Icon-92x92.png',
    '/images/icons/Icon-96x96.png',
    '/images/icons/Icon-128x128.png',
    '/images/icons/Icon-144x144.png',
    '/images/icons/Icon-152x152.png',
    '/images/icons/Icon-192x192.png',
    '/images/icons/Icon-384x384.png',
    '/images/icons/Icon-512x512.png',
    'https://api.mapbox.com/mapbox-gl-js/v2.8.2/mapbox-gl.js',
    'https://api.mapbox.com/mapbox-gl-js/v2.8.2/mapbox-gl.css',
    'https://api.mapbox.com/styles/v1/mapbox/streets-v11?access_token=pk.eyJ1Ijoia29lbmhhYWdzbWEiLCJhIjoiY2wzbjNuY255MGF3ODNwbnl2amJuYms4MCJ9.QD5jhV_KLgBjGYcGOFnwTg',
    `http://localhost:1337/poles?lng=4.8205042&lat=52.4443048`,
];

// Install service worker
self.addEventListener('install', (event) => {
    // console.log('Service worker has been installed');
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
            // console.log(keys);
            return Promise.all(keys.filter((key) => key !== STATIC_CACHE_NAME).map((key) => caches.delete(key)));
        }),
    );
});

// Fetch event
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cache) => {
            return (
                cache ||
                fetch(event.request).then((fetchRes) => {
                    return caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
                        cache.put(event.request.url, fetchRes.clone());
                        return fetchRes;
                    });
                })
            );
        }),
    );
});
