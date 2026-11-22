import React from 'react';

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
  figures = [],
  bullets,
  stats,
  children,
  onOpenFigure
}) {
  const defaultLabel = index ? `Figure ${index}` : undefined;
  const defaultTitle = index === "1" ? "Problem Context" : index === "2" ? "Method & Architecture" : index === "3" ? "Results & Evaluation" : undefined;

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

        {figures.map((figure, figureIdx) => {
          const label = figure.label || defaultLabel;
          const figureTitle = figure.title || defaultTitle;
          const isWide = figure.wide || figure.aspect === "wide";
          const handleZoom = () => onOpenFigure({ ...figure, label, title: figureTitle });
          return (
            <figure
              key={`${figure.src}-${figureIdx}`}
              className={`spread-figure-showcase${isWide ? ' is-wide' : ''}${figure.kind === 'diagram' ? ' is-diagram' : ''}`}
              title="Click to inspect full-resolution figure"
            >
              <button
                type="button"
                className="figure-zoom-trigger"
                aria-label={`Zoom figure: ${figureTitle || figure.caption || 'Section figure'}`}
                onClick={handleZoom}
              >
                <span className="figure-canvas">
                  <img src={figure.src} alt={figureTitle || figure.caption || ''} loading="lazy" />
                </span>
              </button>
              <ArxivFigureCaption
                label={label}
                title={figureTitle}
                caption={figure.caption}
                analysis={figure.analysis}
                onZoom={handleZoom}
              />
            </figure>
          );
        })}

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
    </section>
  );
}
