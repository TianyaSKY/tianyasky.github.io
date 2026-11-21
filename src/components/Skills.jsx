import React from 'react';
import { skillCategories } from '../data/personalData';

export default function Skills() {
  return (
    <div id="skills" className="section-content">
      <h1>🛠️ Skills</h1>

      <ul className="academic-list skills-academic-list">
        {skillCategories.map((cat) => (
          <li key={cat.id}>
            <strong>{cat.category}</strong>: {cat.skills.join(' · ')}
          </li>
        ))}
      </ul>
    </div>
  );
}
