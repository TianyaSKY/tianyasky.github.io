import React from 'react';
import { educationInfo } from '../data/personalData';

export default function Education() {
  return (
    <section id="education" className="section-inner">
      <div className="section-label">学历 · Curriculum</div>

      <div className="education-grid">
        <div className="education-left">
          <span className="education-period">{educationInfo.period.split(' — ')[0]}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.2em', color: 'var(--color-text-light)', marginTop: -4 }}>
            ↓ {educationInfo.period.split(' — ')[1]}
          </span>
          <h3 className="education-school">{educationInfo.school}</h3>
          <span className="education-major">
            {educationInfo.college} · {educationInfo.major}
          </span>
          <div className="edu-tags">
            {educationInfo.tags.map((t) => (
              <span key={t} className="edu-tag">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="kicker kicker-mid" style={{ marginBottom: '0.8rem' }}>Coursework · 课程</div>
          <table className="course-table">
            <thead>
              <tr>
                <th style={{ width: '44%' }}>课程</th>
                <th style={{ width: '12%', textAlign: 'right' }}>成绩</th>
              </tr>
            </thead>
            <tbody>
              {educationInfo.courses.map((c) => (
                <tr key={c.name}>
                  <td>{c.name}</td>
                  <td className="score">{c.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
