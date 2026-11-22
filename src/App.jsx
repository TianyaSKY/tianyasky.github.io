import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ScrollToTop from './components/ScrollToTop';
import { routeMetaFor } from './utils/routeMeta';
import { personalInfo } from './data/personalData';

const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const NotFound = lazy(() => import('./pages/NotFound'));

function RouteFallback() {
  return (
    <div className="route-loading" role="status">
      Loading page…
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
  return (
    <div className="app-container">
      <DocumentMeta />
      <ScrollToTop />
      <Navbar />

      <main>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <footer className="page__footer">
        <div className="page__footer-inner">
          <p>
            © {new Date().getFullYear()} {personalInfo.name}
          </p>
          <p className="page__footer-sub">
            Academic Homepage · Hosted on GitHub Pages
          </p>
        </div>
      </footer>
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
