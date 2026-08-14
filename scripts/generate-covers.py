import os, textwrap, html
OUT = "public/projects"
GROUPS = {
    "vision-positioning": {
        "title": "单目视觉定位",
        "subtitle": "Monocular Vision · 10–15 cm",
        "palette": ["#2563eb", "#0284c7", "#dbeafe"],
        "kind": "vision",
    },
    "cixin-singularity": {
        "title": "科幻奇点",
        "subtitle": "Sci-Fi Singularity · Cixin Style",
        "palette": ["#4f46e5", "#38bdf8", "#eef2ff"],
        "kind": "terminal",
    },
    "rl-racing": {
        "title": "3D 赛车 RL",
        "subtitle": "Reinforcement Learning · Radar PPO",
        "palette": ["#0284c7", "#2563eb", "#e0f2fe"],
        "kind": "track",
    },
    "sky-cloud": {
        "title": "SKYCloud",
        "subtitle": "AI Native Cloud Disk · RAG Agent",
        "palette": ["#38bdf8", "#2563eb", "#dbeafe"],
        "kind": "cards",
    },
    "sky-douyin": {
        "title": "SKYDouyin",
        "subtitle": "Multi-modal Recommendation Engine",
        "palette": ["#4f46e5", "#38bdf8", "#e0f2fe"],
        "kind": "feed",
    },
    "sky-oj": {
        "title": "SKYOJ",
        "subtitle": "Online Judge · ACM / OOP / Notebook",
        "palette": ["#1d4ed8", "#0284c7", "#dbeafe"],
        "kind": "code",
    },
}

W, H = 1600, 900  # 16:9 适合 bento；详情页 hero 用 cover

def cover_svg(group_id, meta, filename):
    palette = meta["palette"]
    title = meta["title"]
    subtitle = meta["subtitle"]
    primary, accent, light = palette

    # 杂志风：左上大字 + 右上大字编号 + 底部带状条 + 装饰几何
    numbers = {"vision-positioning": "01", "cixin-singularity": "02", "rl-racing": "03",
               "sky-cloud": "04", "sky-douyin": "05", "sky-oj": "06"}[group_id]

    if meta["kind"] == "vision":
        deco = f'''
        <g opacity="0.95">
          <rect x="780" y="180" width="640" height="440" rx="22" fill="white" stroke="{primary}" stroke-width="3"/>
          <text x="1100" y="285" text-anchor="middle" fill="{primary}" font-family="JetBrains Mono" font-size="22" letter-spacing="6">YOLO · ROI</text>
          <line x1="860" y1="380" x2="980" y2="290" stroke="{accent}" stroke-width="3"/>
          <line x1="1180" y1="290" x2="1280" y2="380" stroke="{accent}" stroke-width="3"/>
          <line x1="860" y1="540" x2="980" y2="450" stroke="{accent}" stroke-width="3"/>
          <line x1="1180" y1="450" x2="1280" y2="540" stroke="{accent}" stroke-width="3"/>
          <rect x="900" y="330" width="400" height="260" fill="none" stroke="{primary}" stroke-width="3"/>
          <text x="1100" y="565" text-anchor="middle" fill="{primary}" font-family="JetBrains Mono" font-size="20" letter-spacing="4">POSE ESTIMATION</text>
          <text x="1100" y="595" text-anchor="middle" fill="{accent}" font-family="JetBrains Mono" font-size="14" letter-spacing="3">RMSE 10-15 cm · 26 FPS</text>
        </g>'''
    elif meta["kind"] == "terminal":
        deco = f'''
        <g opacity="0.95">
          <rect x="800" y="160" width="660" height="500" rx="20" fill="#09152e"/>
          <rect x="800" y="160" width="660" height="42" fill="#1e293b"/>
          <circle cx="824" cy="181" r="6" fill="#ef4444"/>
          <circle cx="844" cy="181" r="6" fill="#f59e0b"/>
          <circle cx="864" cy="181" r="6" fill="#10b981"/>
          <text x="900" y="186" fill="#94a3b8" font-family="JetBrains Mono" font-size="14">qwen3.6-27b · 4bit-qlora</text>
          <text x="830" y="260" fill="#38bdf8" font-family="JetBrains Mono" font-size="18">$ lora-infer --prompt "二向箔降维"</text>
          <text x="830" y="310" fill="#e2e8f0" font-family="Noto Sans SC, sans-serif" font-size="20">【警告：空间拓扑维度衰减机制启动】</text>
          <text x="830" y="350" fill="#cbd5e1" font-family="Noto Sans SC, sans-serif" font-size="18">维度收缩场已降临目标星域...</text>
          <text x="830" y="395" fill="#cbd5e1" font-family="Noto Sans SC, sans-serif" font-size="18">矢量膜展现出绝对平滑的光学反射...</text>
          <text x="830" y="450" fill="#cbd5e1" font-family="Noto Sans SC, sans-serif" font-size="18">三维宏观结构在 0.00004 秒内坍缩</text>
          <text x="830" y="495" fill="#93c5fd" font-family="Noto Sans SC, sans-serif" font-size="18">为无厚度的二维巨幅画卷...</text>
          <text x="830" y="560" fill="#10b981" font-family="JetBrains Mono" font-size="16">▎ inference · RTX 5090 · VRAM 16.8GB/32GB</text>
          <text x="830" y="600" fill="#94a3b8" font-family="JetBrains Mono" font-size="14">LoRA params: 0.039% · Weights: 20MB</text>
        </g>'''
    elif meta["kind"] == "track":
        deco = f'''
        <g opacity="0.95">
          <path d="M820 360 L1100 360 A90 90 0 0 1 1190 450 L1190 530 A60 60 0 0 1 1130 590 L900 590 A50 50 0 0 0 850 640 L850 660" fill="none" stroke="{primary}" stroke-width="14" stroke-linecap="round"/>
          <line x1="820" y1="670" x2="900" y2="670" stroke="white" stroke-width="3" stroke-dasharray="20 20"/>
          <line x1="940" y1="670" x2="1020" y2="670" stroke="white" stroke-width="3" stroke-dasharray="20 20"/>
          <line x1="1060" y1="670" x2="1140" y2="670" stroke="white" stroke-width="3" stroke-dasharray="20 20"/>
          <circle cx="1180" cy="450" r="14" fill="{accent}"/>
          <text x="1180" y="430" text-anchor="middle" fill="{primary}" font-family="JetBrains Mono" font-size="14" font-weight="700">CAR</text>
          <text x="1000" y="270" text-anchor="middle" fill="{primary}" font-family="JetBrains Mono" font-size="18" letter-spacing="3">PPO · SubprocVecEnv</text>
          <text x="1000" y="295" text-anchor="middle" fill="{accent}" font-family="JetBrains Mono" font-size="14">16 envs · 4x speedup</text>
        </g>'''
    elif meta["kind"] == "cards":
        deco = f'''
        <g opacity="0.95">
          <rect x="820" y="180" width="240" height="240" rx="18" fill="{primary}"/>
          <text x="940" y="305" text-anchor="middle" fill="white" font-family="Noto Sans SC" font-size="28" font-weight="900">PDF</text>
          <text x="940" y="345" text-anchor="middle" fill="white" font-family="JetBrains Mono" font-size="14">128.4 MB</text>
          <text x="940" y="395" text-anchor="middle" fill="white" opacity="0.7" font-family="JetBrains Mono" font-size="13">RAG · indexed</text>

          <rect x="1080" y="180" width="240" height="240" rx="18" fill="white" stroke="{primary}" stroke-width="3"/>
          <text x="1200" y="305" text-anchor="middle" fill="{primary}" font-family="Noto Sans SC" font-size="26" font-weight="800">IMG</text>
          <text x="1200" y="345" text-anchor="middle" fill="{primary}" font-family="JetBrains Mono" font-size="14">42 files</text>

          <rect x="1340" y="180" width="240" height="240" rx="18" fill="{accent}"/>
          <text x="1460" y="305" text-anchor="middle" fill="white" font-family="Noto Sans SC" font-size="26" font-weight="800">ZIP</text>
          <text x="1460" y="345" text-anchor="middle" fill="white" font-family="JetBrains Mono" font-size="14">2.3 GB</text>

          <rect x="820" y="450" width="760" height="220" rx="18" fill="white" stroke="{primary}" stroke-width="3"/>
          <text x="860" y="490" fill="{primary}" font-family="JetBrains Mono" font-size="14" font-weight="700">FAST-MCP · AGENT TOOLS (17)</text>
          <g font-family="JetBrains Mono" font-size="13" fill="#475569">
            <text x="860" y="525">▸ list_files · 14ms</text>
            <text x="1080" y="525">▸ upload · 23ms</text>
            <text x="1280" y="525">▸ tag_image · 1.4s</text>
            <text x="1480" y="525">▸ archive · 89ms</text>
            <text x="860" y="555">▸ search · 18ms</text>
            <text x="1080" y="555">▸ summarize · 2.1s</text>
            <text x="1280" y="555">▸ share · 6ms</text>
            <text x="1480" y="555">▸ revoke · 4ms</text>
            <text x="860" y="585">▸ vectorize · 4.2s</text>
            <text x="1080" y="585">▸ audit · 12ms</text>
            <text x="1280" y="585">▸ backup · 5min</text>
            <text x="1480" y="585">▸ restore · 6min</text>
            <text x="860" y="615">▸ +5 more (multi-query RRF rerank)</text>
          </g>
        </g>'''
    elif meta["kind"] == "feed":
        deco = f'''
        <g opacity="0.95">
          <rect x="800" y="160" width="240" height="540" rx="22" fill="white" stroke="{primary}" stroke-width="3"/>
          <rect x="820" y="180" width="200" height="80" rx="10" fill="{light}"/>
          <text x="920" y="225" text-anchor="middle" fill="{primary}" font-family="JetBrains Mono" font-size="14">RECOMMENDED</text>
          <rect x="820" y="270" width="200" height="380" rx="10" fill="{primary}" opacity="0.08"/>
          <rect x="835" y="285" width="170" height="56" rx="8" fill="{primary}" opacity="0.18"/>
          <rect x="835" y="350" width="170" height="56" rx="8" fill="{accent}" opacity="0.22"/>
          <rect x="835" y="415" width="170" height="56" rx="8" fill="{primary}" opacity="0.22"/>
          <rect x="835" y="480" width="170" height="56" rx="8" fill="{accent}" opacity="0.18"/>
          <rect x="835" y="545" width="170" height="80" rx="8" fill="{primary}" opacity="0.12"/>

          <rect x="1060" y="160" width="240" height="260" rx="22" fill="{primary}"/>
          <text x="1180" y="305" text-anchor="middle" fill="white" font-family="JetBrains Mono" font-size="20" font-weight="700">CTR +18%</text>
          <text x="1180" y="340" text-anchor="middle" fill="white" opacity="0.85" font-family="JetBrains Mono" font-size="12">COLD-START</text>

          <rect x="1060" y="440" width="240" height="260" rx="22" fill="white" stroke="{primary}" stroke-width="3"/>
          <text x="1180" y="500" text-anchor="middle" fill="{primary}" font-family="JetBrains Mono" font-size="14" font-weight="700">3-LAYER PROFILE</text>
          <text x="1180" y="540" text-anchor="middle" fill="{primary}" font-family="JetBrains Mono" font-size="13">Real-time · 5min</text>
          <text x="1180" y="570" text-anchor="middle" fill="{primary}" font-family="JetBrains Mono" font-size="13">Short · 24h</text>
          <text x="1180" y="600" text-anchor="middle" fill="{primary}" font-family="JetBrains Mono" font-size="13">Long · tags</text>
          <text x="1180" y="650" text-anchor="middle" fill="{accent}" font-family="JetBrains Mono" font-size="13">Milvus vectors</text>

          <rect x="1320" y="160" width="240" height="540" rx="22" fill="white" stroke="{accent}" stroke-width="3"/>
          <text x="1440" y="220" text-anchor="middle" fill="{accent}" font-family="JetBrains Mono" font-size="14" font-weight="700">P99 LATENCY</text>
          <text x="1440" y="270" text-anchor="middle" fill="{accent}" font-family="Noto Sans SC" font-size="32" font-weight="900">85ms</text>
          <text x="1440" y="310" text-anchor="middle" fill="{primary}" opacity="0.6" font-family="JetBrains Mono" font-size="12">MQ decoupling</text>
          <text x="1440" y="380" text-anchor="middle" fill="{accent}" font-family="JetBrains Mono" font-size="14" font-weight="700">VECTOR RECALL</text>
          <text x="1440" y="430" text-anchor="middle" fill="{accent}" font-family="Noto Sans SC" font-size="32" font-weight="900">2.7×</text>
          <text x="1440" y="470" text-anchor="middle" fill="{primary}" opacity="0.6" font-family="JetBrains Mono" font-size="12">vs random baseline</text>
          <text x="1440" y="540" text-anchor="middle" fill="{accent}" font-family="JetBrains Mono" font-size="14" font-weight="700">DOUBLE-WRITE</text>
          <text x="1440" y="590" text-anchor="middle" fill="{accent}" font-family="Noto Sans SC" font-size="22" font-weight="900">100%</text>
          <text x="1440" y="630" text-anchor="middle" fill="{primary}" opacity="0.6" font-family="JetBrains Mono" font-size="12">consistency</text>
        </g>'''
    elif meta["kind"] == "code":
        deco = f'''
        <g opacity="0.95">
          <rect x="800" y="160" width="760" height="540" rx="22" fill="#0a1633"/>
          <rect x="800" y="160" width="760" height="42" fill="#1e293b"/>
          <circle cx="824" cy="181" r="6" fill="#ef4444"/>
          <circle cx="844" cy="181" r="6" fill="#f59e0b"/>
          <circle cx="864" cy="181" r="6" fill="#10b981"/>
          <text x="900" y="186" fill="#94a3b8" font-family="JetBrains Mono" font-size="14">SKYOJ · judge · submission #128472</text>

          <text x="830" y="260" fill="#94a3b8" font-family="JetBrains Mono" font-size="14">› STATUS</text>
          <text x="950" y="260" fill="#10b981" font-family="JetBrains Mono" font-size="14" font-weight="700">ACCEPTED · 96/100</text>

          <text x="830" y="300" fill="#94a3b8" font-family="JetBrains Mono" font-size="14">› RUNTIME</text>
          <text x="950" y="300" fill="#38bdf8" font-family="JetBrains Mono" font-size="14" font-weight="700">312 ms</text>

          <text x="830" y="340" fill="#94a3b8" font-family="JetBrains Mono" font-size="14">› MEMORY</text>
          <text x="950" y="340" fill="#38bdf8" font-family="JetBrains Mono" font-size="14" font-weight="700">28.4 MB</text>

          <text x="830" y="380" fill="#94a3b8" font-family="JetBrains Mono" font-size="14">› LANGUAGE</text>
          <text x="950" y="380" fill="#38bdf8" font-family="JetBrains Mono" font-size="14" font-weight="700">Python 3.11</text>

          <text x="830" y="430" fill="#cbd5e1" font-family="Noto Sans SC" font-size="14">▎ 32 worker · cgroup + seccomp</text>
          <text x="830" y="460" fill="#cbd5e1" font-family="Noto Sans SC" font-size="14">▎ 4,820 submissions today</text>
          <text x="830" y="490" fill="#cbd5e1" font-family="Noto Sans SC" font-size="14">▎ AI 教学辅助：3 个错点诊断</text>
          <text x="830" y="540" fill="#60a5fa" font-family="JetBrains Mono" font-size="13">$ oj submit acm-week-09/A.cpp</text>
          <text x="830" y="570" fill="#60a5fa" font-family="JetBrains Mono" font-size="13">$ oj notebook submit lab-7.ipynb</text>
          <text x="830" y="600" fill="#60a5fa" font-family="JetBrains Mono" font-size="13">$ oj oop unittest po-2025/InventoryTest.java</text>
          <text x="830" y="650" fill="#10b981" font-family="JetBrains Mono" font-size="13">✓ All checks passed · queue cleared in 4.6s</text>
        </g>'''
    else:
        deco = ""

    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">
<defs>
  <linearGradient id="bg-{group_id}" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="{light}"/>
    <stop offset="55%" stop-color="white"/>
    <stop offset="100%" stop-color="{light}"/>
  </linearGradient>
  <linearGradient id="stripe-{group_id}" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" stop-color="{primary}"/>
    <stop offset="100%" stop-color="{accent}"/>
  </linearGradient>
  <pattern id="dots-{group_id}" width="32" height="32" patternUnits="userSpaceOnUse">
    <circle cx="2" cy="2" r="1.2" fill="{primary}" opacity="0.15"/>
  </pattern>
</defs>
<rect width="{W}" height="{H}" fill="url(#bg-{group_id})"/>
<rect width="{W}" height="{H}" fill="url(#dots-{group_id})"/>

<!-- 顶部品牌带 -->
<rect x="80" y="80" width="220" height="220" rx="40" fill="white" stroke="{primary}" stroke-width="6"/>
<text x="190" y="220" text-anchor="middle" fill="{primary}" font-family="Noto Sans SC, sans-serif" font-size="120" font-weight="900">CMX</text>
<text x="190" y="270" text-anchor="middle" fill="{accent}" font-family="JetBrains Mono" font-size="22" letter-spacing="6">CHEN MINXIANG</text>

<!-- 大标题 -->
<text x="80" y="500" fill="{primary}" font-family="JetBrains Mono" font-size="42" letter-spacing="14" font-weight="800">PROJECT / {numbers}</text>
<text x="80" y="610" fill="#09152e" font-family="Noto Sans SC, sans-serif" font-size="84" font-weight="900">{title}</text>
<text x="80" y="685" fill="#475569" font-family="Noto Sans SC, sans-serif" font-size="32" font-weight="600">{subtitle}</text>

<!-- 装饰带 -->
<rect x="80" y="730" width="700" height="10" rx="5" fill="url(#stripe-{group_id})"/>
<text x="80" y="800" fill="{primary}" font-family="JetBrains Mono" font-size="22" letter-spacing="6" font-weight="700">BUILT WITH</text>
<text x="80" y="850" fill="#475569" font-family="JetBrains Mono" font-size="22">Python · PyTorch · OpenCV · FastAPI · LangGraph</text>

{deco}
</svg>'''
    with open(os.path.join(OUT, group_id, filename), "w", encoding="utf-8") as f:
        f.write(svg)

# 为每个项目生成 cover
for gid, meta in GROUPS.items():
    cover_svg(gid, meta, "cover.svg")

print("covers generated:", sorted(os.listdir(OUT)))
