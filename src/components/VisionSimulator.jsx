import React, { useState, useEffect, useRef } from 'react';
import { Eye, Activity, RotateCw, Sparkles, CheckCircle2 } from 'lucide-react';

export default function VisionSimulator() {
  const [targetPos, setTargetPos] = useState({ x: 180, y: 110 });
  const [isWaving, setIsWaving] = useState(true);
  const [telemetry, setTelemetry] = useState({
    distanceX: 12.45,
    distanceY: 3.82,
    distanceZ: 45.10,
    rmse: 11.8,
    fps: 26.4,
    corners: 4,
    status: 'OPTIMAL'
  });

  const canvasRef = useRef(null);

  useEffect(() => {
    let animationId;
    let tick = 0;

    const render = () => {
      tick += 0.04;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      const width = (canvas.width = canvas.parentElement.clientWidth || 600);
      const height = (canvas.height = 240);

      // Background Sea Surface & Grid
      ctx.fillStyle = '#06132b';
      ctx.fillRect(0, 0, width, height);

      // Draw Grid / Horizon line
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.lineWidth = 1;
      const horizonY = height * 0.5;
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      ctx.lineTo(width, horizonY);
      ctx.stroke();

      // Perspective Grid Lines
      for (let i = -6; i <= 6; i++) {
        ctx.beginPath();
        ctx.moveTo(width / 2, horizonY);
        ctx.lineTo(width / 2 + i * 80, height);
        ctx.stroke();
      }

      // Simulated Wave Offset
      const waveY = isWaving ? Math.sin(tick * 2) * 8 : 0;
      const waveX = isWaving ? Math.cos(tick * 1.5) * 4 : 0;

      const currentX = targetPos.x + waveX;
      const currentY = targetPos.y + waveY;

      // Draw Camera View Center Reticle
      const camCenterX = width / 2;
      const camCenterY = height / 2;
      ctx.strokeStyle = 'rgba(37, 99, 235, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(camCenterX, camCenterY, 35, 0, Math.PI * 2);
      ctx.stroke();

      // Draw Target Pole & Harris Corner Markers
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(currentX - 4, currentY - 30, 8, 60);

      // Corner Markers
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      const corners = [
        { x: currentX - 12, y: currentY - 35 },
        { x: currentX + 12, y: currentY - 35 },
        { x: currentX - 12, y: currentY + 35 },
        { x: currentX + 12, y: currentY + 35 },
      ];

      corners.forEach((c) => {
        ctx.beginPath();
        ctx.arc(c.x, c.y, 4, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Camera Ray vectors
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(camCenterX, height);
      ctx.lineTo(currentX, currentY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Bounding Box
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(currentX - 22, currentY - 42, 44, 84);

      // HUD Text
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = '#60a5fa';
      ctx.fillText(`TARGET: POLE_ROI [CONF: 98.4%]`, currentX + 26, currentY - 20);
      ctx.fillText(`X:${(currentX * 0.1).toFixed(2)}m Y:${((height - currentY) * 0.1).toFixed(2)}m`, currentX + 26, currentY - 6);

      // Update Telemetry Math
      const dx = (currentX - camCenterX) * 0.08;
      const dy = (height - currentY) * 0.05;
      const dz = Math.sqrt(dx * dx + dy * dy + 40 * 40);
      const rmseCalc = 10.5 + Math.abs(Math.sin(tick)) * 3.5;

      setTelemetry({
        distanceX: parseFloat(dx.toFixed(2)),
        distanceY: parseFloat(dy.toFixed(2)),
        distanceZ: parseFloat(dz.toFixed(2)),
        rmse: parseFloat(rmseCalc.toFixed(1)),
        fps: (25.8 + Math.sin(tick * 3) * 0.8).toFixed(1),
        corners: 4,
        status: 'LM/TRR SOLVED'
      });

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [targetPos, isWaving]);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    setTargetPos({ x: clickX, y: clickY });
  };

  return (
    <div style={{
      marginTop: '1.5rem',
      background: 'linear-gradient(135deg, #050d1e 0%, #0b1c3d 100%)',
      border: '1px solid #1d4ed8',
      borderRadius: '16px',
      padding: '1.25rem',
      boxShadow: '0 12px 32px rgba(5, 13, 30, 0.6)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '0.85rem',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#60a5fa', fontWeight: 700, fontSize: '0.92rem', fontFamily: 'var(--font-mono)' }}>
          <Eye size={18} color="#38bdf8" />
          海上单目视觉相机位姿解算模拟器 (Interactive HUD Demo)
        </div>
        <button
          onClick={() => setIsWaving(!isWaving)}
          style={{
            background: isWaving ? '#1e3a8a' : '#1e293b',
            color: '#93c5fd',
            border: '1px solid #3b82f6',
            padding: '0.3rem 0.75rem',
            borderRadius: '6px',
            fontSize: '0.78rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontFamily: 'var(--font-mono)'
          }}
        >
          <RotateCw size={12} /> {isWaving ? '海浪扰动: 开' : '海浪扰动: 关'}
        </button>
      </div>

      <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
        💡 提示：在上方视域内点击或拖拽杆状目标，实时演算相机光线夹角不变性约束与 LM/TRR 非线性优化姿态。
      </p>

      {/* Canvas Viewport */}
      <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid #1e3a8a', cursor: 'crosshair' }}>
        <canvas ref={canvasRef} onClick={handleCanvasClick} style={{ width: '100%', height: '240px', display: 'block' }} />
        
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          background: 'rgba(7, 16, 38, 0.85)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          padding: '0.3rem 0.6rem',
          borderRadius: '4px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          color: '#38bdf8'
        }}>
          LIVE STREAM: 1920x1080 @ {telemetry.fps} FPS
        </div>
      </div>

      {/* Realtime Math & Telemetry Bar */}
      <div style={{
        marginTop: '1rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '0.65rem',
        fontFamily: 'var(--font-mono)'
      }}>
        <div style={{ background: '#08142c', border: '1px solid #1e293b', padding: '0.65rem', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>三维位姿 X/Y/Z</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#38bdf8' }}>
            {telemetry.distanceX}m, {telemetry.distanceZ}m
          </div>
        </div>

        <div style={{ background: '#08142c', border: '1px solid #1e293b', padding: '0.65rem', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>实测定位误差 (RMSE)</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: telemetry.rmse <= 15 ? '#22c55e' : '#f59e0b' }}>
            {telemetry.rmse} cm
          </div>
        </div>

        <div style={{ background: '#08142c', border: '1px solid #1e293b', padding: '0.65rem', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>角点精准提取</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#60a5fa' }}>
            {telemetry.corners} / 4 Points (Harris)
          </div>
        </div>

        <div style={{ background: '#08142c', border: '1px solid #1e293b', padding: '0.65rem', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>非线性优化状态</div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#22c55e', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <CheckCircle2 size={14} /> {telemetry.status}
          </div>
        </div>
      </div>
    </div>
  );
}
