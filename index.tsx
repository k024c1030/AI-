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
  // windowのloadイベントを待ってからService Workerを登録するのが最も安全です。
  // これにより「The document is in an invalid state」エラーを回避できます。
  window.addEventListener('load', () => {
    // ルートからの絶対パスを使用して、オリジンの問題を回避します
    const swUrl = `${window.location.origin}/sw.js`;
    navigator.serviceWorker.register(swUrl)
      .then(registration => {
        console.log('Service Worker registered successfully:', registration);
      })
      .catch(error => {
        console.error('SW registration failed:', error);
      });
  });
}
