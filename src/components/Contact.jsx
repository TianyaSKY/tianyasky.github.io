import React, { useState, useEffect } from 'react';
import { personalInfo } from '../data/personalData';
import { Mail, Github, Phone, ChevronUp } from 'lucide-react';

export default function Contact() {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="contact" className="section-inner" style={{ paddingBottom: '3rem' }}>
      <div className="section-label">
        <Mail size={14} /> Contact
      </div>
      <h2 className="section-title">联系方式</h2>
      <p className="section-desc">非常欢迎学术交流、技术讨论与合作意向</p>

      <div className="contact-grid">
        <a href={`mailto:${personalInfo.email}`} className="contact-card">
          <div className="contact-icon-box">
            <Mail size={24} />
          </div>
          <div>
            <div className="contact-label">Email</div>
            <div className="contact-value">{personalInfo.email}</div>
          </div>
        </a>

        <a
          href={personalInfo.github}
          target="_blank"
          rel="noopener noreferrer"
          className="contact-card"
        >
          <div className="contact-icon-box">
            <Github size={24} />
          </div>
          <div>
            <div className="contact-label">GitHub</div>
            <div className="contact-value">github.com/TianyaSKY</div>
          </div>
        </a>

        <a href={`tel:${personalInfo.phone}`} className="contact-card">
          <div className="contact-icon-box">
            <Phone size={24} />
          </div>
          <div>
            <div className="contact-label">Phone</div>
            <div className="contact-value">{personalInfo.phone}</div>
          </div>
        </a>
      </div>

      {showTopBtn && (
        <button
          className="back-to-top"
          onClick={scrollToTop}
          aria-label="Back to top"
        >
          <ChevronUp size={24} />
        </button>
      )}

      <footer className="footer" style={{ marginTop: '4rem' }}>
        <p>
          Designed & Built with React by{' '}
          <a href={personalInfo.github} target="_blank" rel="noopener noreferrer">
            {personalInfo.name}
          </a>{' '}
          · 2026
        </p>
      </footer>
    </section>
  );
}
