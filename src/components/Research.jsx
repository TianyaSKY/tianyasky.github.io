import React from 'react';
import { researchProjects } from '../data/personalData';
import VisionSimulator from './VisionSimulator';
import SciFiTerminal from './SciFiTerminal';
import { Microscope, ExternalLink, Sparkles } from 'lucide-react';

export default function Research() {
  return (
    <section id="research" className="section-inner">
      <div className="section-label">
        <Microscope size={14} /> Research & Breakthroughs
      </div>
      <h2 className="section-title">科研项目与算法攻关</h2>
      <p className="section-desc">主导与攻关近海厘米级单目姿态估计、大模型 SFT 风格微调与强化学习算法</p>

      <div className="projects-list">
        {researchProjects.map((proj) => (
          <div key={proj.id} className="project-card bento-card">
            <div className="project-header">
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-primary)', fontFamily: 'var(--font-mono)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {proj.category}
                </span>
                <h3 className="project-name">{proj.title}</h3>
              </div>
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

            {proj.hasVisionDemo && <VisionSimulator />}

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
