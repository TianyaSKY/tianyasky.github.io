import React, { useState, useEffect } from 'react';
import { searchDataset } from '../data/personalData';
import { Search, X, Command, ArrowRight, CornerDownLeft } from 'lucide-react';

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent or state trigger
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredResults = searchDataset.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
    item.type.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (item) => {
    onClose();
    if (item.href.startsWith('http') || item.href.startsWith('mailto')) {
      window.open(item.href, '_blank');
    } else {
      window.location.hash = item.href;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        background: 'rgba(7, 16, 38, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '10vh',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '90%',
          maxWidth: '640px',
          background: '#0a1633',
          border: '1px solid #2563eb',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 30px rgba(37, 99, 235, 0.3)',
          overflow: 'hidden',
          color: '#e2e8f0',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem 1.25rem',
            borderBottom: '1px solid #1e293b',
          }}
        >
          <Search size={20} color="#38bdf8" />
          <input
            type="text"
            autoFocus
            placeholder="搜索科研项目、竞赛获奖、课程成绩或联系方式... (Type to search)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#ffffff',
              fontSize: '1rem',
              fontFamily: 'var(--font-sans)',
            }}
          />
          <button
            onClick={onClose}
            style={{
              background: '#1e293b',
              border: 'none',
              color: '#94a3b8',
              borderRadius: '6px',
              padding: '0.3rem',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '360px', overflowY: 'auto', padding: '0.5rem' }}>
          {filteredResults.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
              未搜索到匹配项...
            </div>
          ) : (
            filteredResults.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleSelect(item)}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  background: idx === selectedIndex ? 'rgba(37, 99, 235, 0.25)' : 'transparent',
                  border: idx === selectedIndex ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid transparent',
                  marginBottom: '0.25rem',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono)',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px',
                        background: '#1e3a8a',
                        color: '#60a5fa',
                      }}
                    >
                      {item.type}
                    </span>
                    <span style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>
                      {item.title}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                    {item.subtitle}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#38bdf8', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                  跳转 <CornerDownLeft size={14} />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer shortcuts info */}
        <div
          style={{
            background: '#060e24',
            padding: '0.65rem 1.25rem',
            borderTop: '1px solid #1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.78rem',
            color: '#64748b',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <div>
            <span style={{ background: '#1e293b', color: '#94a3b8', padding: '0.15rem 0.4rem', borderRadius: '4px', marginRight: 4 }}>ESC</span> 退出
          </div>
          <div>
            <Command size={12} style={{ display: 'inline', marginRight: 4 }} />
            全局极速检索 HUD
          </div>
        </div>
      </div>
    </div>
  );
}
