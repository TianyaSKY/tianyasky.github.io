export const personalInfo = {
  name: "陈敏祥",
  englishName: "Chen Minxiang",
  title: "计算机视觉 · AI 原生系统 · 智能体工程",
  school: "大连海洋大学 · 信息工程学院",
  major: "计算机科学与技术 · 本科 (2023.09 — 2027.07)",
  avatar: "https://media.tianyasky.top/site/avatar.png",
  schoolLogo: "./school_logo.png",
  email: "tianyaguest@qq.com",
  github: "https://github.com/TianyaSKY",
  phone: "135-1700-1469",
  taglines: [
    "从单目几何解算，到可运行的 LLM 多智能体世界",
    "用 FastAPI、Vue 与 Docker 搭建 AI 原生产品",
    "持续打磨 RAG、MCP、推荐系统与安全沙箱",
    "国家级大创项目第一负责人 · 多项算法与工程竞赛获奖"
  ]
};

export const stats = [
  { id: "rank", label: "专业排名", value: "7", sub: "/117", icon: "Trophy", color: "#2563eb" },
  { id: "gpa", label: "GPA 成绩", value: "3.72", sub: "", icon: "GraduationCap", color: "#0284c7" },
  { id: "projects", label: "国家级大创", value: "2", sub: "项", icon: "Rocket", color: "#3b82f6" },
  { id: "awards", label: "竞赛获奖", value: "10+", sub: "项", icon: "Award", color: "#1d4ed8" }
];

export const interestTags = [
  "单目视觉与位姿解算",
  "概率引导人群计数",
  "LLM 多智能体仿真",
  "RAG 与 MCP 工作流",
  "推荐系统与用户建模",
  "Docker 沙箱与异步系统",
  "强化学习环境设计"
];

export const educationInfo = {
  school: "大连海洋大学",
  college: "信息工程学院",
  major: "计算机科学与技术 · 本科",
  period: "2023.09 — 2027.07",
  tags: ["CET-4 510", "排名 7/117", "GPA 3.72", "二等奖学金"],
  courses: [
    { name: "算法分析与设计", score: "95" },
    { name: "机器学习", score: "95" },
    { name: "概率论与数理统计", score: "98" },
    { name: "数据库系统", score: "93" },
    { name: "Java 程序设计", score: "92" },
    { name: "高等数学", score: "97" }
  ],
  skillsSummary: "Python / PyTorch / OpenCV / FastAPI / Vue 3 / LLM Agent / RAG / Docker"
};

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
      { name: "人群密度估计", projects: "YOLO-PGMD 概率引导注意力与守恒密度图 (ShanghaiTech A MAE 48.13)" },
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
      { name: "PyTorch", projects: "单目定位、YOLO-PGMD、PPO 赛车与多模态向量生成" },
      { name: "LLM LoRA 微调", projects: "科幻奇点 0.039% 参数量高效对齐" },
      { name: "FastMCP Agent", projects: "SKYCloud 的 16 Tool / 4 Prompt / 2 Resource" },
      { name: "RAG 多路召回", projects: "6 维改写 + Multi-Query + RRF + Rerank" },
      { name: "强化学习 (PPO)", projects: "16 维状态、9 向雷达与 8 环境并行训练" },
      { name: "智能体运行时", projects: "SKYCity 世界引擎与 SKYCloud 受控 OpenCode Runtime" }
    ]
  },
  {
    id: "backend",
    category: "后端架构 & 高并发",
    theme: "indigo",
    skills: [
      { name: "FastAPI", projects: "SKYCloud、SKYOJ 与 SKYCity 三类业务服务" },
      { name: "Redis / Milvus", projects: "兴趣冷启动、向量召回、权限与热点缓存" },
      { name: "RabbitMQ / Celery", projects: "索引、推荐事件与判题任务异步解耦" },
      { name: "PostgreSQL / pgvector", projects: "结构化业务数据与 1024 维知识索引" },
      { name: "Docker 容器化", projects: "OpenCode Runtime、代码判题与 Agent 工作区隔离" }
    ]
  },
  {
    id: "lang",
    category: "编程语言 & 全栈",
    theme: "sky",
    skills: [
      { name: "Python", projects: "视觉算法、强化学习、FastAPI 与 Agent 核心语言" },
      { name: "Vue 3 / React", projects: "AI Workspace、在线评测与短视频 Web 客户端" },
      { name: "Java / Spring Boot", projects: "SKYDouyin 业务真相与行为事件服务" },
      { name: "PixiJS / Pygame + OpenGL", projects: "AI 小镇瓦片世界与 3D 赛车实验环境" },
      { name: "SQL", projects: "文件、评测、推荐与世界状态的数据建模" }
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
