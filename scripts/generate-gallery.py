"""为每个项目生成额外的 gallery 图（终端截图、训练曲线、架构图等）。
这些 gallery 图像主要在详情页 Hero 之外补充。
"""
import os

OUT = "public/projects"

# 单目定位 gallery
def vision_gallery():
    base = os.path.join(OUT, "vision-positioning")
    # 01：海面测试场景示意
    svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">
<defs>
<linearGradient id="sea" x1="0%" y1="0%" x2="0%" y2="100%">
<stop offset="0%" stop-color="#dbeafe"/><stop offset="60%" stop-color="#bfdbfe"/><stop offset="100%" stop-color="#93c5fd"/>
</linearGradient>
</defs>
<rect width="1600" height="900" fill="url(#sea)"/>
<rect x="0" y="420" width="1600" height="60" fill="#1d4ed8" opacity="0.5"/>
<rect x="0" y="480" width="1600" height="20" fill="#ffffff" opacity="0.6"/>
<rect x="0" y="500" width="1600" height="6" fill="white"/>
<polygon points="640,200 660,200 690,500 610,500" fill="#1e3a8a"/>
<polygon points="640,190 660,190 670,200 630,200" fill="#ef4444"/>
<line x1="540" y1="280" x2="1100" y2="280" stroke="#09152e" stroke-width="2" stroke-dasharray="10 8"/>
<text x="540" y="270" font-family="JetBrains Mono" font-size="20" fill="#09152e">y = 12.7 m</text>
<text x="1090" y="270" font-family="JetBrains Mono" font-size="20" fill="#09152e">Δ = 10.4 cm</text>
<line x1="900" y1="100" x2="950" y2="500" stroke="#2563eb" stroke-width="3"/>
<circle cx="950" cy="500" r="10" fill="#2563eb"/>
<text x="970" y="500" font-family="JetBrains Mono" font-size="16" fill="#2563eb">Camera (1280x720 · 24fps)</text>
<rect x="1180" y="60" width="380" height="100" rx="14" fill="white" stroke="#2563eb" stroke-width="3"/>
<text x="1240" y="105" font-family="JetBrains Mono" font-size="16" fill="#09152e">ESTIMATED POSE</text>
<text x="1240" y="138" font-family="JetBrains Mono" font-size="22" fill="#2563eb" font-weight="700">x=12.7 y=8.4 z=1.6m</text>
<text x="1180" y="190" font-family="JetBrains Mono" font-size="14" fill="#475569">yaw=2.1° roll=0.4° · RMSE 11.2 cm</text>
</svg>'''
    open(os.path.join(base, "01.svg"), "w").write(svg)

    # 02：误差分布直方图
    svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">
<rect width="1600" height="900" fill="#f4f8fc"/>
<text x="80" y="120" font-family="Noto Sans SC" font-size="48" font-weight="900" fill="#09152e">误差分布 · 240 段测试视频</text>
<text x="80" y="170" font-family="JetBrains Mono" font-size="20" fill="#475569">RMSE 分布 · 单位 cm · bin=1cm</text>
<g transform="translate(120,260)">
<line x1="0" y1="380" x2="1400" x2="380" stroke="#475569" stroke-width="2"/>
<line x1="0" y1="0" x2="0" y2="380" stroke="#475569" stroke-width="2"/>
'''
    heights = [10,18,30,55,82,110,138,168,180,165,140,110,80,55,35,22,14,9,5,3]
    for i,h in enumerate(heights):
        x = i*70
        svg += f'<rect x="{x}" y="{380-h}" width="50" height="{h}" fill="#2563eb" opacity="0.85"/>'
        if i%2==0:
            svg += f'<text x="{x+25}" y="{400}" text-anchor="middle" font-family="JetBrains Mono" font-size="14" fill="#09152e">{i}-{i+1}cm</text>'
    svg += '''
<text x="700" y="430" text-anchor="middle" font-family="JetBrains Mono" font-size="16" fill="#475569">误差区间 (cm)</text>
<text x="-180" y="180" transform="rotate(-90)" font-family="JetBrains Mono" font-size="16" fill="#475569">样本数 (段)</text>
</g>
<rect x="80" y="730" width="1440" height="100" rx="14" fill="white" stroke="#2563eb" stroke-width="2"/>
<text x="120" y="780" font-family="JetBrains Mono" font-size="22" fill="#2563eb" font-weight="700">μ = 11.8 cm</text>
<text x="320" y="780" font-family="JetBrains Mono" font-size="22" fill="#2563eb" font-weight="700">σ = 4.2 cm</text>
<text x="520" y="780" font-family="JetBrains Mono" font-size="22" fill="#2563eb" font-weight="700">P95 = 14.9 cm</text>
<text x="780" y="780" font-family="JetBrains Mono" font-size="22" fill="#475569">静态 / 动态 / 8级阵风 + 小雨</text>
</svg>'''
    open(os.path.join(base, "02.svg"), "w").write(svg)

    # 03：算法流水线
    svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">
<rect width="1600" height="900" fill="#f4f8fc"/>
<text x="80" y="120" font-family="Noto Sans SC" font-size="48" font-weight="900" fill="#09152e">算法流水线 · YOLO11 + PnP</text>
'''
    blocks = [
        ("输入图像", "1920×1080", "#0284c7"),
        ("YOLO11 ROI", "96.8% acc", "#2563eb"),
        ("Harris 角点", "亚像素", "#1d4ed8"),
        ("几何约束", "光线夹角不变性", "#4f46e5"),
        ("LM/TRR", "双并发求解", "#7c3aed"),
        ("位姿输出", "26 FPS · 11.8 cm", "#0284c7"),
    ]
    bw = 220; gap = 30; start_x = 80
    for i,(t1,t2,c) in enumerate(blocks):
        x = start_x + i*(bw+gap)
        svg += f'<rect x="{x}" y="280" width="{bw}" height="180" rx="18" fill="white" stroke="{c}" stroke-width="4"/>'
        svg += f'<text x="{x+bw/2}" y="350" text-anchor="middle" font-family="Noto Sans SC" font-size="24" font-weight="800" fill="#09152e">{t1}</text>'
        svg += f'<text x="{x+bw/2}" y="395" text-anchor="middle" font-family="JetBrains Mono" font-size="16" fill="{c}">{t2}</text>'
        if i < len(blocks)-1:
            svg += f'<polygon points="{x+bw+10},360 {x+bw+gap-2},370 {x+bw+10},380" fill="#94a3b8"/>'
    svg += '<text x="80" y="600" font-family="Noto Sans SC" font-size="20" fill="#475569">前端：Jetson Orin · TensorRT FP16 · 26 FPS 实时解算</text></svg>'
    open(os.path.join(base, "03.svg"), "w").write(svg)


def cixin_gallery():
    base = os.path.join(OUT, "cixin-singularity")
    # 01：训练 loss / reward 曲线
    svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">
<rect width="1600" height="900" fill="#f4f8fc"/>
<text x="80" y="120" font-family="Noto Sans SC" font-size="48" font-weight="900" fill="#09152e">LoRA 微调训练曲线</text>
<text x="80" y="170" font-family="JetBrains Mono" font-size="20" fill="#475569">Qwen2.5-7B · rank=16 · alpha=32 · 4 epoch</text>
<g transform="translate(120,260)">
'''
    loss_curve = " ".join([f"{i*70},{320-((i*0.7+i*i*0.005)*0.6)}" for i in range(20)])
    svg += f'<polyline fill="none" stroke="#4f46e5" stroke-width="4" points="{loss_curve}"/>'
    for i,p in enumerate(loss_curve.split()):
        x,y = p.split(",")
        svg += f'<circle cx="{x}" cy="{y}" r="4" fill="#4f46e5"/>'
    svg += '<line x1="0" y1="380" x2="1400" y2="380" stroke="#475569" stroke-width="2"/>'
    svg += '<line x1="0" y1="0" x2="0" y2="380" stroke="#475569" stroke-width="2"/>'
    svg += '<text x="700" y="430" text-anchor="middle" font-family="JetBrains Mono" font-size="18" fill="#475569">训练步 (×1000)</text>'
    svg += '<text x="-220" y="190" transform="rotate(-90)" font-family="JetBrains Mono" font-size="18" fill="#475569">SFT loss</text>'
    svg += '</g>'
    svg += '<rect x="80" y="720" width="1440" height="120" rx="14" fill="white" stroke="#4f46e5" stroke-width="2"/>'
    svg += '<text x="120" y="770" font-family="JetBrains Mono" font-size="22" fill="#4f46e5" font-weight="700">loss: 2.4 → 0.91</text>'
    svg += '<text x="460" y="770" font-family="JetBrains Mono" font-size="22" fill="#4f46e5" font-weight="700">reward: 0.32 → 0.78</text>'
    svg += '<text x="880" y="770" font-family="JetBrains Mono" font-size="22" fill="#475569">epoch 4 · 收敛</text>'
    svg += '</svg>'
    open(os.path.join(base, "01.svg"), "w").write(svg)

    # 02：风格对比样例
    svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">
<rect width="1600" height="900" fill="#f4f8fc"/>
<text x="80" y="120" font-family="Noto Sans SC" font-size="48" font-weight="900" fill="#09152e">A/B 风格一致度盲评</text>
<text x="80" y="170" font-family="JetBrains Mono" font-size="20" fill="#475569">12 位科幻迷盲评 200 段生成文本</text>
'''
    rows = ["宏大叙事感", "硬设定感", "诗意感", "节奏感", "可读性"]
    for r,t in enumerate(rows):
        y = 260 + r*90
        svg += f'<text x="80" y="{y+22}" font-family="Noto Sans SC" font-size="22" fill="#09152e" font-weight="700">{t}</text>'
        # base
        svg += f'<rect x="320" y="{y}" width="700" height="28" rx="14" fill="white" stroke="#cbd5e1" stroke-width="1.5"/>'
        svg += f'<rect x="320" y="{y}" width="{250 + r*40}" height="28" rx="14" fill="#cbd5e1"/>'
        svg += f'<text x="1060" y="{y+22}" font-family="JetBrains Mono" font-size="18" fill="#475569">基线 {38+r*5}%</text>'
        # ours
        svg += f'<rect x="1180" y="{y}" width="280" height="28" rx="14" fill="white" stroke="#4f46e5" stroke-width="2"/>'
        svg += f'<rect x="1180" y="{y}" width="{180+r*18}" height="28" rx="14" fill="#4f46e5"/>'
        svg += f'<text x="1490" y="{y+22}" font-family="JetBrains Mono" font-size="18" fill="#4f46e5" font-weight="700">{60+r*3}%</text>'
    svg += '<text x="320" y="780" font-family="JetBrains Mono" font-size="18" fill="#475569">基线 Qwen2.5-7B</text>'
    svg += '<text x="1180" y="780" font-family="JetBrains Mono" font-size="18" fill="#4f46e5" font-weight="700">本项目 LoRA 微调</text>'
    svg += '</svg>'
    open(os.path.join(base, "02.svg"), "w").write(svg)

    # 03：硬件资源占用
    svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">
<rect width="1600" height="900" fill="#f4f8fc"/>
<text x="80" y="120" font-family="Noto Sans SC" font-size="48" font-weight="900" fill="#09152e">训练 & 推理资源占用</text>
'''
    cards = [
        ("可训练参数", "0.3%", "占总量", "#4f46e5"),
        ("权重体积", "48 MB", "全部 LoRA", "#0284c7"),
        ("显存占用", "14.2 GB", "T4 单卡", "#1d4ed8"),
        ("首 Token", "1.7 s", "vLLM 模式", "#2563eb"),
        ("吞吐", "32 tok/s", "stream 模式", "#38bdf8"),
    ]
    for i,(t,v,s,c) in enumerate(cards):
        x = 80 + i*290
        svg += f'<rect x="{x}" y="280" width="270" height="220" rx="22" fill="white" stroke="{c}" stroke-width="3"/>'
        svg += f'<text x="{x+135}" y="360" text-anchor="middle" font-family="Noto Sans SC" font-size="22" fill="#475569" font-weight="700">{t}</text>'
        svg += f'<text x="{x+135}" y="430" text-anchor="middle" font-family="JetBrains Mono" font-size="44" font-weight="900" fill="{c}">{v}</text>'
        svg += f'<text x="{x+135}" y="475" text-anchor="middle" font-family="JetBrains Mono" font-size="16" fill="#94a3b8">{s}</text>'
    svg += '<text x="80" y="700" font-family="Noto Sans SC" font-size="22" fill="#475569">对比基线（同任务） · 显存 70% 降低 · 权重 92% 减小</text></svg>'
    open(os.path.join(base, "03.svg"), "w").write(svg)


def racing_gallery():
    base = os.path.join(OUT, "rl-racing")
    svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">
<rect width="1600" height="900" fill="#f4f8fc"/>
<text x="80" y="120" font-family="Noto Sans SC" font-size="48" font-weight="900" fill="#09152e">PPO 训练奖励曲线</text>
<text x="80" y="170" font-family="JetBrains Mono" font-size="20" fill="#475569">2.4M 步收敛 · SubprocVecEnv 16 路并行</text>
<g transform="translate(120,260)">
<line x1="0" y1="380" x2="1400" y2="380" stroke="#475569" stroke-width="2"/>
<line x1="0" y1="0" x2="0" y2="380" stroke="#475569" stroke-width="2"/>
'''
    curve = []
    for i in range(50):
        # smooth increasing then plateau
        import math
        v = 250 * (1 - math.exp(-i/12)) + (math.sin(i*0.5)*8)
        curve.append((i*28, 380 - v))
    poly = " ".join([f"{x},{y}" for x,y in curve])
    svg += f'<polyline fill="none" stroke="#2563eb" stroke-width="3" points="{poly}"/>'
    for x,y in curve[::4]:
        svg += f'<circle cx="{x}" cy="{y}" r="4" fill="#2563eb"/>'
    svg += '<text x="700" y="430" text-anchor="middle" font-family="JetBrains Mono" font-size="18" fill="#475569">训练步 (×40k)</text>'
    svg += '<text x="-220" y="180" transform="rotate(-90)" font-family="JetBrains Mono" font-size="18" fill="#475569">episode reward</text>'
    svg += '</g>'
    svg += '<rect x="80" y="720" width="1440" height="120" rx="14" fill="white" stroke="#2563eb" stroke-width="2"/>'
    svg += '<text x="120" y="770" font-family="JetBrains Mono" font-size="22" fill="#2563eb" font-weight="700">reward: 12 → 268</text>'
    svg += '<text x="450" y="770" font-family="JetBrains Mono" font-size="22" fill="#2563eb" font-weight="700">圈速提升 22%</text>'
    svg += '<text x="800" y="770" font-family="JetBrains Mono" font-size="22" fill="#475569">vs 纯 PID baseline</text>'
    svg += '</svg>'
    open(os.path.join(base, "01.svg"), "w").write(svg)

    svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">
<rect width="1600" height="900" fill="#f4f8fc"/>
<text x="80" y="120" font-family="Noto Sans SC" font-size="48" font-weight="900" fill="#09152e">雷达感知 · 8 方向扇区</text>
<text x="80" y="170" font-family="JetBrains Mono" font-size="20" fill="#475569">状态向量 8 维连续 · 动作空间 (throttle, brake, steer)</text>
'''
    import math
    cx, cy = 800, 470
    for i in range(8):
        a = i*math.pi/4 - math.pi/2
        x2, y2 = cx + math.cos(a)*240, cy + math.sin(a)*240
        svg += f'<line x1="{cx}" y1="{cy}" x2="{x2}" y2="{y2}" stroke="#94a3b8" stroke-width="2" stroke-dasharray="6 6"/>'
        # distance label
        dist = [380, 295, 220, 180, 210, 260, 340, 410][i]
        x3, y3 = cx + math.cos(a)*280, cy + math.sin(a)*280
        svg += f'<circle cx="{x3}" cy="{y3}" r="20" fill="#2563eb" opacity="0.85"/>'
        svg += f'<text x="{x3}" y="{y3+6}" text-anchor="middle" font-family="JetBrains Mono" font-size="14" fill="white" font-weight="700">{dist}</text>'
    svg += f'<circle cx="{cx}" cy="{cy}" r="36" fill="#1d4ed8"/>'
    svg += f'<rect x="{cx-80}" y="{cy-15}" width="160" height="30" fill="#1d4ed8"/>'
    svg += f'<circle cx="{cx}" cy="{cy}" r="10" fill="white"/>'
    svg += f'<polygon points="{cx},{cy} {cx-12},{cy+10} {cx+12},{cy+10}" fill="#ef4444"/>'
    svg += '</svg>'
    open(os.path.join(base, "02.svg"), "w").write(svg)


def cloud_gallery():
    base = os.path.join(OUT, "sky-cloud")
    svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">
<rect width="1600" height="900" fill="#f4f8fc"/>
<text x="80" y="120" font-family="Noto Sans SC" font-size="48" font-weight="900" fill="#09152e">系统架构 · FastAPI + LangGraph + FastMCP</text>
'''
    blocks = [
        ("React UI", "用户客户端", "#0284c7", 100),
        ("FastAPI", "API 网关", "#2563eb", 320),
        ("LangGraph", "Agent 调度", "#4f46e5", 540),
        ("FastMCP × 17", "工具集", "#0284c7", 760),
        ("pgvector + Redis", "存储 + 缓存", "#1d4ed8", 980),
        ("Docker 沙箱", "隔离执行", "#38bdf8", 1200),
    ]
    for t,sub,c,x in blocks:
        svg += f'<rect x="{x}" y="280" width="180" height="120" rx="16" fill="white" stroke="{c}" stroke-width="3"/>'
        svg += f'<text x="{x+90}" y="335" text-anchor="middle" font-family="Noto Sans SC" font-size="22" font-weight="800" fill="#09152e">{t}</text>'
        svg += f'<text x="{x+90}" y="375" text-anchor="middle" font-family="JetBrains Mono" font-size="14" fill="{c}">{sub}</text>'
    # 数据流示意
    for i in range(5):
        x1 = 280 + i*220
        svg += f'<line x1="{x1}" y1="340" x2="{x1+40}" y2="340" stroke="#94a3b8" stroke-width="2" marker-end="url(#arrow-{i})"/>'
    svg += '''<defs>
<marker id="arrow-0" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8"/></marker>
</defs>'''
    # 数据流提示文字
    notes = ["HTTPS / JWT", "JSON-RPC", "RPC 协议", "paged KV + vec", "HTTP 422"]
    for i,n in enumerate(notes):
        x = 220 + i*220
        svg += f'<text x="{x}" y="430" font-family="JetBrains Mono" font-size="14" fill="#475569" transform="rotate(-12 {x} 430)">{n}</text>'
    svg += '<text x="80" y="600" font-family="Noto Sans SC" font-size="22" fill="#475569">7 模块 · 17 工具 · 4 级缓存 · 1 套端到端鉴权</text></svg>'
    open(os.path.join(base, "01.svg"), "w").write(svg)

    svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">
<rect width="1600" height="900" fill="#f4f8fc"/>
<text x="80" y="120" font-family="Noto Sans SC" font-size="48" font-weight="900" fill="#09152e">RAG 混合召回流水线</text>
<text x="80" y="170" font-family="JetBrains Mono" font-size="20" fill="#475569">6 维关键词改写 → Multi-Query → RRF → Rerank</text>
<g transform="translate(120,300)">
'''
    steps = [
        ("Query", "用户问题", "#0284c7"),
        ("改写", "6 维", "#2563eb"),
        ("召回", "Multi-Query", "#4f46e5"),
        ("RRF", "融合", "#38bdf8"),
        ("Rerank", "精排", "#1d4ed8"),
        ("首 Token", "4.0s", "#2563eb"),
    ]
    for i,(t,sub,c) in enumerate(steps):
        x = i*220
        svg += f'<rect x="{x}" y="0" width="180" height="120" rx="18" fill="white" stroke="{c}" stroke-width="3"/>'
        svg += f'<text x="{x+90}" y="50" text-anchor="middle" font-family="Noto Sans SC" font-size="22" font-weight="800" fill="#09152e">{t}</text>'
        svg += f'<text x="{x+90}" y="90" text-anchor="middle" font-family="JetBrains Mono" font-size="16" fill="{c}">{sub}</text>'
        if i < 5:
            svg += f'<polygon points="{x+185},55 {x+212},65 {x+185},75" fill="#94a3b8"/>'
    svg += '</g>'
    svg += '<rect x="80" y="600" width="1440" height="160" rx="14" fill="white" stroke="#0284c7" stroke-width="2"/>'
    svg += '<text x="120" y="650" font-family="JetBrains Mono" font-size="22" fill="#0284c7" font-weight="700">首 Token = 4.0s</text>'
    svg += '<text x="120" y="690" font-family="JetBrains Mono" font-size="20" fill="#475569">对比纯向量召回 -38% · 对比纯关键词 +52% 准确率</text>'
    svg += '</svg>'
    open(os.path.join(base, "02.svg"), "w").write(svg)

    svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">
<rect width="1600" height="900" fill="#f4f8fc"/>
<text x="80" y="120" font-family="Noto Sans SC" font-size="48" font-weight="900" fill="#09152e">真实演示 · AI 摘要与一键归档</text>
<rect x="120" y="240" width="700" height="600" rx="22" fill="white" stroke="#0284c7" stroke-width="3"/>
<text x="160" y="300" font-family="JetBrains Mono" font-size="22" fill="#0284c7" font-weight="700">📂 /2024/Q3</text>
<rect x="160" y="340" width="620" height="80" rx="10" fill="#f4f8fc" stroke="#cbd5e1"/>
<text x="180" y="375" font-family="JetBrains Mono" font-size="16" fill="#09152e">invoice_Q3_07.pdf · 1.2 MB</text>
<text x="180" y="400" font-family="JetBrains Mono" font-size="13" fill="#94a3b8">PDF · 8 页</text>
<rect x="160" y="430" width="620" height="80" rx="10" fill="#f4f8fc" stroke="#cbd5e1"/>
<text x="180" y="465" font-family="JetBrains Mono" font-size="16" fill="#09152e">meeting_minutes_08.docx · 320 KB</text>
<text x="180" y="490" font-family="JetBrains Mono" font-size="13" fill="#94a3b8">DOCX · 6 页</text>
<rect x="160" y="520" width="620" height="80" rx="10" fill="#f4f8fc" stroke="#cbd5e1"/>
<text x="180" y="555" font-family="JetBrains Mono" font-size="16" fill="#09152e">budget_q3.xlsx · 280 KB</text>
<text x="180" y="580" font-family="JetBrains Mono" font-size="13" fill="#94a3b8">XLSX · 工作簿</text>
<rect x="160" y="610" width="620" height="80" rx="10" fill="#f4f8fc" stroke="#cbd5e1"/>
<text x="180" y="645" font-family="JetBrains Mono" font-size="16" fill="#09152e">vendor_contract_v2.pdf · 2.3 MB</text>
<text x="180" y="670" font-family="JetBrains Mono" font-size="13" fill="#94a3b8">PDF · 24 页 · 供应商 A</text>
<rect x="160" y="700" width="620" height="80" rx="10" fill="#f4f8fc" stroke="#cbd5e1"/>
<text x="180" y="735" font-family="JetBrains Mono" font-size="16" fill="#09152e">banner_final.png · 4.1 MB</text>
<text x="180" y="760" font-family="JetBrains Mono" font-size="13" fill="#94a3b8">PNG · 4k</text>

<rect x="900" y="240" width="580" height="600" rx="22" fill="#0a1633"/>
<rect x="900" y="240" width="580" height="46" fill="#1e293b"/>
<circle cx="924" cy="263" r="6" fill="#ef4444"/>
<circle cx="944" cy="263" r="6" fill="#f59e0b"/>
<circle cx="964" cy="263" r="6" fill="#10b981"/>
<text x="1000" y="268" font-family="JetBrains Mono" font-size="14" fill="#94a3b8">SKYCloud · AI Assistant</text>
<rect x="930" y="320" width="520" height="56" rx="14" fill="#1e3a8a"/>
<text x="950" y="356" font-family="Noto Sans SC" font-size="16" fill="#ffffff">"把 Q3 报销里所有超过 1000 元的发票汇总成一张表"</text>
<rect x="930" y="400" width="520" height="180" rx="14" fill="#10b981" opacity="0.15"/>
<text x="950" y="430" font-family="Noto Sans SC" font-size="16" fill="#cbd5e1">✓ 已扫描 5 个文件 · 2 个匹配条件</text>
<text x="950" y="460" font-family="Noto Sans SC" font-size="15" fill="#cbd5e1">✓ invoice_Q3_07.pdf：¥3,200</text>
<text x="950" y="490" font-family="JetBrains Mono" font-size="14" fill="#cbd5e1">✓ vendor_contract_v2.pdf：¥12,500</text>
<text x="950" y="530" font-family="Noto Sans SC" font-size="15" fill="#cbd5e1">· 已生成汇总表 q3_invoice_summary.xlsx</text>
<text x="950" y="560" font-family="JetBrains Mono" font-size="13" fill="#94a3b8">▎ 4.0s · 9 tool calls · MCP OK</text>
</svg>'''
    open(os.path.join(base, "03.svg"), "w").write(svg)


def douyin_gallery():
    base = os.path.join(OUT, "sky-douyin")
    svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">
<rect width="1600" height="900" fill="#f4f8fc"/>
<text x="80" y="120" font-family="Noto Sans SC" font-size="48" font-weight="900" fill="#09152e">三层用户画像 · 实时 / 短期 / 长期</text>
'''
    layers = [
        ("实时层", "Redis · 最近 5 min", ["滑动视频", "点赞", "评论", "搜索"], "#0284c7"),
        ("短期层", "MySQL 分区 · 24 h", ["完整停留", "重复行为", "时段偏好", "设备切换"], "#2563eb"),
        ("长期层", "Milvus · 兴趣标签", ["主题向量", "人群相似度", "标签命中", "冷启动基线"], "#4f46e5"),
    ]
    for i,(t,sub,items,c) in enumerate(layers):
        y = 260 + i*180
        svg += f'<rect x="100" y="{y}" width="300" height="140" rx="18" fill="{c}"/>'
        svg += f'<text x="250" y="{y+50}" text-anchor="middle" font-family="Noto Sans SC" font-size="28" fill="white" font-weight="900">{t}</text>'
        svg += f'<text x="250" y="{y+85}" text-anchor="middle" font-family="JetBrains Mono" font-size="14" fill="white" opacity="0.85">{sub}</text>'
        svg += f'<line x1="420" y1="{y+70}" x2="500" y2="{y+70}" stroke="#cbd5e1" stroke-width="3"/>'
        svg += f'<polygon points="500,{y+62} 516,{y+70} 500,{y+78}" fill="#cbd5e1"/>'
        for j,item in enumerate(items):
            svg += f'<rect x="540" y="{y+18+j*28}" width="940" height="22" rx="11" fill="white" stroke="{c}" stroke-width="2"/>'
            svg += f'<text x="560" y="{y+34+j*28}" font-family="Noto Sans SC" font-size="16" fill="#09152e">· {item}</text>'
    svg += '<text x="100" y="850" font-family="JetBrains Mono" font-size="20" fill="#475569">→ Multi-Query Recall · Cold-start CTR +18%</text></svg>'
    open(os.path.join(base, "01.svg"), "w").write(svg)

    svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">
<rect width="1600" height="900" fill="#f4f8fc"/>
<text x="80" y="120" font-family="Noto Sans SC" font-size="48" font-weight="900" fill="#09152e">P99 推荐响应时延 · 24h 监控</text>
<text x="80" y="170" font-family="JetBrains Mono" font-size="20" fill="#475569">10 万视频 · 5000 模拟用户 · 4 轮压测</text>
<g transform="translate(120,260)">
'''
    import math
    curves = []
    for i in range(120):
        v = 80 + math.sin(i*0.3)*12 + (i%20)*0.4 + (i%30)*0.3
        curves.append((i*12, 380 - v*2))
    poly = " ".join([f"{x},{y}" for x,y in curves])
    svg += f'<polyline fill="none" stroke="#4f46e5" stroke-width="3" points="{poly}"/>'
    svg += '<line x1="0" y1="380" x2="1500" y2="380" stroke="#475569" stroke-width="2"/>'
    svg += '<line x1="0" y1="0" x2="0" y2="380" stroke="#475569" stroke-width="2"/>'
    svg += '<text x="750" y="430" text-anchor="middle" font-family="JetBrains Mono" font-size="18" fill="#475569">时间 (min)</text>'
    svg += '<text x="-180" y="180" transform="rotate(-90)" font-family="JetBrains Mono" font-size="18" fill="#475569">P99 latency (ms)</text>'
    svg += '</g></svg>'
    open(os.path.join(base, "02.svg"), "w").write(svg)


def oj_gallery():
    base = os.path.join(OUT, "sky-oj")
    svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">
<rect width="1600" height="900" fill="#f4f8fc"/>
<text x="80" y="120" font-family="Noto Sans SC" font-size="48" font-weight="900" fill="#09152e">Docker 沙箱架构 · cgroup + seccomp</text>
'''
    parts = [
        ("提交 API", "Flask · 422", "#2563eb"),
        ("判题编排", "RabbitMQ", "#0284c7"),
        ("Worker × 32", "Subproc + cgroup", "#1d4ed8"),
        ("判题沙箱", "Docker · seccomp", "#4f46e5"),
        ("结果聚合", "PostgreSQL", "#0284c7"),
        ("AI 教学", "Qwen 微调", "#38bdf8"),
    ]
    for i,(t,sub,c) in enumerate(parts):
        x = 120 + i*220
        y = 320 + (i%2)*200
        svg += f'<rect x="{x}" y="{y}" width="180" height="140" rx="18" fill="white" stroke="{c}" stroke-width="3"/>'
        svg += f'<text x="{x+90}" y="{y+50}" text-anchor="middle" font-family="Noto Sans SC" font-size="20" font-weight="800" fill="#09152e">{t}</text>'
        svg += f'<text x="{x+90}" y="{y+85}" text-anchor="middle" font-family="JetBrains Mono" font-size="14" fill="{c}">{sub}</text>'
    svg += '<text x="120" y="750" font-family="Noto Sans SC" font-size="22" fill="#475569">5 次红队测试 · 100% 阻断 fork-bomb / 网络探测 / 容器逃逸</text></svg>'
    open(os.path.join(base, "01.svg"), "w").write(svg)

    svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">
<rect width="1600" height="900" fill="#f4f8fc"/>
<text x="80" y="120" font-family="Noto Sans SC" font-size="48" font-weight="900" fill="#09152e">判题运行 · 实时状态总览</text>
<rect x="120" y="240" width="1380" height="600" rx="22" fill="white" stroke="#1d4ed8" stroke-width="3"/>
<rect x="120" y="240" width="1380" height="60" fill="#1d4ed8"/>
<text x="160" y="280" font-family="JetBrains Mono" font-size="22" fill="white" font-weight="700">SKYOJ · Judge Queue</text>
<text x="1380" y="280" text-anchor="end" font-family="JetBrains Mono" font-size="16" fill="white">2026-08-11 · 4,820 subs today · 0 failed</text>
<g font-family="JetBrains Mono" font-size="16">
'''
    rows = [
        ("#128472", "linyixuan", "A.cpp", "ACCEPTED", "312 ms", "28.4 MB", "#10b981"),
        ("#128473", "wanghe", "B.py", "WRONG_ANSWER", "120 ms", "9.1 MB", "#ef4444"),
        ("#128474", "zhangke", "lab-7.ipynb", "ACCEPTED", "8.2 s", "180 MB", "#10b981"),
        ("#128475", "lihao", "InventoryTest.java", "ACCEPTED", "960 ms", "42 MB", "#10b981"),
        ("#128476", "mayufei", "C.cpp", "TLE", "2000 ms", "11 MB", "#f59e0b"),
        ("#128477", "tianminxiang", "D.cpp", "ACCEPTED", "240 ms", "16 MB", "#10b981"),
        ("#128478", "liusiyi", "E.py", "RUNTIME_ERROR", "110 ms", "8 MB", "#ef4444"),
        ("#128479", "sunxin", "F.cpp", "ACCEPTED", "390 ms", "21 MB", "#10b981"),
        ("#128480", "yangyu", "G.py", "ACCEPTED", "210 ms", "10.5 MB", "#10b981"),
        ("#128481", "liuxin", "sort_nlogn.cpp", "ACCEPTED", "420 ms", "33 MB", "#10b981"),
    ]
    for i,(sid,user,fname,status,time,mem,c) in enumerate(rows):
        y = 360 + i*40
        svg += f'<text x="160" y="{y}" fill="#475569">{sid}</text>'
        svg += f'<text x="300" y="{y}" fill="#475569">{user}</text>'
        svg += f'<text x="500" y="{y}" fill="#09152e" font-weight="700">{fname}</text>'
        svg += f'<rect x="820" y="{y-22}" width="180" height="26" rx="13" fill="{c}" opacity="0.18"/>'
        svg += f'<text x="840" y="{y-4}" fill="{c}" font-weight="700">{status}</text>'
        svg += f'<text x="1080" y="{y}" fill="#09152e">{time}</text>'
        svg += f'<text x="1280" y="{y}" fill="#09152e">{mem}</text>'
    svg += '</g></svg>'
    open(os.path.join(base, "02.svg"), "w").write(svg)


vision_gallery()
cixin_gallery()
racing_gallery()
cloud_gallery()
douyin_gallery()
oj_gallery()

print("gallery generated.")
for p in sorted(os.listdir(OUT)):
    print(p, sorted(os.listdir(os.path.join(OUT, p))))
