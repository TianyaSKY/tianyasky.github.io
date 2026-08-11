import React from 'react';
import { stats, interestTags } from '../data/personalData';

export default function About() {
  return (
    <section id="about" className="section-inner">
      <div className="section-label">关于 · About the author</div>

      <div className="about-grid">
        <div className="about-prose">
          <p className="dropcap">
            <span className="dropcap-letter">我</span>是<strong>陈敏祥</strong>，大连海洋大学计算机科学与技术专业 2022 级本科生，GPA 3.64 排名
            <strong>9/117</strong>。把<em>计算机视觉的三维几何</em>与<em>AI 智能体系统</em>作为长期的两条线索。前者以厘米级单目姿态估计起步，后者从推荐召回流到 FastMCP 工作流。
          </p>
          <p>
            作为<strong>国家级大创项目第一负责人</strong>，独立设计近海单目视觉定位系统，RMSE
            <strong>11.2 cm</strong>，FPS<strong>26</strong>；写过 LLM 微调、RAG 高并发检索、FastMCP 工作流若干
            全栈与科研落地。
          </p>
          <p>
            同时在做笔名实验：在 B 站 & Qwen2.5-7B 上，<em>以刘慈欣科幻文风</em>训一个可以连续输出"末日感"
            的小型 LLM。这是兴趣，也是阅读训练。
          </p>
        </div>

        <div>
          <div className="kicker" style={{ marginBottom: '1.25rem' }}>兴趣方向 / Interests</div>
          <ul className="interest-list">
            {interestTags.map((tag) => (
              <li key={tag}>
                <span className="label">{tag}</span>
                <span className="meta">/ 兴趣</span>
              </li>
            ))}
          </ul>

          <div className="kicker kicker-mid" style={{ marginTop: '2.5rem', marginBottom: '1rem' }}>
            数据 / In numbers
          </div>
          <ul className="interest-list">
            {stats.map((s) => (
              <li key={s.label}>
                <span className="label" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.4rem' }}>
                  {s.value}
                  {s.sub && <span style={{ color: 'var(--color-text-light)', fontSize: '0.6em', marginLeft: 4 }}>{s.sub}</span>}
                </span>
                <span className="meta">{s.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
