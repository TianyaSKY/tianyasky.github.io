import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { projects } from '../data/personalData';
import { ArrowUpRight, Github, PlayCircle } from 'lucide-react';

const FILTER_TABS = [
  { id: 'all', label: 'All', count: 6 },
  { id: 'research', label: 'Research', count: 3 },
  { id: 'engineering', label: 'Engineering', count: 3 }
];

export default function ProjectsBento({ standalone = false }) {
  const [filter, setFilter] = useState('all');

  const list = useMemo(() => {
    if (filter === 'all') return projects;
    return projects.filter((p) => p.type === filter);
  }, [filter]);

  return (
    <div className="bento-section">
      <header className="bento-header">
        <div className="bento-header-text">
          <div className="kicker">Featured · Index</div>
          <h2 className="section-title">
            六个项目 / <em>six installations</em>
          </h2>
          <p className="section-desc">
            三项科研攻关 · 三项系统工程。每张卡片下附完整案例研究：问题、方法、数据、反思与延伸阅读。
          </p>
        </div>
        <div className="bento-header-meta">
          VOL. 02<br />
          <strong>Project Index</strong>
          <span style={{ display: 'block', marginTop: 6 }}>
            {list.length} featured · mmxxvi
          </span>
        </div>
      </header>

      <div className="bento-filter" role="tablist">
        {FILTER_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={filter === t.id}
            className={`bento-filter-btn ${filter === t.id ? 'active' : ''}`}
            onClick={() => setFilter(t.id)}
          >
            {t.label}
            <span className="count">{t.count}</span>
          </button>
        ))}
      </div>

      <div className={`bento-grid ${list.length === 3 ? 'cols-3' : ''}`}>

        {list.map((p, idx) => (
          <ProjectCard key={p.id} project={p} indexInList={idx} totalCount={list.length} />
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project, indexInList, totalCount }) {
  // Spread sizes so the grid never collapses: rotate among 4 shapes
  const layoutOrder = ['feature', 'tall', 'half-r', 'wide', 'half', 'quad'];
  // Filter-aware mapping so all 6 stay visible
  const layout =
    project.id === 'vision-positioning' ? 'feature'
    : project.id === 'cixin-singularity' ? 'tall'
    : project.id === 'rl-racing' ? 'half-r'
    : project.id === 'sky-cloud' ? 'wide'
    : project.id === 'sky-douyin' ? 'half'
    : 'quad';

  const number = String(indexInList + 1).padStart(2, '0');
  const isAltColor = project.accent === 'indigo' || project.accent === 'cyan';

  return (
    <Link to={`/projects/${project.id}`} className={`bento-card bento-${layout} ${isAltColor ? 'alt-color' : ''}`} aria-label={project.title}>
      <header className="head">
        <span className="badge">{project.badge}</span>
        <span className="index">{number}</span>
      </header>

      <span className="number-tag">
        {project.type === 'research' ? 'Research · 科研' : 'Engineering · 工程'}
      </span>

      <h3 className="title">{project.title}</h3>

      <p className="subtitle">{project.subtitle}</p>

      <div className="cover">
        <img src={project.cover} alt={project.title} loading="lazy" />
      </div>
      <div className="cover-caption">
        <span>{project.id}</span>
        <span>{project.type === 'research' ? 'RES' : 'ENG'}/0{number}</span>
      </div>

      {project.description && (layout === 'feature' || layout === 'tall' || layout === 'wide') && (
        <p className="desc">{project.description}</p>
      )}

      <div className="meta-row">
        {project.stats?.slice(0, layout === 'feature' || layout === 'tall' || layout === 'wide' ? 3 : 2).map((s) => (
          <span key={s.label}>
            <span className="k">{s.label}</span> <strong>{s.value}</strong>
          </span>
        ))}
      </div>

      <footer className="footer">
        <span className="read-more">展开案例研究</span>
        <span className="stats-inline">
          {project.tech.slice(0, 2).join(' · ')}
          {project.tech.length > 2 && ` +${project.tech.length - 2}`}
        </span>
      </footer>
    </Link>
  );
}
