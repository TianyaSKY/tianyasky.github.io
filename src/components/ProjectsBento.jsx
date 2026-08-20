import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { projects } from '../data/personalData';
import { ArrowUpRight, Github, PlayCircle } from 'lucide-react';

export default function ProjectsBento({ standalone = false }) {
  const [filter, setFilter] = useState('all');

  const filterTabs = useMemo(() => [
    { id: 'all', label: 'All', count: projects.length },
    { id: 'research', label: 'Research', count: projects.filter((p) => p.type === 'research').length },
    { id: 'engineering', label: 'Engineering', count: projects.filter((p) => p.type === 'engineering').length }
  ], []);

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
            精选项目 / <em>{projects.length} case studies</em>
          </h2>
          <p className="section-desc">
            精选四项前沿科研（单目几何解算、YOLO-PGMD 概率引导人群计数、Qwen-27B 风格微调、PPO 自动驾驶）与三项系统工程（AI Workspace、推荐系统链路、Docker 安全沙箱），不只展示结果，也拆解问题定义、关键数据流、技术边界与下一步。
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
        {filterTabs.map((t) => (
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

      <div className={`bento-grid ${list.length <= 4 ? 'cols-auto' : ''}`}>
        {list.map((p, idx) => (
          <ProjectCard key={p.id} project={p} indexInList={idx} totalCount={list.length} />
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project, indexInList, totalCount }) {
  const layout =
    project.id === 'vision-positioning' ? 'feature'
    : project.id === 'crowd-sigmod' ? 'wide'
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

      {project.description && (
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
