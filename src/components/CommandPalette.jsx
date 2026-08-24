import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  searchDataset,
  searchCategories,
  popularSearchTags
} from '../data/searchDataset';
import { searchItems, renderHighlightedText } from '../utils/searchEngine';
import {
  Search,
  X,
  CornerDownLeft,
  ExternalLink,
  Sparkles,
  Clock,
  ArrowRight,
  Hash
} from 'lucide-react';
import AccessibleDialog from './AccessibleDialog';
import '../styles/search-palette.css';

const RECENT_STORAGE_KEY = 'cmx_portfolio_recent_searches';

export default function CommandPalette({ onClose }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isMac, setIsMac] = useState(false);

  const inputRef = useRef(null);
  const itemRefs = useRef([]);
  const navigate = useNavigate();

  // 检测操作系统平台
  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setIsMac(/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform || navigator.userAgent));
    }
  }, []);

  // 加载最近搜索历史
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed.slice(0, 5));
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // 记录最近搜索词
  const saveRecentSearch = (text) => {
    const trimmed = text?.trim();
    if (!trimmed) return;
    try {
      const filtered = recentSearches.filter((item) => item !== trimmed);
      const updated = [trimmed, ...filtered].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // 清除全部最近搜索
  const handleClearAllRecent = (e) => {
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  // 移除单条最近搜索
  const handleRemoveRecentItem = (e, target) => {
    e.stopPropagation();
    const updated = recentSearches.filter((item) => item !== target);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // 计算当前搜索词在各分类下的匹配数量
  const categoryCounts = useMemo(() => {
    const counts = { all: 0 };
    for (const cat of searchCategories) {
      if (cat.id !== 'all') {
        const res = searchItems(searchDataset, query, cat.id);
        counts[cat.id] = res.length;
        counts.all += res.length;
      }
    }
    return counts;
  }, [query]);

  // 获取当前激活分类下的筛选结果
  const filteredResults = useMemo(() => {
    return searchItems(searchDataset, query, activeCategory);
  }, [query, activeCategory]);

  // 当结果列表变化或分类切换时，重置选中索引为 0
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredResults.length, activeCategory]);

  // 键盘光标选中项变化时，自动平滑滚动使其保持在视口可见区域
  useEffect(() => {
    if (itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex].scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  }, [selectedIndex]);

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleClearQuery = () => {
    setQuery('');
    setSelectedIndex(0);
    inputRef.current?.focus();
  };

  const handleSelect = (item) => {
    if (!item) return;
    saveRecentSearch(query || item.title);
    onClose();

    if (item.href.startsWith('http') || item.href.startsWith('mailto')) {
      window.open(item.href, '_blank', 'noopener,noreferrer');
      return;
    }

    // href 形如 "#projects" / "#research" / "#skills" => 滚动到目标锚点
    if (item.href.startsWith('#')) {
      const id = item.href.slice(1);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      navigate('/');
      setTimeout(() => {
        const target = document.getElementById(id);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 220);
      return;
    }

    // href 包含子章节锚点，如 "/projects/vision-positioning#sec-pipeline"
    if (item.href.includes('#')) {
      const [path, hashId] = item.href.split('#');
      navigate(item.href);
      setTimeout(() => {
        const target = document.getElementById(hashId);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 240);
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
      if (filteredResults.length > 0 && filteredResults[selectedIndex]) {
        handleSelect(filteredResults[selectedIndex]);
      }
    } else if (e.key === 'Tab') {
      // 按 Tab 键循环切换分类
      e.preventDefault();
      const currentIdx = searchCategories.findIndex((c) => c.id === activeCategory);
      const nextIdx = e.shiftKey
        ? (currentIdx - 1 + searchCategories.length) % searchCategories.length
        : (currentIdx + 1) % searchCategories.length;
      setActiveCategory(searchCategories[nextIdx].id);
    }
  };

  const handleQuickTagClick = (tag) => {
    setQuery(tag);
    inputRef.current?.focus();
  };

  const isExternal = (href = '') => href.startsWith('http') || href.startsWith('mailto');

  // 获取分类专属色彩标识样式
  const getCategoryColorClass = (cat = '') => {
    switch (cat.toLowerCase()) {
      case 'research':
        return 'badge-research';
      case 'engineering':
        return 'badge-engineering';
      case 'opensource':
        return 'badge-opensource';
      case 'skill':
        return 'badge-skill';
      case 'award':
        return 'badge-award';
      case 'nav':
      default:
        return 'badge-nav';
    }
  };

  return (
    <AccessibleDialog
      overlayClassName="search-overlay"
      dialogClassName="search-panel"
      label="全站智能检索"
      onClose={onClose}
    >
      {/* 头部装饰与关闭按钮 */}
      <div className="search-panel-kicker">
        <div className="search-kicker-left">
          <span className="search-panel-rule" />
          <span className="search-panel-title">INDEX / 全站智能检索</span>
        </div>
        <div className="search-kicker-right">
          <span className="search-count-badge">
            {filteredResults.length} 条结果
          </span>
          <button className="search-close" onClick={onClose} aria-label="关闭搜索 (ESC)">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* 搜索输入行 */}
      <div className="search-input-row">
        <Search className="search-input-icon" size={20} strokeWidth={1.8} />
        <input
          ref={inputRef}
          type="text"
          data-dialog-initial-focus
          placeholder="搜索项目、论文、技术栈、竞赛荣誉或技能……"
          value={query}
          onChange={handleQueryChange}
          onKeyDown={handleInputKeyDown}
          autoComplete="off"
          spellCheck="false"
        />
        {query && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={handleClearQuery}
            title="清空输入"
            aria-label="清空输入"
          >
            <X size={14} />
          </button>
        )}
        <span className="search-input-hint" title="键盘呼出快捷键">
          {isMac ? '⌘ K' : 'Ctrl+K'}
        </span>
      </div>

      {/* 分类选项卡 */}
      <div className="search-categories-bar" role="tablist" aria-label="搜索分类">
        {searchCategories.map((cat) => {
          const count = categoryCounts[cat.id] || 0;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`search-cat-tab ${isActive ? 'is-active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span>{cat.label}</span>
              <span className="search-cat-count">{count}</span>
            </button>
          );
        })}
      </div>

      {/* 空搜索时的推荐标签与历史探索 */}
      {!query && (
        <div className="search-suggestions-box">
          {/* 最近搜索 */}
          {recentSearches.length > 0 && (
            <div className="search-suggestion-section">
              <div className="search-suggestion-header">
                <span className="section-title-with-icon">
                  <Clock size={12} /> 最近搜索
                </span>
                <button
                  type="button"
                  className="search-clear-history-btn"
                  onClick={handleClearAllRecent}
                >
                  清除全部
                </button>
              </div>
              <div className="search-tags-row">
                {recentSearches.map((item) => (
                  <span
                    key={item}
                    className="search-tag-chip search-tag-history"
                    onClick={() => handleQuickTagClick(item)}
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      className="search-tag-remove"
                      onClick={(e) => handleRemoveRecentItem(e, item)}
                      title="删除记录"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 热门搜索推荐 */}
          <div className="search-suggestion-section">
            <div className="search-suggestion-header">
              <span className="section-title-with-icon">
                <Sparkles size={12} /> 热门探索
              </span>
            </div>
            <div className="search-tags-row">
              {popularSearchTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="search-tag-chip search-tag-popular"
                  onClick={() => handleQuickTagClick(tag)}
                >
                  <Hash size={11} className="tag-hash-icon" />
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 搜索结果列表 */}
      <ul className="search-results" aria-label="搜索结果">
        {filteredResults.length === 0 ? (
          <li className="search-empty">
            <div className="search-empty-icon">
              <Search size={32} strokeWidth={1.4} />
            </div>
            <p className="search-empty-title">未找到与「{query}」相关的内容</p>
            <p className="search-empty-desc">
              支持按中文标题、技术栈标签、拼音首字母（如 lqb、pgmd）或英文关键词检索。
            </p>
            <div className="search-empty-suggestions">
              <span>尝试搜索：</span>
              {popularSearchTags.slice(0, 4).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="search-empty-chip"
                  onClick={() => handleQuickTagClick(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </li>
        ) : (
          filteredResults.map((item, idx) => {
            const isSelected = idx === selectedIndex;
            const external = isExternal(item.href);
            const colorClass = getCategoryColorClass(item.category);

            return (
              <li key={item.id || item.title}>
                <button
                  ref={(el) => (itemRefs.current[idx] = el)}
                  type="button"
                  className={`search-result ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <div className="search-result-main">
                    <div className="search-result-heading">
                      <span className={`search-result-type ${colorClass}`}>
                        {item.type}
                      </span>
                      {item.badge && (
                        <span className="search-result-badge">
                          {renderHighlightedText(item.badge, query)}
                        </span>
                      )}
                      <span className="search-result-title">
                        {renderHighlightedText(item.title, query)}
                      </span>
                    </div>

                    <div className="search-result-subtitle">
                      {renderHighlightedText(item.subtitle, query)}
                    </div>

                    {/* 标签列表 */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="search-result-tags">
                        {item.tags.slice(0, 5).map((t, tIdx) => (
                          <span key={tIdx} className="search-mini-tag">
                            {renderHighlightedText(t, query)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="search-result-action">
                    {external ? (
                      <ExternalLink className="search-result-arrow" size={15} />
                    ) : (
                      <CornerDownLeft className="search-result-arrow" size={15} />
                    )}
                  </div>
                </button>
              </li>
            );
          })
        )}
      </ul>

      {/* 底部按键提示 */}
      <div className="search-footer">
        <div className="search-footer-shortcuts">
          <span><kbd>↑</kbd><kbd>↓</kbd> 选择</span>
          <span><kbd>↵</kbd> 打开</span>
          <span><kbd>Tab</kbd> 切换分类</span>
          <span><kbd>ESC</kbd> 关闭</span>
        </div>
        <div className="search-footer-hint">
          <span>Tianya Portfolio Search · v2.0</span>
        </div>
      </div>
    </AccessibleDialog>
  );
}

