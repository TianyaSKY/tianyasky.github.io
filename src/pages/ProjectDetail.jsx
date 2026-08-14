import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { projects } from '../data/personalData';
import NotFound from './NotFound';
import { ArrowLeft, Github, ArrowRight, Download, ExternalLink, Package, FileCode, CheckCircle2 } from 'lucide-react';
import ProjectHero from '../components/ProjectSections/ProjectHero';
import ProjectSpread from '../components/ProjectSections/ProjectSpread';
import ProjectGallery from '../components/ProjectSections/ProjectGallery';
import SciFiTerminal from '../components/SciFiTerminal';
import VisionSimulator from '../components/VisionSimulator';

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

  const links = project.links || {};

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
      />

      {/* Download artifacts card when downloadable results exist */}
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
                <h3 className="file-name">{links.downloadLabel || 'liucixin_train.zip'}</h3>
                <p className="file-desc">
                  内含 1.0 / 1.5 / 2.0 epoch 三份精选 LoRA 适配器权重（每份 ~20MB）、全量训练 loss/eval 评估记录、微调训练脚本与 ChatML completion 模板。
                </p>
              </div>

              <div className="download-buttons">
                <a
                  href={links.download}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-download"
                  download={links.downloadLabel || 'liucixin_train.zip'}
                >
                  <Download size={16} /> 立即下载训练结果 ({links.downloadLabel || 'ZIP'})
                </a>
                {links.gitee && (
                  <a
                    href={links.gitee}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                  >
                    <ExternalLink size={15} /> 访问 Gitee 开源仓库
                  </a>
                )}
              </div>
            </div>

            <div className="project-download-grid">
              <div className="download-spec-item">
                <div className="spec-label">LoRA 适配器</div>
                <div className="spec-value">3 Checkpoints (1.0 / 1.5 / 2.0 ep)</div>
              </div>
              <div className="download-spec-item">
                <div className="spec-label">基座大模型</div>
                <div className="spec-value">Qwen3.6-27B (4bit NF4)</div>
              </div>
              <div className="download-spec-item">
                <div className="spec-label">微调参数量</div>
                <div className="spec-value">10.5M Params (0.039%)</div>
              </div>
              <div className="download-spec-item">
                <div className="spec-label">单文件体积</div>
                <div className="spec-value">~20 MB / 适配器</div>
              </div>
            </div>

            <div className="download-code-block">
              <div className="code-title">
                <FileCode size={14} /> 快速加载权重推理示例 (Python / PEFT)
              </div>
              <pre className="code-content">
{`from peft import PeftModel
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

model_id = "Qwen/Qwen3.6-27B"
lora_path = "./checkpoint-epoch-2.0"

tokenizer = AutoTokenizer.from_pretrained(model_id, trust_remote_code=True)
base_model = AutoModelForCausalLM.from_pretrained(
    model_id,
    device_map="auto",
    torch_dtype=torch.bfloat16,
    load_in_4bit=True,
    trust_remote_code=True
)
model = PeftModel.from_pretrained(base_model, lora_path)`}
              </pre>
            </div>
          </div>
        </section>
      )}

      {/* Reflection · full-width pullquote */}
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
            {links.download && (
              <a
                className="btn btn-outline"
                href={links.download}
                target="_blank"
                rel="noopener noreferrer"
                download={links.downloadLabel || 'liucixin_train.zip'}
              >
                <Download size={16} /> 下载训练结果 ({links.downloadLabel || 'ZIP'})
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
