import React from 'react';

export default function ProjectHero({ project }) {
  const projectKind = project.type === 'research' ? 'Research' : 'Engineering';

  return (
    <header className="project-hero">
      <div className="project-hero-copy">
        <div className="project-hero-heading">
          <div className="project-hero-meta">
            {project.badge} &middot; {projectKind} Issue
          </div>

          <h1 className="project-hero-title">{project.title}</h1>
          <p className="project-hero-subtitle">{project.subtitle}</p>

          <div className="project-hero-tech">
            {project.tech.map((t) => (
              <span key={t} className="tech-tag">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="project-hero-facts">
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
              {project.links.gitee && (
                <a className="btn btn-primary" href={project.links.gitee} target="_blank" rel="noopener noreferrer">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    Gitee 仓库 →
                  </span>
                </a>
              )}
              {project.links.github && (
                <a className="btn btn-primary" href={project.links.github} target="_blank" rel="noopener noreferrer">
                  GitHub →
                </a>
              )}
              {project.links.download && (
                <a
                  className="btn btn-outline"
                  href={project.links.download}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={project.links.downloadLabel || 'liucixin_train.zip'}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    下载训练结果 ({project.links.downloadLabel || 'ZIP'}) ↓
                  </span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      <figure
        className="project-hero-cover"
        style={{ '--project-cover': `url("${project.cover}")` }}
      >
        <img className="project-hero-cover-image" src={project.cover} alt={project.title} />
        <figcaption className="project-hero-cover-caption">
          <span>{project.id}</span>
          <span>cover · 1600×900</span>
        </figcaption>
      </figure>
    </header>
  );
}
