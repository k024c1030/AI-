// 手動で更新するバージョン。キャッシュ構造の変更や大きなバグ修正時に更新します。
const SW_VERSION = "v4-ttl-fix"; 
const STATIC_CACHE = `static-${SW_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${SW_VERSION}`;

const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/offline.html",
  "/manifest.json",
  "/monsters/kaiju_brown.png"
  // CSSやJSファイルが別にあればここに追加
];

self.addEventListener("install", (event) => {
  // `skipWaiting()`を呼び出すことで、新しいService Workerが即座にアクティブになります。
  // これにより、ユーザーはページをリロードすることなく最新の機能を利用できます。
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log("Precaching static assets");
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener("activate", (event) => {
  // 古いキャッシュをクリーンアップします。
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          // 現在のバージョンと異なるキャッシュはすべて削除します。
          if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
            console.log("Deleting old cache:", key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => {
      // `clients.claim()`により、Service Workerがアクティブになった後、
      // 即座にすべての開いているページを制御下に置きます。
      return self.clients.claim();
    })
  );
});


self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // GETリクエスト以外やブラウザ拡張機能からのリクエストは無視
  if (request.method !== "GET" || url.protocol.startsWith('chrome-extension')) {
    return;
  }

  // 天気APIへのリクエスト (/api/weather) は Stale-While-Revalidate 戦略 + TTL で処理
  if (url.pathname.startsWith('/api/weather')) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(DYNAMIC_CACHE);
        const cachedResponse = await cache.match(request);

        // ネットワークから取得してキャッシュを更新する非同期関数
        const fetchAndCache = async () => {
          try {
            const networkResponse = await fetch(request);
            if (networkResponse.ok) {
              await cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          } catch (error) {
            console.error("Fetch failed:", error);
            return undefined; // 失敗を明確にする
          }
        };

        if (!cachedResponse) {
          // キャッシュがない場合、ネットワークからの応答を待つしかない
          console.log("Weather: No cache, fetching from network.");
          return (await fetchAndCache()) || new Response(JSON.stringify({ error: "Offline" }), { status: 503, headers: { 'Content-Type': 'application/json' } });
        }

        // キャッシュがある場合、TTLをチェック
        const cachedData = await cachedResponse.clone().json();
        const fetchedAt = new Date(cachedData.fetched_at).getTime();
        const ttl = (cachedData.ttl_seconds || 7200) * 1000; // デフォルト2時間
        const isStale = Date.now() > fetchedAt + ttl;

        if (isStale) {
          console.log("Weather cache is stale. Forcing re-fetch.");
          // TTL切れ: ネットワーク取得を試み、失敗したら古いキャッシュを返す
          const networkResponse = await fetchAndCache();
          return networkResponse || cachedResponse;
        } else {
          console.log("Weather cache is fresh. Using stale-while-revalidate.");
          // TTL内: キャッシュを即座に返し、バックグラウンドで静かに更新
          fetchAndCache(); // awaitしないのがポイント
          return cachedResponse;
        }
      })()
    );
    return;
  }
  
  // OpenWeatherMapのアイコンも動的キャッシュ（Cache First）
  if (url.hostname === 'openweathermap.org') {
      event.respondWith(
        caches.open(DYNAMIC_CACHE).then(cache => {
            return cache.match(request).then(response => {
                return response || fetch(request).then(networkResponse => {
                    cache.put(request, networkResponse.clone());
                    return networkResponse;
                });
            });
        })
      );
      return;
  }
  
  // HTMLページのナビゲーションリクエストは Network-First 戦略
  if (request.headers.get("accept")?.includes("text/html")) {
     event.respondWith(
      fetch(request)
        .then((networkResponse) => {
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
      return cachedResponse || fetch(request);
    })
  );
});