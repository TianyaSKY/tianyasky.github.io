"""生成 OG 社交分享预览图 (1200x630)"""
import os
OUT = "public"
W, H = 1200, 630

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">
<defs>
<linearGradient id="og-bg" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" stop-color="#dbeafe"/>
<stop offset="55%" stop-color="#ffffff"/>
<stop offset="100%" stop-color="#e0f2fe"/>
</linearGradient>
<linearGradient id="og-stripe" x1="0%" y1="0%" x2="100%" y2="0%">
<stop offset="0%" stop-color="#1d4ed8"/>
<stop offset="100%" stop-color="#0284c7"/>
</linearGradient>
<pattern id="og-dots" width="32" height="32" patternUnits="userSpaceOnUse">
<circle cx="2" cy="2" r="1.2" fill="#2563eb" opacity="0.18"/>
</pattern>
</defs>
<rect width="{W}" height="{H}" fill="url(#og-bg)"/>
<rect width="{W}" height="{H}" fill="url(#og-dots)"/>

<rect x="80" y="110" width="170" height="170" rx="32" fill="white" stroke="#2563eb" stroke-width="5"/>
<text x="165" y="220" text-anchor="middle" fill="#2563eb" font-family="Noto Sans SC" font-size="92" font-weight="900">CMX</text>

<text x="290" y="180" fill="#0284c7" font-family="JetBrains Mono" font-size="22" letter-spacing="8" font-weight="800">CHEN MINXIANG</text>
<text x="290" y="270" fill="#09152e" font-family="Noto Sans SC" font-size="68" font-weight="900">陈敏祥</text>

<rect x="290" y="320" width="780" height="6" rx="3" fill="url(#og-stripe)"/>

<text x="80" y="430" fill="#475569" font-family="Noto Sans SC" font-size="26">计算机视觉 · AI 智能体 · 系统工程</text>
<text x="80" y="478" fill="#475569" font-family="JetBrains Mono" font-size="20">GPA 3.74 · 排名 9/117 · 国家级大创 · 10+ 项竞赛获奖</text>

<rect x="80" y="510" width="220" height="40" rx="20" fill="#e0f2fe" stroke="#0284c7" stroke-width="1.5"/>
<text x="190" y="538" text-anchor="middle" fill="#0284c7" font-family="Noto Sans Mono" font-size="18" font-weight="700">10-15 cm RMSE</text>

<rect x="320" y="510" width="220" height="40" rx="20" fill="#dbeafe" stroke="#1d4ed8" stroke-width="1.5"/>
<text x="430" y="538" text-anchor="middle" fill="#1d4ed8" font-family="JetBrains Mono" font-size="18" font-weight="700">26 FPS · Jetson Orin</text>

<rect x="560" y="510" width="220" height="40" rx="20" fill="#eef2ff" stroke="#4f46e5" stroke-width="1.5"/>
<text x="670" y="538" text-anchor="middle" fill="#4f46e5" font-family="JetBrains Mono" font-size="18" font-weight="700">17 MCP · SKYCloud</text>

<text x="1140" y="600" text-anchor="end" fill="#475569" font-family="JetBrains Mono" font-size="20" font-weight="700">tianyasky.github.io</text>
</svg>'''
with open(os.path.join(OUT, "og-image.svg"), "w", encoding="utf-8") as f:
    f.write(svg)
print("OG image generated:", os.path.join(OUT, "og-image.svg"))
