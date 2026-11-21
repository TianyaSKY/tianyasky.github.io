import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ScrollToTop from './components/ScrollToTop';
import { routeMetaFor } from './utils/routeMeta';
import { personalInfo } from './data/personalData';

const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const NotFound = lazy(() => import('./pages/NotFound'));
const CommandPalette = lazy(() => import('./components/CommandPalette'));

function RouteFallback() {
  return (
    <div className="route-loading" role="status">
      Loading page…
    </div>
  );
}

function PaletteFallback() {
  return (
    <div className="palette-loading" role="status">
      Loading search…
    </div>
  );
}

function DocumentMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = routeMetaFor(pathname);
    if (!meta) return;
    document.title = meta.title;
    const description = document.querySelector('meta[name="description"]');
    if (description && meta.description) description.setAttribute('content', meta.description);
  }, [pathname]);

  return null;
}

function Shell() {
  const [isCmdOpen, setIsCmdOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCmdOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="app-container">
      <DocumentMeta />
      <ScrollToTop />
      <Navbar onOpenCmdPalette={() => setIsCmdOpen(true)} />

      <main>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home onOpenCmdPalette={() => setIsCmdOpen(true)} />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <footer className="page__footer">
        <div className="page__footer-inner">
          <p>
            © {new Date().getFullYear()} {personalInfo.name} ({personalInfo.chineseName})
          </p>
          <p className="page__footer-sub">
            Academic Homepage · Hosted on GitHub Pages
          </p>
        </div>
      </footer>

      {isCmdOpen && (
        <Suspense fallback={<PaletteFallback />}>
          <CommandPalette onClose={() => setIsCmdOpen(false)} />
        </Suspense>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}
