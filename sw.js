const CACHE_NAME = 'newz-static-1'

const STATIC_ASSETS = [
	'/',
	'js/script.js',
	'css/styles.css',
	'images/newz-dog.png',
	'images/white-dog-icon.png',
	'./fallback.json'
	]

self.addEventListener('install', async event=>{
	const CACHE = await caches.open(CACHE_NAME)
	CACHE.addAll(STATIC_ASSETS)
})

self.addEventListener('activate', event=>{
	event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', async event=>{
	console.log('sw fetch')
	const request = event.request
	const url = new URL(request.url)
	if(url.origin === location.origin) {
		event.respondWith(cacheFirst(request))
	} else {
		console.log(request)
		event.respondWith(networkFirst(request))
	}
})

async function cacheFirst (request) {
	const REQUEST_IS_CACHED = await caches.match(request)
	return REQUEST_IS_CACHED || fetch(request)
}

async function networkFirst (request) {
	const dynamicCache = await caches.open('newz-dynamic-1')
	try {
		const networkResponse = await fetch(request)
		dynamicCache.put(request, networkResponse.clone())
		return networkResponse
	} catch(e) {
		const cachedResponse = await dynamicCache.match(request)
		console.log('This is the catch block of the networkFirst method: ', e);
		return cachedResponse || await caches.match('./fallback.json')
	}
}










/*this.addEventListener('fetch', function(event) {
  var response;
  event.respondWith(caches.match(event.request).catch(function() {
    return fetch(event.request);
  }).then(function(r) {
    response = r;
    caches.open('v1').then(function(cache) {
      cache.put(event.request, response);
    });
    return response.clone();
  }).catch(function() {
    return caches.match('/sw-test/gallery/myLittleVader.jpg');
  }));
});*/