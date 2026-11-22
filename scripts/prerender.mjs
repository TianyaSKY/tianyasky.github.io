// Post-build static prerendering: generates a standalone index.html for each route.
// Solves two problems:
//   1) SPA deep links on GitHub Pages otherwise return HTTP 404 (soft 404) to search engines and social crawlers;
//   2) Social preview cards (Twitter/OpenGraph) do not execute JS and only read head meta tags.
// Each generated file contains a static SEO shell inside the SPA mount point plus route-specific meta tags;
// once loaded in a browser, React replaces the shell seamlessly.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');

// Dynamically import source modules via file:// URLs for cross-platform compatibility
const load = (relative) => import(pathToFileURL(path.join(root, relative)).href);

const { projectCatalog } = await load('src/data/projectCatalog.js');
const { buildRoutes, SITE_ORIGIN: SITE, clipText: clip } = await load('src/utils/routeMeta.js');
const { personalInfo, stats, newsList, interestTags, educationInfo, awardsList } = await load('src/data/personalData.js');
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

// ── Utilities ───────────────────────────────────────────────────────────────
const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// Strip KaTeX $ / $$ delimiters while retaining formula text in the static shell
const plain = (s) => String(s ?? '').replace(/\$\$?/g, '');

// Replace meta content value or insert before </head> if missing.
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
  const kind = project.type === 'research' ? 'RESEARCH' : 'ENGINEERING';
  const links = project.links || {};
  const linkBits = [
    `<a href="/?projectType=${esc(project.type)}#projects">← Back to Projects</a>`,
    links.gitee ? `<a href="${esc(links.gitee)}">Gitee Repository</a>` : '',
    links.github ? `<a href="${esc(links.github)}">GitHub</a>` : ''
  ].filter(Boolean);

  let body = '';
  if (project.background) body += `<h2>Problem &amp; Motivation</h2><p>${esc(clip(project.background, 700))}</p>`;
  if (project.method) body += `<h2>Method &amp; Architecture</h2><p>${esc(clip(project.method, 900))}</p>`;
  if (project.results) body += `<h2>Results &amp; Metrics</h2><p>${esc(clip(project.results, 700))}</p>`;
  if (project.highlights?.length) {
    body += `<h2>Technical Highlights</h2><ul>${project.highlights
      .map((h) => `<li>· ${esc(clip(h, 260))}</li>`)
      .join('')}</ul>`;
  }
  if (project.paperInfo) {
    body += `<h2>Abstract</h2><p><strong>${esc(project.paperInfo.titleEn)}</strong></p><p>${esc(
      clip(project.paperInfo.abstractEn, 1400)
    )}</p>`;
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
        `<li><a href="/projects/${esc(p.id)}/"><img src="${esc(p.cover)}" alt="" style="width:360px;max-width:100%;height:auto" loading="lazy" /> ${esc(p.title)}</a> · ${esc(p.badge)}</li>`
    )
    .join('');
  const awards = awardsList
    .map((a) => `<li>${esc(a.year)} · ${esc(a.title)} — ${esc(a.detail)}</li>`)
    .join('');
  const courses = educationInfo.courses
    .map((c) => `${esc(c.name)} ${esc(c.score)}`)
    .join(' · ');

  return `${shellOpen(
    `${educationInfo.school} · ${educationInfo.college}`,
    `${personalInfo.name} · ${personalInfo.title}`,
    personalInfo.taglines[0],
    statsHtml(stats)
  )}
<p>${esc(personalInfo.major)} · ${esc(personalInfo.school)} · ${esc(educationInfo.period)}</p>
<h2>About Me</h2>
<p>I am ${esc(personalInfo.name)}, an undergraduate student in Computer Science and Technology at ${esc(educationInfo.school)}. My work focuses on Computer Vision &amp; 3D Geometry (monocular positioning, crowd counting) and AI-Native Systems &amp; Multi-Agent Engineering (RAG, FastMCP, multi-agent simulation, and secure sandboxing).</p>
<p>${personalInfo.taglines.map((t) => esc(t)).join(' · ')}</p>
<h2>News</h2>
<ul>${newsList.map((n) => `<li><strong>[${esc(n.date)}]</strong> ${esc(n.text.replace(/<[^>]+>/g, ''))}</li>`).join('')}</ul>
<h2 id="projects">Projects</h2>
<ul>${projectList}</ul>
<h2>Education</h2>
<p>${esc(educationInfo.school)} · ${esc(educationInfo.college)} · ${esc(educationInfo.major)} · ${esc(
    educationInfo.period
  )}</p>
<p><img src="/dalian.webp" alt="Dalian" style="max-width:440px;width:100%;border-radius:4px" /></p>
<h2>Research Interests</h2>
<p>${esc(interestTags.join(' · '))}</p>
<h2>Contact</h2>
<p><a href="mailto:${esc(personalInfo.email)}">${esc(personalInfo.email)}</a></p>
</div>`;
}

// ── Route SEO Metadata ──────────────────────────────────────────────────────
function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: personalInfo.name,
    jobTitle: 'Undergraduate in Computer Science · Computer Vision & AI Systems Engineering',
    description: `${personalInfo.name}, ${personalInfo.major} at ${personalInfo.school}, focusing on monocular 3D vision, crowd density estimation, LLM agents, and secure sandboxing.`,
    url: `${SITE}/`,
    image: personalInfo.avatar,
    email: `mailto:${personalInfo.email}`,
    affiliation: {
      '@type': 'CollegeOrUniversity',
      name: `${personalInfo.school} ${personalInfo.college}`
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
    inLanguage: 'en',
    keywords: (project.tech || []).join(', '),
    position: index + 1
  };
  if (project.links?.github) data.codeRepository = project.links.github;
  if (isPaper && project.paperInfo.abstractEn) data.abstract = clip(project.paperInfo.abstractEn, 900);
  return data;
}

function breadcrumbJsonLd(project) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: project.title, item: `${SITE}/projects/${project.id}/` }
    ]
  };
}

// Route metadata is shared with runtime via src/utils/routeMeta.js; attach output paths, static shells, and JSON-LD here.
const baseRoutes = buildRoutes();
const routes = baseRoutes.map((route) => {
  const index = projects.findIndex((p) => `/projects/${p.id}` === route.path);
  const project = index >= 0 ? projects[index] : null;

  return {
    ...route,
    outPath: route.path === '/' ? 'index.html' : `${route.path.replace(/^\//, '')}/index.html`,
    shell: project ? projectShell(project, index) : homeShell(),
    jsonLd: project ? [projectJsonLd(project, index), breadcrumbJsonLd(project)] : [personJsonLd()]
  };
});

// Cover dimensions on R2 (1672x941, ~16:9).
const COVER_W = 1672;
const COVER_H = 941;

// ── Generation ──────────────────────────────────────────────────────────────
const template = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
const headEnd = '</head>';

for (const route of routes) {
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(route.title)}</title>`)
    .replace('<div id="root"></div>', `<div id="root">${route.shell}</div>`);

  if (route.path !== '/') {
    html = html.replace(/^\s*<meta name="author" content="[^"]*"\s*\/?>\n/m, '');
  }

  html = upsertMeta(html, 'name', 'description', route.description);
  html = upsertMeta(html, 'property', 'og:type', route.ogType);
  html = upsertMeta(html, 'property', 'og:title', route.ogTitle || route.title);
  html = upsertMeta(html, 'property', 'og:description', route.description);
  html = upsertMeta(html, 'property', 'og:image', route.image);
  html = upsertMeta(html, 'property', 'og:image:width', COVER_W);
  html = upsertMeta(html, 'property', 'og:image:height', COVER_H);
  html = upsertMeta(html, 'property', 'og:image:alt', `${route.title} — Social Preview`);
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

// Generate robots.txt and sitemap.xml
let lastmod = new Date().toISOString().slice(0, 10);
try {
  lastmod = execFileSync('git', ['log', '-1', '--format=%cs'], { cwd: root, encoding: 'utf8' }).trim() || lastmod;
} catch {
  /* Fallback to current date outside git repositories */
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
console.log(`  ✓ robots.txt / sitemap.xml (${routes.length} URLs, lastmod ${lastmod})`);
console.log(`Static prerendering complete: ${routes.length} routes generated.`);
