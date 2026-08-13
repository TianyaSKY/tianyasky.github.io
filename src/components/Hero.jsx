import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { personalInfo } from '../data/personalData';
import { ArrowRight, Github, Search } from 'lucide-react';

export default function Hero({ onOpenCmdPalette }) {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fullText = personalInfo.taglines[taglineIndex];
    let speed = isDeleting ? 35 : 75;

    if (!isDeleting && currentText === fullText) {
      const timeout = setTimeout(() => setIsDeleting(true), 2200);
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

  const now = new Date();
  const dateStr = `${now.getFullYear()} · vol.${(now.getMonth() + 1).toString().padStart(2, '0')}`;

  return (
    <section id="hero" className="hero-section">
      <header className="hero-eyebrow">
        <span className="dot pulse" />
        <span>{personalInfo.school}</span>
        <span style={{ opacity: 0.4 }}>·</span>
        <span>{dateStr}</span>
        <span style={{ opacity: 0.4 }}>·</span>
        <span>本期主题：<em style={{ fontStyle: 'italic', fontFamily: 'var(--font-serif)', color: 'var(--color-vermilion)' }}>视觉智能与 AI 原生系统</em></span>
      </header>

      <div className="hero-grid">
        <div>
          <h1 className="hero-title">
            <span className="cn">{personalInfo.name}</span>
            <span className="en">{personalInfo.englishName}, 编辑寄语</span>
          </h1>

          <p className="hero-lede">
            从近海单目定位出发，把“感知—决策—执行—反馈”的方法延伸到 AI Workspace、多智能体世界、在线评测与推荐系统；这里收录能运行、可复现、也经得起复盘的研究与工程。
          </p>

          <div className="hero-typing-box" aria-live="polite">
            <span className="hero-typing-prefix">&gt;</span>
            <span>{currentText}</span>
            <span className="typing-cursor" />
          </div>

          <div className="hero-cta-group">
            <Link to="/projects" className="btn btn-primary">
              翻阅项目 <ArrowRight size={16} />
            </Link>
            <button onClick={onOpenCmdPalette} className="btn btn-outline">
              <Search size={14} /> 全站检索
            </button>
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-link"
            >
              <Github size={14} style={{ marginRight: 4, verticalAlign: '-2px' }} />
              github.com/TianyaSKY
            </a>
          </div>
        </div>

        <aside className="hero-portrait" aria-label="作者">
          <div className="hero-portrait-frame">
            <img src={personalInfo.avatar} alt={personalInfo.name} />
          </div>
          <div className="hero-portrait-caption">
            <span>封面摄影</span>
            <span className="name">{personalInfo.englishName}</span>
            <span>{personalInfo.major}</span>
          </div>
        </aside>
      </div>

      <div className="hero-stats">
        <div className="hero-stat">
          <span className="hero-stat-value">9<sup>/117</sup></span>
          <span className="hero-stat-label">专业排名</span>
        </div>
        <div className="hero-stat">
          <span className="hero-stat-value">3.74</span>
          <span className="hero-stat-label">GPA · 6 学期</span>
        </div>
        <div className="hero-stat">
          <span className="hero-stat-value">2<sup> 项</sup></span>
          <span className="hero-stat-label">国家级大创</span>
        </div>
      </div>
    </section>
  );
}
