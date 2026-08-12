import React, { useState } from 'react';

export default function ProjectGallery({ project }) {
  const items = project.gallery || [];
  const [open, setOpen] = useState(null);

  if (items.length === 0) return null;

  return (
    <section style={{ padding: '5rem 0' }}>
      <div className="kicker">05 · Gallery</div>
      <h2 className="section-title" style={{ fontSize: '2.6rem', marginTop: '0.5rem' }}>
        视觉证据 / <em>visual evidence</em>
      </h2>

      <div className={`project-gallery ${items.length > 5 ? 'project-gallery-expanded' : ''}`}>
        {items.map((item, i) => {
          const src = typeof item === 'string' ? item : item.src;
          const caption = typeof item === 'string' ? `${project.id} · fig ${i + 1}` : item.caption;
          return (
            <figure key={src} onClick={() => setOpen({ src, caption })}>
              <img src={src} alt={caption || `${project.title} ${i + 1}`} />
              <figcaption>{caption || `${project.id} · fig ${i + 1}`}</figcaption>
            </figure>
          );
        })}
      </div>

      {open && (
        <div className="inline-demo-modal" onClick={() => setOpen(null)} role="dialog" aria-label={open.caption}>
          <div className="inline-demo-image" onClick={(e) => e.stopPropagation()}>
            <button className="inline-demo-close" onClick={() => setOpen(null)}>✕ 关闭</button>
            <img src={open.src} alt={open.caption || ''} />
          </div>
        </div>
      )}
    </section>
  );
}
