
// Segundo bloque 

importScripts('js/sw-utils.js');


// Primer bloque 

const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
   // '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    //agregar hasta el segundo bloque
    'js/sw-utils.js'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];

// Instalación del Service Worker con manejo de errores
self.addEventListener('install', e => {
    const cacheStatic = caches.open(STATIC_CACHE).then(cache =>
        cache.addAll(APP_SHELL).catch(err => {
            console.error('Error al agregar al caché estático:', err);
        })
    );

    const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache =>
        cache.addAll(APP_SHELL_INMUTABLE).catch(err => {
            console.error('Error al agregar al caché inmutable:', err);
        })
    );

    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});


// Activación del Service Worker
self.addEventListener('activate', e => {
    const respuesta = caches.keys().then(keys => {
        return Promise.all(
            keys.map(key => {
                if (key !== STATIC_CACHE && key.includes('static')) {
                    return caches.delete(key);
                }
            })
        );
    });

    e.waitUntil(respuesta);
});
//_________________________________  Cache con Network 2a parte

self.addEventListener('fetch', e=>{
    const respuesta =caches.match(e.request).then(res =>{
if(res){
    return res;
}else {
    return fetch(e.request).then(newRes => {

     return actualizarCacheDinamico(DYNAMIC_CACHE,e.request,newRes);
    
        
    });
}

});
e.respondWith(respuesta);
});


