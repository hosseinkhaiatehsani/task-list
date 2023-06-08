const CACHE_NAME = 'to-do-list-v1';

const PRECACHE_URLS = [
    'index.html', // Add the URL of your app's homepage
    './assets/css/styles.css',
    './assets/js/app.js',
    "./assets/images/logo-large.png"
    // Add other essential assets to be precached
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
        return cache.addAll(PRECACHE_URLS);
        })
    );
});
  
self.addEventListener('fetch', function(event) {
    // Check if the requested resource is available in cache
    event.respondWith(
      caches.match(event.request).then(function(response) {
        if (response) {
          return response;
        }
  
        // If the user is offline, return the custom offline page
        if (!navigator.onLine) {
          return caches.match('/offline.html');
        }
  
        // If the requested resource is not in cache and the user is online, fetch it from the network
        return fetch(event.request).then(function(response) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, responseClone);
          });
  
          return response;
        });
      })
    );
});