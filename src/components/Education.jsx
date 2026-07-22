import React from 'react';
import { educationInfo } from '../data/personalData';
import { BookOpen } from 'lucide-react';

export default function Education() {
  return (
    <section id="education" className="section-inner">
      <div className="section-label">
        <BookOpen size={14} /> Education
      </div>
      <h2 className="section-title">教育背景</h2>
      <p className="section-desc">本科在读 · {educationInfo.period}</p>

      <div className="edu-card">
        <div className="edu-logo-wrapper">
          <img
            src={educationInfo.schoolLogo}
            alt={educationInfo.school}
            className="edu-logo-img"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerText = '🎓';
            }}
          />
        </div>

        <div>
          <div className="edu-title-group">
            <h3>{educationInfo.school}</h3>
            <div className="edu-subtitle">{educationInfo.college} · {educationInfo.major}</div>
          </div>

          <div className="edu-metrics">
            {educationInfo.tags.map((tag, i) => (
              <span key={i} className="metric-chip">
                {tag}
              </span>
            ))}
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            <strong style={{ color: 'var(--color-navy)', fontSize: '0.95rem' }}>核心课程与成绩：</strong>
            <div className="course-grid">
              {educationInfo.courses.map((c, i) => (
                <div key={i} className="course-item">
                  <span className="course-name">{c.name}</span>
                  <span className="course-score">{c.score}分</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
