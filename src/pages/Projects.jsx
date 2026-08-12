import React from 'react';
import ProjectsBento from '../components/ProjectsBento';
import { Grid3x3 } from 'lucide-react';

export default function Projects() {
  return (
    <section className="section-inner" style={{ paddingTop: '8rem' }}>
      <div className="section-label">
        <Grid3x3 size={14} /> Projects Index
      </div>
      <h2 className="section-title">六个精选项目的完整案例</h2>
      <p className="section-desc">
        从单目几何、LLM 微调与强化学习，到 AI Workspace、推荐链路和安全判题；每个案例均按背景、架构、实现、结果与技术复盘展开。SKYCity 等持续迭代项目可在 GitHub 查看。
      </p>
      <ProjectsBento standalone />
    </section>
  );
}
