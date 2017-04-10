const CACHE_NAME = 'ruuvi_weather_station_v1';

const urlsToCache = [
    '/',
    '/sw.js',
    '/webmanifest.json',
    '/css/ruu-vi-styles.css',
    '/js/base64.js',
    '/js/respond.js',
    '/images/bg.jpg',
    '/images/bg-m.jpg',
    '/images/eye_128x128.png',
    '/images/eye_144x144.png',
    '/images/eye_152x152.png',
    '/images/eye_192x192.png',
    '/images/favicon.ico',
    '/svg/ruuvi-logo.svg',
    '/svg/icon-temperature.svg',
    '/svg/icon-humidity.svg',
    '/svg/icon-air-pressure.svg',
];

// Perform install steps
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(urlsToCache);
            })
    )
});

// Use network-first strategy for cache
self.addEventListener('fetch', function(event) {
    event.respondWith(
        fetch(event.request).catch(function() {
            return caches.match(event.request);
        })
    );
});

