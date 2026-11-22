import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { projects } from '../data/projectDetails';
import NotFound from './NotFound';
import {
  ArrowLeft,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2
} from 'lucide-react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import ProjectHero from '../components/ProjectSections/ProjectHero';
import ProjectSpread from '../components/ProjectSections/ProjectSpread';
import SciFiTerminal from '../components/SciFiTerminal';
import AccessibleDialog from '../components/AccessibleDialog';

function renderMathText(text) {
  if (typeof text !== 'string') return text;
  if (!text.includes('$') && !text.includes('`')) return text;

  const parts = text.split(/(\$\$[\s\S]+?\$\$|\$[^\$]+?\$|`[^`]+?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('$$') && part.endsWith('$$')) {
      const tex = part.slice(2, -2).trim();
      try {
        const html = katex.renderToString(tex, { displayMode: true, throwOnError: false });
        return <span key={i} className="math-display" dangerouslySetInnerHTML={{ __html: html }} />;
      } catch (e) {
        return <code key={i}>{part}</code>;
      }
    } else if (part.startsWith('$') && part.endsWith('$')) {
      const tex = part.slice(1, -1).trim();
      try {
        const html = katex.renderToString(tex, { displayMode: false, throwOnError: false });
        return <span key={i} className="math-inline" dangerouslySetInnerHTML={{ __html: html }} />;
      } catch (e) {
        return <code key={i}>{part}</code>;
      }
    } else if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i}>{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

function MathBlock({ formula }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(formula, { displayMode: true, throwOnError: false });
    } catch (e) {
      return `<pre><code>${formula}</code></pre>`;
    }
  }, [formula]);
  return <div className="math-formula-box" dangerouslySetInnerHTML={{ __html: html }} />;
}

function ArxivFigureCaption({ label, title, caption, analysis, onZoom, compact = false }) {
  let cleanTitle = title ? title.trim() : '';
  if (cleanTitle && !cleanTitle.endsWith('.') && !cleanTitle.endsWith(':')) {
    cleanTitle += '.';
  }

  let cleanLabel = label ? label.trim() : '';
  if (cleanLabel && !cleanLabel.endsWith('.') && !cleanLabel.endsWith(':')) {
    cleanLabel += '.';
  }

  return (
    <figcaption className={`arxiv-figure-caption ${compact ? 'is-compact' : ''}`}>
      <div className="arxiv-caption-body">
        {cleanLabel && <strong className="arxiv-caption-label">{cleanLabel} </strong>}
        {cleanTitle && <strong className="arxiv-caption-title">{cleanTitle} </strong>}
        {caption && <span className="arxiv-caption-text">{renderMathText(caption)} </span>}
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
          <span className="arxiv-analysis-text">{renderMathText(analysis)}</span>
        </div>
      )}
    </figcaption>
  );
}

function ArxivTableCaption({ caption }) {
  if (!caption) return null;
  const match = caption.match(/^(Table\s+[\dA-Za-z]+)\s*[:|·\-.]\s*(.*)$/i);
  if (match) {
    const tableLabel = match[1];
    let tableText = match[2].trim();
    if (!tableText.endsWith('.')) tableText += '.';
    return (
      <div className="arxiv-table-caption">
        <strong className="arxiv-table-label">{tableLabel}: </strong>
        <span className="arxiv-table-title">{renderMathText(tableText)}</span>
      </div>
    );
  }
  return (
    <div className="arxiv-table-caption">
      <strong className="arxiv-table-title">{renderMathText(caption)}</strong>
    </div>
  );
}

function PaperInlineFigure({ figure, onOpen }) {
  return (
    <figure className={`paper-inline-figure ${figure.wide ? 'is-wide' : ''}`}>
      <button
        type="button"
        className="figure-zoom-trigger"
        aria-label={`Zoom figure: ${figure.title || figure.caption}`}
        onClick={() => onOpen(figure)}
      >
        <span className="figure-canvas">
          <img src={figure.src} alt={figure.title || figure.caption} loading="lazy" />
        </span>
      </button>
      <ArxivFigureCaption
        label={figure.label}
        title={figure.title}
        caption={figure.caption}
        analysis={figure.analysis}
        onZoom={() => onOpen(figure)}
      />
    </figure>
  );
}

function FigureLightboxModal({ figure, onClose }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  React.useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [figure]);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '+' || e.key === '=') setScale((s) => Math.min(Number((s + 0.25).toFixed(2)), 4.0));
      if (e.key === '-' || e.key === '_') setScale((s) => Math.max(Number((s - 0.25).toFixed(2)), 0.5));
      if (e.key === '0') {
        setScale(1);
        setPosition({ x: 0, y: 0 });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!figure) return null;

  const handleZoomIn = () => setScale((s) => Math.min(Number((s + 0.25).toFixed(2)), 4.0));
  const handleZoomOut = () => setScale((s) => Math.max(Number((s - 0.25).toFixed(2)), 0.5));
  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };
  const handleActualSize = () => {
    setScale((s) => (s === 1.6 ? 1 : 1.6));
    setPosition({ x: 0, y: 0 });
  };

  const handleWheel = (e) => {
    e.stopPropagation();
    const delta = e.deltaY < 0 ? 0.2 : -0.2;
    setScale((s) => Math.min(Math.max(Number((s + delta).toFixed(2)), 0.5), 4.0));
  };

  const handleMouseDown = (e) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleDoubleClick = () => {
    if (scale > 1) {
      handleReset();
    } else {
      setScale(1.8);
    }
  };

  return (
    <AccessibleDialog
      overlayClassName="project-modal-backdrop"
      dialogClassName="project-modal-shell"
      label={figure.title || figure.caption}
      onClose={onClose}
    >
        {/* Header with full inspection tools */}
        <header className="project-modal-header">
          <div className="modal-header-meta">
            <span className="modal-fig-label">{figure.label ? `arXiv · ${figure.label}` : 'arXiv · FIG'}</span>
            <span className="project-modal-title">
              <strong>{figure.title || figure.label || 'Figure Inspection'}</strong>
            </span>
          </div>

          <div className="modal-header-actions">
            <div className="modal-zoom-controls">
              <button
                type="button"
                className="zoom-btn"
                onClick={handleZoomOut}
                title="Zoom Out (-)"
              >
                <ZoomOut size={15} />
              </button>
              <span className="zoom-level-badge">{Math.round(scale * 100)}%</span>
              <button
                type="button"
                className="zoom-btn"
                onClick={handleZoomIn}
                title="Zoom In (+)"
              >
                <ZoomIn size={15} />
              </button>
              <button
                type="button"
                className="zoom-btn text-btn"
                onClick={handleReset}
                title="Fit to Window (Reset, 0)"
              >
                <RotateCcw size={13} style={{ marginRight: 3 }} /> Fit Window
              </button>
              <button
                type="button"
                className={`zoom-btn text-btn ${scale > 1 ? 'is-active' : ''}`}
                onClick={handleActualSize}
                title="High-Resolution Detail Mode"
              >
                <Maximize2 size={13} style={{ marginRight: 3 }} /> {scale > 1 ? 'Reset Size' : 'HD Detail'}
              </button>
            </div>

            <a
              href={figure.src}
              target="_blank"
              rel="noopener noreferrer"
              className="modal-origin-link"
              title="Open full-resolution original image in a new tab"
            >
              <ExternalLink size={14} /> Open Original
            </a>

            <button
              type="button"
              className="project-modal-close"
              data-dialog-initial-focus
              onClick={onClose}
              aria-label="Close modal"
              title="Press ESC or click to close"
            >
              ✕ Close
            </button>
          </div>
        </header>

        {/* Viewport Canvas with high contrast and smooth drag-pan */}
        <div
          className={`project-modal-image-wrap ${scale > 1 ? 'is-zoomable' : ''} ${isDragging ? 'is-dragging' : ''}`}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onDoubleClick={handleDoubleClick}
        >
          <img
            src={figure.src}
            alt={figure.caption || ''}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transition: isDragging ? 'none' : 'transform 0.15s cubic-bezier(0.2, 0, 0, 1)'
            }}
            draggable={false}
          />
          <div className="modal-canvas-hint">
            {scale > 1 ? 'Hold left mouse button to pan · Scroll to zoom · Double-click to reset' : 'Scroll or double-click to zoom · Drag to pan and inspect details'}
          </div>
        </div>

        {/* Informative Captions & Diagnostics Footer */}
        {(figure.caption || figure.analysis) && (
          <footer className="project-modal-footer arxiv-modal-footer">
            <div className="arxiv-modal-caption-content">
              <div className="arxiv-caption-body">
                {figure.label && (
                  <strong className="arxiv-caption-label">
                    {figure.label.endsWith('.') || figure.label.endsWith(':') ? figure.label : `${figure.label}.`}{' '}
                  </strong>
                )}
                {figure.title && (
                  <strong className="arxiv-caption-title">
                    {figure.title.endsWith('.') || figure.title.endsWith(':') ? figure.title : `${figure.title}.`}{' '}
                  </strong>
                )}
                {figure.caption && (
                  <span className="arxiv-caption-text">{renderMathText(figure.caption)}</span>
                )}
              </div>
              {figure.analysis && (
                <div className="arxiv-analysis-block">
                  <em className="arxiv-analysis-tag">Analysis. </em>
                  <span className="arxiv-analysis-text">{renderMathText(figure.analysis)}</span>
                </div>
              )}
            </div>
          </footer>
        )}
    </AccessibleDialog>
  );
}

const toFigureList = (value) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

export default function ProjectDetail() {
  const { id } = useParams();
  const project = useMemo(() => projects.find((p) => p.id === id), [id]);
  const related = useMemo(
    () => (project ? projects.filter((p) => p.id !== project.id && p.type === project.type).slice(0, 3) : []),
    [project]
  );

  const [modalFigure, setModalFigure] = useState(null);

  const paperArticle = project?.paperArticle;

  if (!project) return <NotFound />;

  return (
    <article className="project-detail">
      {/* Backbar */}
      <div className="project-detail-backbar">
        <Link to={`/?projectType=${project.type}#projects`} className="btn-link">
          <ArrowLeft size={14} /> Back to Projects
        </Link>
      </div>

      {/* Hero */}
      <ProjectHero project={project} />

      {/* Academic Paper Abstract Block (When paperInfo is present) */}
      {project.paperInfo && (
        <section className="paper-abstract-section">
          <div className="paper-abstract-card">
            <h2 className="paper-main-title">
              {project.paperInfo.titleEn}
            </h2>

            <div className="paper-abstract-body">
              <p className="abstract-text">
                <strong>Abstract. </strong>
                {project.paperInfo.abstractEn}
              </p>
            </div>

            {project.paperInfo.keywordsEn && project.paperInfo.keywordsEn.length > 0 && (
              <footer className="paper-abstract-footer">
                <span className="keywords-label">
                  <strong>Keywords:</strong>
                </span>
                <span className="keywords-list-inline">
                  {project.paperInfo.keywordsEn.join(' · ')}
                </span>
              </footer>
            )}
          </div>
        </section>
      )}

      {/* Interactive AI Terminal or Simulator when available */}
      {project.hasTerminalSim && (
        <section className="project-interactive-demo">
          <h2 className="section-title">Interactive Sci-Fi Continuation Terminal</h2>
          <SciFiTerminal defaultOpen={false} />
        </section>
      )}

      {/* Demo · embedded video when recorded */}
      {project.video && (
        <section className="project-demo">
          <h2 className="section-title">Video Walkthrough</h2>
          <video
            className="project-demo-video"
            src={project.video}
            controls
            preload="metadata"
            poster={project.cover}
          />
        </section>
      )}

      {/* ========================================================================= */}
      {/* MODE A: Publication-Grade Academic Paper Reader (When paperArticle is present) */}
      {/* ========================================================================= */}
      {paperArticle ? (
        <div className="paper-article-layout">
          <div className="paper-article-container">
            {paperArticle.sections.map((sec) => (
              <section key={sec.id} id={sec.id} className="paper-section-block">
                <header className="paper-section-header">
                  <h2 className="paper-section-title">
                    {sec.number}. {sec.title}
                  </h2>
                </header>

                <div className="paper-section-content">
                  {sec.paragraphs && sec.paragraphs.length > 0 && (
                    <div className="paper-paragraphs-group">
                      {sec.paragraphs.map((p, pIdx) => (
                        <p key={pIdx} className="paper-p">{renderMathText(p)}</p>
                      ))}
                    </div>
                  )}

                  {sec.contributions && (
                    <div className="paper-contributions-card">
                      <h3 className="paper-subsection-title">Core Contributions</h3>
                      <ul className="paper-contributions-list">
                        {sec.contributions.map((c, cIdx) => (
                          <li key={cIdx} className="contribution-li">
                            {renderMathText(c)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {sec.math && (
                    <div className="paper-math-block">
                      <MathBlock formula={sec.math.formula} />
                      {sec.math.explanation && (
                        <p className="paper-p math-explanation">{renderMathText(sec.math.explanation)}</p>
                      )}
                    </div>
                  )}

                  {sec.figure && (
                    <PaperInlineFigure figure={sec.figure} onOpen={setModalFigure} />
                  )}

                  {sec.subsections && (
                    <div className="paper-subsections-flow">
                      {sec.subsections.map((sub, sIdx) => (
                        <div key={sIdx} className="paper-subsection-item">
                          <h3 className="paper-subsection-title">{sub.title}</h3>
                          <p className="paper-p">{renderMathText(sub.content)}</p>
                          {sub.figures?.map(figure => (
                            <PaperInlineFigure key={figure.src} figure={figure} onOpen={setModalFigure} />
                          ))}
                        </div>
                      ))}
                    </div>
                  )}

                  {sec.trainingPillars && (
                    <div className="paper-training-pillars">
                      {sec.trainingPillars.map((tp, tpIdx) => (
                        <div key={tpIdx} className="training-pillar-item">
                          <h4>{tp.title}</h4>
                          <p>{renderMathText(tp.detail)}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {sec.id === 'sec-results' && (
                    <div className="paper-benchmark-block">
                      {sec.datasetFigure && (
                        <PaperInlineFigure figure={sec.datasetFigure} onOpen={setModalFigure} />
                      )}

                      {sec.datasetOverview && (
                        <PaperInlineFigure figure={sec.datasetOverview} onOpen={setModalFigure} />
                      )}

                      {project.benchmarkTable && (
                        <div className="academic-table-wrapper">
                          <ArxivTableCaption caption={project.benchmarkTable.caption} />
                          <div className="academic-table-container">
                            <table className="academic-booktabs-table">
                              <thead>
                                <tr>
                                  {project.benchmarkTable.columns.map((col, idx) => (
                                    <th key={idx} className={idx >= 1 && idx <= (project.benchmarkTable.columns.length - 2) ? 'col-num' : ''}>{col}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {project.benchmarkTable.rows.map((row, idx) => {
                                  if (row.cells) {
                                    return (
                                      <tr key={idx} className={`${row.highlight ? 'row-highlight' : ''} ${row.isSummary ? 'row-summary' : ''} ${row.isOurs ? 'row-ours' : ''}`}>
                                        {row.cells.map((cell, cIdx) => (
                                          <td
                                            key={cIdx}
                                            className={
                                              typeof cell === 'object' && cell.className
                                                ? cell.className
                                                : cIdx === 0
                                                ? 'cell-dataset'
                                                : cIdx >= 1 && cIdx <= (row.cells.length - 2)
                                                ? 'col-num'
                                                : 'cell-comment'
                                            }
                                          >
                                            {typeof cell === 'object' ? (
                                              cell.strong !== false ? <strong>{renderMathText(cell.text)}</strong> : renderMathText(cell.text)
                                            ) : (
                                              renderMathText(cell)
                                            )}
                                          </td>
                                        ))}
                                      </tr>
                                    );
                                  }
                                  return (
                                    <tr key={idx} className={`${row.highlight ? 'row-highlight' : ''} ${row.isSummary ? 'row-summary' : ''}`}>
                                      <td className="cell-dataset">
                                        <strong>{row.dataset}</strong>
                                      </td>
                                      <td className="col-num">{row.testN}</td>
                                      <td className="col-num val-mae"><strong>{row.mae}</strong></td>
                                      <td className="col-num val-rmse"><strong>{row.rmse}</strong></td>
                                      <td className="col-num">{row.nae}</td>
                                      <td className="cell-comment">{row.comment}</td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                          <div className="table-footnote">
                            {project.benchmarkTable.footnote || 'Note: ↓ indicates lower is better; Macro Average summarizes performance across domains.'}
                          </div>
                        </div>
                      )}

                      {(project.sotaTable || sec.sotaNarrative) && (
                        <div className="paper-sota-narrative">
                          <h3 className="paper-subsection-title">
                            {sec.sotaTitle || "Cross-Benchmark Comparison with Published Models"}
                          </h3>
                          <p className="paper-p">
                            {renderMathText(
                              sec.sotaNarrative ||
                              "We compare YOLO-PGMD with six representative crowd-counting models published at CVPR, ICCV, and NeurIPS under the same benchmark protocols."
                            )}
                          </p>

                          {project.sotaTable && (
                            <div className="academic-table-wrapper">
                              <ArxivTableCaption caption={project.sotaTable.caption} />
                              <div className="academic-table-container">
                                <table className="academic-booktabs-table">
                                  <thead>
                                    <tr>
                                      {project.sotaTable.columns.map((col, idx) => (
                                        <th key={idx} className={idx >= 1 && idx <= (project.sotaTable.columns.length - 2) ? 'col-num' : ''}>{col}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {project.sotaTable.rows.map((row, idx) => {
                                      if (row.cells) {
                                        return (
                                          <tr key={idx} className={row.isOurs ? 'row-ours' : ''}>
                                            {row.cells.map((cell, cIdx) => (
                                              <td
                                                key={cIdx}
                                                className={
                                                  typeof cell === 'object' && cell.className
                                                    ? cell.className
                                                    : cIdx === 0
                                                    ? 'cell-model'
                                                    : cIdx >= 1 && cIdx <= (row.cells.length - 2)
                                                    ? `col-num ${row.isOurs ? 'highlight-cell' : ''}`
                                                    : 'cell-venue'
                                                }
                                              >
                                                {typeof cell === 'object' ? (
                                                  cell.strong !== false ? <strong>{renderMathText(cell.text)}</strong> : renderMathText(cell.text)
                                                ) : (
                                                  renderMathText(cell)
                                                )}
                                              </td>
                                            ))}
                                          </tr>
                                        );
                                      }
                                      return (
                                        <tr key={idx} className={row.isOurs ? 'row-ours' : ''}>
                                          <td className="cell-model">
                                            <strong>{row.model}</strong>
                                          </td>
                                          <td className={`col-num ${row.isOurs ? 'highlight-cell' : ''}`}>{row.shaA}</td>
                                          <td className="col-num">{row.shaB}</td>
                                          <td className="col-num">{row.ucfQnrf}</td>
                                          <td className={`col-num ${row.isOurs ? 'highlight-cell' : ''}`}>{row.jhu}</td>
                                          <td className="col-num">{row.ucfCc50}</td>
                                          <td className="cell-venue">{row.venue}</td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                              <div className="table-footnote">
                                {project.sotaTable.footnote || 'Reference models include CSRNet (CVPR\'18), Bayesian Loss (ICCV\'19), DM-Count (NeurIPS\'20), MAN (CVPR\'22), and CLIP-EBC (arXiv\'24).'}
                              </div>
                            </div>
                          )}

                          {sec.sotaFigure && (
                            <PaperInlineFigure figure={sec.sotaFigure} onOpen={setModalFigure} />
                          )}
                        </div>
                      )}

                      {sec.scatterFigures && (
                        <div className="paper-scatter-analysis-block">
                          <h3 className="paper-subsection-title">
                            Ground-Truth vs. Predicted Count Regression Consistency
                          </h3>
                          {sec.scatterDiscussion && (
                            <p className="paper-p">{renderMathText(sec.scatterDiscussion)}</p>
                          )}
                          <div className="paper-scatter-grid">
                            {sec.scatterFigures.map((sFig, sfIdx) => (
                              <figure key={sfIdx} className="scatter-figure-card">
                                <button
                                  type="button"
                                  className="figure-zoom-trigger"
                                  aria-label={`Zoom figure: ${sFig.title || sFig.caption}`}
                                  onClick={() => setModalFigure(sFig)}
                                >
                                  <span className="figure-canvas">
                                    <img src={sFig.src} alt={sFig.title || sFig.caption} loading="lazy" />
                                  </span>
                                </button>
                                <ArxivFigureCaption
                                  label={sFig.label}
                                  title={sFig.title}
                                  caption={sFig.caption}
                                  analysis={sFig.analysis}
                                  onZoom={() => setModalFigure(sFig)}
                                  compact={true}
                                />
                              </figure>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {sec.cases && (
                    <div className="paper-case-studies-stream">
                      {sec.cases.map((cItem, cIdx) => (
                        <div key={cItem.id || cIdx} className="paper-case-card">
                          <h3 className="paper-subsection-title">
                            {cItem.tag} {cItem.dataset ? `(${cItem.dataset})` : ''}
                          </h3>
                          <PaperInlineFigure
                            figure={{ ...cItem.figure, wide: true, analysis: cItem.analysis }}
                            onOpen={setModalFigure}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            ))}
          </div>
        </div>
      ) : (
        <>
          <ProjectSpread
            index="1"
            title="Problem & Motivation"
            lead={project.background}
            figures={toFigureList(project.caseFigures?.background).length
              ? toFigureList(project.caseFigures.background)
              : [{ src: project.cover, label: "Figure 1", title: "Problem Context", caption: project.description || project.title }]}
            onOpenFigure={setModalFigure}
          />

          <ProjectSpread
            index="2"
            title="Method & Architecture"
            lead={project.method}
            figures={toFigureList(project.caseFigures?.method).length
              ? toFigureList(project.caseFigures.method)
              : [{ src: project.cover, label: "Figure 2", title: "Method & Architecture", caption: project.method ? `${project.title} core methodology and technical architecture.` : `${project.id} · pipeline schematic`, wide: true }]}
            bullets={project.highlights}
            onOpenFigure={setModalFigure}
          />

          <ProjectSpread
            index="3"
            title="Results & Evaluation"
            lead={project.results}
            figures={toFigureList(project.caseFigures?.results).length
              ? toFigureList(project.caseFigures.results)
              : [{ src: project.cover, label: "Figure 3", title: "Results & Evaluation", caption: project.results ? `${project.title} experimental verification and performance evaluation.` : `${project.id} · evaluation results` }]}
            onOpenFigure={setModalFigure}
          >
            {project.benchmarkTable && (
              <div className="academic-table-wrapper">
                <ArxivTableCaption caption={project.benchmarkTable.caption} />
                <div className="academic-table-container">
                  <table className="academic-booktabs-table">
                    <thead>
                      <tr>
                        {project.benchmarkTable.columns.map((col, idx) => (
                          <th key={idx} className={idx >= 1 && idx <= 4 ? 'col-num' : ''}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {project.benchmarkTable.rows.map((row, idx) => (
                        <tr key={idx} className={`${row.highlight ? 'row-highlight' : ''} ${row.isSummary ? 'row-summary' : ''}`}>
                          <td className="cell-dataset">
                            <strong>{row.dataset}</strong>
                          </td>
                          <td className="col-num">{row.testN}</td>
                          <td className="col-num val-mae"><strong>{row.mae}</strong></td>
                          <td className="col-num val-rmse"><strong>{row.rmse}</strong></td>
                          <td className="col-num">{row.nae}</td>
                          <td className="cell-comment">{row.comment}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="table-footnote">
                  Note: ↓ indicates lower is better; Macro Average summarizes performance across domains.
                </div>
              </div>
            )}

            {project.sotaTable && (
              <div className="academic-table-wrapper">
                <ArxivTableCaption caption={project.sotaTable.caption} />
                <div className="academic-table-container">
                  <table className="academic-booktabs-table">
                    <thead>
                      <tr>
                        {project.sotaTable.columns.map((col, idx) => (
                          <th key={idx} className={idx >= 1 && idx <= 5 ? 'col-num' : ''}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {project.sotaTable.rows.map((row, idx) => (
                        <tr key={idx} className={row.isOurs ? 'row-ours' : ''}>
                          <td className="cell-model">
                            <strong>{row.model}</strong>
                          </td>
                          <td className={`col-num ${row.isOurs ? 'highlight-cell' : ''}`}>{row.shaA}</td>
                          <td className="col-num">{row.shaB}</td>
                          <td className="col-num">{row.ucfQnrf}</td>
                          <td className={`col-num ${row.isOurs ? 'highlight-cell' : ''}`}>{row.jhu}</td>
                          <td className="col-num">{row.ucfCc50}</td>
                          <td className="cell-venue">{row.venue}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="table-footnote">
                  Reference models include CSRNet (CVPR'18), Bayesian Loss (ICCV'19), DM-Count (NeurIPS'20), MAN (CVPR'22), and CLIP-EBC (arXiv'24).
                </div>
              </div>
            )}
          </ProjectSpread>
        </>
      )}

      {/* Lightbox Modal for Any Zoomed Figure */}
      {modalFigure && (
        <FigureLightboxModal figure={modalFigure} onClose={() => setModalFigure(null)} />
      )}

      {/* Related · next project */}
      {related.length > 0 && (
        <section className="project-related-block">
          <h3 className="project-related-title">Related Projects</h3>
          <ul className="project-related-ul">
            {related.map((r) => (
              <li key={r.id}>
                <Link to={`/projects/${r.id}`}>
                  <strong>{r.title}</strong>
                </Link>
                {' — '}
                <span className="sub">{r.subtitle}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}

