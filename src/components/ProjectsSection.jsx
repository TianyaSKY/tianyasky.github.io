import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { projectCatalog } from '../data/projectCatalog';

const tabs = [
  { id: 'research', label: 'Research' },
  { id: 'engineering', label: 'Engineering' }
].map((tab) => ({
  ...tab,
  projects: projectCatalog.filter((project) => project.type === tab.id)
}));

export default function ProjectsSection() {
  const [filter, setFilter] = useState('research');
  const displayedProjects = tabs.find((tab) => tab.id === filter).projects;

  return (
    <div id="projects" className="section-content">
      <h1>🚀 Projects</h1>

      <div className="project-filter-tabs" role="group" aria-label="Project categories">
        {tabs.map(({ id, label, projects }) => (
          <button
            key={id}
            type="button"
            className={`filter-tab-btn ${filter === id ? 'active' : ''}`}
            aria-pressed={filter === id}
            onClick={() => setFilter(id)}
          >
            {label} ({projects.length})
          </button>
        ))}
      </div>

      <div className="paper-box-container">
        {displayedProjects.map((p) => (
          <div className="paper-box" key={p.id}>
            <div className="paper-box-image">
              <Link to={`/projects/${p.id}`}>
                <img src={p.cover} alt={p.title} loading="lazy" />
                <span className={`badge badge--${p.type}`}>{p.badge}</span>
              </Link>
            </div>

            <div className="paper-box-text">
              <p className="paper-title">
                <Link to={`/projects/${p.id}`} className="paper-title-link">
                  <strong>{p.title}</strong>
                </Link>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
