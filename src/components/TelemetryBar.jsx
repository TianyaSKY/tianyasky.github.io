import React from 'react';
import { Activity, ShieldCheck, Cpu } from 'lucide-react';

export default function TelemetryBar() {
  return (
    <div
      style={{
        width: '100%',
        background: 'linear-gradient(90deg, #071228 0%, #1e3a8a 50%, #071228 100%)',
        color: '#93c5fd',
        padding: '0.4rem 1rem',
        fontSize: '0.78rem',
        fontFamily: 'var(--font-mono)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(56, 189, 248, 0.2)',
        position: 'relative',
        zIndex: 10,
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#38bdf8', fontWeight: 700 }}>
          <Activity size={12} className="pulse-dot" style={{ background: '#38bdf8' }} />
          TELEMETRY: ONLINE
        </span>
        <span style={{ opacity: 0.8, display: 'none', mdDisplay: 'inline' }}>
          大连海洋大学 · 信息工程学院
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
        <span>
          单目姿态估计: <strong style={{ color: '#ffffff' }}>10-15cm / 26 FPS</strong>
        </span>
        <span style={{ display: 'none', smDisplay: 'inline' }}>
          GPA: <strong style={{ color: '#60a5fa' }}>3.74</strong> (9/117)
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: '#22c55e' }}>
          <ShieldCheck size={12} /> VERIFIED
        </span>
      </div>
    </div>
  );
}
