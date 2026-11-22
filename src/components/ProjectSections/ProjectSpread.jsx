import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import AccessibleDialog from '../AccessibleDialog';

function formatRichLine(text) {
  if (typeof text !== 'string') return text;
  const parts = text.split(/(\*\*.+?\*\*|`.+?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i}>{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

function ArxivFigureCaption({ label, title, caption, analysis, onZoom, compact = false }) {
  let cleanTitle = title ? title.trim() : '';
  if (cleanTitle && !cleanTitle.endsWith('.') && !cleanTitle.endsWith(':')) cleanTitle += '.';

  let cleanLabel = label ? label.trim() : '';
  if (cleanLabel && !cleanLabel.endsWith('.') && !cleanLabel.endsWith(':')) cleanLabel += '.';

  return (
    <figcaption className={`arxiv-figure-caption ${compact ? 'is-compact' : ''}`}>
      <div className="arxiv-caption-body">
        {cleanLabel && <strong className="arxiv-caption-label">{cleanLabel} </strong>}
        {cleanTitle && <strong className="arxiv-caption-title">{cleanTitle} </strong>}
        {caption && <span className="arxiv-caption-text">{formatRichLine(caption)} </span>}
        {onZoom && (
          <button
            type="button"
            className="arxiv-zoom-btn"
            onClick={onZoom}
            aria-label={`Zoom ${label || 'figure'}`}
            title="Inspect figure at full resolution"
          >
            [Zoom]
          </button>
        )}
      </div>

      {analysis && (
        <div className="arxiv-analysis-block">
          <em className="arxiv-analysis-tag">Analysis. </em>
          <span className="arxiv-analysis-text">{formatRichLine(analysis)}</span>
        </div>
      )}
    </figcaption>
  );
}

export default function ProjectSpread({
  index,
  title,
  lead,
  figure,
  bullets,
  stats,
  children,
  onOpenFigure
}) {
  const [modalOpen, setModalOpen] = useState(false);

  const normalizedFigure = figure ? {
    ...figure,
    label: figure.label || (index ? `Figure ${index}` : undefined),
    title: figure.title || (index === "1" ? "Problem Context" : index === "2" ? "Method & Architecture" : index === "3" ? "Results & Evaluation" : undefined)
  } : null;

  const handleZoom = () => {
    if (onOpenFigure && normalizedFigure) {
      onOpenFigure(normalizedFigure);
    } else {
      setModalOpen(true);
    }
  };

  return (
    <section className="project-spread-block">
      <header className="spread-header">
        <h2 className="spread-title">
          {index ? `${index}. ` : ''}
          {title}
        </h2>
      </header>

      <div className="spread-body">
        {lead && (
          <div className="spread-text-lead">
            {lead.split('\n').map((p, i) => (
              <p key={i}>{formatRichLine(p)}</p>
            ))}
          </div>
        )}

        {normalizedFigure && (
          <figure
            className={`spread-figure-showcase${normalizedFigure.wide ? ' is-wide' : ''}${normalizedFigure.kind === 'diagram' ? ' is-diagram' : ''}`}
            title="Click to inspect full-resolution figure"
          >
            <button
              type="button"
              className="figure-zoom-trigger"
              aria-label={`Zoom figure: ${normalizedFigure.title || normalizedFigure.caption || 'Section figure'}`}
              onClick={handleZoom}
            >
              <span className="figure-canvas">
                <img src={normalizedFigure.src} alt={normalizedFigure.title || normalizedFigure.caption || ''} loading="lazy" />
              </span>
            </button>
            <ArxivFigureCaption
              label={normalizedFigure.label}
              title={normalizedFigure.title}
              caption={normalizedFigure.caption}
              analysis={normalizedFigure.analysis}
              onZoom={handleZoom}
            />
          </figure>
        )}

        {bullets && bullets.length > 0 && (
          <div className="spread-highlights-container">
            <h3 className="highlights-header">Key Highlights</h3>
            <ul className="spread-highlights-list">
              {bullets.map((b, i) => (
                <li key={i} className="spread-highlight-li">
                  {formatRichLine(b)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {stats && stats.length > 0 && (
          <div className="project-stat-row">
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

      {modalOpen && normalizedFigure && (
        <AccessibleDialog
          overlayClassName="inline-demo-modal"
          dialogClassName="inline-demo-image"
          label={normalizedFigure.title || normalizedFigure.caption}
          onClose={() => setModalOpen(false)}
        >
          <button className="inline-demo-close" data-dialog-initial-focus onClick={() => setModalOpen(false)}>✕ Close</button>
          <div className="inline-demo-image-viewport">
            <img src={normalizedFigure.src} alt={normalizedFigure.title || normalizedFigure.caption || ''} />
          </div>
          <div className="inline-demo-image-bar">
            <div className="arxiv-modal-caption-content">
              <strong className="arxiv-caption-label">{normalizedFigure.label || 'FIG'}. </strong>
              {normalizedFigure.title && <strong className="arxiv-caption-title">{normalizedFigure.title}. </strong>}
              {normalizedFigure.caption && <span className="arxiv-caption-text">{formatRichLine(normalizedFigure.caption)}</span>}
            </div>
            <a href={normalizedFigure.src} target="_blank" rel="noopener noreferrer" className="view-origin">
              <ExternalLink size={14} /> Open Original
            </a>
          </div>
        </AccessibleDialog>
      )}
    </section>
  );
}
