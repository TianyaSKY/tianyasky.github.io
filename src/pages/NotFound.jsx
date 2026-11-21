import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div id="main" className="academic-main" role="main">
      <section className="not-found">
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for might have been removed or does not exist.</p>
        <Link to="/" style={{ color: '#224b8d', display: 'inline-flex', alignItems: 'center', gap: '0.3em', marginTop: '1em' }}>
          <ArrowLeft size={16} /> Back to Homepage
        </Link>
      </section>
    </div>
  );
}
