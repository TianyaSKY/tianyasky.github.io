import React from 'react';
import { personalInfo, interestTags } from '../data/personalData';

export default function About() {
  return (
    <div id="about-me" className="section-content">
      <h1>About Me</h1>

      <p>
        I am <strong>{personalInfo.name} ({personalInfo.chineseName})</strong>, an undergraduate student (Class of 2023) majoring in Computer Science and Technology at the <strong>{personalInfo.college}, {personalInfo.school}</strong>. I serve as the Principal Investigator (PI) of a <strong>National College Students' Innovation and Entrepreneurship Training Program</strong>.
      </p>

      <p>
        My research interests include <strong>Computer Vision</strong> and <strong>Natural Language Processing</strong>.
      </p>
    </div>
  );
}
