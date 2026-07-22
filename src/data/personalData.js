export const personalInfo = {
  name: "陈敏祥",
  englishName: "Chen Minxiang",
  title: "计算机视觉 · AI 智能体 · 系统工程",
  school: "大连海洋大学 · 信息工程学院",
  major: "计算机科学与技术 · 本科 (2023.09 — 2027.07)",
  avatar: "./avatar.png",
  schoolLogo: "./school_logo.png",
  email: "tianyaguest@qq.com",
  github: "https://github.com/TianyaSKY",
  phone: "135-1700-1469",
  taglines: [
    "近海 10–15cm 厘米级单目姿态估计架构师",
    "专注计算机视觉与三维几何姿态重建",
    "精通 AI 智能体 (Agent) 与 RAG 并行召回",
    "国家级大创项目第一负责人 · 竞赛国奖得主"
  ]
};

export const stats = [
  { id: "rank", label: "专业排名", value: "9", sub: "/117", icon: "Trophy", color: "#2563eb" },
  { id: "gpa", label: "GPA 成绩", value: "3.64", sub: "", icon: "GraduationCap", color: "#0284c7" },
  { id: "projects", label: "国家级大创", value: "2", sub: "项", icon: "Rocket", color: "#3b82f6" },
  { id: "awards", label: "竞赛获奖", value: "10+", sub: "项", icon: "Award", color: "#1d4ed8" }
];

export const interestTags = [
  "单目视觉定位",
  "三维几何重建",
  "YOLO 目标检测",
  "大语言模型 SFT",
  "FastMCP 智能体",
  "多模态推荐系统"
];

export const educationInfo = {
  school: "大连海洋大学",
  college: "信息工程学院",
  major: "计算机科学与技术 · 本科",
  period: "2023.09 — 2027.07",
  tags: ["CET-4 510", "排名 9/117", "GPA 3.64", "二等奖学金"],
  courses: [
    { name: "算法分析与设计", score: "95" },
    { name: "机器学习", score: "95" },
    { name: "概率论与数理统计", score: "98" },
    { name: "数据库系统", score: "93" },
    { name: "Java 程序设计", score: "92" },
    { name: "高等数学", score: "97" }
  ],
  skillsSummary: "Python / PyTorch / OpenCV / YOLO 系列 / 三维几何重建 / LLM 微调 / Agent 开发"
};

export const researchProjects = [
  {
    id: "vision-positioning",
    title: "基于杆状标志物的单目视觉定位系统",
    badge: "国家级大创 · 第一负责人",
    category: "Computer Vision & Pose Estimation",
    tech: ["Python", "PyTorch", "YOLO11", "OpenCV", "Jetson Orin"],
    description: "针对近海环境 GPS 信号易受干扰、传统 PnP 在共线杆状结构上几何退化的致命痛点，自主设计低成本单目视觉定位系统。海上实测 10–15cm RMSE 精度，26 FPS 实时解算。",
    highlights: [
      "级联检测网络：YOLO11 ROI 提取 + Harris 亚像素角点精炼 + 轻量 CNN 语义识别（96.8% 准确率）",
      "非线性求解：提出光线夹角不变性几何约束，LM/TRR 双并发求解器克服共线点退化",
      "海上实操验证：大连沿海实测 10–15cm RMSE 定位精度，具备强抗光照与抗波浪抖动能力",
      "学术与知识产权：辽宁省创新创业年会三等奖 · 软件著作权《基于单目视觉的相机定位系统》"
    ],
    hasVisionDemo: true
  },
  {
    id: "cixin-singularity",
    title: "科幻奇点 — 刘慈欣风格科幻生成系统",
    badge: "项目负责人",
    category: "LLM Fine-Tuning & SFT",
    tech: ["Qwen2.5-7B", "LoRA", "PyTorch", "SFT"],
    description: "双卡 T4 有限算力约束下，高效微调 Qwen2.5-7B 赋能「慈欣体」风格生成。清洗 120 万字语料，LoRA 注入 Attention 层，可训练参数仅 0.3%，权重不足 50MB。",
    highlights: [
      "滑动窗口 + 语义切分构建高质量 SFT 训练集，文风逼真度显著超越基线大模型",
      "轻量化 LoRA 注入 Attention 投影层，显存占用降低 70%，推演响应时间 < 2s",
      "竞赛荣誉：辽宁省大学生智能技术应用大赛一等奖"
    ],
    hasTerminalSim: true
  },
  {
    id: "rl-racing",
    title: "基于强化学习的 3D 赛车自动驾驶系统",
    badge: "独立开发",
    category: "Reinforcement Learning",
    tech: ["Python", "PyTorch", "Stable-Baselines3", "PPO", "Pygame"],
    description: "基于 Pygame 与物理引擎构建 3D 赛车运动学仿真环境，结合多维雷达传感器，采用 PPO 算法训练无人驾驶智能体，实现 100% 自动绕障与最优路径巡航。",
    highlights: [
      "运动学环境：构建 3D 赛车物理运动模型，配备多方向雷达射线束进行毫米级边界感知",
      "复合奖励设计：设计速度与轨迹偏离度惩罚的连续动作空间 PPO 训练逻辑",
      "并行训练加速：利用 SubprocVecEnv 多进程并行采样，训练效率提升 4 倍以上"
    ],
    github: "https://github.com/TianyaSKY/RacingCar",
    bilibiliBvid: "BV1EBqSBcEnL"
  }
];

export const engineeringProjects = [
  {
    id: "sky-cloud",
    title: "SKYCloud —— AI 原生云盘",
    badge: "中软国际 AI 挑战赛省一等奖",
    category: "AI Agent & RAG Architecture",
    tech: ["FastAPI", "Redis", "PostgreSQL", "pgvector", "LangGraph", "Docker"],
    description: "大模型驱动的智能云盘系统：文件智能自动归档、多模态语义搜索、沙箱智能体自主运维。",
    highlights: [
      "沙箱工作区：Docker SDK 动态调度隔离容器，FastMCP 暴露 17 个运维工具，大模型无感鉴权",
      "RAG 混合召回：6 维关键词改写 + Multi-Query 并行召回 + RRF 融合 + Rerank 重排，首 Token 响应 4s",
      "海量存储：大文件分片秒传、断点续传；布隆过滤器 + Redis Bitmap 实现高并发权限预判"
    ],
    github: "https://github.com/TianyaSKY/SKYCloud",
    bilibiliBvid: "BV1Ez5x6kE1R"
  },
  {
    id: "sky-douyin",
    title: "SKYDouyin —— 短视频推荐系统",
    badge: "多模态推荐引擎",
    category: "High Performance Backend",
    tech: ["MySQL", "Redis", "RabbitMQ", "Milvus", "FastAPI"],
    description: "多模态大模型 + 三层用户画像 + 双路召回，构建毫秒级高并发短视频推荐引擎。",
    highlights: [
      "多模态向量化：联合视频标题、封面与音频语义向量，基于 Milvus 实现向量 + 热门双路召回",
      "消息队列解耦：用户行为上报、实时画像更新与统计聚合全链路 RabbitMQ 削峰解耦",
      "高可用存储：唯一键幂等写入与 Redis 缓存击穿防护，保障双写一致性"
    ],
    github: "https://github.com/TianyaSKY/MyDouyin"
  },
  {
    id: "sky-oj",
    title: "SKYOJ —— 在线代码评测系统",
    badge: "独立开发",
    category: "Microservice Platform",
    tech: ["Vue3", "Flask", "Docker", "RabbitMQ", "PostgreSQL"],
    description: "基于微服务架构的在线评测平台，支持 ACM 判题、OOP 测试与 Notebook 数据科学评测，集成 LLM 智能代码分析。",
    highlights: [
      "Docker 安全沙箱：容器隔离执行用户提交代码，严格限制 CPU/内存/网络权限，杜绝恶意脚本",
      "多模式评测：支持 ACM 标准对拍、OOP 单元测试以及 Jupyter Notebook 自动化评分",
      "AI 教学辅助：接入大模型对错误代码进行静态分析与优化诊断建议"
    ],
    github: "https://github.com/TianyaSKY/SKYOJ"
  }
];

export const awardsList = [
  { year: "2026", level: "National", title: "蓝桥杯全国总决赛一等奖", detail: "第 17 届 · Python 组 · 全国第 10 名" },
  { year: "2026", level: "Provincial", title: "中软国际 · 卓越杯 AI 挑战赛一等奖", detail: "辽宁赛区" },
  { year: "2026", level: "Provincial", title: "智能技术应用大赛 · 一等奖", detail: "辽宁赛区" },
  { year: "2025", level: "National", title: "iCAN 创新创业大赛三等奖", detail: "全国总决赛 · 第 19 届" },
  { year: "2024", level: "National", title: "大学生数学竞赛二等奖", detail: "第 16 届" },
  { year: "2024", level: "National", title: "金砖技能大赛三等奖", detail: "全国总决赛 · 一带一路技术创新赛道" },
  { year: "2025", level: "Provincial", title: "辽宁省创新创业年会三等奖", detail: "单目视觉定位系统" },
  { year: "2025", level: "Provincial", title: "大学生计算机设计大赛三等奖", detail: "辽宁赛区 · 软件应用开发" }
];

export const skillCategories = [
  {
    id: "cv",
    category: "计算机视觉 & 3D 几何",
    theme: "blue",
    skills: [
      { name: "OpenCV", projects: "车牌提取 | 双目鱼体尺寸估算" },
      { name: "单目视觉定位", projects: "杆状标志物 10-15cm RMSE 海上实时解算" },
      { name: "YOLO 目标检测", projects: "YOLO11 ROI 提取 & 人群计数定位" },
      { name: "3D 姿态识别", projects: "WHAM 关键点估计与运动姿态重构" },
      { name: "位姿估计", projects: "YOLO-pose 头部追踪与虚拟眼镜贴合" },
      { name: "三维几何重建", projects: "海面坐标系光线夹角不变性映射" },
      { name: "点云补全", projects: "扩散模型 Chamfer Distance 优化" },
      { name: "多模态管线", projects: "端到端视觉与文本自动化特征流" }
    ]
  },
  {
    id: "ai",
    category: "AI & 大模型工程",
    theme: "cyan",
    skills: [
      { name: "PyTorch", projects: "单目定位、3D 赛车与点云补全架构" },
      { name: "LLM LoRA 微调", projects: "科幻奇点 0.3% 参数量高效对齐" },
      { name: "FastMCP Agent", projects: "SKYCloud 17 运维工具无感鉴权调度" },
      { name: "RAG 多路召回", projects: "6 维改写 + Multi-Query + RRF 融合" },
      { name: "强化学习 (PPO)", projects: "3D 赛车雷达避障与最优巡航控制" },
      { name: "沙盒智能体", projects: "Docker 隔离代码生成受限执行环境" }
    ]
  },
  {
    id: "backend",
    category: "后端架构 & 高并发",
    theme: "indigo",
    skills: [
      { name: "FastAPI", projects: "SKYCloud & 多模态推荐系统高性能 API" },
      { name: "Redis / Milvus", projects: "用户特征毫秒级缓存 & 向量双路召回" },
      { name: "RabbitMQ", projects: "解耦代码评测与视频日志全链路异步削峰" },
      { name: "PostgreSQL / pgvector", projects: "结构化业务与 1536 维向量检索" },
      { name: "Docker 容器化", projects: "智能体沙盒与评测隔离环境" }
    ]
  },
  {
    id: "lang",
    category: "编程语言 & 全栈",
    theme: "sky",
    skills: [
      { name: "Python", projects: "深度学习、Agent、FastAPI 核心语言" },
      { name: "JavaScript / React", projects: "现代 React 全栈交互与炫酷 HUD 动效" },
      { name: "Java", projects: "后端基座与强类型服务解耦" },
      { name: "SQL", projects: "高并发查询优化与数据库架构" }
    ]
  }
];

export const sciFiPresetPrompts = [
  {
    id: "foil",
    label: "二向箔降维打击",
    prompt: "请求执行二向箔降维攻击指令，目标：水星第三防卫基地",
    response: "【警告：空间拓扑维度衰减机制启动】\n维度收缩场已降临目标星域。矢量膜展现出绝对平滑的光学反射，三维宏观结构在 0.00004 秒内坍缩为无厚度的二维巨幅画卷。引力波探测阵列捕捉到极致静谧的降维涟漪……宇宙最深沉的永恒，即是画卷中的沉寂。"
  },
  {
    id: "droplet",
    label: "水滴穿透舰队阵列",
    prompt: "测控站汇报：微波天线捕捉到强相互作用力材料探测器（水滴）正以 30km/s 相对速度冲向第一联合舰队",
    response: "【强相互作用力外壳状态：绝对全反射】\n无视碰撞，无视温度，无视动能量级。水滴呈完美椭球体，其表面原子核被强相互作用力紧密锁死。它如同热刀切过黄油般穿透了第一舰队旗舰的聚变反应堆核心，继而是第二艘、第三艘……这场屠杀不需要愤怒，只是宇宙物理法则的冰冷执行。"
  },
  {
    id: "wallfacer",
    label: "面壁者逻辑广播",
    prompt: "面壁者逻辑，请向宇宙发射太阳电磁波放大广播（187J3X1 恒星坐标）",
    response: "【太阳电磁辐射层功率增益：10^8 倍级联放大】\n咒语已随着能量波束撕裂星尘。在漫漫暗森林中，一颗恒星的位置已暴露在万千冷酷猎手的视线之下。50年或100年后，毁灭将从天而降。这是弱小的碳基生命，向全宇宙发出的死神请柬。"
  }
];

// Search dataset for Quick Search Command Palette (⌘K)
export const searchDataset = [
  { type: "Research", title: "单目视觉定位系统", subtitle: "国家级大创 · 10-15cm 精度", href: "#research" },
  { type: "Research", title: "科幻奇点 — 慈欣体生成", subtitle: "Qwen2.5-7B SFT 微调", href: "#research" },
  { type: "Research", title: "3D 赛车自动驾驶系统", subtitle: "PPO 强化学习", href: "#research" },
  { type: "Engineering", title: "SKYCloud AI 原生云盘", subtitle: "FastAPI + LangGraph + FastMCP", href: "#projects" },
  { type: "Engineering", title: "SKYDouyin 短视频推荐", subtitle: "多模态向量 + 双路召回", href: "#projects" },
  { type: "Engineering", title: "SKYOJ 在线评测平台", subtitle: "Docker 沙盒 + ACM 对拍", href: "#projects" },
  { type: "Award", title: "蓝桥杯全国一等奖", subtitle: "第17届 Python 组全国第 10 名", href: "#awards" },
  { type: "Award", title: "卓越杯 AI 挑战赛一等奖", subtitle: "中软国际 辽宁赛区", href: "#awards" },
  { type: "Course", title: "算法分析与设计 (95分)", subtitle: "大连海洋大学 核心高分课程", href: "#education" },
  { type: "Course", title: "机器学习 (95分)", subtitle: "大连海洋大学 核心高分课程", href: "#education" },
  { type: "Course", title: "概率论与数理统计 (98分)", subtitle: "大连海洋大学 核心高分课程", href: "#education" },
  { type: "Contact", title: "Email: tianyaguest@qq.com", subtitle: "点击直接发送邮件交流", href: "mailto:tianyaguest@qq.com" },
  { type: "Contact", title: "GitHub: github.com/TianyaSKY", subtitle: "查看全部开源代码库", href: "https://github.com/TianyaSKY" }
];
