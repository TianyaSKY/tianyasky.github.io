import React, { useState } from 'react';

export default function ProjectGallery({ project }) {
  const items = (project.gallery || []).slice(0, 5);
  const [open, setOpen] = useState(null);

  if (items.length === 0) return null;

  return (
    <section style={{ padding: '5rem 0' }}>
      <div className="kicker">05 · Gallery</div>
      <h2 className="section-title" style={{ fontSize: '2.6rem', marginTop: '0.5rem' }}>
        视觉证据 / <em>visual evidence</em>
      </h2>

      <div className="project-gallery">
        {items.map((src, i) => (
          <figure key={i} onClick={() => setOpen(src)}>
            <img src={src} alt={`${project.id} ${i + 1}`} />
            <figcaption>{project.id} · fig {i + 1}</figcaption>
          </figure>
        ))}
      </div>

      {open && (
        <div className="inline-demo-modal" onClick={() => setOpen(null)} role="dialog">
          <div className="inline-demo-image" onClick={(e) => e.stopPropagation()}>
            <button className="inline-demo-close" onClick={() => setOpen(null)}>✕ 关闭</button>
            <img src={open} alt="" />
          </div>
        </div>
      )}
    </section>
  );
}
