import React from 'react';
import { newsList } from '../data/personalData';

export default function News() {
  return (
    <div id="news" className="section-content">
      <h1>🔥 News</h1>
      <ul className="academic-list news-list">
        {newsList.map((item, index) => (
          <li key={index}>
            <span className="news-date">[{item.date}]</span>{' '}
            <span dangerouslySetInnerHTML={{ __html: item.text }} />
          </li>
        ))}
      </ul>
    </div>
  );
}
