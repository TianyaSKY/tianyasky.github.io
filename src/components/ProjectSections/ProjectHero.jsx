import React from 'react';

export default function ProjectHero({ project }) {
  const projectKind = project.type === 'research' ? 'Research' : 'Engineering';

  return (
    <header className="project-hero">
      <div className="project-hero-meta">
        <span>{project.badge}</span>
        <span>&middot;</span>
        <span>{projectKind}</span>
      </div>

      <h1 className="project-hero-title">{project.title}</h1>
      <p className="project-hero-subtitle">{project.subtitle}</p>

      {project.tech && project.tech.length > 0 && (
        <div className="project-hero-tech">
          {project.tech.map((t) => (
            <span key={t} className="tech-tag">
              {t}
            </span>
          ))}
        </div>
      )}

      {project.links && (
        <div className="project-hero-actions">
          {project.links.github && (
            <a className="btn btn-primary" href={project.links.github} target="_blank" rel="noopener noreferrer">
              GitHub Repository →
            </a>
          )}
          {project.links.gitee && (
            <a className="btn btn-outline" href={project.links.gitee} target="_blank" rel="noopener noreferrer">
              Gitee Repository →
            </a>
          )}
          {project.links.download && (
            <a
              className="btn btn-outline"
              href={project.links.download}
              target="_blank"
              rel="noopener noreferrer"
              download={project.links.downloadLabel || 'weights.zip'}
            >
              Download Checkpoints ({project.links.downloadLabel || 'ZIP'}) ↓
            </a>
          )}
        </div>
      )}

      {project.stats && project.stats.length > 0 && (
        <div className="project-hero-stats">
          {project.stats.map((s) => (
            <div key={s.label} className="project-hero-stat">
              <span className="project-hero-stat-value">{s.value}</span>
              <span className="project-hero-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {project.cover && (
        <figure className="project-hero-cover">
          <img className="project-hero-cover-image" src={project.cover} alt={project.title} />
        </figure>
      )}
    </header>
  );
}
