import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.scss';

// 添加字体链接
$(() => {
  // 添加字体预连接
  if (!$('link[href*="fonts.googleapis.com"]').length) {
    $('<link>').attr('rel', 'preconnect').attr('href', 'https://fonts.googleapis.com').appendTo('head');
    $('<link>').attr('rel', 'preconnect').attr('href', 'https://fonts.gstatic.com').attr('crossorigin', '').appendTo('head');
    $('<link>').attr('href', 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Noto+Serif+SC:wght@300;400;700&display=swap').attr('rel', 'stylesheet').appendTo('head');
  }

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
});
