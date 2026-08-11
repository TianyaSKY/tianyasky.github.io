import React from 'react';
import { FileText } from 'lucide-react';

export default function ProjectSpread({ layout = 'default', index, title, lead, figure, bullets, stats }) {
  const isAlt = layout === 'alt';
  return (
    <section className={`project-spread ${isAlt ? 'alt' : ''}`}>
      <aside>
        <div className="project-spread-index">{index}</div>
        <h2 className="project-spread-title">{title}</h2>
        {figure && (
          <figure className="project-spread-figure" style={{ marginTop: '2rem' }}>
            <img src={figure.src} alt={figure.caption || ''} />
            <figcaption>
              <span>fig · {figure.caption}</span>
              <span>↓</span>
            </figcaption>
          </figure>
        )}
      </aside>

      <div>
        {lead && (
          <div className="project-spread-body">
            {lead.split('\n').map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        )}

        {bullets && bullets.length > 0 && (
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '1.5rem' }}>
            {bullets.map((b, i) => (
              <li
                key={i}
                style={{
                  padding: '1rem 0',
                  borderTop: '1px solid var(--rule)',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'flex-start',
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.05rem',
                  lineHeight: 1.6
                }}
              >
                <FileText
                  size={16}
                  style={{ color: 'var(--color-vermilion)', marginTop: '0.35rem', flexShrink: 0 }}
                />
                <div dangerouslySetInnerHTML={{ __html: b.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
              </li>
            ))}
          </ul>
        )}

        {stats && stats.length > 0 && (
          <div className="project-stat-row" style={{ marginTop: '2rem' }}>
            {stats.map((s) => (
              <div key={s.label} className="project-stat-cell">
                <div className="v">{s.value}</div>
                <div className="l">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
