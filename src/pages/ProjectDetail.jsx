import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { projects } from '../data/personalData';
import NotFound from './NotFound';
import {
  ArrowLeft,
  Github,
  ArrowRight,
  Download,
  ExternalLink,
  Package,
  FileCode,
  CheckCircle2,
  Copy,
  BookOpen,
  Sparkles,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Compass,
  Cpu,
  BarChart3,
  SearchCode,
  ShieldCheck,
  CheckCircle
} from 'lucide-react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import ProjectHero from '../components/ProjectSections/ProjectHero';
import ProjectSpread from '../components/ProjectSections/ProjectSpread';
import ProjectGallery from '../components/ProjectSections/ProjectGallery';
import SciFiTerminal from '../components/SciFiTerminal';
import VisionSimulator from '../components/VisionSimulator';

function renderMathText(text) {
  if (typeof text !== 'string') return text;
  if (!text.includes('$')) return text;

  const parts = text.split(/(\$\$[\s\S]+?\$\$|\$[^\$]+?\$)/g);
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
      if (e.key === 'Escape') onClose();
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
    <div className="project-modal-backdrop" onClick={onClose}>
      <div className="project-modal-shell" onClick={(e) => e.stopPropagation()}>
        {/* Header with full inspection tools */}
        <header className="project-modal-header">
          <div className="modal-header-meta">
            <span className="modal-fig-label">{figure.label || 'FIG'}</span>
            <span className="project-modal-title">
              <strong>{figure.title || figure.caption}</strong>
            </span>
          </div>

          <div className="modal-header-actions">
            <div className="modal-zoom-controls">
              <button
                type="button"
                className="zoom-btn"
                onClick={handleZoomOut}
                title="缩小 (Zoom Out, -)"
              >
                <ZoomOut size={15} />
              </button>
              <span className="zoom-level-badge">{Math.round(scale * 100)}%</span>
              <button
                type="button"
                className="zoom-btn"
                onClick={handleZoomIn}
                title="放大 (Zoom In, +)"
              >
                <ZoomIn size={15} />
              </button>
              <button
                type="button"
                className="zoom-btn text-btn"
                onClick={handleReset}
                title="适应窗口 (Reset, 0)"
              >
                <RotateCcw size={13} style={{ marginRight: 3 }} /> 适应窗口
              </button>
              <button
                type="button"
                className={`zoom-btn text-btn ${scale > 1 ? 'is-active' : ''}`}
                onClick={handleActualSize}
                title="大图细节模式"
              >
                <Maximize2 size={13} style={{ marginRight: 3 }} /> {scale > 1 ? '还原尺寸' : '高清细节'}
              </button>
            </div>

            <a
              href={figure.src}
              target="_blank"
              rel="noopener noreferrer"
              className="modal-origin-link"
              title="在新标签页中打开超高清原图"
            >
              <ExternalLink size={14} /> 原图直达
            </a>

            <button
              type="button"
              className="project-modal-close"
              onClick={onClose}
              aria-label="Close modal"
              title="按 ESC 键或点击关闭"
            >
              ✕ 关闭
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
            {scale > 1 ? '按住鼠标左键可平移拖拽 · 滚轮缩放 · 双击重置' : '滚轮或双击放大 · 支持拖拽平移查看细节'}
          </div>
        </div>

        {/* Informative Captions & Diagnostics Footer */}
        {(figure.caption || figure.analysis) && (
          <footer className="project-modal-footer">
            <p className="modal-caption-text">
              <strong>学术图释：</strong>{renderMathText(figure.caption)}
            </p>
            {figure.analysis && (
              <p className="modal-analysis-text">
                <strong>实验机理与归因：</strong>{renderMathText(figure.analysis)}
              </p>
            )}
          </footer>
        )}
      </div>
    </div>
  );
}

export default function ProjectDetail() {
  const { id } = useParams();
  const project = useMemo(() => projects.find((p) => p.id === id), [id]);
  const related = useMemo(
    () => (project ? projects.filter((p) => p.id !== project.id && p.type === project.type).slice(0, 3) : []),
    [project]
  );

  const [abstractLang, setAbstractLang] = useState('zh');
  const [copiedBibtex, setCopiedBibtex] = useState(false);
  const [modalFigure, setModalFigure] = useState(null);

  if (!project) return <NotFound />;

  const num = String(projects.findIndex((p) => p.id === project.id) + 1).padStart(2, '0');
  const relatedNumeric = (rid) =>
    String(projects.findIndex((p) => p.id === rid) + 1).padStart(2, '0');

  const links = project.links || {};
  const paperArticle = project.paperArticle;

  const [activeSecId, setActiveSecId] = useState(paperArticle?.sections?.[0]?.id || '');

  React.useEffect(() => {
    if (!paperArticle) return;
    const sectionIds = [...paperArticle.sections.map((s) => s.id), 'sec-citation'];

    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSecId(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [paperArticle]);

  const handleCopyBibtex = () => {
    if (project.bibtex) {
      navigator.clipboard.writeText(project.bibtex);
      setCopiedBibtex(true);
      setTimeout(() => setCopiedBibtex(false), 2000);
    }
  };

  const scrollToSection = (secId) => {
    const el = document.getElementById(secId);
    if (el) {
      const topOffset = 84;
      const elPosition = el.getBoundingClientRect().top;
      const offsetPosition = elPosition + window.pageYOffset - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSecId(secId);
    }
  };

  return (
    <article className="project-detail">
      {/* Backbar */}
      <div className="project-detail-backbar">
        <Link to="/projects" className="btn-link" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
          <ArrowLeft size={14} /> 返回目录
        </Link>
        <span className="signoff">
          ISSUE · 0{num} · {project.type === 'research' ? 'RESEARCH' : 'ENGINEERING'}
        </span>
      </div>

      {/* Hero */}
      <ProjectHero project={project} />

      {/* 00 · Academic Paper Abstract Block (When paperInfo is present) */}
      {project.paperInfo && (
        <section className="paper-abstract-section" style={{ padding: '3.5rem 0 0', borderTop: '1px solid var(--rule)' }}>
          <div className="paper-abstract-card">
            <header className="paper-card-header">
              <div className="paper-meta-top">
                <span className="paper-type-badge">
                  <BookOpen size={13} style={{ marginRight: 4 }} /> Academic Paper Specification · 学术论文规范
                </span>
                <div className="paper-lang-tabs" role="tablist">
                  <button
                    type="button"
                    className={`lang-tab-btn ${abstractLang === 'zh' ? 'active' : ''}`}
                    onClick={() => setAbstractLang('zh')}
                  >
                    中文摘要 (Abstract)
                  </button>
                  <button
                    type="button"
                    className={`lang-tab-btn ${abstractLang === 'en' ? 'active' : ''}`}
                    onClick={() => setAbstractLang('en')}
                  >
                    English Abstract
                  </button>
                </div>
              </div>

              <h2 className="paper-main-title">
                {abstractLang === 'zh' ? project.paperInfo.titleZh : project.paperInfo.titleEn}
              </h2>

              <div className="paper-author-row">
                <span className="paper-author"><strong>{project.paperInfo.authors}</strong></span>
                {project.paperInfo.affiliation && (
                  <span className="paper-affil">{project.paperInfo.affiliation}</span>
                )}
              </div>
            </header>

            <div className="paper-abstract-body">
              <div className="abstract-label-pill">ABSTRACT · 论文摘要</div>
              <p className="abstract-text">
                {abstractLang === 'zh' ? project.paperInfo.abstractZh : project.paperInfo.abstractEn}
              </p>
            </div>

            <footer className="paper-abstract-footer">
              <span className="keywords-label">
                <strong>{abstractLang === 'zh' ? '关键词 (Keywords)：' : 'Keywords:'}</strong>
              </span>
              <div className="keywords-list">
                {(abstractLang === 'zh' ? project.paperInfo.keywordsZh : project.paperInfo.keywordsEn).map((kw, i) => (
                  <span key={i} className="paper-keyword-tag">{kw}</span>
                ))}
              </div>
            </footer>
          </div>
        </section>
      )}

      {/* Interactive AI Terminal or Simulator when available */}
      {project.hasTerminalSim && (
        <section className="project-interactive-demo" style={{ padding: '4rem 0 0', borderTop: '1px solid var(--rule)' }}>
          <div className="kicker">00 · Interactive Terminal</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem', marginBottom: '1.25rem' }}>
            <h2 className="section-title" style={{ fontSize: '2.4rem', margin: 0 }}>
              「慈欣体」在线生成终端 / <em>interactive terminal</em>
            </h2>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Qwen3.6-27B 4bit QLoRA 续写体验
            </span>
          </div>
          <SciFiTerminal defaultOpen={true} />
        </section>
      )}

      {project.hasVisionDemo && (
        <section className="project-interactive-demo" style={{ padding: '4rem 0 0', borderTop: '1px solid var(--rule)' }}>
          <div className="kicker">00 · Vision Simulator</div>
          <h2 className="section-title" style={{ fontSize: '2.4rem', marginTop: '0.5rem', marginBottom: '1.25rem' }}>
            单目视觉解算模拟器 / <em>vision simulator</em>
          </h2>
          <VisionSimulator />
        </section>
      )}

      {/* Demo · embedded video when recorded */}
      {project.video && (
        <section className="project-demo" style={{ padding: '4rem 0 0', borderTop: '1px solid var(--rule)' }}>
          <div className="kicker">00 · Demo</div>
          <h2 className="section-title" style={{ fontSize: '2.6rem', marginTop: '0.5rem' }}>
            演示视频 / <em>demo</em>
          </h2>
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
          {/* Sticky Sidebar Outline Table of Contents */}
          <aside className="paper-sidebar-toc" aria-label="Paper outline navigation">
            <div className="sidebar-toc-inner">
              <div className="sidebar-toc-header">
                <div className="sidebar-toc-label">
                  <Compass size={14} className="toc-icon" />
                  <span>论文目录导览</span>
                </div>
                <span className="sidebar-toc-count">{paperArticle.sections.length + 1} 节</span>
              </div>

              <div className="sidebar-toc-scroll">
                <nav className="sidebar-toc-list">
                  {paperArticle.sections.map((sec) => (
                    <button
                      key={sec.id}
                      type="button"
                      className={`sidebar-toc-item ${activeSecId === sec.id ? 'is-active' : ''}`}
                      onClick={() => scrollToSection(sec.id)}
                    >
                      <span className="toc-num">{sec.number}</span>
                      <div className="toc-text">
                        <span className="toc-title">{sec.title.split('/')[0].trim()}</span>
                        <span className="toc-kicker">{sec.kicker}</span>
                      </div>
                    </button>
                  ))}
                  <button
                    type="button"
                    className={`sidebar-toc-item ${activeSecId === 'sec-citation' ? 'is-active' : ''}`}
                    onClick={() => scrollToSection('sec-citation')}
                  >
                    <span className="toc-num">08</span>
                    <div className="toc-text">
                      <span className="toc-title">BibTeX 引用与代码</span>
                      <span className="toc-kicker">Citation & Repository</span>
                    </div>
                  </button>
                </nav>
              </div>

              <div className="sidebar-toc-footer">
                <button
                  type="button"
                  className="sidebar-top-btn"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  <ArrowLeft size={13} style={{ transform: 'rotate(90deg)' }} /> 返回顶部
                </button>
              </div>
            </div>
          </aside>

          {/* Paper Sections Stream */}
          <div className="paper-article-container">
            {paperArticle.sections.map((sec) => (
              <section key={sec.id} id={sec.id} className="paper-section-block">
                {/* Section Header */}
                <header className="paper-section-header">
                  <div className="paper-section-kicker">
                    <span className="sec-num">{sec.number}</span>
                    <span className="sec-divider">/</span>
                    <span className="sec-kicker-text">{sec.kicker}</span>
                  </div>
                  <h2 className="paper-section-title">{sec.title}</h2>
                </header>

                {/* Section Body */}
                <div className="paper-section-content">
                  {/* Lead Paragraphs */}
                  {sec.paragraphs && sec.paragraphs.length > 0 && (
                    <div className="paper-paragraphs-group">
                      {sec.paragraphs.map((p, pIdx) => (
                        <p key={pIdx} className="paper-p">{renderMathText(p)}</p>
                      ))}
                    </div>
                  )}

                  {/* Core Contributions (Sec 1) */}
                  {sec.contributions && (
                    <div className="paper-contributions-card">
                      <div className="contributions-header">
                        <Sparkles size={16} style={{ color: 'var(--color-primary)' }} />
                        <strong>核心学术贡献与工程突破 (Core Contributions)</strong>
                      </div>
                      <div className="contributions-grid">
                        {sec.contributions.map((c, cIdx) => (
                          <div key={cIdx} className="contribution-item">
                            <div className="contribution-num">0{cIdx + 1}</div>
                            <div className="contribution-desc">{renderMathText(c)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Math Formula Card (Sec 2, Sec 4, etc.) */}
                  {sec.math && (
                    <div className="paper-math-card">
                      <div className="math-card-header">
                        <span className="math-badge">EQUATION · 公式推导</span>
                        <h4 className="math-title">{sec.math.title}</h4>
                      </div>
                      <MathBlock formula={sec.math.formula} />
                      {sec.math.explanation && (
                        <p className="math-explanation">{renderMathText(sec.math.explanation)}</p>
                      )}
                    </div>
                  )}

                  {/* Standalone Embedded Figure (Sec 2, Sec 3, etc.) */}
                  {sec.figure && (
                    <figure
                      className={`paper-inline-figure ${sec.figure.wide ? 'is-wide' : ''}`}
                      onClick={() => setModalFigure(sec.figure)}
                    >
                      <div className="figure-canvas">
                        <img src={sec.figure.src} alt={sec.figure.caption} loading="lazy" />
                      </div>
                      <figcaption className="paper-figure-caption">
                        <div className="fig-meta-bar">
                          <span className="fig-tag">{sec.figure.label}</span>
                          <strong className="fig-heading">{sec.figure.title || sec.figure.caption}</strong>
                        </div>
                        <p className="fig-text">{renderMathText(sec.figure.caption)}</p>
                        {sec.figure.analysis && (
                          <div className="fig-analysis-box">
                            <span className="analysis-pill">物理机理与质检分析</span>
                            <p className="analysis-body">{renderMathText(sec.figure.analysis)}</p>
                          </div>
                        )}
                      </figcaption>
                    </figure>
                  )}

                  {/* Subsections with architectural explanations (Sec 3) */}
                  {sec.subsections && (
                    <div className="paper-subsections-flow">
                      {sec.subsections.map((sub, sIdx) => (
                        <div key={sIdx} className="paper-subsection-item">
                          <h3 className="paper-subsection-title">{sub.title}</h3>
                          <p className="paper-p">{renderMathText(sub.content)}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Training Strategy Pillars (Sec 4) */}
                  {sec.trainingPillars && (
                    <div className="paper-training-pillars-grid">
                      {sec.trainingPillars.map((tp, tpIdx) => (
                        <div key={tpIdx} className="training-pillar-card">
                          <div className="pillar-header">
                            <Cpu size={16} style={{ color: 'var(--color-primary)' }} />
                            <h4>{tp.title}</h4>
                          </div>
                          <p>{renderMathText(tp.detail)}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Quantitative Benchmarks & Tables (Sec 5) */}
                  {sec.id === 'sec-results' && (
                    <div className="paper-benchmark-block">
                      {/* Figure 3: Dataset Overview */}
                      {sec.datasetFigure && (
                        <figure
                          className="paper-inline-figure"
                          onClick={() => setModalFigure(sec.datasetFigure)}
                        >
                          <div className="figure-canvas">
                            <img src={sec.datasetFigure.src} alt={sec.datasetFigure.caption} loading="lazy" />
                          </div>
                          <figcaption className="paper-figure-caption">
                            <div className="fig-meta-bar">
                              <span className="fig-tag">{sec.datasetFigure.label}</span>
                              <strong className="fig-heading">{sec.datasetFigure.title}</strong>
                            </div>
                            <p className="fig-text">{renderMathText(sec.datasetFigure.caption)}</p>
                          </figcaption>
                        </figure>
                      )}

                      {/* Table 1: All Datasets */}
                      {project.benchmarkTable && (
                        <div className="academic-table-wrapper" style={{ marginTop: '2.5rem' }}>
                          <div className="academic-table-caption">
                            <strong>{project.benchmarkTable.caption}</strong>
                          </div>
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
                                      {row.highlight && <span className="highlight-tag">BEST</span>}
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
                            注：↓ 表示数值越小越优；ShanghaiTech Part A 为模型最显著突破项；Macro Average 仅作多域均值参考。
                          </div>
                        </div>
                      )}

                      {/* SOTA Comparison Narrative & Table 2 */}
                      <div className="paper-sota-narrative" style={{ marginTop: '3.5rem' }}>
                        <h3 className="paper-subsection-title">
                          与国际主流顶会 SOTA 模型纵横对比 (SOTA Cross-Benchmark Comparison)
                        </h3>
                        <p className="paper-p">
                          我们将 YOLO-PGMD 与近年来在 CVPR、ICCV、NeurIPS 等顶级会议发表的 6 种代表性 SOTA 模型进行了同基准定量对比。在密集度最高的 ShanghaiTech Part A 上，YOLO-PGMD 取得了 <strong>48.13 MAE / 74.17 RMSE</strong>，超越了包括 CVPR'22 MAN (56.8) 及 NeurIPS'20 DM-Count (59.7) 在内的全部主流基准；在复杂恶劣场景的 JHU-Crowd 上取得 <strong>39.73 MAE</strong>，验证了显著的跨域泛化优势。
                        </p>

                        {/* Table 2: SOTA Comparison */}
                        {project.sotaTable && (
                          <div className="academic-table-wrapper" style={{ marginTop: '1.5rem' }}>
                            <div className="academic-table-caption">
                              <strong>{project.sotaTable.caption}</strong>
                            </div>
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
                                        {row.isOurs && <span className="highlight-tag ours-tag">OURS</span>}
                                      </td>
                                      <td className={`col-num ${row.isOurs ? 'highlight-cell' : ''}`}>{row.shaA}</td>
                                      <td className="col-num">{row.shaB}</td>
                                      <td className="col-num">{row.ucfQnrf}</td>
                                      <td className={`col-num ${row.isOurs ? 'highlight-cell' : ''}`}>{row.jhu}</td>
                                      <td className="col-num">{row.ucfCc50}</td>
                                      <td className="cell-venue"><span className="venue-badge">{row.venue}</span></td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            <div className="table-footnote">
                              对比基准涵盖 CVPR'18 (CSRNet)、ICCV'19 (Bayesian Loss)、NeurIPS'20 (DM-Count)、CVPR'22 (MAN) 及 arXiv'24 (CLIP-EBC) 等权威公开工作。
                            </div>
                          </div>
                        )}

                        {/* Figure 4: SOTA Comparison Bar Chart */}
                        {sec.sotaFigure && (
                          <figure
                            className="paper-inline-figure"
                            style={{ marginTop: '2.5rem' }}
                            onClick={() => setModalFigure(sec.sotaFigure)}
                          >
                            <div className="figure-canvas">
                              <img src={sec.sotaFigure.src} alt={sec.sotaFigure.caption} loading="lazy" />
                            </div>
                            <figcaption className="paper-figure-caption">
                              <div className="fig-meta-bar">
                                <span className="fig-tag">{sec.sotaFigure.label}</span>
                                <strong className="fig-heading">{sec.sotaFigure.title}</strong>
                              </div>
                              <p className="fig-text">{renderMathText(sec.sotaFigure.caption)}</p>
                            </figcaption>
                          </figure>
                        )}
                      </div>

                      {/* Scatter Regression Analysis (Figures 5 & 6) */}
                      {sec.scatterFigures && (
                        <div className="paper-scatter-analysis-block" style={{ marginTop: '3.5rem' }}>
                          <h3 className="paper-subsection-title">
                            真实人数 vs 预测人数回归拟合一致性分析 (Linear Regression Consistency)
                          </h3>
                          {sec.scatterDiscussion && (
                            <p className="paper-p">{renderMathText(sec.scatterDiscussion)}</p>
                          )}
                          <div className="paper-scatter-grid">
                            {sec.scatterFigures.map((sFig, sfIdx) => (
                              <figure
                                key={sfIdx}
                                className="scatter-figure-card"
                                onClick={() => setModalFigure(sFig)}
                              >
                                <div className="figure-canvas">
                                  <img src={sFig.src} alt={sFig.caption} loading="lazy" />
                                </div>
                                <figcaption className="scatter-caption">
                                  <div className="fig-meta-bar">
                                    <span className="fig-tag">{sFig.label}</span>
                                    <strong className="fig-heading">{sFig.title}</strong>
                                  </div>
                                  <p className="fig-text">{renderMathText(sFig.caption)}</p>
                                </figcaption>
                              </figure>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Qualitative Case Studies (Sec 6) */}
                  {sec.cases && (
                    <div className="paper-case-studies-stream">
                      {sec.cases.map((cItem, cIdx) => (
                        <div key={cItem.id || cIdx} className="paper-case-card">
                          <header className="case-card-header">
                            <span className="case-tag-badge">{cItem.tag}</span>
                            <span className="case-dataset-label">{cItem.dataset}</span>
                          </header>
                          <figure
                            className="paper-inline-figure is-wide"
                            onClick={() => setModalFigure(cItem.figure)}
                          >
                            <div className="figure-canvas">
                              <img src={cItem.figure.src} alt={cItem.figure.caption} loading="lazy" />
                            </div>
                            <figcaption className="paper-figure-caption">
                              <div className="fig-meta-bar">
                                <span className="fig-tag">{cItem.figure.label}</span>
                                <strong className="fig-heading">{cItem.figure.title}</strong>
                              </div>
                              <p className="fig-text">{renderMathText(cItem.figure.caption)}</p>
                              {cItem.analysis && (
                                <div className="fig-analysis-box">
                                  <span className="analysis-pill">实验机理与场景解析</span>
                                  <p className="analysis-body">{renderMathText(cItem.analysis)}</p>
                                </div>
                              )}
                            </figcaption>
                          </figure>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reflection & Future Work (Sec 7) */}
                  {sec.reflection && (
                    <div className="paper-reflection-block" style={{ marginTop: '2rem' }}>
                      <blockquote className="paper-pullquote">
                        <p>{renderMathText(sec.reflection)}</p>
                        <cite>— 作者反思与后续迭代演进方向</cite>
                      </blockquote>
                      {sec.futurePillars && (
                        <div className="paper-future-grid" style={{ marginTop: '2rem' }}>
                          {sec.futurePillars.map((fp, fpIdx) => (
                            <div key={fpIdx} className="future-pillar-card">
                              <div className="pillar-top">
                                <span className="future-idx">0{fpIdx + 1}</span>
                                <h4>{fp.title}</h4>
                              </div>
                              <p>{renderMathText(fp.desc)}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </section>
            ))}
          </div>

          {/* Section 08: BibTeX Citation Block */}
          {project.bibtex && (
            <section id="sec-citation" className="paper-bibtex-section" style={{ padding: '4rem 0 2rem', borderTop: '1px solid var(--rule)' }}>
              <div className="paper-section-kicker">
                <span className="sec-num">08</span>
                <span className="sec-divider">/</span>
                <span className="sec-kicker-text">Academic Citation & Code Archive</span>
              </div>
              <h2 className="paper-section-title" style={{ fontSize: '2.2rem', marginTop: '0.5rem', marginBottom: '1.25rem' }}>
                论文引用与代码归档 / <em>BibTeX & Code Repository</em>
              </h2>

              <div className="bibtex-box">
                <div className="bibtex-header">
                  <span className="bibtex-label"><FileCode size={14} style={{ marginRight: 6 }} /> BibTeX Citation Entry</span>
                  <button type="button" className="btn-copy-bibtex" onClick={handleCopyBibtex}>
                    {copiedBibtex ? (
                      <><CheckCircle2 size={14} style={{ color: 'var(--color-primary)' }} /> 已复制到剪贴板</>
                    ) : (
                      <><Copy size={14} /> 复制 BibTeX</>
                    )}
                  </button>
                </div>
                <pre className="bibtex-code">
                  <code>{project.bibtex}</code>
                </pre>
              </div>

              {project.links && (
                <div className="project-reflection-links" style={{ marginTop: '2rem' }}>
                  {links.github && (
                    <a className="btn btn-primary" href={links.github} target="_blank" rel="noopener noreferrer">
                      <Github size={16} /> 访问 GitHub 开源仓库
                    </a>
                  )}
                  {links.download && (
                    <a
                      className="btn btn-outline"
                      href={links.download}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={links.downloadLabel || 'weights.zip'}
                    >
                      <Download size={16} /> 下载模型权重归档
                    </a>
                  )}
                </div>
              )}
            </section>
          )}
        </div>
      ) : (
        /* ========================================================================= */
        /* MODE B: Default Project Spread & Gallery Flow for Standard Projects       */
        /* ========================================================================= */
        <>
          {/* 01 · Background & Motivation */}
          <ProjectSpread
            index="01"
            kicker="Background & Motivation"
            title={<>问题<span style={{ fontStyle: 'italic', color: 'var(--color-vermilion)' }}>与动机</span></>}
            lead={project.background}
            figure={project.caseFigures?.background || { src: project.cover, caption: `${project.id} · cover · 1600×900` }}
          />

          {/* 02 · Method & Architecture */}
          <ProjectSpread
            index="02"
            kicker="Method & Architecture"
            title={<>方法与<em>实现</em></>}
            lead={project.method}
            figure={project.caseFigures?.method || { src: typeof project.gallery?.[0] === 'string' ? project.gallery[0] : project.gallery?.[0]?.src || project.cover, caption: `${project.id} · pipeline schematic`, wide: true }}
            bullets={project.highlights}
          />

          {/* 03 · Results & Metrics */}
          <ProjectSpread
            index="03"
            kicker="Results & Metrics"
            title={<>成果与<em>指标</em></>}
            lead={project.results}
            figure={project.caseFigures?.results || { src: typeof project.gallery?.[1] === 'string' ? project.gallery[1] : project.gallery?.[1]?.src || (typeof project.gallery?.[0] === 'string' ? project.gallery[0] : project.gallery?.[0]?.src) || project.cover, caption: `${project.id} · evaluation table` }}
            stats={project.stats}
          >
            {/* Table 1: All Dataset Breakdown (When present) */}
            {project.benchmarkTable && (
              <div className="academic-table-wrapper" style={{ marginTop: '3.5rem' }}>
                <div className="academic-table-caption">
                  <strong>{project.benchmarkTable.caption}</strong>
                </div>
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
                            {row.highlight && <span className="highlight-tag">BEST</span>}
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
                  注：↓ 表示数值越小越优；ShanghaiTech Part A 为当前模型最显著突破项；Macro Average 仅作多域均值参考。
                </div>
              </div>
            )}

            {/* Table 2: SOTA Comparison Across Venues (When present) */}
            {project.sotaTable && (
              <div className="academic-table-wrapper" style={{ marginTop: '3.5rem' }}>
                <div className="academic-table-caption">
                  <strong>{project.sotaTable.caption}</strong>
                </div>
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
                            {row.isOurs && <span className="highlight-tag ours-tag">OURS</span>}
                          </td>
                          <td className={`col-num ${row.isOurs ? 'highlight-cell' : ''}`}>{row.shaA}</td>
                          <td className="col-num">{row.shaB}</td>
                          <td className="col-num">{row.ucfQnrf}</td>
                          <td className={`col-num ${row.isOurs ? 'highlight-cell' : ''}`}>{row.jhu}</td>
                          <td className="col-num">{row.ucfCc50}</td>
                          <td className="cell-venue"><span className="venue-badge">{row.venue}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="table-footnote">
                  对比基准包含 CVPR'18 (CSRNet)、ICCV'19 (Bayesian Loss)、NeurIPS'20 (DM-Count)、CVPR'22 (MAN) 及 arXiv'24 (CLIP-EBC) 等权威公开模型。
                </div>
              </div>
            )}
          </ProjectSpread>

          {/* BibTeX Citation Block (When available) */}
          {project.bibtex && (
            <section className="paper-bibtex-section" style={{ padding: '3.5rem 0 1rem', borderTop: '1px solid var(--rule)' }}>
              <div className="kicker">03.5 · Academic Citation</div>
              <h2 className="section-title" style={{ fontSize: '2.2rem', marginTop: '0.5rem', marginBottom: '1.25rem' }}>
                论文引用 / <em>BibTeX Citation</em>
              </h2>

              <div className="bibtex-box">
                <div className="bibtex-header">
                  <span className="bibtex-label"><FileCode size={14} style={{ marginRight: 6 }} /> BibTeX Entry</span>
                  <button type="button" className="btn-copy-bibtex" onClick={handleCopyBibtex}>
                    {copiedBibtex ? (
                      <><CheckCircle2 size={14} style={{ color: 'var(--color-primary)' }} /> 已复制到剪贴板</>
                    ) : (
                      <><Copy size={14} /> 复制 BibTeX</>
                    )}
                  </button>
                </div>
                <pre className="bibtex-code">
                  <code>{project.bibtex}</code>
                </pre>
              </div>
            </section>
          )}

          {/* Download artifacts card */}
          {links.download && (
            <section className="project-download-section" style={{ padding: '4rem 0 2rem', borderTop: '1px solid var(--rule)' }}>
              <div className="kicker">03.5 · Artifacts & Checkpoints</div>
              <h2 className="section-title" style={{ fontSize: '2.4rem', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
                训练成果与<em>权重交付</em>
              </h2>

              <div className="project-download-box">
                <div className="project-download-header">
                  <div className="download-meta">
                    <span className="file-badge"><Package size={14} /> 权重归档包</span>
                    <h3 className="file-name">{links.downloadLabel || 'checkpoint.zip'}</h3>
                    <p className="file-desc">
                      内含模型适配器权重、评估日志与推理示例代码。
                    </p>
                  </div>

                  <div className="download-buttons">
                    <a
                      href={links.download}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-download"
                      download={links.downloadLabel || 'checkpoint.zip'}
                    >
                      <Download size={16} /> 立即下载训练结果 ({links.downloadLabel || 'ZIP'})
                    </a>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Reflection */}
          <section style={{ padding: '4rem 0', borderTop: '1px solid var(--rule)' }}>
            <div className="kicker">04 · Reflection</div>
            <div className="project-pullquote" style={{ marginTop: '1.5rem' }}>
              {project.reflection}
              <span className="project-pullquote-cite">— If I were to rebuild it today</span>
            </div>

            {project.links && (
              <div className="project-reflection-links">
                {links.gitee && (
                  <a className="btn btn-primary" href={links.gitee} target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={16} /> 查看 Gitee 仓库
                  </a>
                )}
                {links.github && (
                  <a className="btn btn-primary" href={links.github} target="_blank" rel="noopener noreferrer">
                    <Github size={16} /> 查看 GitHub
                  </a>
                )}
              </div>
            )}
          </section>

          {/* Gallery */}
          <ProjectGallery project={project} />
        </>
      )}

      {/* Lightbox Modal for Any Zoomed Figure */}
      {modalFigure && (
        <FigureLightboxModal figure={modalFigure} onClose={() => setModalFigure(null)} />
      )}

      {/* Related · next project */}
      {related.length > 0 && (
        <section className="project-related-block" style={{ marginTop: '4rem' }}>
          <div className="project-related-title">继续阅读 / Next in series</div>
          {related.map((r) => (
            <Link key={r.id} to={`/projects/${r.id}`} className="project-related-row">
              <span className="idx">0{relatedNumeric(r.id)}</span>
              <div>
                <h4 className="ttl">{r.title}</h4>
                <span className="sub">{r.subtitle}</span>
              </div>
              <span className="arr"><ArrowRight size={16} /></span>
            </Link>
          ))}
        </section>
      )}
    </article>
  );
}

