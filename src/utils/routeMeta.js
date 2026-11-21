import { projectCatalog } from '../data/projectCatalog.js';

export const SITE_ORIGIN = 'https://tianyasky.github.io';
export const SITE_NAME = 'Minxiang Chen · Academic Homepage';

export const clipText = (s, n) => {
  const t = String(s ?? '')
    .replace(/\$\$?/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return t.length > n ? `${t.slice(0, n - 1)}…` : t;
};

export const normalizePath = (pathname) => {
  const trimmed = String(pathname || '/').replace(/[?#].*$/, '').replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
};

export function buildRoutes() {
  const routes = [
    {
      path: '/',
      url: `${SITE_ORIGIN}/`,
      title: 'Minxiang Chen · Computer Vision, AI-Native Systems & Agent Engineering',
      ogTitle: 'Minxiang Chen · Computer Vision, AI-Native Systems & Agent Engineering',
      description:
        'Minxiang Chen\'s academic homepage: Undergraduate at Dalian Ocean University. Research in monocular 3D vision, crowd density estimation, LLM multi-agents, and high-concurrency systems.',
      image: projectCatalog[0].cover,
      ogType: 'profile'
    }
  ];

  for (const project of projectCatalog) {
    routes.push({
      path: `/projects/${project.id}`,
      url: `${SITE_ORIGIN}/projects/${project.id}/`,
      title: `${project.title} · ${project.type === 'research' ? 'Research' : 'Engineering'} | Minxiang Chen`,
      ogTitle: `${project.title} — ${project.subtitle}`,
      description: clipText(project.description, 200),
      image: project.cover,
      ogType: 'article'
    });
  }

  return routes;
}

export function routeMetaFor(pathname) {
  const norm = normalizePath(pathname);
  const match = buildRoutes().find((r) => r.path === norm);
  if (match) return match;
  return null;
}
