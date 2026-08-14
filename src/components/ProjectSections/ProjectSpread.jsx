import React, { useState } from 'react';
import { ZoomIn, ExternalLink, Sparkles, CheckCircle } from 'lucide-react';

export default function ProjectSpread({
  index,
  kicker,
  title,
  lead,
  figure,
  bullets,
  stats,
  children
}) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="project-spread-block">
      {/* Section Header */}
      <header className="spread-header">
        <div className="spread-kicker">
          <span className="spread-idx">{index}</span>
          <span className="spread-dot">/</span>
          <span className="spread-kicker-text">
            {kicker || (index === '01' ? 'Background & Problem' : index === '02' ? 'Method & Architecture' : 'Results & Metrics')}
          </span>
        </div>
        <h2 className="spread-title">{title}</h2>
      </header>

      {/* Main Narrative & Layout */}
      <div className="spread-body">
        {lead && (
          <div className="spread-text-lead">
            {lead.split('\n').map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        )}

        {/* Featured Visual Figure (Full-width / Natural ratio) */}
        {figure && (
          <figure
            className={`spread-figure-showcase ${figure.wide ? 'is-wide' : ''}`}
            onClick={() => setModalOpen(true)}
            title="点击放大查看高清图表"
          >
            <div className="figure-canvas">
              <img src={figure.src} alt={figure.caption || ''} loading="lazy" />
              <div className="figure-zoom-overlay">
                <span><ZoomIn size={15} /> 点击放大查看高清原图</span>
              </div>
            </div>
            <figcaption className="figure-caption">
              <span className="fig-label">FIG · {index}</span>
              <span className="fig-desc">{figure.caption}</span>
              <span className="fig-btn"><ZoomIn size={12} /> 点击放大</span>
            </figcaption>
          </figure>
        )}

        {/* Key Highlights Card Grid */}
        {bullets && bullets.length > 0 && (
          <div className="spread-highlights-container">
            <div className="highlights-header">
              <Sparkles size={14} style={{ color: 'var(--color-vermilion)' }} />
              <span>核心技术亮点与工程突破 / Key Takeaways</span>
            </div>
            <div className="spread-highlights-grid">
              {bullets.map((b, i) => (
                <div key={i} className="spread-highlight-item">
                  <div className="item-icon">
                    <span className="bullet-num">0{i + 1}</span>
                  </div>
                  <div
                    className="item-text"
                    dangerouslySetInnerHTML={{ __html: b.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Row */}
        {stats && stats.length > 0 && (
          <div className="project-stat-row" style={{ marginTop: '2.5rem' }}>
            {stats.map((s) => (
              <div key={s.label} className="project-stat-cell">
                <div className="v">{s.value}</div>
                <div className="l">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {children}
      </div>

      {/* Lightbox Zoom Modal */}
      {modalOpen && figure && (
        <div className="inline-demo-modal" onClick={() => setModalOpen(false)} role="dialog" aria-label={figure.caption}>
          <div className="inline-demo-image" onClick={(e) => e.stopPropagation()}>
            <button className="inline-demo-close" onClick={() => setModalOpen(false)}>✕ 关闭</button>
            <div className="inline-demo-image-viewport">
              <img src={figure.src} alt={figure.caption || ''} />
            </div>
            <div className="inline-demo-image-bar">
              <span className="caption">{figure.caption}</span>
              <a href={figure.src} target="_blank" rel="noopener noreferrer" className="view-origin">
                <ExternalLink size={14} /> 原图直达
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
