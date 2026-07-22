import React, { useState, useEffect } from 'react';
import { personalInfo } from '../data/personalData';
import { Github, ArrowRight } from 'lucide-react';

export default function Hero() {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fullText = personalInfo.taglines[taglineIndex];
    let speed = isDeleting ? 40 : 80;

    if (!isDeleting && currentText === fullText) {
      speed = 2200; // Pause at full text
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
      </div>

      <h1 className="hero-name">{personalInfo.name}</h1>

      <div className="hero-typing-box">
        <span>{currentText}</span>
        <span className="typing-cursor"></span>
      </div>

      <p className="hero-sub">{personalInfo.major}</p>

      <div className="hero-cta-group">
        <a href="#research" className="btn btn-primary">
          科研与工程项目 <ArrowRight size={18} />
        </a>
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
