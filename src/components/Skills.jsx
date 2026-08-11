import React, { useState } from 'react';
import { skillCategories } from '../data/personalData';

export default function Skills() {
  const [openId, setOpenId] = useState(null);

  return (
    <section id="skills" className="section-inner">
      <div className="section-label">技术栈 · Tech Stack</div>
      <h2 className="section-title">
        工具与语言 / <em>tooling & languages</em>
      </h2>
      <p className="section-desc">
        真实可调用的栈：科研与工程两条线索都走相同的全栈脚手架。
      </p>

      {skillCategories.map((cat, idx) => (
        <div key={cat.id} className="skills-block">
          <div>
            <span className="skills-cat-num">/ 0{idx + 1}</span>
            <h3 className="skills-cat-label">{cat.category}</h3>
            {cat.bullets && <p className="skills-cat-bullets">{cat.bullets}</p>}
          </div>

          <div className="skills-grid">
            {cat.skills.map((sk) => {
              const id = `${cat.id}-${sk.name}`;
              const open = openId === id;
              return (
                <div
                  key={sk.name}
                  className="skill-item"
                  onClick={() => setOpenId(open ? null : id)}
                  style={{ flexDirection: 'column', alignItems: 'flex-start', cursor: 'pointer', gap: 4 }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <span className="skill-name">{sk.name}</span>
                    <span className="skill-detail">{sk.level || 'PROFICIENT'}</span>
                  </div>
                  {open && sk.projects && (
                    <div style={{ marginTop: 6, fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                      {sk.projects.split('|').map((p, i) => (
                        <div key={i}>· {p.trim()}</div>
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
