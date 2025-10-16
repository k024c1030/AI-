import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if ('serviceWorker' in navigator) {
  const registerServiceWorker = () => {
    // ルートからの相対パスを使用する方がシンプルで確実です
    const swUrl = `/sw.js`;
    navigator.serviceWorker.register(swUrl)
      .then(registration => {
        console.log('Service Worker registered successfully:', registration);
      })
      .catch(error => {
        console.error('SW registration failed:', error);
      });
  };

  // ページがすでに完全に読み込まれている場合、すぐに登録します。
  if (document.readyState === 'complete') {
    registerServiceWorker();
  } else {
    // そうでない場合は、loadイベントを待ちます。
    window.addEventListener('load', registerServiceWorker);
  }
}
