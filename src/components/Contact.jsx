import React from 'react';
import { personalInfo } from '../data/personalData';

export default function Contact() {
  return (
    <section id="contact" className="section-inner" style={{ paddingBottom: '3rem' }}>
      <div className="section-label">联系 · Letter to the editor</div>

      <div className="contact-letter">
        <div>
          <p className="contact-letter-text">
            这本小刊仍在缓慢增订。<em>我将等待您的每一封来信。</em>
          </p>
          <div className="contact-letter-signoff">— 敏祥</div>
        </div>

        <ul className="contact-list">
          <li>
            <span className="lbl">E-mail</span>
            <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
          </li>
          <li>
            <span className="lbl">GitHub</span>
            <a href={personalInfo.github} target="_blank" rel="noopener noreferrer">
              github.com/TianyaSKY
            </a>
          </li>
          <li>
            <span className="lbl">Phone</span>
            <span className="v">{personalInfo.phone}</span>
          </li>
          <li>
            <span className="lbl">Bilibili</span>
            <a href="https://space.bilibili.com/" target="_blank" rel="noopener noreferrer">
              space.bilibili.com
            </a>
          </li>
        </ul>
      </div>

      <footer className="footer" style={{ marginTop: '4rem' }}>
        © 2026 {personalInfo.name} · Designed in editorial bento ·{' '}
        <a href={personalInfo.github} target="_blank" rel="noopener noreferrer">
          view source
        </a>
      </footer>
    </section>
  );
}
