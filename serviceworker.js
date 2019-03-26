var CACHE_NAME = 'quiz-web-1';

var urlsToCache = [
    '/',
    '/js/index.js',
    '/js/main.js',
    '/css/style.css',
    '/scss/style.css',
    '/manifest.json',
    '/fallback.json'
];

// install cache on browser
self.addEventListener('install', function (event) {
    // do install
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                // cek apakah cache sudah terinstall
                console.log("service worker do install..");
                return cache.addAll(urlsToCache);
            }
        )
    )
});

// aktivasi sw
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                // jika sudah ada cache dgn versi beda maka di hapus
                cacheNames.filter(function (cacheName) {
                    return cacheName !== CACHE_NAME;
                }).map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

// fetch cache
self.addEventListener('fetch', function (event) {
    var request = event.request;
    var url = new URL(request.url);

    /*
    * menggunakan data local cache
    * */
    if (url.origin === location.origin){
        event.respondWith(
            caches.match(request).then(function (response) {
                // jika ada data di cache maka tampilkan data cache, jika tidak maka petch request
                return response || fetch(request);
            })
        )
    } else{
        // internet API
        event.respondWith(
            caches.open('quiz-web-1').then(function (cache) {
                return fetch(request).then(function (liveRequest) {
                    cache.put(request, liveRequest.clone());
                    // save cache to mahasiswa-cache-v1
                    return liveRequest;
                }).catch(function () {
                    return caches.match(request).then(function (response) {
                        if (response) return response;
                        return caches.match('/fallback.json');
                    })
                })
            })
        )
    }
});