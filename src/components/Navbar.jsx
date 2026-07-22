import React, { useState, useEffect } from 'react';
import { Menu, X, Search, Command } from 'lucide-react';

export default function Navbar({ onOpenCmdPalette }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const navItems = [
    { id: 'about', label: '关于' },
    { id: 'education', label: '教育' },
    { id: 'research', label: '科研项目' },
    { id: 'projects', label: '工程体系' },
    { id: 'awards', label: '竞赛荣誉' },
    { id: 'skills', label: '技术栈' },
    { id: 'contact', label: '联系' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);

      const sections = ['hero', ...navItems.map((item) => item.id)];
      const scrollPos = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <a href="#hero" className="nav-brand">
          <span className="nav-brand-dot"></span>
          CMX.
          <span style={{ fontSize: '0.72rem', opacity: 0.6, fontFamily: 'var(--font-mono)', fontWeight: 600, marginLeft: 4 }}>
            v2.0
          </span>
        </a>

        <ul className="nav-links">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button
            onClick={onOpenCmdPalette}
            style={{
              background: 'var(--color-primary-subtle)',
              border: '1px solid var(--border-color)',
              color: 'var(--color-primary)',
              borderRadius: '9999px',
              padding: '0.4rem 0.85rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            title="快捷搜索 (Ctrl+K)"
          >
            <Search size={14} />
            <span>搜索</span>
            <span style={{ fontSize: '0.7rem', opacity: 0.7, fontFamily: 'var(--font-mono)', background: 'rgba(37,99,235,0.15)', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
              ⌘K
            </span>
          </button>

          <button
            className="nav-mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="mobile-drawer">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="mobile-drawer-link"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
