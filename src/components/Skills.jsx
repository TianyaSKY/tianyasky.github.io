import React, { useState } from 'react';
import { skillCategories } from '../data/personalData';
import { Layers, Info } from 'lucide-react';

export default function Skills() {
  const [selectedSkill, setSelectedSkill] = useState(null);

  return (
    <section id="skills" className="section-inner">
      <div className="section-label">
        <Layers size={14} /> Technical Skills
      </div>
      <h2 className="section-title">技术栈与实践经验</h2>
      <p className="section-desc">点击技能项可查看关联的具体科研与工程落地应用</p>

      {skillCategories.map((cat, catIdx) => (
        <div key={catIdx} className="skills-category-block">
          <div className="skills-category-title">
            <span className="nav-brand-dot" style={{ width: 10, height: 10 }}></span>
            {cat.category}
          </div>

          <div className="skills-grid">
            {cat.skills.map((sk, skIdx) => {
              const isSelected = selectedSkill === `${catIdx}-${skIdx}`;
              return (
                <div
                  key={skIdx}
                  className="skill-card"
                  onClick={() =>
                    setSelectedSkill(isSelected ? null : `${catIdx}-${skIdx}`)
                  }
                >
                  <div className="skill-header">
                    <span className="skill-name">{sk.name}</span>
                    <span className="skill-icon-dot"></span>
                  </div>

                  {isSelected && (
                    <div className="skill-details-popup">
                      <div style={{ fontWeight: 700, marginBottom: 4, color: 'var(--color-navy)' }}>
                        <Info size={12} style={{ display: 'inline', marginRight: 4 }} />
                        项目关联实践：
                      </div>
                      {sk.projects.split('|').map((proj, pIdx) => (
                        <div key={pIdx} style={{ marginBottom: 4 }}>
                          • {proj.trim()}
                        </div>
                      ))}
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
