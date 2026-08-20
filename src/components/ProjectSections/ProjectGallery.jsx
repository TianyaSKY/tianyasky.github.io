import React, { useState } from 'react';
import { ZoomIn, ExternalLink } from 'lucide-react';

export default function ProjectGallery({ project }) {
  const items = project.gallery || [];
  const [open, setOpen] = useState(null);

  if (items.length === 0) return null;

  const count = items.length;
  let galleryClass = 'project-gallery-3items';
  if (count === 1) galleryClass = 'project-gallery-1item';
  else if (count === 2) galleryClass = 'project-gallery-2items';
  else if (count === 3) galleryClass = 'project-gallery-3items';
  else if (count === 4) galleryClass = 'project-gallery-4items';
  else if (count >= 5) galleryClass = 'project-gallery-expanded';

  return (
    <section className="project-gallery-section" style={{ padding: '5rem 0 3rem' }}>
      <div className="kicker">05 · Gallery</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem', marginBottom: '1.75rem' }}>
        <h2 className="section-title" style={{ fontSize: '2.6rem', margin: 0 }}>
          视觉证据 / <em>visual evidence</em>
        </h2>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          {items.length} 份全尺寸架构与收敛实证 · 点击可放大查看
        </span>
      </div>

      <div className={`project-gallery-container ${galleryClass}`}>
        {items.map((item, i) => {
          const src = typeof item === 'string' ? item : item.src;
          const caption = typeof item === 'string' ? `${project.id} · fig ${i + 1}` : item.caption;
          const isWide = item.aspect === 'wide' || (count === 3 && i === 0);

          return (
            <figure
              key={src + i}
              className={`gallery-figure ${isWide ? 'gallery-figure-wide' : ''}`}
              onClick={() => setOpen({ src, caption })}
              title="点击查看大图"
            >
              <div className="gallery-figure-inner">
                <img src={src} alt={caption || `${project.title} ${i + 1}`} loading="lazy" />
              </div>
              <figcaption>
                <span className="fig-tag">FIG · 0{i + 1}</span>
                <span className="fig-caption">{caption || `${project.id} · fig ${i + 1}`}</span>
              </figcaption>
            </figure>
          );
        })}
      </div>

      {open && (
        <div className="inline-demo-modal" onClick={() => setOpen(null)} role="dialog" aria-label={open.caption}>
          <div className="inline-demo-image" onClick={(e) => e.stopPropagation()}>
            <button className="inline-demo-close" onClick={() => setOpen(null)}>✕ 关闭</button>
            <div className="inline-demo-image-viewport">
              <img src={open.src} alt={open.caption || ''} />
            </div>
            <div className="inline-demo-image-bar">
              <span className="caption">{open.caption}</span>
              <a href={open.src} target="_blank" rel="noopener noreferrer" className="view-origin">
                <ExternalLink size={14} /> 原图直达
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
