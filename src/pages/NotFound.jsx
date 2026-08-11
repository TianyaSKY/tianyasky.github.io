import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="section-inner" style={{ paddingTop: '10rem', textAlign: 'center' }}>
      <div className="section-label">404</div>
      <h2 className="section-title">页面找不到了</h2>
      <p className="section-desc" style={{ marginBottom: '2rem' }}>
        这里可能是迭代中被移除的旧页面，或许从未存在过。
      </p>
      <Link to="/" className="btn btn-primary">
        <ArrowLeft size={18} /> 回到首页
      </Link>
    </section>
  );
}
