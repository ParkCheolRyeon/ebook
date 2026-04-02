const CACHE_NAME = "ebook-v1";

// Install: cache the app shell
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: network-first with cache fallback
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Skip external requests except Google Fonts
  const url = new URL(request.url);
  const isLocal = url.origin === self.location.origin;
  const isGoogleFont =
    url.origin === "https://fonts.googleapis.com" ||
    url.origin === "https://fonts.gstatic.com";

  if (!isLocal && !isGoogleFont) return;

  // Google Fonts: cache-first (they don't change)
  if (isGoogleFont) {
    event.respondWith(
      caches.match(request).then(
        (cached) => cached || fetch(request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
      )
    );
    return;
  }

  // Local assets: network-first, fallback to cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached || caches.match("/")))
  );
});
