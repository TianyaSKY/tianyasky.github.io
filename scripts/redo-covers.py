"""6 张项目封面 + 画廊封面页，按编辑风格的杂志封面设计。
比例 1600×900 (16:9)，细节级别高、可经受缩放。
"""
import os, math
OUT = "public/projects"

# 1. 单目视觉定位：海面场景 + 标注
def vision_cover():
    p = "vision-positioning"
    svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">
<defs>
<linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
<stop offset="0%" stop-color="#cfd8e3"/>
<stop offset="60%" stop-color="#e3e1d3"/>
<stop offset="100%" stop-color="#d9d4c0"/>
</linearGradient>
<linearGradient id="sea" x1="0%" y1="0%" x2="0%" y2="100%">
<stop offset="0%" stop-color="#3b566e"/>
<stop offset="40%" stop-color="#26425a"/>
<stop offset="100%" stop-color="#162938"/>
</linearGradient>
<pattern id="halftone" width="6" height="6" patternUnits="userSpaceOnUse">
<circle cx="3" cy="3" r="0.7" fill="#0c111d" opacity="0.1"/>
</pattern>
</defs>
<rect width="1600" height="900" fill="url(#sky)"/>
<rect y="0" width="1600" height="320" fill="url(#halftone)" opacity="0.4"/>
<rect y="320" width="1600" height="20" fill="#e8b478" opacity="0.6"/>
<rect y="340" width="1600" height="560" fill="url(#sea)"/>
<g stroke="#dfe7ee" stroke-width="1.2" fill="none">
<path d="M0 470 Q200 450 400 470 T800 460 T1200 470 T1600 460"/>
<path d="M0 540 Q300 520 600 540 T1200 540 T1600 530"/>
<path d="M0 620 Q400 600 800 620 T1600 600"/>
<path d="M0 700 Q200 680 400 700 T800 690 T1200 710 T1600 700"/>
<path d="M0 790 Q300 770 600 800 T1200 790 T1600 770"/>
</g>
<!-- 太阳 -->
<circle cx="1230" cy="190" r="58" fill="#f3e1c5"/>
<circle cx="1230" cy="190" r="80" fill="#f3e1c5" opacity="0.18"/>
<!-- 云 -->
<ellipse cx="220" cy="160" rx="160" ry="22" fill="#fff" opacity="0.6"/>
<ellipse cx="380" cy="120" rx="120" ry="18" fill="#fff" opacity="0.5"/>
<ellipse cx="900" cy="200" rx="180" ry="16" fill="#fff" opacity="0.4"/>
<!-- 远方船 -->
<path d="M620 410 L660 405 L660 425 L620 425 Z" fill="#1a2638"/>
<rect x="640" y="385" width="6" height="22" fill="#1a2638"/>
<polygon points="640,385 658,395 640,395" fill="#e8b478"/>
<!-- 标杆（主体）-->
<g>
<rect x="350" y="220" width="14" height="300" fill="#0c111d"/>
<rect x="350" y="280" width="20" height="10" fill="#b53a2a"/>
<rect x="350" y="360" width="20" height="10" fill="#b53a2a"/>
<rect x="350" y="440" width="20" height="10" fill="#b53a2a"/>
<polygon points="357,220 364,210 350,210" fill="#b53a2a"/>
</g>
<!-- 第二个标杆 -->
<g>
<rect x="900" y="280" width="12" height="240" fill="#0c111d"/>
<rect x="900" y="340" width="18" height="8" fill="#b53a2a"/>
<rect x="900" y="420" width="18" height="8" fill="#b53a2a"/>
</g>
<!-- 检测框 -->
<g stroke="#e8b478" stroke-width="2.5" fill="none">
<rect x="318" y="206" width="78" height="320"/>
</g>
<g stroke="#e8b478" stroke-width="1.5" fill="none">
<line x1="318" y1="206" x2="396" y2="526"/>
<line x1="396" y1="206" x2="318" y2="526"/>
<circle cx="357" cy="200" r="22"/>
<circle cx="906" cy="270" r="22"/>
</g>
<!-- 角点标注 -->
<g font-family="JetBrains Mono, monospace" font-size="14" fill="#e8b478">
<text x="240" y="195" letter-spacing="2">P1</text>
<text x="430" y="195" letter-spacing="2">P2</text>
<text x="240" y="540" letter-spacing="2">P3</text>
<text x="430" y="540" letter-spacing="2">P4</text>
</g>
<!-- 坐标系轴 -->
<g transform="translate(820,440)" stroke-width="2" fill="none">
<line x1="0" y1="0" x2="120" y2="0" stroke="#b53a2a"/>
<line x1="0" y1="0" x2="0" y2="-90" stroke="#3a7a52"/>
<line x1="0" y1="0" x2="-60" y2="60" stroke="#3a6b9c"/>
<polygon points="120,0 108,-6 108,6" fill="#b53a2a"/>
<polygon points="0,-90 -6,-78 6,-78" fill="#3a7a52"/>
<polygon points="-60,60 -52,52 -64,48" fill="#3a6b9c"/>
<text x="125" y="4" fill="#b53a2a" font-family="JetBrains Mono, monospace" font-size="16">X</text>
<text x="-4" y="-95" fill="#3a7a52" font-family="JetBrains Mono, monospace" font-size="16">Y</text>
<text x="-72" y="58" fill="#3a6b9c" font-family="JetBrains Mono, monospace" font-size="16">Z</text>
</g>
<!-- Telemetry -->
<g font-family="JetBrains Mono, monospace" fill="#f3e1c5">
<rect x="1280" y="600" width="240" height="160" fill="#0c111d" stroke="#e8b478" stroke-width="1"/>
<text x="1300" y="630" font-size="11" letter-spacing="3" fill="#e8b478">POSE ESTIMATION</text>
<text x="1300" y="660" font-size="22" fill="#f3e1c5" font-weight="700">x = 12.7 m</text>
<text x="1300" y="685" font-size="22" fill="#f3e1c5" font-weight="700">y = 8.4 m</text>
<text x="1300" y="710" font-size="14" fill="#dfe7ee">yaw 2.1° · roll 0.4°</text>
<text x="1300" y="740" font-size="11" letter-spacing="2" fill="#b53a2a">RMSE 11.2 cm · 26 FPS</text>
</g>
<!-- Bottom credit -->
<g font-family="JetBrains Mono, monospace" font-size="11" letter-spacing="3" fill="#f3e1c5">
<text x="80" y="50">VISION · ISSUE 01</text>
<text x="80" y="75" fill="#e8b478">AUG · 2026</text>
<line x1="80" y1="90" x2="280" y2="90" stroke="#e8b478" stroke-width="1"/>
<text x="80" y="120">YOLO11 — Harris — LM/TRR</text>
</g>
</svg>'''
    open(os.path.join(OUT, p, "cover.svg"), "w").write(svg)


# 2. 科幻奇点：星空黑底 + 巨字术语
def cixin_cover():
    p = "cixin-singularity"
    svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">
<defs>
<radialGradient id="bg" cx="50%" cy="55%" r="80%">
<stop offset="0%" stop-color="#2a1a40"/>
<stop offset="60%" stop-color="#0e0820"/>
<stop offset="100%" stop-color="#000"/>
</radialGradient>
</defs>
<rect width="1600" height="900" fill="url(#bg)"/>
<!-- stars -->
<g fill="#fff">
'''
    rnd_seed = 31337
    import random
    random.seed(rnd_seed)
    for _ in range(220):
        x = random.randint(0, 1600)
        y = random.randint(0, 900)
        r = random.choice([0.5, 0.5, 0.5, 0.8, 1.2])
        op = random.uniform(0.3, 0.9)
        svg += f'<circle cx="{x}" cy="{y}" r="{r}" opacity="{op}"/>\n'
    svg += '</g>\n'
    svg += '''
<!-- 一颗红色恒星 -->
<circle cx="1280" cy="220" r="120" fill="#b53a2a" opacity="0.15"/>
<circle cx="1280" cy="220" r="60" fill="#b53a2a" opacity="0.5"/>
<circle cx="1280" cy="220" r="20" fill="#f3e1c5"/>
<!-- 太阳系线 -->
<ellipse cx="800" cy="500" rx="500" ry="140" fill="none" stroke="#f3e1c5" stroke-width="0.6" opacity="0.25" transform="rotate(-15 800 500)"/>
<ellipse cx="800" cy="500" rx="320" ry="90" fill="none" stroke="#f3e1c5" stroke-width="0.5" opacity="0.18" transform="rotate(-15 800 500)"/>
<!-- 巨字 -->
<g font-family="Noto Serif SC, serif" text-anchor="middle">
<text x="800" y="430" font-size="160" font-weight="900" fill="#f3e1c5" letter-spacing="-4">二 向 箔</text>
<text x="800" y="470" font-size="22" font-style="italic" fill="#b53a2a" letter-spacing="10">TWO-DIMENSIONAL FOIL</text>
</g>
<!-- 副标 -->
<g font-family="Noto Serif SC, serif" text-anchor="middle" fill="#dfe7ee">
<text x="800" y="540" font-size="26" font-style="italic">「维度收缩场已降临目标星域。」</text>
<text x="800" y="585" font-size="18" letter-spacing="2" fill="#94a0b0">— 刘慈欣体 · Qwen2.5-7B · LoRA 微调</text>
</g>
<!-- 上眉头部 -->
<g font-family="JetBrains Mono, monospace" font-size="11" letter-spacing="4" fill="#94a0b0">
<text x="80" y="50">SINGULARITY · ISSUE 02</text>
<line x1="80" y1="65" x2="280" y2="65" stroke="#b53a2a" stroke-width="1"/>
<text x="80" y="92">SCI-FI · LANGUAGE MODEL FINE-TUNING</text>
</g>
<!-- 右下小章 -->
<g font-family="JetBrains Mono, monospace" font-size="11" letter-spacing="3" fill="#94a0b0">
<rect x="1320" y="780" width="200" height="60" fill="none" stroke="#b53a2a" stroke-width="1"/>
<text x="1335" y="805" fill="#f3e1c5">trained on</text>
<text x="1335" y="825" fill="#b53a2a">120 万字 · 49MB</text>
</g>
<!-- 左下版次 -->
<g font-family="JetBrains Mono, monospace" font-size="10" letter-spacing="3" fill="#94a0b0">
<text x="80" y="820">VOL. 01 — 2026.08</text>
<text x="80" y="840">CHEN MINXIANG · 个人实验</text>
</g>
</svg>'''
    open(os.path.join(OUT, p, "cover.svg"), "w").write(svg)


# 3. 3D 赛车：俯视赛道 + 雷达场
def racing_cover():
    p = "rl-racing"
    svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">
<defs>
<linearGradient id="grass" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" stop-color="#3a5a3a"/>
<stop offset="100%" stop-color="#1f3a1f"/>
</linearGradient>
</defs>
<rect width="1600" height="900" fill="url(#grass)"/>
<rect x="40" y="40" width="1520" height="820" fill="none" stroke="#f3e1c5" stroke-width="0.6" opacity="0.18"/>
<!-- 赛道 -->
<path d="M200 720 L440 720 A100 100 0 0 0 540 620 L540 360 A140 140 0 0 1 680 220 L1100 220 A120 120 0 0 1 1220 340 L1220 580 A60 60 0 0 1 1160 640 L920 640" fill="none" stroke="#162938" stroke-width="96" stroke-linecap="round"/>
<path d="M200 720 L440 720 A100 100 0 0 0 540 620 L540 360 A140 140 0 0 1 680 220 L1100 220 A120 120 0 0 1 1220 340 L1220 580 A60 60 0 0 1 1160 640 L920 640" fill="none" stroke="#f3e1c5" stroke-width="2" stroke-linecap="round" stroke-dasharray="22 22"/>
<!-- 起终点 -->
<g transform="translate(200,720)">
<rect x="-10" y="-30" width="20" height="60" fill="#162938" stroke="#f3e1c5" stroke-width="1"/>
<g fill="#f3e1c5">
<rect x="-8" y="-26" width="6" height="12"/>
<rect x="2" y="-26" width="6" height="12"/>
<rect x="-8" y="-10" width="6" height="12"/>
<rect x="2" y="-10" width="6" height="12"/>
<rect x="-8" y="6" width="6" height="12"/>
<rect x="2" y="6" width="6" height="12"/>
</g>
</g>
<!-- 赛车 -->
<g transform="translate(1000,320)">
<rect x="-30" y="-15" width="60" height="30" fill="#b53a2a" rx="4"/>
<rect x="-22" y="-22" width="44" height="14" fill="#f3e1c5" rx="2"/>
<circle cx="-18" cy="14" r="8" fill="#0c111d"/>
<circle cx="18" cy="14" r="8" fill="#0c111d"/>
<!-- 雷达射线 -->
<g stroke="#e8b478" stroke-width="1" opacity="0.7">
<line x1="0" y1="0" x2="0" y2="-160"/>
<line x1="0" y1="0" x2="0" y2="160"/>
<line x1="0" y1="0" x2="-160" y2="0"/>
<line x1="0" y1="0" x2="160" y2="0"/>
<line x1="0" y1="0" x2="120" y2="-120"/>
<line x1="0" y1="0" x2="-120" y2="120"/>
<line x1="0" y1="0" x2="120" y2="120"/>
<line x1="0" y1="0" x2="-120" y2="-120"/>
</g>
<g fill="#e8b478">
<circle cx="0" cy="-150" r="3"/>
<circle cx="0" cy="120" r="3"/>
<circle cx="-80" cy="0" r="3"/>
<circle cx="140" cy="0" r="3"/>
</g>
<!-- 速度向量 -->
<path d="M0 0 L70 30" stroke="#3a7a52" stroke-width="3" fill="none" marker-end="url(#arrowhead)"/>
</g>
<defs>
<marker id="arrowhead" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
<path d="M0 0 L10 5 L0 10 z" fill="#3a7a52"/>
</marker>
</defs>
<!-- HUD -->
<g font-family="JetBrains Mono, monospace" fill="#f3e1c5">
<rect x="1280" y="80" width="240" height="160" fill="#0c111d" stroke="#e8b478" stroke-width="1" opacity="0.92"/>
<text x="1300" y="110" font-size="11" letter-spacing="3" fill="#e8b478">EP REWARD</text>
<text x="1300" y="155" font-size="44" font-weight="700">+268</text>
<line x1="1300" y1="170" x2="1500" y2="170" stroke="#3a7a52" stroke-width="2"/>
<text x="1300" y="195" font-size="11" letter-spacing="3" fill="#e8b478">LAP TIME</text>
<text x="1300" y="222" font-size="22" fill="#f3e1c5">42.6 s</text>
</g>
<!-- Bottom credit -->
<g font-family="JetBrains Mono, monospace" font-size="11" letter-spacing="3" fill="#f3e1c5" opacity="0.7">
<text x="80" y="50">RACING · ISSUE 03 · REINFORCEMENT LEARNING</text>
<line x1="80" y1="65" x2="280" y2="65" stroke="#e8b478" stroke-width="1"/>
<text x="80" y="92">PPO · SubprocVecEnv · 16 路并行</text>
</g>
</svg>'''
    open(os.path.join(OUT, p, "cover.svg"), "w").write(svg)


# 4. SKYCloud：浏览器+UI mockup
def cloud_cover():
    p = "sky-cloud"
    svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">
<defs>
<linearGradient id="pagebg" x1="0%" y1="0%" x2="0%" y2="100%">
<stop offset="0%" stop-color="#f5f1ea"/>
<stop offset="100%" stop-color="#e7e0d0"/>
</linearGradient>
</defs>
<rect width="1600" height="900" fill="url(#pagebg)"/>
<!-- 笔记本外框 -->
<g transform="translate(120,80)">
<rect width="1080" height="700" rx="14" fill="#0c111d"/>
<rect x="10" y="10" width="1060" height="660" rx="8" fill="#fff"/>
<!-- 浏览器顶部条 -->
<rect x="10" y="10" width="1060" height="34" rx="8" fill="#f0ebe0"/>
<circle cx="32" cy="27" r="6" fill="#b53a2a"/>
<circle cx="52" cy="27" r="6" fill="#e8b478"/>
<circle cx="72" cy="27" r="6" fill="#94a0b0"/>
<rect x="100" y="18" width="500" height="18" rx="9" fill="#fff" stroke="#d9d4c0"/>
<text x="120" y="31" font-family="JetBrains Mono, monospace" font-size="11" fill="#5e6a7a">app.skycloud.dev/files</text>
<!-- 侧边栏 -->
<rect x="10" y="44" width="200" height="626" fill="#f5f1ea" stroke="#d9d4c0"/>
<text x="40" y="80" font-family="Noto Serif SC, serif" font-size="22" font-weight="700" fill="#0c111d">SKYCloud</text>
<text x="40" y="105" font-family="JetBrains Mono, monospace" font-size="10" letter-spacing="2" fill="#94a0b0">— 工作台</text>
<g font-family="Noto Sans SC, sans-serif" font-size="13" fill="#0c111d">
<rect x="30" y="140" width="160" height="32" rx="4" fill="#fff" stroke="#b53a2a"/>
<text x="46" y="161" fill="#b53a2a" font-weight="600">▢ 全部文件</text>
<text x="46" y="195">▢ AI 助手</text>
<text x="46" y="225">▢ 团队共享</text>
<text x="46" y="255">▢ 回收站</text>
</g>
<text x="30" y="320" font-family="JetBrains Mono, monospace" font-size="10" letter-spacing="3" fill="#94a0b0">用量</text>
<text x="30" y="345" font-family="Noto Serif SC, serif" font-size="22" font-weight="700" fill="#0c111d">128 / 500 GB</text>
<rect x="30" y="360" width="160" height="6" fill="#d9d4c0"/>
<rect x="30" y="360" width="42" height="6" fill="#b53a2a"/>
<!-- 主体内容 -->
<rect x="220" y="60" width="820" height="80" rx="6" fill="#f5f1ea"/>
<text x="240" y="92" font-family="Noto Serif SC, serif" font-size="28" font-weight="700" fill="#0c111d">Q3 报销</text>
<text x="240" y="115" font-family="JetBrains Mono, monospace" font-size="11" letter-spacing="2" fill="#94a0b0">5 个文件 · 7.2 GB · 最近编辑 2 小时前</text>
<text x="990" y="100" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="12" fill="#b53a2a">+ 上传</text>
<!-- 文件行 -->
<g font-family="Noto Sans SC, sans-serif" font-size="13" fill="#0c111d">
<g transform="translate(220,170)">
<rect width="820" height="68" rx="6" fill="#fff" stroke="#d9d4c0"/>
<rect x="20" y="14" width="40" height="40" fill="#f5f1ea" stroke="#b53a2a"/>
<text x="40" y="40" text-anchor="middle" font-family="Noto Serif SC, serif" font-size="16" font-weight="700" fill="#b53a2a">PDF</text>
<text x="80" y="34" font-weight="600">invoice_Q3_07.pdf</text>
<text x="80" y="54" font-family="JetBrains Mono, monospace" font-size="10" fill="#94a0b0" letter-spacing="1">1.2 MB · 8 页 · RAG 已索引</text>
<text x="800" y="42" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="11" fill="#5e6a7a">2 小时前</text>
</g>
<g transform="translate(220,250)">
<rect width="820" height="68" rx="6" fill="#fff" stroke="#d9d4c0"/>
<rect x="20" y="14" width="40" height="40" fill="#f5f1ea" stroke="#3a7a52"/>
<text x="40" y="40" text-anchor="middle" font-family="Noto Serif SC, serif" font-size="14" font-weight="700" fill="#3a7a52">DOC</text>
<text x="80" y="34" font-weight="600">meeting_minutes_08.docx</text>
<text x="80" y="54" font-family="JetBrains Mono, monospace" font-size="10" fill="#94a0b0" letter-spacing="1">320 KB · 6 页</text>
<text x="800" y="42" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="11" fill="#5e6a7a">昨天</text>
</g>
<g transform="translate(220,330)">
<rect width="820" height="68" rx="6" fill="#fff" stroke="#d9d4c0"/>
<rect x="20" y="14" width="40" height="40" fill="#f5f1ea" stroke="#c2822a"/>
<text x="40" y="40" text-anchor="middle" font-family="Noto Serif SC, serif" font-size="14" font-weight="700" fill="#c2822a">XLS</text>
<text x="80" y="34" font-weight="600">budget_q3.xlsx</text>
<text x="80" y="54" font-family="JetBrains Mono, monospace" font-size="10" fill="#94a0b0" letter-spacing="1">280 KB</text>
<text x="800" y="42" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="11" fill="#5e6a7a">3 天前</text>
</g>
</g>
<!-- AI Chat 浮窗 -->
<g transform="translate(820,440)">
<rect width="220" height="220" rx="6" fill="#0c111d"/>
<circle cx="20" cy="20" r="4" fill="#10b981"/>
<text x="32" y="24" font-family="JetBrains Mono, monospace" font-size="10" fill="#dfe7ee" letter-spacing="2">SKYCLOUD · AI</text>
<rect x="10" y="40" width="200" height="34" rx="6" fill="#1e293b"/>
<text x="18" y="62" font-family="Noto Sans SC, sans-serif" font-size="10" fill="#dfe7ee">把 Q3 报销里超过 1000 元的发票汇总</text>
<rect x="10" y="84" width="200" height="62" rx="6" fill="#3a7a52" opacity="0.22"/>
<text x="18" y="102" font-family="Noto Sans SC, sans-serif" font-size="10" fill="#dfe7ee">扫描 5 个文件，匹配 2 条</text>
<text x="18" y="118" font-family="JetBrains Mono, monospace" font-size="10" fill="#e8b478">¥3,200 + ¥12,500</text>
<text x="18" y="138" font-family="Noto Sans SC, sans-serif" font-size="10" fill="#dfe7ee">已生成汇总表</text>
<text x="18" y="170" font-family="JetBrains Mono, monospace" font-size="9" fill="#94a0b0">4.0s · 9 tool calls</text>
</g>
</g>
<!-- 右侧 metadata -->
<g transform="translate(1240,140)" font-family="Noto Serif SC, serif" fill="#0c111d">
<text x="0" y="0" font-family="JetBrains Mono, monospace" font-size="11" letter-spacing="4" fill="#94a0b0">SKYCLOUD · ISSUE 04</text>
<line x1="0" y1="14" x2="80" y2="14" stroke="#b53a2a" stroke-width="1"/>
<text x="0" y="60" font-family="Noto Serif SC, serif" font-size="42" font-weight="400" fill="#0c111d">云盘里的</text>
<text x="0" y="115" font-family="Noto Serif SC, serif" font-size="42" font-style="italic" fill="#b53a2a">工作流。</text>
<text x="0" y="190" font-family="Noto Serif SC, serif" font-size="16" font-style="italic" fill="#5e6a7a">一个 AI 原生云盘</text>
<text x="0" y="215" font-family="Noto Serif SC, serif" font-size="16" font-style="italic" fill="#5e6a7a">FastAPI + LangGraph</text>
<text x="0" y="240" font-family="Noto Serif SC, serif" font-size="16" font-style="italic" fill="#5e6a7a">+ FastMCP 17 tools</text>
</g>
<!-- Bottom strip -->
<g transform="translate(120,820)" font-family="JetBrains Mono, monospace" font-size="11" letter-spacing="3" fill="#5e6a7a">
<line x1="0" y1="-20" x2="1080" y2="-20" stroke="#0c111d"/>
<text x="0" y="0">STACK · FastAPI · pgvector · Redis · LangGraph · FastMCP · Docker</text>
</g>
</svg>'''
    open(os.path.join(OUT, p, "cover.svg"), "w").write(svg)


# 5. SKYDouyin：手机端+推荐流
def douyin_cover():
    p = "sky-douyin"
    svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">
<defs>
<linearGradient id="bgd" x1="0%" y1="0%" x2="0%" y2="100%">
<stop offset="0%" stop-color="#f5f1ea"/>
<stop offset="100%" stop-color="#eae4d6"/>
</linearGradient>
</defs>
<rect width="1600" height="900" fill="url(#bgd)"/>
<!-- 左侧论文式背景说明 -->
<g font-family="Noto Serif SC, serif" fill="#0c111d">
<text x="80" y="80" font-family="JetBrains Mono, monospace" font-size="11" letter-spacing="4" fill="#94a0b0">DOYUIN · ISSUE 05 · RECOMMEND</text>
<line x1="80" y1="98" x2="280" y2="98" stroke="#b53a2a" stroke-width="1"/>
<text x="80" y="200" font-size="84" font-weight="400" letter-spacing="-2">被看见的</text>
<text x="80" y="290" font-size="84" font-style="italic" fill="#b53a2a" letter-spacing="-2">那一秒。</text>
<text x="80" y="360" font-size="20" font-style="italic" fill="#5e6a7a" font-family="Noto Serif SC, serif">一个短视频推荐引擎的</text>
<text x="80" y="392" font-size="20" font-style="italic" fill="#5e6a7a" font-family="Noto Serif SC, serif">多模态召回与三层画像实验记。</text>
</g>
<!-- 数据数字 -->
<g transform="translate(80,500)" font-family="Noto Serif SC, serif" fill="#0c111d">
<line x1="0" y1="-20" x2="540" y2="-20" stroke="#0c111d"/>
<text x="0" y="20" font-family="JetBrains Mono, monospace" font-size="11" letter-spacing="3" fill="#94a0b0">FEATURED</text>
<text x="0" y="80" font-family="DM Serif Display, serif" font-size="80" font-weight="400">85<tspan font-size="32" fill="#94a0b0">ms</tspan></text>
<text x="180" y="80" font-family="DM Serif Display, serif" font-size="80" font-weight="400" fill="#b53a2a">2.7×</text>
<text x="0" y="120" font-family="Noto Serif SC, serif" font-size="14" font-style="italic" fill="#5e6a7a">P99 推荐延迟</text>
<text x="180" y="120" font-family="Noto Serif SC, serif" font-size="14" font-style="italic" fill="#5e6a7a">冷启动 CTR 提升</text>
<text x="0" y="170" font-family="Noto Serif SC, serif" font-size="14" font-style="italic" fill="#5e6a7a">MySQL · Redis · RabbitMQ</text>
<text x="0" y="195" font-family="Noto Serif SC, serif" font-size="14" font-style="italic" fill="#5e6a7a">Milvus 向量库 · FastAPI</text>
<line x1="0" y1="220" x2="540" y2="220" stroke="#0c111d"/>
</g>
<!-- 手机 -->
<g transform="translate(800,80)">
<rect width="280" height="720" rx="36" fill="#0c111d"/>
<rect x="12" y="12" width="256" height="696" rx="28" fill="#fff"/>
<rect x="120" y="14" width="40" height="6" rx="3" fill="#0c111d"/>
<!-- Status -->
<text x="36" y="46" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">9:42</text>
<g transform="translate(232,40)">
<rect x="-30" y="-6" width="20" height="10" rx="2" fill="none" stroke="#0c111d" stroke-width="1"/>
<rect x="-9" y="-4" width="2" height="6" fill="#0c111d"/>
</g>
<!-- Tabs -->
<g transform="translate(20,70)" font-family="Noto Sans SC, sans-serif" font-size="12">
<text x="0" y="14" font-weight="700" fill="#0c111d">推荐</text>
<text x="60" y="14" fill="#94a0b0">同城</text>
<text x="120" y="14" fill="#94a0b0">关注</text>
</g>
<!-- video tile 1 -->
<g transform="translate(20,100)">
<rect width="240" height="320" fill="#0c111d"/>
<rect width="240" height="280" fill="#26425a" opacity="0.4"/>
<!-- video content placeholder -->
<rect x="40" y="80" width="160" height="80" fill="#94a0b0" opacity="0.3"/>
<text x="120" y="125" text-anchor="middle" font-family="Noto Serif SC, serif" font-size="14" fill="#dfe7ee" font-style="italic">视频缩略图</text>
<!-- overlay -->
<text x="20" y="305" font-family="Noto Sans SC, sans-serif" font-size="13" fill="#fff" font-weight="700">夜色海面上的渔火</text>
<text x="20" y="320" font-family="JetBrains Mono, monospace" font-size="9" fill="#94a0b0" letter-spacing="1">@海上看日出 · 32.4k</text>
</g>
<!-- video tile 2 -->
<g transform="translate(20,440)">
<rect width="240" height="240" fill="#1f3a1f"/>
<rect width="240" height="200" fill="#3a5a3a" opacity="0.3"/>
<text x="120" y="105" text-anchor="middle" font-family="Noto Serif SC, serif" font-size="13" fill="#dfe7ee" font-style="italic">露营 vlog #12</text>
<text x="20" y="225" font-family="Noto Sans SC, sans-serif" font-size="13" fill="#fff" font-weight="700">周末北纬 39° 露营</text>
</g>
<!-- bottom tab -->
<g transform="translate(20,690)" font-family="Noto Sans SC, sans-serif" font-size="11" fill="#0c111d">
<line x1="0" y1="-2" x2="240" y2="-2" stroke="#d9d4c0"/>
<text x="0" y="20">首页</text>
<text x="62" y="20">朋友</text>
<text x="124" y="20">+</text>
<text x="170" y="20">消息</text>
<text x="216" y="20">我</text>
</g>
</g>
<!-- 右侧 recommendation log -->
<g transform="translate(1180,80)" font-family="JetBrains Mono, monospace" fill="#0c111d">
<rect x="0" y="0" width="340" height="720" fill="#fff" stroke="#0c111d"/>
<text x="20" y="40" font-size="12" letter-spacing="3" fill="#b53a2a">RECALL LOG</text>
<line x1="20" y1="56" x2="320" y2="56" stroke="#0c111d"/>
<g font-size="11" fill="#5e6a7a">
<text x="20" y="84">user_id · u_204812</text>
<text x="20" y="106">query  · 山水 海面 露营</text>
<text x="20" y="128">tier   · cold-start</text>
</g>
<g font-family="Noto Sans SC, sans-serif" font-size="13" fill="#0c111d">
<text x="20" y="170" font-weight="700">召回 1000 → 融合 50 → 排前 10</text>
</g>
<g font-family="JetBrains Mono, monospace" font-size="11" fill="#3a7a52">
<text x="20" y="200">[vec]   980.2 ms · 967</text>
<text x="20" y="220">[hot]    14.3 ms · 50</text>
<text x="20" y="240">[rrf]     4.1 ms · 50</text>
<text x="20" y="260">[rerank] 89.7 ms · 10</text>
</g>
<line x1="20" y1="280" x2="320" y2="280" stroke="#d9d4c0"/>
<g font-family="Noto Serif SC, serif" font-size="13" fill="#0c111d">
<text x="20" y="310" font-weight="700" font-style="italic">曝光 #1</text>
<text x="20" y="332" font-size="11" fill="#94a0b0">夜色海面上的渔火</text>
<text x="20" y="362" font-weight="700" font-style="italic">曝光 #2</text>
<text x="20" y="384" font-size="11" fill="#94a0b0">周末北纬 39° 露营</text>
<text x="20" y="414" font-weight="700" font-style="italic">曝光 #3</text>
<text x="20" y="436" font-size="11" fill="#94a0b0">海岛 7 日 — 摄影师日记</text>
<text x="20" y="466" font-weight="700" font-style="italic">曝光 #4</text>
<text x="20" y="488" font-size="11" fill="#94a0b0">灯塔 · 凌晨 04:18</text>
<text x="20" y="518" font-weight="700" font-style="italic">曝光 #5</text>
<text x="20" y="540" font-size="11" fill="#94a0b0">这种天气适合出海</text>
</g>
<line x1="20" y1="580" x2="320" y2="580" stroke="#d9d4c0"/>
<g font-family="JetBrains Mono, monospace" font-size="11" fill="#94a0b0">
<text x="20" y="610">total · 1.08s · 12 steps</text>
<text x="20" y="640" fill="#b53a2a">p99 · 85ms</text>
</g>
</g>
</svg>'''
    open(os.path.join(OUT, p, "cover.svg"), "w").write(svg)


# 6. SKYOJ：代码终端 + 排行榜
def oj_cover():
    p = "sky-oj"
    svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">
<defs>
<linearGradient id="bg-oj" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" stop-color="#f5f1ea"/>
<stop offset="100%" stop-color="#ebe5d8"/>
</linearGradient>
</defs>
<rect width="1600" height="900" fill="url(#bg-oj)"/>
<!-- 左大字 -->
<g font-family="Noto Serif SC, serif" fill="#0c111d">
<text x="80" y="80" font-family="JetBrains Mono, monospace" font-size="11" letter-spacing="4" fill="#94a0b0">SKYOJ · ISSUE 06 · JUDGE</text>
<line x1="80" y1="98" x2="280" y2="98" stroke="#b53a2a" stroke-width="1"/>
<text x="80" y="240" font-size="120" font-weight="400" letter-spacing="-3">判定</text>
<text x="80" y="360" font-size="120" font-style="italic" fill="#b53a2a" letter-spacing="-3">through.</text>
<text x="80" y="440" font-family="Noto Serif SC, serif" font-size="20" font-style="italic" fill="#5e6a7a">一个自部署的在线评测平台，</text>
<text x="80" y="472" font-family="Noto Serif SC, serif" font-size="20" font-style="italic" fill="#5e6a7a">覆盖 ACM / OOP / Notebook 评测模式。</text>
</g>
<!-- data -->
<g transform="translate(80,550)" font-family="Noto Serif SC, serif" fill="#0c111d">
<text x="0" y="0" font-family="JetBrains Mono, monospace" font-size="11" letter-spacing="3" fill="#94a0b0">TODAY</text>
<line x1="0" y1="14" x2="180" y2="14" stroke="#0c111d"/>
<text x="0" y="60" font-family="DM Serif Display, serif" font-size="48">4 820</text>
<text x="160" y="60" font-family="DM Serif Display, serif" font-size="48" fill="#b53a2a">4.6s</text>
<text x="0" y="92" font-family="Noto Serif SC, serif" font-size="13" font-style="italic" fill="#5e6a7a">submissions</text>
<text x="160" y="92" font-family="Noto Serif SC, serif" font-size="13" font-style="italic" fill="#5e6a7a">avg judge</text>
</g>
<!-- 终端 -->
<g transform="translate(620,100)">
<rect width="900" height="700" rx="12" fill="#0c111d"/>
<rect width="900" height="40" fill="#1e293b"/>
<circle cx="22" cy="20" r="6" fill="#b53a2a"/>
<circle cx="44" cy="20" r="6" fill="#e8b478"/>
<circle cx="66" cy="20" r="6" fill="#3a7a52"/>
<text x="100" y="25" font-family="JetBrains Mono, monospace" font-size="12" fill="#94a0b0">SKYOJ — judge: ACM / OOP / Notebook</text>
<!-- main list -->
<g transform="translate(24,72)" font-family="JetBrains Mono, monospace" font-size="13" fill="#dfe7ee">
<text x="0" y="0" fill="#94a0b0">$ oj logs -f --queue</text>
<text x="0" y="36" fill="#3a7a52">▎ 12 workers idle    4 jobs pending    last ping 0.4s</text>
<text x="0" y="68" fill="#94a0b0">▎ judge_01 · AC · submission #128472  · 312 ms · 28 MB</text>
<text x="0" y="92" fill="#94a0b0">▎ judge_02 · WA · submission #128473  · 120 ms</text>
<text x="0" y="116" fill="#94a0b0">▎ judge_03 · AC · submission #128474  · lab-7.ipynb · 8.2 s</text>
<text x="0" y="140" fill="#94a0b0">▎ judge_04 · AC · submission #128475  · 960 ms</text>
<text x="0" y="164" fill="#e8b478">▎ judge_05 · TLE · submission #128476  · 2000 ms</text>
<text x="0" y="188" fill="#94a0b0">▎ judge_06 · AC · submission #128477  · 240 ms</text>
<text x="0" y="212" fill="#b53a2a">▎ judge_07 · RE · submission #128478  · 110 ms</text>
<text x="0" y="236" fill="#94a0b0">▎ judge_08 · AC · submission #128479  · 390 ms</text>
<text x="0" y="260" fill="#94a0b0">▎ judge_09 · AC · submission #128480  · 210 ms</text>
<text x="0" y="284" fill="#94a0b0">▎ judge_10 · AC · submission #128481  · sort_nlogn.cpp · 420 ms</text>
</g>
<line x1="24" y1="380" x2="876" y2="380" stroke="#1e293b"/>
<g transform="translate(24,400)" font-family="JetBrains Mono, monospace" font-size="13" fill="#dfe7ee">
<text x="0" y="0" fill="#94a0b0">▎ sandbox · cgroup v2 · seccomp profile · 32 worker · 0 escape</text>
<text x="0" y="24" fill="#94a0b0">▎ AI teach · Qwen-7B SFT · 3 错点诊断</text>
</g>
<g transform="translate(24,460)" font-family="JetBrains Mono, monospace" font-size="13" fill="#3a7a52">
<text x="0" y="0">$ oj submit acm-week-09/A.cpp</text>
<text x="0" y="22" fill="#94a0b0">→ AC · 240 ms · 16 MB · ranked #2</text>
<text x="0" y="68">$ oj notebook submit lab-7.ipynb</text>
<text x="0" y="90" fill="#94a0b0">→ AC · nbgrader · 8.2 s</text>
<text x="0" y="136">$ oj oop unittest po-2025/InventoryTest.java</text>
<text x="0" y="158" fill="#94a0b0">→ AC · 960 ms · 42 MB</text>
</g>
</g>
<!-- 底部标注 -->
<g transform="translate(80,810)" font-family="JetBrains Mono, monospace" font-size="11" letter-spacing="3" fill="#5e6a7a">
<line x1="0" y1="-20" x2="1440" y2="-20" stroke="#0c111d"/>
<text x="0" y="0">STACK · Vue3 · Flask · Docker · RabbitMQ · PostgreSQL</text>
<text x="1440" y="0" text-anchor="end" fill="#b53a2a">— 5 次红队测试 · 0 越权</text>
</g>
</svg>'''
    open(os.path.join(OUT, p, "cover.svg"), "w").write(svg)


vision_cover()
cixin_cover()
racing_cover()
cloud_cover()
douyin_cover()
oj_cover()
print("covers regenerated.")
for p in sorted(os.listdir(OUT)):
    print(p, sorted(os.listdir(os.path.join(OUT, p))))
