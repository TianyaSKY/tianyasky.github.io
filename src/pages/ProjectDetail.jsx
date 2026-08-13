import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { projects } from '../data/personalData';
import NotFound from './NotFound';
import { ArrowLeft, Github, ArrowRight } from 'lucide-react';
import ProjectHero from '../components/ProjectSections/ProjectHero';
import ProjectSpread from '../components/ProjectSections/ProjectSpread';
import ProjectGallery from '../components/ProjectSections/ProjectGallery';

export default function ProjectDetail() {
  const { id } = useParams();
  const project = useMemo(() => projects.find((p) => p.id === id), [id]);
  const related = useMemo(
    () => (project ? projects.filter((p) => p.id !== project.id && p.type === project.type).slice(0, 3) : []),
    [project]
  );

  if (!project) return <NotFound />;

  const num = String(projects.findIndex((p) => p.id === project.id) + 1).padStart(2, '0');
  const relatedNumeric = (rid) =>
    String(projects.findIndex((p) => p.id === rid) + 1).padStart(2, '0');

  return (
    <article className="project-detail">
      <div className="project-detail-backbar">
        <Link to="/projects" className="btn-link" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
          <ArrowLeft size={14} /> 返回目录
        </Link>
        <span className="signoff">
          ISSUE · 0{num} · {project.type === 'research' ? 'RESEARCH' : 'ENGINEERING'}
        </span>
      </div>

      <ProjectHero project={project} />

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

      {/* Background · spread 左引文 + 右正文 */}
      <ProjectSpread
        layout="default"
        index="01"
        title={<>问题<span style={{ fontStyle: 'italic', color: 'var(--color-vermilion)' }}>与动机</span></>}
        lead={project.background}
        figure={project.caseFigures?.background || { src: project.cover, caption: `${project.id} · cover · 1600×900` }}
      />

      {/* Method · alt spread 左正文 + 右引文 */}
      <ProjectSpread
        layout="alt"
        index="02"
        title={<>方法与<em>实现</em></>}
        lead={project.method}
        bullets={project.highlights}
        figure={project.caseFigures?.method || { src: typeof project.gallery?.[0] === 'string' ? project.gallery[0] : project.gallery?.[0]?.src || project.cover, caption: `${project.id} · pipeline schematic` }}
      />

      {/* Results · 用 pullquote + stats grid */}
      <ProjectSpread
        layout="default"
        index="03"
        title={<>成果与<em>指标</em></>}
        lead={project.results}
        figure={project.caseFigures?.results || { src: typeof project.gallery?.[1] === 'string' ? project.gallery[1] : project.gallery?.[1]?.src || (typeof project.gallery?.[0] === 'string' ? project.gallery[0] : project.gallery?.[0]?.src) || project.cover, caption: `${project.id} · evaluation table` }}
        stats={project.stats}
      />

      {/* Reflection · full-width pullquote */}
      <section style={{ padding: '4rem 0', borderTop: '1px solid var(--rule)' }}>
        <div className="kicker">04 · Reflection</div>
        <div className="project-pullquote" style={{ marginTop: '1.5rem' }}>
          {project.reflection}
          <span className="project-pullquote-cite">— If I were to rebuild it today</span>
        </div>

        {project.links && (
          <div className="project-reflection-links">
            {project.links.github && (
              <a className="btn btn-primary" href={project.links.github} target="_blank" rel="noopener noreferrer">
                <Github size={16} /> 查看 GitHub
              </a>
            )}
          </div>
        )}
      </section>

      {/* Gallery */}
      <ProjectGallery project={project} />

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
