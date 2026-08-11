import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchDataset } from '../data/personalData';
import { Search, X, CornerDownLeft } from 'lucide-react';

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

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
      return;
    }
    // href 形如 "#projects" / "#research" => 滚动到目标锚点
    if (item.href.startsWith('#')) {
      const id = item.href.slice(1);
      // 优先尝试在当前页内滚动
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      // 否则回到首页并定位
      navigate('/');
      setTimeout(() => {
        const target = document.getElementById(id);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    } else {
      navigate(item.href);
    }
  };

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-panel" onClick={(e) => e.stopPropagation()}>
        <div className="search-panel-kicker">
          <span className="search-panel-rule" />
          <span>站内检索 / INDEX</span>
          <button className="search-close" onClick={onClose} aria-label="关闭搜索">
            <X size={16} />
          </button>
        </div>

        <div className="search-input-row">
          <Search className="search-input-icon" size={20} strokeWidth={1.6} />
          <input
            type="text"
            autoFocus
            placeholder="搜索项目、研究、经历……"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="search-input-hint">⌘ K</span>
        </div>

        <div className="search-results" role="listbox" aria-label="搜索结果">
          {filteredResults.length === 0 ? (
            <div className="search-empty">没有找到匹配内容</div>
          ) : (
            filteredResults.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleSelect(item)}
                className={`search-result ${idx === selectedIndex ? 'is-selected' : ''}`}
                role="option"
                aria-selected={idx === selectedIndex}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <div className="search-result-copy">
                  <div className="search-result-heading">
                    <span className="search-result-type">{item.type}</span>
                    <span className="search-result-title">{item.title}</span>
                  </div>
                  <div className="search-result-subtitle">{item.subtitle}</div>
                </div>
                <CornerDownLeft className="search-result-arrow" size={15} />
              </div>
            ))
          )}
        </div>

        <div className="search-footer">
          <span>浏览条目以访问内容</span>
          <span><kbd>ESC</kbd> 关闭</span>
        </div>
      </div>
    </div>
  );
}
