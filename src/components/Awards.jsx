import React, { useState } from 'react';
import { awardsList } from '../data/personalData';
import { Award, Filter } from 'lucide-react';

export default function Awards() {
  const [filter, setFilter] = useState('ALL');

  const filteredAwards = awardsList.filter((item) => {
    if (filter === 'National') return item.level === 'National';
    if (filter === 'Provincial') return item.level === 'Provincial';
    return true;
  });

  return (
    <section id="awards" className="section-inner">
      <div className="section-label">
        <Award size={14} /> Honors & Awards
      </div>
      <h2 className="section-title">竞赛获奖</h2>
      <p className="section-desc">算法竞赛、AI 挑战赛与创新创业荣誉记录</p>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          className={`btn ${filter === 'ALL' ? 'btn-primary' : 'btn-outline'}`}
          style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
          onClick={() => setFilter('ALL')}
        >
          全部 ({awardsList.length})
        </button>
        <button
          className={`btn ${filter === 'National' ? 'btn-primary' : 'btn-outline'}`}
          style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
          onClick={() => setFilter('National')}
        >
          国家级 ({awardsList.filter((a) => a.level === 'National').length})
        </button>
        <button
          className={`btn ${filter === 'Provincial' ? 'btn-primary' : 'btn-outline'}`}
          style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
          onClick={() => setFilter('Provincial')}
        >
          省级 ({awardsList.filter((a) => a.level === 'Provincial').length})
        </button>
      </div>

      <div className="awards-grid">
        {filteredAwards.map((award, i) => (
          <div key={i} className="award-card">
            <span className="award-badge-year">{award.year}</span>
            <div className="award-info">
              <h4>{award.title}</h4>
              <p>{award.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
