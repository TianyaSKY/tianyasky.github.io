import React, { useState, useEffect } from 'react';
import { personalInfo } from '../data/personalData';
import { MapPin, Mail, Search } from 'lucide-react';

export default function Sidebar({ onOpenCmdPalette }) {
  const [isEducation, setIsEducation] = useState(false);

  useEffect(() => {
    const el = document.getElementById('education');
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsEducation(entry.isIntersecting);
      },
      {
        rootMargin: '-10% 0px -25% 0px',
        threshold: 0.08
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`sidebar sticky ${isEducation ? 'show-photo' : ''}`}>
      <div className="profile_box">
        {/* Profile View (Default) */}
        <div className="sidebar-profile-view">
          <div className="author__content">
            <h3 className="author__name">{personalInfo.name}</h3>
            <p className="author__name-en">{personalInfo.chineseName}</p>
            <p className="author__bio">{personalInfo.title}</p>
          </div>

          <div className="author__urls-wrapper">
            <div className="author__summary">
              <p className="summary-college">{personalInfo.college}</p>
              <p className="summary-school">{personalInfo.school}</p>
              <p className="highlight-tag">National Innovation Project PI</p>
            </div>

            <ul className="author__urls social-icons">
              <li>
                <span className="author__meta-item">
                  <MapPin size={15} className="meta-icon" />
                  <span>{personalInfo.location}</span>
                </span>
              </li>
              <li>
                <a href={`mailto:${personalInfo.email}`} className="author__meta-link">
                  <Mail size={15} className="meta-icon" />
                  <span>{personalInfo.email}</span>
                </a>
              </li>
            </ul>

            {onOpenCmdPalette && (
              <div className="sidebar__search-trigger">
                <button
                  type="button"
                  onClick={onOpenCmdPalette}
                  className="sidebar-search-btn"
                  title="Search Site (⌘K / Ctrl+K)"
                >
                  <Search size={14} />
                  <span>Site Search (⌘K)</span>
                </button>
              </div>
            )}

            {/* Mobile quick links */}
            <div className="author__urls_sm">
              <a href={`mailto:${personalInfo.email}`} title="Email"><Mail size={18} /></a>
              {onOpenCmdPalette && (
                <button type="button" onClick={onOpenCmdPalette} title="Search" className="mobile-search-icon-btn">
                  <Search size={18} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Dalian Photo View (Smoothly morphs in when scrolled to Education) */}
        <div className="sidebar-photo-view" aria-hidden={!isEducation}>
          <div className="sidebar-photo-card">
            <div className="sidebar-photo-img-wrap">
              <img
                src="/dalian.webp"
                alt="Coastal Dalian, China"
                className="sidebar-photo-img"
              />
              <span className="photo-location-badge">📍 Dalian, China</span>
            </div>
            <div className="sidebar-photo-caption">
              <p className="photo-caption-title">{personalInfo.school}</p>
              <p className="photo-caption-sub">{personalInfo.college}</p>
              <p className="photo-caption-city">Dalian, Liaoning</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
