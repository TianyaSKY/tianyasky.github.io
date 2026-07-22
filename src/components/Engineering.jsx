import React from 'react';
import { engineeringProjects } from '../data/personalData';
import { Cpu, ExternalLink } from 'lucide-react';

export default function Engineering() {
  return (
    <section id="projects" className="section-inner">
      <div className="section-label">
        <Cpu size={14} /> Engineering
      </div>
      <h2 className="section-title">工程项目</h2>
      <p className="section-desc">个人独立开发或主导的大型系统工程与 AI 原生应用</p>

      <div className="projects-list">
        {engineeringProjects.map((proj) => (
          <div key={proj.id} className="project-card">
            <div className="project-header">
              <h3 className="project-name">{proj.title}</h3>
              <span className="project-badge">{proj.badge}</span>
            </div>

            <div className="tech-tags">
              {proj.tech.map((t, idx) => (
                <span key={idx} className="tech-tag">
                  {t}
                </span>
              ))}
            </div>

            <p className="project-desc">{proj.description}</p>

            <ul className="project-highlights">
              {proj.highlights.map((hl, idx) => (
                <li key={idx}>
                  <span>{hl}</span>
                </li>
              ))}
            </ul>

            {proj.github && (
              <div className="project-links-bar">
                <a
                  href={proj.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-github-link"
                >
                  查看 GitHub 项目 <ExternalLink size={14} />
                </a>
              </div>
            )}

            {proj.bilibiliBvid && (
              <div className="video-container">
                <iframe
                  src={`https://player.bilibili.com/player.html?bvid=${proj.bilibiliBvid}&page=1&high_quality=1&as_wide=1&danmaku=0`}
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen={true}
                  title={proj.title}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
