import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// GitHub Pages SPA 重定向恢复：从 404.html 跳回首页后，把原路径写回 location。
(() => {
  try {
    const saved = sessionStorage.getItem('gh-pages-redirect');
    if (saved) {
      sessionStorage.removeItem('gh-pages-redirect');
      const url = new URL(window.location.href);
      url.pathname = saved.replace(/(\?|#).*/, '');
      url.search = saved.includes('?') ? saved.slice(saved.indexOf('?'), saved.includes('#') ? saved.indexOf('#') : undefined) : '';
      url.hash = saved.includes('#') ? saved.slice(saved.indexOf('#')) : '';
      window.history.replaceState(null, '', url.pathname + url.search + url.hash);
    }
  } catch (e) { /* sessionStorage may be disabled */ }
})();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
