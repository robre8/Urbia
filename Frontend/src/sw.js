// Force SW update immediately
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});
self.addEventListener("install", (event) => {
    event.waitUntil(
      caches.open("app-cache").then((cache) => {
        return cache.addAll(["/"]);
      })
    );
  });
  
  self.addEventListener("fetch", (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  });
  