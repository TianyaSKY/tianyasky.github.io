import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { personalInfo } from '../data/personalData';

const NAV_LINKS = [
  { id: 'about-me', label: 'About Me', hash: '#about-me' },
  { id: 'news', label: 'News', hash: '#news' },
  { id: 'projects', label: 'Projects', hash: '#projects' },
  { id: 'education', label: 'Education', hash: '#education' },
  { id: 'skills', label: 'Skills', hash: '#skills' },
  { id: 'contact', label: 'Contact', hash: '#contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  // Close drawer on path changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleNavClick = (e, item) => {
    e.preventDefault();
    setMobileOpen(false);

    if (isHome) {
      const el = document.getElementById(item.id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.pageYOffset - 65;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    } else {
      navigate('/' + item.hash);
      setTimeout(() => {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.pageYOffset - 65;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 150);
    }
  };

  return (
    <header className="masthead">
      <div className="masthead__inner-wrap">
        <div className="masthead__menu">
          <nav id="site-nav" className="greedy-nav">
            <Link
              to="/"
              className="site-title"
              onClick={() => isHome && window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <strong>{personalInfo.name}</strong> / {personalInfo.chineseName}
            </Link>

            <ul className="visible-links">
              <li className="masthead__menu-item masthead__menu-home-item">
                <Link to="/" onClick={() => isHome && window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  Homepage
                </Link>
              </li>
              {NAV_LINKS.map((item) => (
                <li key={item.id} className="masthead__menu-item">
                  <a href={`/${item.hash}`} onClick={(e) => handleNavClick(e, item)}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="nav-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </nav>
        </div>

        {mobileOpen && (
          <div className="masthead__mobile-menu">
            <ul>
              <li>
                <Link to="/" onClick={() => { setMobileOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                  Homepage
                </Link>
              </li>
              {NAV_LINKS.map((item) => (
                <li key={item.id}>
                  <a href={`/${item.hash}`} onClick={(e) => handleNavClick(e, item)}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
