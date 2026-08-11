import React, { useState } from 'react';
import { awardsList } from '../data/personalData';
import { ArrowUpRight } from 'lucide-react';

export default function Awards() {
  const [filter, setFilter] = useState('ALL');

  const filtered = awardsList.filter((a) => {
    if (filter === 'ALL') return true;
    return a.level === filter;
  });

  return (
    <section id="awards" className="section-inner">
      <div className="section-label">荣誉 · Honors & Awards</div>
      <h2 className="section-title">
        被翻起的页面 / <em>honor roll</em>
      </h2>
      <p className="section-desc">
        算法竞赛、AI 挑战赛与创新创业的页码记录，按年份倒序排列。
      </p>

      <div className="bento-filter">
        {[
          { id: 'ALL', label: 'All', count: awardsList.length },
          { id: 'National', label: 'National · 国家级', count: awardsList.filter((a) => a.level === 'National').length },
          { id: 'Provincial', label: 'Provincial · 省级', count: awardsList.filter((a) => a.level === 'Provincial').length }
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            className={`bento-filter-btn ${filter === t.id ? 'active' : ''}`}
            onClick={() => setFilter(t.id)}
          >
            {t.label}
            <span className="count">{t.count}</span>
          </button>
        ))}
      </div>

      <div className="awards-list">
        {filtered.map((a) => (
          <article key={a.title} className="awards-row">
            <span className="awards-year">{a.year}</span>
            <span className={`awards-level ${a.level === 'National' ? 'national' : ''}`}>
              {a.level}
            </span>
            <span className="awards-title">{a.title}</span>
            <span className="awards-detail">{a.detail}</span>
            <span className="awards-arrow">
              <ArrowUpRight size={18} />
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
