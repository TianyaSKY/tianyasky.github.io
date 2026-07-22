import React from 'react';
import { stats, interestTags } from '../data/personalData';
import { Trophy, GraduationCap, Rocket, Award, UserCheck } from 'lucide-react';

const iconMap = {
  Trophy: <Trophy size={26} />,
  GraduationCap: <GraduationCap size={26} />,
  Rocket: <Rocket size={26} />,
  Award: <Award size={26} />,
};

export default function About() {
  return (
    <section id="about" className="section-inner">
      <div className="section-label">
        <UserCheck size={14} /> About Me
      </div>
      <h2 className="section-title">关于我</h2>

      <div className="about-grid">
        <div className="about-card">
          <p>
            大连海洋大学 · 计算机科学与技术 · GPA <strong>3.64</strong>，专业排名 <strong>9/117</strong>。
            主要研究与攻关方向聚焦于<strong>计算机视觉</strong>与<strong>AI 智能体系统</strong>。
          </p>
          <p>
            作为<strong>国家级大创项目第一负责人</strong>，独立设计单目视觉定位系统，在近海强光与复杂工况下实现 <strong>10–15cm</strong> RMSE 厘米级定位精度、<strong>26 FPS</strong> 实时运行。
          </p>
          <p>
            在<strong>大模型微调 (SFT/LoRA)</strong>、<strong>RAG 高并发召回</strong>、<strong>FastMCP 智能体工作流</strong>等方向拥有丰富的全栈工程与科研落地经验。
          </p>

          <div className="interest-tags-wrapper">
            {interestTags.map((tag) => (
              <span key={tag} className="tag-badge">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <div className="stats-grid">
          {stats.map((st, i) => (
            <div key={i} className="stat-card">
              <div className="stat-value">
                {st.value}
                {st.sub && <span className="stat-sub">{st.sub}</span>}
              </div>
              <div className="stat-label">{st.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
