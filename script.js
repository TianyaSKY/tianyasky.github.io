// ═══ CONSTELLATION CANVAS ═══
(function () {
  const canvas = document.getElementById('constellation');
  const ctx = canvas.getContext('2d');
  let w, h, stars = [], mouse = { x: -9999, y: -9999 }, dpr = 1;

  function resize() {
    dpr = window.devicePixelRatio || 1;
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.scale(dpr, dpr);
  }

  class Star {
    constructor() { this.reset() }
    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - .5) * .12;
      this.vy = (Math.random() - .5) * .12;
      this.r = Math.random() * 1.5 + .4;
      this.alpha = Math.random() * .5 + .15;
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpeed = Math.random() * .015 + .004;
      // Color variation: gold, warm white, or faint teal
      const roll = Math.random();
      if (roll < .6) this.color = [212, 168, 67];
      else if (roll < .85) this.color = [240, 236, 228];
      else this.color = [56, 196, 184];
    }
    update() {
      this.pulse += this.pulseSpeed;
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < -50) this.x = w + 50;
      if (this.x > w + 50) this.x = -50;
      if (this.y < -50) this.y = h + 50;
      if (this.y > h + 50) this.y = -50;
      const dx = this.x - mouse.x, dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 180) {
        const force = (180 - dist) / 180 * .25;
        this.x += dx / dist * force;
        this.y += dy / dist * force;
      }
    }
    draw() {
      const a = this.alpha * (.65 + .35 * Math.sin(this.pulse));
      const [r, g, b] = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
      ctx.fill();
      // Subtle glow for larger stars
      if (this.r > 1.2) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${a * .08})`;
        ctx.fill();
      }
    }
  }

  function init() {
    resize();
    stars = [];
    const count = Math.min(Math.floor(w * h / 9000), 130);
    for (let i = 0; i < count; i++) stars.push(new Star());
  }

  function drawLines() {
    const maxDist = 130;
    const cellSize = maxDist;
    const cols = Math.ceil(w / cellSize);
    const rows = Math.ceil(h / cellSize);
    const grid = new Array(cols * rows);
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const cx = Math.floor(s.x / cellSize);
      const cy = Math.floor(s.y / cellSize);
      if (cx < 0 || cx >= cols || cy < 0 || cy >= rows) continue;
      const idx = cy * cols + cx;
      if (!grid[idx]) grid[idx] = [];
      grid[idx].push(i);
    }
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const cx = Math.floor(s.x / cellSize);
      const cy = Math.floor(s.y / cellSize);
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = cx + dx, ny = cy + dy;
          if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;
          const cell = grid[ny * cols + nx];
          if (!cell) continue;
          for (const j of cell) {
            if (j <= i) continue;
            const t = stars[j];
            const ddx = s.x - t.x, ddy = s.y - t.y;
            const dist = Math.sqrt(ddx * ddx + ddy * ddy);
            if (dist < maxDist) {
              const a = (1 - dist / maxDist) * .12;
              ctx.beginPath();
              ctx.moveTo(s.x, s.y);
              ctx.lineTo(t.x, t.y);
              ctx.strokeStyle = `rgba(212,168,67,${a})`;
              ctx.lineWidth = .5;
              ctx.stroke();
            }
          }
        }
      }
    }
  }

  // Draw lines connecting stars near mouse cursor (interactive highlight)
  function drawMouseLines() {
    if (mouse.x === -9999) return;
    const maxDist = 200;
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const dx = s.x - mouse.x, dy = s.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDist) {
        const a = (1 - dist / maxDist) * .08;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(56,196,184,${a})`;
        ctx.lineWidth = .4;
        ctx.stroke();
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    stars.forEach(s => { s.update(); s.draw() });
    drawLines();
    drawMouseLines();
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    resize();
    // Re-scale and adjust star positions
    if (stars.length === 0) init();
  });
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY });
  window.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999 });

  init();
  animate();
})();

// ═══ TYPING EFFECT ═══
(function () {
  const el = document.getElementById('typing');
  if (!el) return;
  const phrases = [
    '计算机视觉 / AI 智能体 / 系统工程',
    '单目视觉定位 · 大模型微调 · Agent 开发 · 推荐算法',
  ];
  let pi = 0, ci = 0, deleting = false, delay = 100;

  function tick() {
    const current = phrases[pi];
    if (!deleting) {
      el.textContent = current.substring(0, ci + 1);
      ci++;
      if (ci === current.length) {
        deleting = true;
        delay = 2200;
      } else {
        delay = 75 + Math.random() * 45;
      }
    } else {
      el.textContent = current.substring(0, ci - 1);
      ci--;
      if (ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
        delay = 450;
      } else {
        delay = 25;
      }
    }
    setTimeout(tick, delay);
  }
  setTimeout(tick, 1800);
})();

// ═══ SCROLL REVEAL ═══
(function () {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: .08, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

// ═══ NAV SCROLL ═══
(function () {
  const nav = document.getElementById('nav');
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.classList.toggle('scrolled', window.scrollY > 40);
        ticking = false;
      });
      ticking = true;
    }
  });
})();

// ═══ SMOOTH SCROLL ═══
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const href = a.getAttribute('href');
    if (href === '#') return window.scrollTo({ top: 0, behavior: 'smooth' });
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ═══ SCROLL SPY ═══
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const mobileLinks = document.querySelectorAll('.mobile-menu a');
  function updateActive() {
    let current = '';
    sections.forEach(s => {
      const top = s.offsetTop - 120;
      if (window.scrollY >= top) current = s.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
    mobileLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', () => requestAnimationFrame(updateActive));
  updateActive();
})();

// ═══ MOBILE MENU ═══
(function () {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('mobileMenu');
  if (!toggle || !menu) return;
  const links = menu.querySelectorAll('a');
  function close() {
    toggle.classList.remove('open');
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  toggle.addEventListener('click', () => {
    const open = toggle.classList.toggle('open');
    menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  links.forEach(l => l.addEventListener('click', close));
})();

// ═══ BACK TO TOP ═══
(function () {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > window.innerHeight * .5);
  });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ═══ HEX TOOLTIP ═══
(function () {
  const hexes = document.querySelectorAll('.hex[data-projects]');
  let tooltip = null;

  function createTooltip() {
    const el = document.createElement('div');
    el.className = 'hex-tooltip';
    document.body.appendChild(el);
    return el;
  }

  function positionTooltip(el, hex) {
    const rect = hex.getBoundingClientRect();
    const tw = el.offsetWidth;
    let left = rect.left + rect.width / 2 - tw / 2;
    // Keep tooltip within viewport
    left = Math.max(8, Math.min(left, window.innerWidth - tw - 8));
    el.style.left = left + 'px';
    el.style.top = rect.bottom + 10 + 'px';
  }

  hexes.forEach(hex => {
    hex.addEventListener('mouseenter', () => {
      if (!tooltip) tooltip = createTooltip();
      const projects = hex.dataset.projects;
      if (!projects) return;

      let ttColor = 'var(--gold)';
      let ttColorDim = 'rgba(212,168,67,.2)';
      if (hex.classList.contains('hex--teal')) {
        ttColor = 'var(--teal)';
        ttColorDim = 'rgba(56,196,184,.2)';
      } else if (hex.classList.contains('hex--coral')) {
        ttColor = 'var(--coral)';
        ttColorDim = 'rgba(232,112,90,.2)';
      } else if (hex.classList.contains('hex--gray')) {
        ttColor = '#8b8798';
        ttColorDim = 'rgba(139,135,152,.2)';
      }

      tooltip.style.setProperty('--tt-color', ttColor);
      tooltip.style.setProperty('--tt-color-dim', ttColorDim);

      const htmlContent = projects.split('|').map(p => {
        const parts = p.split('::');
        const title = parts[0] ? parts[0].trim() : '';
        const desc = parts[1] ? parts[1].trim() : '';
        if (desc) {
          return `<div class="tt-project-item">
                    <div class="tt-project-title">${title}</div>
                    <div class="tt-project-desc">${desc}</div>
                  </div>`;
        } else {
          return `<div class="tt-project-item"><div class="tt-project-title">${title}</div></div>`;
        }
      }).join('');

      tooltip.innerHTML = `<div class="tt-label">核心应用与实践</div><div class="tt-projects">${htmlContent}</div>`;
      positionTooltip(tooltip, hex);
      requestAnimationFrame(() => tooltip.classList.add('show'));
    });
    hex.addEventListener('mouseleave', () => {
      if (tooltip) tooltip.classList.remove('show');
    });
  });

  window.addEventListener('scroll', () => {
    if (tooltip) tooltip.classList.remove('show');
  }, { passive: true });
})();

// ═══ STAT COUNTER ANIMATION ═══
(function () {
  const statValues = document.querySelectorAll('.stat-value');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        animateValue(entry.target);
      }
    });
  }, { threshold: .5 });

  function animateValue(el) {
    const text = el.textContent.trim();
    // Try to extract a number (int or float)
    const match = text.match(/^([\d.]+)/);
    if (!match) return;
    const target = parseFloat(match[1]);
    const suffix = text.replace(match[1], '');
    const isFloat = match[1].includes('.');
    const duration = 800;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      el.innerHTML = (isFloat ? current.toFixed(2) : Math.round(current)) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.innerHTML = text; // Restore original HTML
    }
    el.innerHTML = isFloat ? '0.00' : '0';
    requestAnimationFrame(tick);
  }

  statValues.forEach(el => observer.observe(el));
})();

// ═══ PARALLAX HERO ═══
(function () {
  const hero = document.querySelector('.hero');
  const heroAvatar = document.querySelector('.hero-avatar');
  const heroName = document.querySelector('.hero-name');
  if (!hero) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const vh = window.innerHeight;
        if (scrollY < vh) {
          const ratio = scrollY / vh;
          if (heroAvatar) heroAvatar.style.transform = `translateY(${scrollY * .08}px) scale(${1 - ratio * .1})`;
          if (heroName) heroName.style.transform = `translateY(${scrollY * .04}px)`;
          hero.style.opacity = 1 - ratio * .6;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();
