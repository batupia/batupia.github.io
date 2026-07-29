/* STONEBREAKING — kurtarıcı service worker
   Eski PWA (Break the Limits) sw.js'i ziyaretçilerin tarayıcısına kurulu
   kaldı ve eski sayfayı cache'ten servis ediyor. Bu dosya onun yerine
   geçer: tüm cache'leri siler, kendini kaydından düşürür, açık sekmeleri
   tazeler. Dosyayı silmek yerine bunu koymak ZORUNLU — silinseydi
   tarayıcı eski sw.js'i tutmaya devam ederdi. */
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => caches.delete(k)));
    await self.registration.unregister();
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach(c => c.navigate(c.url));
  })());
});

self.addEventListener('fetch', () => {});
