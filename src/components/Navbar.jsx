import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, Command } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'about', label: '关于', anchor: '#about' },
  { id: 'education', label: '教育', anchor: '#education' },
  { id: 'projects', label: '项目', anchor: '#projects', route: '/projects' },
  { id: 'awards', label: '竞赛', anchor: '#awards' },
  { id: 'skills', label: '技术栈', anchor: '#skills' },
  { id: 'contact', label: '联系', anchor: '#contact' }
];

function scrollToAnchor(id, navigate) {
  if (id === 'hero') return;
  const onHome = window.location.pathname === '/';
  if (!onHome) {
    navigate('/');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 220);
    return;
  }
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function Navbar({ onOpenCmdPalette }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isMac, setIsMac] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setIsMac(/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform || navigator.userAgent));
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
      if (!isHome) return;
      const sections = ['hero', ...NAV_ITEMS.map((i) => i.id)];
      const scrollPos = window.scrollY + 200;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  const handleNav = (e, item) => {
    e.preventDefault();
    setMobileOpen(false);
    if (item.route) {
      navigate(item.route);
      return;
    }
    scrollToAnchor(item.id, navigate);
  };

  const handleMobileSearch = () => {
    setMobileOpen(false);
    onOpenCmdPalette();
  };

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <Link
          to="/"
          className="nav-brand"
          onClick={() => isHome && window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <img className="nav-brand-logo" src="/logo.png" alt="CMX" />
          <span className="nav-brand-version">v2.0</span>
        </Link>

        <ul className="nav-links">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => handleNav(e, item)}
                className={`nav-link ${isHome && activeSection === item.id ? 'active' : ''}`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <button
            onClick={onOpenCmdPalette}
            className="nav-search-bar-trigger"
            title={`全站快捷搜索 (${isMac ? '⌘K' : 'Ctrl+K'})`}
            aria-label="打开全局搜索"
          >
            <Search size={14} className="nav-search-icon" />
            <span className="nav-search-text">搜索项目、技能、荣誉...</span>
            <span className="nav-search-kbd">{isMac ? '⌘K' : 'Ctrl+K'}</span>
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
          <button
            type="button"
            className="mobile-drawer-link"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              background: 'none',
              border: 'none',
              font: 'inherit',
              textAlign: 'left',
              color: 'var(--color-vermilion)'
            }}
            onClick={handleMobileSearch}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <Search size={16} /> 全站检索
            </span>
            <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>{isMac ? '⌘K' : 'Ctrl+K'}</span>
          </button>

          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="mobile-drawer-link"
              onClick={(e) => handleNav(e, item)}
            >
              {item.label}
            </a>
          ))}
          <Link
            to="/projects"
            className="mobile-drawer-link"
            onClick={() => setMobileOpen(false)}
          >
            所有项目
          </Link>
        </div>
      )}
    </>
  );
}
