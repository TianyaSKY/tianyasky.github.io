import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/site.css'
import './index.css'
import App from './App.jsx'

// Build-time prerendering (scripts/prerender.mjs) writes a static shell into #root for crawlers,
// social preview bots, and visitors without JS. Clear it before React mounts to avoid duplicate content.
const container = document.getElementById('root');
if (container.firstElementChild) {
  container.replaceChildren();
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
