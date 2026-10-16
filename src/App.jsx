import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import BackgroundCanvas from './components/BackgroundCanvas';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ScrollToTop from './components/ScrollToTop';
import { routeMetaFor } from './utils/routeMeta';

const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const NotFound = lazy(() => import('./pages/NotFound'));
const CommandPalette = lazy(() => import('./components/CommandPalette'));

function RouteFallback() {
  return (
    <div className="route-loading" role="status">
      正在加载页面…
    </div>
  );
}

function PaletteFallback() {
  return (
    <div className="palette-loading" role="status">
      正在加载搜索…
    </div>
  );
}

// 站内跳转时同步 <title> 与 description：预渲染只覆盖「首次加载」，
// 之后由 React Router 接管，不处理的话从首页点进任何项目页，标题都会停留在首页那一版。
function DocumentMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = routeMetaFor(pathname);
    if (!meta) return; // 未预渲染的路径（404）保持原状
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
      <BackgroundCanvas />
      <Navbar onOpenCmdPalette={() => setIsCmdOpen(true)} />

      <main>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home onOpenCmdPalette={() => setIsCmdOpen(true)} />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

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
