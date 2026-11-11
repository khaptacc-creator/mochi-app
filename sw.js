/* Học Vui – service worker: mở được khi không có mạng */
const C='mochi-v30',IMG='mochi-img';const CORE=['./','index.html','manifest.json','icon-192.png','icon-512.png','apple-touch-icon.png','favicon-32.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C&&k!==IMG).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 if(r.mode==='navigate'||u.pathname.endsWith('index.html')){e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put('index.html',cp));return res}).catch(()=>caches.match('index.html')));return}
 if(u.host==='images.pexels.com'||(u.host.endsWith('.supabase.co')&&u.pathname.includes('/storage/v1/object/public/'))){e.respondWith(caches.open(IMG).then(c=>c.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok||res.type==='opaque')c.put(r,res.clone());return res}))));return}
 if(u.origin===location.origin||u.host.includes('fonts.g')){e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok||res.type==='opaque'){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res})))}});
