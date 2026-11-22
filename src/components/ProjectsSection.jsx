import React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { projectCatalog } from '../data/projectCatalog';

const tabs = [
  { id: 'research', label: 'Research' },
  { id: 'engineering', label: 'Engineering' }
].map((tab) => ({
  ...tab,
  projects: projectCatalog.filter((project) => project.type === tab.id)
}));

export default function ProjectsSection() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeTab = tabs.find((tab) => tab.id === searchParams.get('projectType')) ?? tabs[0];

  function selectTab(id) {
    if (id === activeTab.id) return;
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('projectType', id);
    navigate({ search: `?${nextParams}`, hash: '#projects' }, { replace: true });
  }

  return (
    <div id="projects" className="section-content">
      <h1>🚀 Projects</h1>

      <div className="project-filter-tabs" role="group" aria-label="Project categories">
        {tabs.map(({ id, label, projects }) => (
          <button
            key={id}
            type="button"
            className={`filter-tab-btn ${activeTab.id === id ? 'active' : ''}`}
            aria-pressed={activeTab.id === id}
            onClick={() => selectTab(id)}
          >
            {label} ({projects.length})
          </button>
        ))}
      </div>

      <div className="paper-box-container">
        {activeTab.projects.map((p) => (
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
