import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchDataset } from '../data/searchDataset';
import { Search, X, CornerDownLeft } from 'lucide-react';
import AccessibleDialog from './AccessibleDialog';
import '../styles/search-palette.css';

export default function CommandPalette({ onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const filteredResults = searchDataset.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
    item.type.toLowerCase().includes(query.toLowerCase())
  );

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
    setSelectedIndex(0);
  };

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

  const handleInputKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (filteredResults.length > 0) {
        setSelectedIndex((i) => (i + 1) % filteredResults.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (filteredResults.length > 0) {
        setSelectedIndex((i) => (i - 1 + filteredResults.length) % filteredResults.length);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults.length > 0) {
        handleSelect(filteredResults[selectedIndex]);
      }
    }
  };

  return (
    <AccessibleDialog
      overlayClassName="search-overlay"
      dialogClassName="search-panel"
      label="站内检索"
      onClose={onClose}
    >
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
          data-dialog-initial-focus
          placeholder="搜索项目、研究、经历……"
          value={query}
          onChange={handleQueryChange}
          onKeyDown={handleInputKeyDown}
        />
        <span className="search-input-hint">⌘ K</span>
      </div>

      <ul className="search-results" aria-label="搜索结果">
        {filteredResults.length === 0 ? (
          <li className="search-empty">没有找到匹配内容</li>
        ) : (
          filteredResults.map((item, idx) => (
            <li key={item.title}>
              <button
                type="button"
                className={`search-result ${idx === selectedIndex ? 'is-selected' : ''}`}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <span className="search-result-copy">
                  <span className="search-result-heading">
                    <span className="search-result-type">{item.type}</span>
                    <span className="search-result-title">{item.title}</span>
                  </span>
                  <span className="search-result-subtitle">{item.subtitle}</span>
                </span>
                <CornerDownLeft className="search-result-arrow" size={15} />
              </button>
            </li>
          ))
        )}
      </ul>

      <div className="search-footer">
        <span>浏览条目以访问内容</span>
        <span><kbd>ESC</kbd> 关闭</span>
      </div>
    </AccessibleDialog>
  );
}
