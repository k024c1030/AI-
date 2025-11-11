const CACHE_VERSION = "v3"; // 天気APIのキャッシュ戦略を追加したためバージョンを更新
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`; // APIレスポンスなどの動的コンテンツ用

const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/offline.html",
  "/manifest.json",
  "/monsters/kaiju_brown.png"
  // CSSやJSファイルが別にあればここに追加
];

self.addEventListener("install", (event) => {
  // `skipWaiting()`を呼び出すことで、新しいService Workerが即座にアクティブになります
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log("Precaching static assets");
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener("activate", (event) => {
  // 古いキャッシュをクリーンアップします
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
            console.log("Deleting old cache:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  // `clients.claim()`により、Service Workerが制御するページを即座に制御下に置きます
  return self.clients.claim();
});


self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // GETリクエスト以外は無視
  if (request.method !== "GET") {
    return;
  }
  
  // ブラウザ拡張機能や開発ツールからのリクエストは無視
  if (url.protocol.startsWith('chrome-extension')) {
    return;
  }

  // 天気APIへのリクエスト (/api/weather) は Stale-While-Revalidate 戦略を使用
  // OpenWeatherMapのアイコンも同様にキャッシュします
  if (url.pathname.startsWith('/api/weather') || url.hostname === 'openweathermap.org') {
    event.respondWith(
      caches.open(DYNAMIC_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        
        const fetchPromise = fetch(request).then((networkResponse) => {
          // ネットワークから正常に取得できたら、キャッシュを更新してレスポンスを返す
          cache.put(request, networkResponse.clone());
          return networkResponse;
        });

        // キャッシュがあればそれを即座に返し、裏でネットワークリクエストを実行してキャッシュを更新
        // キャッシュがなければ、ネットワークリクエストの結果を待つ
        return cachedResponse || fetchPromise;
      })
    );
    return; // このルールに一致したらここで処理を終了
  }
  
  // HTMLページのナビゲーションリクエストは Network-First 戦略
  if (request.headers.get("accept")?.includes("text/html")) {
     event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          // 成功したらキャッシュに保存
          const responseToCache = networkResponse.clone();
          caches.open(STATIC_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });
          return networkResponse;
        })
        .catch(async () => {
           // ネットワークが失敗したらキャッシュから返す
          const cachedResponse = await caches.match(request);
          return cachedResponse || await caches.match('/offline.html');
        })
    );
    return;
  }

  // その他の静的アセットは Cache-First 戦略
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // キャッシュがあればそれを返す
      if (cachedResponse) {
        return cachedResponse;
      }
      // なければネットワークから取得し、キャッシュに保存して返す
      return fetch(request).then((networkResponse) => {
        const responseToCache = networkResponse.clone();
        caches.open(STATIC_CACHE).then((cache) => {
          cache.put(request, responseToCache);
        });
        return networkResponse;
      });
    })
  );
});
