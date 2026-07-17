self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  clients.claim();
  console.log('Service worker aktivert');
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.origin === location.origin) {
    event.respondWith(
      caches.open('static-v1').then(cache =>
        cache.match(event.request).then(resp => resp || fetch(event.request).then(fetched => {
          if (event.request.method === 'GET') cache.put(event.request, fetched.clone());
          return fetched;
        }))
      )
    );
  }
});

