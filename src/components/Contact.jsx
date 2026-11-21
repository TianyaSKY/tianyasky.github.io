import React from 'react';
import { personalInfo } from '../data/personalData';

export default function Contact() {
  return (
    <div id="contact" className="section-content">
      <h1>📬 Contact</h1>

      <p>Feel free to reach out regarding research collaborations or inquiries:</p>
      <ul className="academic-list contact-academic-list">
        <li>
          <strong>Email</strong>: <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
        </li>
      
      </ul>
    </div>
  );
}
