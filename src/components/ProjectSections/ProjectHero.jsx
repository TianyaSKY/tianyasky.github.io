import React from 'react';

export default function ProjectHero({ project }) {
  const idx = String(
    (
      // pulled from data index if possible; falls back to order
      1
    )
  ).padStart(2, '0');

  return (
    <header className="project-hero">
      <div className="project-hero-copy">
        <div className="project-hero-meta">
          {project.badge} &middot; {project.type === 'research' ? 'Research' : 'Engineering'} Issue
        </div>

        <h1 className="project-hero-title">{project.title}</h1>
        <p className="project-hero-subtitle">{project.subtitle}</p>

        <div className="project-hero-tech">
          {project.tech.map((t) => (
            <span key={t} className="tech-tag" style={{ color: '#f3e1c5', borderColor: 'rgba(245,241,234,0.4)' }}>
              {t}
            </span>
          ))}
        </div>

        <div className="project-hero-stats">
          {(project.stats || []).map((s) => (
            <div key={s.label} className="project-hero-stat">
              <span className="project-hero-stat-value">{s.value}</span>
              <span className="project-hero-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {project.links && (
          <div className="project-hero-actions">
            {project.links.github && (
              <a className="btn btn-primary" href={project.links.github} target="_blank" rel="noopener noreferrer">
                GitHub →
              </a>
            )}
            {project.links.bilibili && (
              <a
                className="btn btn-outline"
                href={`https://www.bilibili.com/video/${project.links.bilibili}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                ▶ 视频演示
              </a>
            )}
          </div>
        )}
      </div>

      <figure className="project-hero-cover">
        <img src={project.cover} alt={project.title} />
        <figcaption className="project-hero-cover-caption">
          <span>{project.id}</span>
          <span>cover · 1600×900</span>
        </figcaption>
      </figure>
    </header>
  );
}
