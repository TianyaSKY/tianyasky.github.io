import React from 'react';
import { researchProjects } from '../data/personalData';
import SciFiTerminal from './SciFiTerminal';
import { Microscope, ExternalLink } from 'lucide-react';

export default function Research() {
  return (
    <section id="research" className="section-inner">
      <div className="section-label">
        <Microscope size={14} /> Research
      </div>
      <h2 class="section-title">科研项目</h2>
      <p className="section-desc">专注三维视觉定位、强泛化位姿估计与大模型微调工程</p>

      <div className="projects-list">
        {researchProjects.map((proj) => (
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
                  查看 GitHub 源码 <ExternalLink size={14} />
                </a>
              </div>
            )}

            {proj.hasTerminalSim && <SciFiTerminal />}

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
