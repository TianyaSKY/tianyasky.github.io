// 构建后静态预渲染：为每个真实路由生成独立的 index.html
// 解决两件事：
//   1) SPA 深链接在 GitHub Pages 上返回 HTTP 404（软 404），搜索引擎与社交平台一律视为死链；
//   2) 分享预览卡片（QQ/微信/Twitter）不执行 JS，只能读 HTML 头部的 OG 标签 —— 之前所有子页共用首页的那一套。
// 生成的每个文件都是「静态外壳 + 同一个 SPA 挂载点」：爬虫/预览机器人读到真实标题、摘要、正文与 OG 图，
// 真实用户加载后 React 接管，体验不变。
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');

// 用 file:// URL 动态导入源码，Windows 下直接 import 绝对路径会报错
const load = (relative) => import(pathToFileURL(path.join(root, relative)).href);

const { projectCatalog } = await load('src/data/projectCatalog.js');
const { buildRoutes, SITE_ORIGIN: SITE, clipText: clip } = await load('src/utils/routeMeta.js');
const { personalInfo, stats, interestTags, educationInfo, awardsList } = await load('src/data/personalData.js');
const detailModules = {
  'vision-positioning': (await load('src/data/projects/visionPositioning.js')).default,
  'crowd-sigmod': (await load('src/data/projects/crowdSigmod.js')).default,
  'cixin-singularity': (await load('src/data/projects/cixinSingularity.js')).default,
  'rl-racing': (await load('src/data/projects/rlRacing.js')).default,
  'sky-cloud': (await load('src/data/projects/skyCloud.js')).default,
  'sky-douyin': (await load('src/data/projects/skyDouyin.js')).default,
  'sky-oj': (await load('src/data/projects/skyOj.js')).default
};

const projects = projectCatalog.map((summary) => ({ ...summary, ...(detailModules[summary.id] || {}) }));

// ── 基础工具 ────────────────────────────────────────────────────────────────
const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// 去掉 KaTeX 的 $ / $$ 定界符，保留公式文本（静态外壳里不做数学渲染）
const plain = (s) => String(s ?? '').replace(/\$\$?/g, '');

// 只替换 content 值；缺失时插入到 </head> 之前。attribute 用 name / property。
function upsertMeta(html, attr, key, content) {
  const re = new RegExp(`<meta\\s+${attr}="${key}"\\s+content="[^"]*"\\s*/?>`);
  const tag = `<meta ${attr}="${key}" content="${esc(content)}" />`;
  if (re.test(html)) return html.replace(re, tag);
  return html.replace('</head>', `  ${tag}\n  </head>`);
}

function upsertLink(html, rel, href) {
  const re = new RegExp(`<link\\s+rel="${rel}"[^>]*>`);
  const tag = `<link rel="${rel}" href="${esc(href)}" />`;
  if (re.test(html)) return html.replace(re, tag);
  return html.replace('</head>', `  ${tag}\n  </head>`);
}

const SHELL_STYLE = `<style id="seo-shell-style">
.seo-shell{max-width:76rem;margin:0 auto;padding:2.5rem 1.25rem 4rem;color:#09152e;font-family:'Plus Jakarta Sans','Noto Sans SC',system-ui,-apple-system,sans-serif;line-height:1.75}
.seo-shell h1{font-size:2.1rem;line-height:1.25;margin:0 0 .6rem;font-weight:800;letter-spacing:-.01em}
.seo-shell h2{font-size:1.15rem;margin:2rem 0 .5rem;font-weight:750;color:#1d4ed8}
.seo-shell .seo-kicker{font-family:'JetBrains Mono',ui-monospace,monospace;font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;color:#64748b;margin:0 0 .75rem}
.seo-shell .seo-subtitle{font-size:1.02rem;color:#475569;margin:0 0 1.25rem}
.seo-shell p{margin:.55rem 0;color:#334155}
.seo-shell a{color:#2563eb;text-decoration:none;border-bottom:1px solid rgba(37,99,235,.35)}
.seo-shell ul{list-style:none;padding:0;margin:.6rem 0}
.seo-shell li{padding:.3rem 0}
.seo-shell .seo-stats{display:flex;flex-wrap:wrap;gap:1.6rem;margin:1rem 0 1.4rem}
.seo-shell .seo-stats div{min-width:8rem}
.seo-shell .seo-stats strong{display:block;font-size:1.35rem;color:#0284c7;font-family:'JetBrains Mono',ui-monospace,monospace}
.seo-shell .seo-stats span{font-size:.8rem;color:#64748b}
.seo-shell .seo-tags{margin:1rem 0 0;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:.75rem;color:#475569}
</style>`;

function shellOpen(kicker, title, subtitle, statsHtml = '') {
  return `<div class="seo-shell">
${kicker ? `<p class="seo-kicker">${esc(kicker)}</p>` : ''}
<h1>${esc(title)}</h1>
${subtitle ? `<p class="seo-subtitle">${esc(subtitle)}</p>` : ''}
${statsHtml}`;
}

const statsHtml = (list = []) =>
  list.length
    ? `<div class="seo-stats">${list
        .map((s) => `<div><strong>${esc(s.value)}</strong><span>${esc(s.label)}</span></div>`)
        .join('')}</div>`
    : '';

function projectShell(project, index) {
  const num = String(index + 1).padStart(2, '0');
  const kind = project.type === 'research' ? 'RESEARCH · 科研' : 'ENGINEERING · 工程';
  const links = project.links || {};
  const linkBits = [
    `<a href="/projects/">← 返回项目目录</a>`,
    links.gitee ? `<a href="${esc(links.gitee)}">Gitee 仓库</a>` : '',
    links.github ? `<a href="${esc(links.github)}">GitHub</a>` : ''
  ].filter(Boolean);

  let body = '';
  if (project.background) body += `<h2>问题与动机 / Background</h2><p>${esc(clip(project.background, 700))}</p>`;
  if (project.method) body += `<h2>方法与实现 / Method</h2><p>${esc(clip(project.method, 900))}</p>`;
  if (project.results) body += `<h2>成果与指标 / Results</h2><p>${esc(clip(project.results, 700))}</p>`;
  if (project.highlights?.length) {
    body += `<h2>核心亮点 / Highlights</h2><ul>${project.highlights
      .map((h) => `<li>· ${esc(clip(h, 260))}</li>`)
      .join('')}</ul>`;
  }
  if (project.paperInfo) {
    body += `<h2>论文摘要 / Abstract</h2><p><strong>${esc(project.paperInfo.titleZh)}</strong></p><p>${esc(
      clip(project.paperInfo.abstractZh, 1400)
    )}</p><p>${esc(project.paperInfo.authors)} — ${esc(project.paperInfo.affiliation)}</p>`;
  }

  return `${shellOpen(
    `ISSUE · ${num} · ${kind}`,
    project.title,
    project.subtitle,
    statsHtml(project.stats)
  )}
<p>${esc(clip(project.description, 520))}</p>
${body}
<p class="seo-tags">${esc((project.tech || []).join(' · '))}</p>
<p style="margin-top:1.6rem">${linkBits.join(' · ')}</p>
</div>`;
}

function homeShell() {
  const projectList = projects
    .map(
      (p) =>
        `<li><a href="/projects/${esc(p.id)}/">${esc(p.title)}</a> — ${esc(clip(p.subtitle, 90))}</li>`
    )
    .join('');
  const awards = awardsList
    .map((a) => `<li>${esc(a.year)} · ${esc(a.title)} — ${esc(a.detail)}</li>`)
    .join('');
  const courses = educationInfo.courses
    .map((c) => `${esc(c.name)} ${esc(c.score)}`)
    .join(' · ');

  return `${shellOpen(
    `${educationInfo.school} · ${educationInfo.college} · 2026 · VOL.10`,
    `${personalInfo.name} · ${personalInfo.title}`,
    personalInfo.taglines[0],
    statsHtml(stats)
  )}
<p>${esc(personalInfo.major)} · ${esc(personalInfo.school)} · ${esc(educationInfo.period)}</p>
<h2>关于 / About</h2>
<p>我是${esc(personalInfo.name)}（${esc(
    personalInfo.englishName
  )}），${esc(educationInfo.school)}${esc(educationInfo.major)} 2023 级本科生。两条长期主线：计算机视觉与三维几何（单目视觉定位、人群计数），AI 原生系统与智能体工程（RAG、MCP、多智能体仿真、安全沙箱评测）。</p>
<p>${personalInfo.taglines.map((t) => esc(t)).join(' · ')}</p>
<h2>项目 / Projects</h2>
<ul>${projectList}</ul>
<h2>竞赛与荣誉 / Honors</h2>
<ul>${awards}</ul>
<h2>教育 / Education</h2>
<p>${esc(educationInfo.school)} · ${esc(educationInfo.college)} · ${esc(educationInfo.major)} · ${esc(
    educationInfo.period
  )}</p>
<p>${esc(educationInfo.tags.join(' · '))}</p>
<p>课程成绩：${courses}</p>
<h2>兴趣方向 / Interests</h2>
<p>${esc(interestTags.join(' · '))}</p>
<h2>联系 / Contact</h2>
<p><a href="mailto:${esc(personalInfo.email)}">${esc(personalInfo.email)}</a> · <a href="${esc(
    personalInfo.github
  )}">${esc(personalInfo.github)}</a> · <a href="/projects/">全部项目案例</a></p>
</div>`;
}

function projectsShell() {
  const items = projects
    .map((p, i) => {
      const num = String(i + 1).padStart(2, '0');
      return `<li><strong>${num} · <a href="/projects/${esc(p.id)}/">${esc(p.title)}</a></strong><br />${esc(
        clip(p.subtitle, 120)
      )}<br />${esc(clip(p.description, 260))}</li>`;
    })
    .join('');
  return `${shellOpen('VOL. 02 · PROJECT INDEX · 7 FEATURED', '精选项目 / Featured Projects', '四项前沿科研与三项系统工程，含问题定义、关键数据流、技术边界与下一步。')}
<ul>${items}</ul>
<p><a href="/">← 返回首页</a></p>
</div>`;
}

// ── 每个路由的 SEO 元信息 ───────────────────────────────────────────────────
function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: personalInfo.name,
    alternateName: personalInfo.englishName,
    jobTitle: '计算机科学与技术本科生 · 计算机视觉与 AI 系统工程',
    description: `${personalInfo.name}，${personalInfo.school}${personalInfo.major}，聚焦单目视觉与三维几何、LLM 多智能体、RAG/MCP 与安全沙箱评测。`,
    url: `${SITE}/`,
    image: personalInfo.avatar,
    email: `mailto:${personalInfo.email}`,
    affiliation: {
      '@type': 'CollegeOrUniversity',
      name: '大连海洋大学 信息工程学院'
    },
    knowsAbout: interestTags,
    sameAs: [personalInfo.github]
  };
}

function projectJsonLd(project, index) {
  const isPaper = Boolean(project.paperInfo);
  const data = {
    '@context': 'https://schema.org',
    '@type': isPaper ? 'ScholarlyArticle' : project.type === 'research' ? 'CreativeWork' : 'SoftwareSourceCode',
    name: project.title,
    alternateName: project.subtitle,
    description: project.description,
    url: `${SITE}/projects/${project.id}/`,
    image: project.cover,
    inLanguage: 'zh-CN',
    author: {
      '@type': 'Person',
      name: personalInfo.name,
      url: `${SITE}/`
    },
    keywords: (project.tech || []).join(', '),
    position: index + 1
  };
  if (project.links?.github) data.codeRepository = project.links.github;
  if (isPaper && project.paperInfo.abstractZh) data.abstract = clip(project.paperInfo.abstractZh, 900);
  return data;
}

function breadcrumbJsonLd(project) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首页', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: '项目', item: `${SITE}/projects/` },
      { '@type': 'ListItem', position: 3, name: project.title, item: `${SITE}/projects/${project.id}/` }
    ]
  };
}

// 元信息来自 src/utils/routeMeta.js（与运行时共用一份），这里补上「写哪个文件、静态外壳、结构化数据」
const baseRoutes = buildRoutes();
const routes = baseRoutes.map((route) => {
  const index = projects.findIndex((p) => `/projects/${p.id}` === route.path);
  const project = index >= 0 ? projects[index] : null;

  return {
    ...route,
    outPath: route.path === '/' ? 'index.html' : `${route.path.replace(/^\//, '')}/index.html`,
    shell: project ? projectShell(project, index) : route.path === '/' ? homeShell() : projectsShell(),
    jsonLd: project
      ? [projectJsonLd(project, index), breadcrumbJsonLd(project)]
      : route.path === '/'
      ? [personJsonLd()]
      : [
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: '精选项目 · 陈敏祥',
            url: `${SITE}/projects/`,
            hasPart: projects.map((p) => ({
              '@type': 'CreativeWork',
              name: p.title,
              url: `${SITE}/projects/${p.id}/`
            }))
          }
        ]
  };
});

// R2 上的 7 张封面尺寸一致（1672×941，约 16:9）。声明宽高能让爬虫/预览服务在不下载图片的情况下排好卡片。
const COVER_W = 1672;
const COVER_H = 941;

// ── 生成 ────────────────────────────────────────────────────────────────────
const template = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
const headEnd = '</head>';

for (const route of routes) {
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(route.title)}</title>`)
    .replace('<div id="root"></div>', `<div id="root">${route.shell}</div>`);

  html = upsertMeta(html, 'name', 'description', route.description);
  html = upsertMeta(html, 'property', 'og:type', route.ogType);
  html = upsertMeta(html, 'property', 'og:title', route.ogTitle || route.title);
  html = upsertMeta(html, 'property', 'og:description', route.description);
  html = upsertMeta(html, 'property', 'og:image', route.image);
  html = upsertMeta(html, 'property', 'og:image:width', COVER_W);
  html = upsertMeta(html, 'property', 'og:image:height', COVER_H);
  html = upsertMeta(html, 'property', 'og:image:alt', `${route.title} — 分享预览图`);
  html = upsertMeta(html, 'property', 'og:url', route.url);
  html = upsertMeta(html, 'name', 'twitter:title', route.title);
  html = upsertMeta(html, 'name', 'twitter:description', route.description);
  html = upsertMeta(html, 'name', 'twitter:image', route.image);
  html = upsertMeta(html, 'name', 'robots', 'index, follow, max-image-preview:large');
  html = upsertLink(html, 'canonical', route.url);

  const ld = route.jsonLd.map(
    (obj) => `<script type="application/ld+json">${JSON.stringify(obj)}</script>`
  );
  html = html.replace(
    headEnd,
    `  ${SHELL_STYLE}\n  ${ld.join('\n  ')}\n${headEnd}`
  );

  const target = path.join(distDir, route.outPath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, html);
  console.log(`  ✓ ${route.outPath}  ←  ${route.url}`);
}

// robots.txt + sitemap.xml：让搜索引擎能直接发现 7 篇案例研究
let lastmod = new Date().toISOString().slice(0, 10);
try {
  lastmod = execFileSync('git', ['log', '-1', '--format=%cs'], { cwd: root, encoding: 'utf8' }).trim() || lastmod;
} catch {
  /* 非 git 环境（如 tarball 构建）沿用今天 */
}
fs.writeFileSync(path.join(distDir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
fs.writeFileSync(
  path.join(distDir, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes
    .map(
      (r) =>
        `  <url>\n    <loc>${r.url}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${
          r.outPath === 'index.html' ? 'weekly' : 'monthly'
        }</changefreq>\n  </url>`
    )
    .join('\n')}\n</urlset>\n`
);
console.log(`  ✓ robots.txt / sitemap.xml（${routes.length} 个 URL，lastmod ${lastmod}）`);
console.log(`静态预渲染完成：${routes.length} 个路由，每个都是独立的 200 页面。`);
