import React, { useState, useEffect } from 'react';
import { personalInfo } from '../data/personalData';
import { Github, ArrowRight, Sparkles, Terminal, ShieldCheck } from 'lucide-react';

export default function Hero({ onOpenCmdPalette }) {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fullText = personalInfo.taglines[taglineIndex];
    let speed = isDeleting ? 35 : 75;

    if (!isDeleting && currentText === fullText) {
      speed = 2200;
      const timeout = setTimeout(() => setIsDeleting(true), speed);
      return () => clearTimeout(timeout);
    } else if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setTaglineIndex((prev) => (prev + 1) % personalInfo.taglines.length);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentText(
        isDeleting
          ? fullText.substring(0, currentText.length - 1)
          : fullText.substring(0, currentText.length + 1)
      );
    }, speed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, taglineIndex]);

  return (
    <section id="hero" className="hero-section">
      <div className="hero-badge">
        <span className="pulse-dot"></span>
        {personalInfo.school}
        <span style={{ opacity: 0.5, margin: '0 4px' }}>|</span>
        <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>GPA 3.64 (9/117)</span>
      </div>

      <div className="hero-avatar-wrapper">
        <div className="hero-avatar-glow"></div>
        <img
          src={personalInfo.avatar}
          alt={personalInfo.name}
          className="hero-avatar-img"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/150?text=CMX';
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-4px',
            right: '-4px',
            background: 'linear-gradient(135deg, #2563eb, #0284c7)',
            color: '#ffffff',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '3px solid #ffffff',
            boxShadow: '0 4px 12px rgba(37,99,235,0.4)',
          }}
          title="国家级大创第一负责人"
        >
          <Sparkles size={18} />
        </div>
      </div>

      <h1 className="hero-name-gradient">
        {personalInfo.name}
        <span className="hero-english-sub">{personalInfo.englishName}</span>
      </h1>

      <div className="hero-typing-box">
        <span className="tagline-prefix">&gt; </span>
        <span>{currentText}</span>
        <span className="typing-cursor"></span>
      </div>

      <p className="hero-sub">{personalInfo.major}</p>

      <div className="hero-cta-group">
        <a href="#research" className="btn btn-primary">
          探索科研与工程成果 <ArrowRight size={18} />
        </a>

        <button onClick={onOpenCmdPalette} className="btn btn-outline">
          <Terminal size={18} /> 全局 HUD 极速检索
        </button>

        <a
          href={personalInfo.github}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline"
        >
          <Github size={18} /> GitHub 主页
        </a>
      </div>
    </section>
  );
}
