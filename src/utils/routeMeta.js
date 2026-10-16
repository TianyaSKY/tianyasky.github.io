// 站点路由的「可索引元信息」唯一来源。
// 同时被两处使用：
//   · 构建期 scripts/prerender.mjs —— 为每条路由生成独立 HTML 的 title / description / OG 标签与 sitemap；
//   · 运行时 src/App.jsx —— 站内跳转（SPA 路由切换）时同步更新 document.title 与 description。
// 两边共用同一份数据，避免出现「直链标题对、点进去标题还是首页」这类不一致。
import { projectCatalog } from '../data/projectCatalog.js';

export const SITE_ORIGIN = 'https://tianyasky.github.io';
export const SITE_NAME = '陈敏祥 · 个人学术主页';

// 搜索结果与社交卡片都会截断，这里统一按「中文字符数」裁剪
export const clipText = (s, n) => {
  const t = String(s ?? '')
    .replace(/\$\$?/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return t.length > n ? `${t.slice(0, n - 1)}…` : t;
};

// 路径归一化：'/projects/vision-positioning/' 与 '/projects/vision-positioning' 视为同一页
export const normalizePath = (pathname) => {
  const trimmed = String(pathname || '/').replace(/[?#].*$/, '').replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
};

export function buildRoutes() {
  const routes = [
    {
      path: '/',
      url: `${SITE_ORIGIN}/`,
      title: '陈敏祥 · 计算机视觉、AI 原生系统与智能体工程',
      ogTitle: '陈敏祥 · 计算机视觉、AI 原生系统与智能体工程',
      description:
        '陈敏祥的个人主页：大连海洋大学计算机科学与技术 2023 级本科生。聚焦单目视觉与三维几何、LLM 多智能体、RAG/MCP 与安全沙箱评测，收录 7 个可运行、可复现的科研与工程案例。',
      image: projectCatalog[0].cover,
      ogType: 'profile'
    },
    {
      path: '/projects',
      url: `${SITE_ORIGIN}/projects/`,
      title: '精选项目 · 7 个科研与工程案例 | 陈敏祥',
      ogTitle: '精选项目 · 陈敏祥',
      description:
        '陈敏祥的项目索引：单目视觉三维坐标重建、YOLO-PGMD 人群计数、Qwen 文风微调、PPO 自动驾驶，以及 SKYCloud、SKYDouyin、SKYOJ 三套系统工程。',
      image: projectCatalog[1].cover,
      ogType: 'website'
    }
  ];

  for (const project of projectCatalog) {
    routes.push({
      path: `/projects/${project.id}`,
      url: `${SITE_ORIGIN}/projects/${project.id}/`,
      // 搜索结果里的标题会被截断，保持短而完整；副标题交给 og:title 与描述承载
      title: `${project.title} · ${project.type === 'research' ? '科研' : '工程'} | 陈敏祥`,
      ogTitle: `${project.title} — ${project.subtitle}`,
      description: clipText(project.description, 190),
      image: project.cover,
      ogType: 'article'
    });
  }

  return routes;
}

const routeIndex = new Map(buildRoutes().map((route) => [normalizePath(route.path), route]));

// 未预渲染的路径（例如 404 页面）返回 null，调用方保持现状即可
export function routeMetaFor(pathname) {
  return routeIndex.get(normalizePath(pathname)) || null;
}
