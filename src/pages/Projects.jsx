import React from 'react';
import ProjectsBento from '../components/ProjectsBento';
import { Grid3x3 } from 'lucide-react';

export default function Projects() {
  return (
    <section className="section-inner" style={{ paddingTop: '8rem' }}>
      <div className="section-label">
        <Grid3x3 size={14} /> Projects Index
      </div>
      <h2 className="section-title">全部科研与工程项目</h2>
      <p className="section-desc">
        6 个项目 · 3 项科研攻关 + 3 项系统工程 · 点击任意卡片查看完整案例研究
      </p>
      <ProjectsBento standalone />
    </section>
  );
}
