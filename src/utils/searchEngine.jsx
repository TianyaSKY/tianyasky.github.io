import React from 'react';

/**
 * 规范化字符串（去空格转小写）
 */
export function normalizeStr(str = '') {
  return String(str).toLowerCase().trim();
}

/**
 * 将用户 query 按空格分割为多个搜索词 token
 */
export function tokenizeQuery(query = '') {
  return query
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * 计算单条数据对搜索词组的相关性匹配得分
 * @param {Object} item - searchDataset 中的单条记录
 * @param {Array<string>} tokens - 分词后的查询列表
 * @param {string} rawQuery - 原始完整查询串
 * @returns {number} 匹配得分，0 表示不匹配
 */
export function calculateMatchScore(item, tokens, rawQuery) {
  if (!tokens.length) return 1;

  const title = normalizeStr(item.title);
  const subtitle = normalizeStr(item.subtitle);
  const desc = normalizeStr(item.description);
  const badge = normalizeStr(item.badge);
  const tags = (item.tags || []).map(normalizeStr);
  const aliases = (item.aliases || []).map(normalizeStr);
  const type = normalizeStr(item.type);

  const cleanRawQuery = normalizeStr(rawQuery);

  let score = 0;

  // 1. 完整 Query 精确命中 / 开头命中
  if (title === cleanRawQuery) {
    score += 200;
  } else if (title.startsWith(cleanRawQuery)) {
    score += 120;
  } else if (title.includes(cleanRawQuery)) {
    score += 80;
  }

  // 2. 检查多 Token 匹配情况（必须全部 token 都有对应命中才判定为 match）
  let allTokensMatched = true;

  for (const token of tokens) {
    let tokenScore = 0;

    // 匹配标题
    if (title === token) {
      tokenScore += 90;
    } else if (title.startsWith(token)) {
      tokenScore += 60;
    } else if (title.includes(token)) {
      tokenScore += 45;
    }

    // 匹配别名/拼音首字母/英文别名
    if (aliases.some((a) => a === token)) {
      tokenScore += 70;
    } else if (aliases.some((a) => a.includes(token))) {
      tokenScore += 40;
    }

    // 匹配标签 / 技术栈
    if (tags.some((t) => t === token)) {
      tokenScore += 60;
    } else if (tags.some((t) => t.includes(token))) {
      tokenScore += 35;
    }

    // 匹配徽章 / 类型
    if (badge.includes(token) || type.includes(token)) {
      tokenScore += 25;
    }

    // 匹配副标题
    if (subtitle.includes(token)) {
      tokenScore += 20;
    }

    // 匹配描述内容
    if (desc.includes(token)) {
      tokenScore += 10;
    }

    if (tokenScore === 0) {
      allTokensMatched = false;
      break;
    }

    score += tokenScore;
  }

  return allTokensMatched ? score : 0;
}

/**
 * 执行搜索过滤与相关度排序
 */
export function searchItems(dataset, query, activeCategory = 'all') {
  if (!Array.isArray(dataset)) return [];

  // 分类初筛
  const categoryFiltered = activeCategory === 'all'
    ? dataset
    : dataset.filter((item) => item.category === activeCategory);

  const cleanQuery = query.trim();
  if (!cleanQuery) {
    return categoryFiltered;
  }

  const tokens = tokenizeQuery(cleanQuery);

  const scoredItems = [];
  for (const item of categoryFiltered) {
    const score = calculateMatchScore(item, tokens, cleanQuery);
    if (score > 0) {
      scoredItems.push({ item, score });
    }
  }

  // 按得分从高到低排序
  scoredItems.sort((a, b) => b.score - a.score);

  return scoredItems.map((entry) => entry.item);
}

/**
 * 关键词高亮渲染辅助函数
 * 将 text 中的匹配 token 用 <mark class="search-highlight"> 高亮
 */
export function renderHighlightedText(text, query) {
  if (!text || !query || !query.trim()) {
    return text;
  }

  const tokens = tokenizeQuery(query);
  if (!tokens.length) return text;

  // 构造安全的正则匹配模式
  const escapedTokens = tokens
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .filter(Boolean);

  if (!escapedTokens.length) return text;

  const regex = new RegExp(`(${escapedTokens.join('|')})`, 'gi');
  const parts = String(text).split(regex);

  return parts.map((part, i) => {
    if (!part) return null;
    const isMatch = tokens.some((t) => t.toLowerCase() === part.toLowerCase());
    if (isMatch) {
      return (
        <mark key={i} className="search-highlight">
          {part}
        </mark>
      );
    }
    return part;
  });
}
