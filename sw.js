const CACHE_NAME = 'newz-static-2'

const STATIC_ASSETS = [
	'index.html',
	'./',
	'js/script.js',
	'css/styles.css',
	'images/dog-logo.png',
	'images/newz-dog.png',
	'images/place.jpg',
	'./fallback.json',
	'favicon.ico',
	'favicon-16x16.png',
	'favicon-32x32.png',
	'favicon-96x96.png'
	]

self.addEventListener('install', async event=>{
	const CACHE = await caches.open(CACHE_NAME)
	CACHE.addAll(STATIC_ASSETS)
})

self.addEventListener('activate', event=>{
	const currentCaches = [CACHE_NAME]
	event.waitUntil(
		caches.keys().then(cacheNames=> {
			return cacheNames.filter(cacheName=>!currentCaches.includes(cacheName))
		}).then(cachesToDelete=>{
			return Promise.all(cachesToDelete.map(cacheToDelete=>{
				return caches.delete(cacheToDelete)
			}))
		}).then(()=>self.clients.claim())
		)
})

self.addEventListener('fetch', async event=>{
	const request = event.request
	const url = new URL(request.url)
	if(url.origin === location.origin) {
		event.respondWith(cacheFirst(request))
	} else {
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
		return cachedResponse || await caches.match('./fallback.json')
	}
}
