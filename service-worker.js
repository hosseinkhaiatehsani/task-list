let cacheName = "ToDoList";
let filesToCache = ["/", "./assets/images/logo-large.png", "./assets/css/styles.css", "./assets/js/app.js"];

const OFFLINE_URL = `index.html`;
const CACHE_NAME = 'ToDoList';
const HOST = self.location.host;
const PROTOCOL = self.location.protocol;
// const REGEX = `${PROTOCOL}//${HOST}/assets/.*|${PROTOCOL}//${HOST}/assets/logo-large.png`;

// to import other service workers
// importScripts("./");

self.addEventListener('install', function(e) {
    e.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);
        await cache.addAll(filesToCache);
      })());
      self.skipWaiting();
});

self.addEventListener("activate", event => {
    // when this SW becomes activated, we claim all the opened clients
    // they can be standalone PWA windows or browser tabs
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', function(e) {

    e.request.mode === "navigate" && 
    e.respondWith(
        Promise.resolve(e.preloadResponse)
        .then((response => response || fetch(e.request)))
        .catch((
                ()=>caches.open(CACHE_NAME)
                .then((event => event.match(OFFLINE_URL)))
            )) 
    )
    // ,
    // new RegExp(REGEX).test(e.request.url) && 
    // e.respondWith(
    //     caches.open(CACHE_NAME)
    //     .then((response => response.match(e.request.url)))
    //     .catch((error => error || fetch(e.request)))
    // )
});