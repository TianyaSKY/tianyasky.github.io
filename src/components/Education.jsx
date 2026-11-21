import React from 'react';
import { educationInfo } from '../data/personalData';

export default function Education() {
  return (
    <div id="education" className="section-content">
      <h1>🏫 Education</h1>

      <div className="education-block">
        <div className="education-period-badge">{educationInfo.period}</div>
        <div className="education-main-info">
          <h3 className="education-school-title">{educationInfo.school}</h3>
          <p className="education-major-line">
            <strong>{educationInfo.major}</strong>
            <span className="education-college-text"> · {educationInfo.college}</span>
          </p>
        </div>
      </div>

      {/* Mobile-only photo (on desktop, the photo smoothly transitions in the left sidebar) */}
      <div className="mobile-only-education-photo">
        <img
          src="/dalian.webp"
          alt="Dalian, China"
          className="education-mobile-img"
          loading="lazy"
        />
        <p className="education-photo-caption">Dalian, China</p>
      </div>
    </div>
  );
}
