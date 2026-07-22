import React, { useState } from 'react';
import { skillCategories } from '../data/personalData';
import { Layers, Info, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [selectedSkill, setSelectedSkill] = useState(null);

  const categories = [
    { id: 'ALL', name: '全部技术栈' },
    ...skillCategories.map((c) => ({ id: c.id, name: c.category })),
  ];

  const filteredCategories = activeCategory === 'ALL'
    ? skillCategories
    : skillCategories.filter((c) => c.id === activeCategory);

  return (
    <section id="skills" className="section-inner">
      <div className="section-label">
        <Layers size={14} /> Tech Stack & System Matrix
      </div>
      <h2 className="section-title">全栈技术拓扑与能力矩阵</h2>
      <p className="section-desc">点击技能卡片可展开与该技术栈绑定的具体科研算法与工程落地实践</p>

      {/* Category Pills Filter */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`btn ${activeCategory === cat.id ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '0.4rem 1.1rem', fontSize: '0.88rem' }}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {filteredCategories.map((cat, catIdx) => (
        <div key={cat.id} className="skills-category-block">
          <div className="skills-category-title">
            <span className="nav-brand-dot" style={{ width: 10, height: 10 }}></span>
            {cat.category}
          </div>

          <div className="skills-grid">
            {cat.skills.map((sk, skIdx) => {
              const key = `${cat.id}-${skIdx}`;
              const isSelected = selectedSkill === key;
              return (
                <div
                  key={skIdx}
                  className={`skill-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedSkill(isSelected ? null : key)}
                >
                  <div className="skill-header">
                    <span className="skill-name">{sk.name}</span>
                    <span className="skill-icon-dot"></span>
                  </div>

                  {isSelected ? (
                    <div className="skill-details-popup">
                      <div style={{ fontWeight: 700, marginBottom: 4, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <CheckCircle2 size={13} />
                        落地工程与项目实践：
                      </div>
                      {sk.projects.split('|').map((proj, pIdx) => (
                        <div key={pIdx} style={{ marginBottom: 4 }}>
                          • {proj.trim()}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-light)', marginTop: '0.4rem' }}>
                      点击查看关联项目 →
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
