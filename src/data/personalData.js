export const personalInfo = {
  name: "陈敏祥",
  englishName: "Chen Minxiang",
  title: "计算机视觉与智能系统",
  school: "大连海洋大学 · 信息工程学院",
  major: "计算机科学与技术 · 本科 (2023.09 — 2027.07)",
  avatar: "./avatar.png",
  schoolLogo: "./school_logo.png",
  email: "tianyaguest@qq.com",
  github: "https://github.com/TianyaSKY",
  phone: "135-1700-1469",
  taglines: [
    "专注计算机视觉与单目姿态几何估计",
    "精通 AI 智能体 (Agent) 与 RAG 架构",
    "国家级大创项目第一负责人",
    "近海厘米级单目视觉定位系统开发者"
  ]
};

export const stats = [
  { label: "专业排名", value: "9", sub: "/117", icon: "Trophy" },
  { label: "GPA", value: "3.64", sub: "", icon: "GraduationCap" },
  { label: "国家级大创", value: "2", sub: "项", icon: "Rocket" },
  { label: "竞赛获奖", value: "10+", sub: "项", icon: "Award" }
];

export const interestTags = [
  "计算机视觉",
  "三维重建",
  "目标检测",
  "大语言模型",
  "智能体系统",
  "推荐系统"
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
    { name: "概率论", score: "98" },
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
    tech: ["Python", "PyTorch", "YOLO11", "OpenCV", "Jetson Orin"],
    description: "近海 GPS 易受干扰，传统 PnP 在共线结构上存在几何退化。设计低成本单目视觉定位系统，在强光、运动模糊等极端工况下实现厘米级定位。",
    highlights: [
      "视觉感知：级联检测：YOLO11 ROI 提取 + Harris 亚像素角点精炼 + 轻量 CNN 语义识别（96.8% 准确率）",
      "位姿估计：提出光线夹角不变性几何约束，LM/TRR 双并发非线性优化克服共线退化",
      "海上实测：大连沿海实地验证：10–15cm RMSE、26 FPS、92% 特征检出率",
      "成果：辽宁省创新创业年会三等奖 · 软件著作权《基于单目视觉的相机定位系统》"
    ]
  },
  {
    id: "cixin-singularity",
    title: "科幻奇点 — 刘慈欣风格科幻生成系统",
    badge: "项目负责人",
    tech: ["Qwen2.5-7B", "LoRA", "PyTorch", "SFT"],
    description: "双卡 T4 有限算力下，高效微调 Qwen2.5-7B 赋予「慈欣体」风格，端到端科幻文本生成。清洗 120 万字语料，LoRA 注入 Attention 层，可训练参数仅 0.3%，权重不足 50MB。",
    highlights: [
      "滑动窗口 + 语义切分构建 SFT 数据，风格一致性显著优于基线",
      "LoRA 微调，有限算力高效训练，可训练参数仅 0.3%",
      "获奖：辽宁省大学生智能技术应用大赛一等奖"
    ],
    hasTerminalSim: true
  },
  {
    id: "rl-racing",
    title: "基于强化学习的 3D 赛车自动驾驶系统",
    badge: "独立开发",
    tech: ["Python", "PyTorch", "Stable-Baselines3", "PPO", "Pygame"],
    description: "基于 Pygame 与物理引擎构建 3D 赛车仿真环境，并使用近端策略优化（PPO）算法训练无人驾驶智能体，实现复杂赛道下的自动避障与高效巡航。",
    highlights: [
      "环境构建：自主搭建 3D 赛车运动学模拟环境，配备多维雷达射线检测模块，实现车体与赛道边缘/障碍物的实时距离感知。",
      "策略训练：应用 SB3 中的 PPO 算法，优化转向与速度控制的连续动作空间，设计结合速度奖励与碰撞惩罚的复合奖励函数。",
      "工程优化：采用多进程并行采样环境（SubprocVecEnv），大幅加速样本收集；支持模型断点保存、续训微调与 TensorBoard 实时监控。",
      "运行成效：在复杂多弯道的赛道上实现 100% 自动绕障与稳定巡航，具备优异的控制精度与避障泛化性能。"
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
    tech: ["FastAPI", "Redis", "PostgreSQL", "pgvector", "LangGraph", "Docker"],
    description: "大模型驱动的智能云盘：文件自动归档、多模态语义检索、AI 代理自主操作。",
    highlights: [
      "沙箱工作区：Docker SDK 动态调度隔离容器，FastMCP 暴露 17 个运维工具，大模型工具调用无感鉴权",
      "RAG 链路：6 维关键词改写 + Multi-Query 并行召回 + RRF 融合 + Rerank 重排，首 Token 响应 4s",
      "存储优化：大文件分片上云、断点续传、Hash 秒传；布隆过滤器 + Redis Bitmap 权限预判"
    ],
    github: "https://github.com/TianyaSKY/SKYCloud",
    bilibiliBvid: "BV1Ez5x6kE1R"
  },
  {
    id: "sky-douyin",
    title: "SKYDouyin —— 短视频推荐系统",
    badge: "多模态内容理解与个性化推荐",
    tech: ["MySQL", "Redis", "RabbitMQ", "Milvus", "FastAPI"],
    description: "多模态大模型 + 三层用户画像 + 双路召回，构建高并发短视频推荐引擎。",
    highlights: [
      "视频标题 / 封面 / 内容联合语义向量，热门池 + 语义向量双路并行召回",
      "行为上报、画像更新、统计聚合全链路 MQ 异步解耦",
      "唯一键幂等写入保障数据库与缓存双写一致性"
    ],
    github: "https://github.com/TianyaSKY/MyDouyin"
  },
  {
    id: "sky-oj",
    title: "SKYOJ —— 在线评测系统",
    badge: "独立开发",
    tech: ["Vue3", "Flask", "Docker", "RabbitMQ", "PostgreSQL"],
    description: "基于微服务架构的在线评测平台，支持 ACM 模式、OOP 测试与数据科学评测，集成大模型辅助代码分析能力。",
    highlights: [
      "安全沙箱：Docker 容器隔离执行用户代码，限制 CPU / 内存 / 网络资源，防止恶意提交",
      "多评测模式：支持标准 ACM 对拍、OOP 单元测试、数据科学 Notebook 评分等多种判题方式",
      "AI 辅助：集成大模型对提交代码进行风格检查与错误提示，辅助教学场景"
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
    category: "计算机视觉",
    theme: "blue",
    skills: [
      { name: "OpenCV", projects: "车牌识别::利用形态学处理与边缘检测提取车牌区域 | 基于双目视觉的鱼体测量::通过极线几何与特征匹配估算真实尺寸" },
      { name: "视觉定位", projects: "单目视觉定位系统::结合相机姿态与坐标系变换，实现海上 10–15cm 精度的实时定位" },
      { name: "目标检测", projects: "人群计数::基于预训练扩散模型进行高密度人群定位与数量估算" },
      { name: "姿态识别", projects: "WHAM 关键点检测::引入 WHAM 进行 3D 人体关键点估计与运动姿态重构" },
      { name: "位姿估计", projects: "虚拟眼镜试戴::基于 YOLO-pose 提取面部关键点，结合 3D 旋转实现头部追踪与眼镜贴合" },
      { name: "三维重建", projects: "单目视觉定位系统::通过流水线方式在海面上实现三维坐标映射" },
      { name: "点云补全", projects: "扩散模型点云补全::利用预训练点云模型，以随机向量初始化并使用倒角距离优化" },
      { name: "多模态管线", projects: "SKYCloud 多模态管线::集成视觉与文本模型，构建从多模态输入到特征提取的端到端自动化分析流" }
    ]
  },
  {
    category: "AI & 大模型",
    theme: "cyan",
    skills: [
      { name: "PyTorch", projects: "深度学习架构::在 3D 赛车、单目定位及点云补全项目中负责模型构建与训练优化" },
      { name: "NLP", projects: "文本情感建模::针对推荐算法中的用户评论，提取情感特征以优化多模态推荐性能" },
      { name: "大模型微调", projects: "代码查重系统::利用大模型生成不同样本微调对比学习模型 | 科幻奇点::LoRA 技术领域知识对齐" },
      { name: "时序处理", projects: "水质预测系统::将向量化的所有站点数据结合时序模型，进行联合趋势预测" },
      { name: "Agent 架构", projects: "SKYCloud 智能体群组::使用 LangGraph 编排归档智能体，利用 OpenAI SDK 构建 RAG 知识库智能体" },
      { name: "沙盒智能体", projects: "Docker 隔离评测::结合 Docker 与 Opencode，为代码生成型智能体提供安全受限的执行环境" },
      { name: "强化学习", projects: "3D 赛车避障::构建带有雷达射线的车体环境，使用 PPO 策略优化算法训练无人驾驶与避障策略" }
    ]
  },
  {
    category: "后端工程",
    theme: "indigo",
    skills: [
      { name: "FastAPI", projects: "高性能 API::利用 FastAPI 高并发特性，为多模态智能体管线和推荐引擎提供支撑" },
      { name: "推荐系统", projects: "短视频推荐架构::综合提取用户的点赞、停留等显隐式行为数据进行协同过滤建模" },
      { name: "Redis", projects: "高速特征缓存::作为推荐系统的高速缓存层，支撑用户特征与召回列表的毫秒级读取" },
      { name: "MySQL", projects: "基础数据存储::结构化存储短视频推荐系统的用户画像属性、物品特征与历史交互日志" },
      { name: "PostgreSQL", projects: "复杂业务支撑::利用 PostgreSQL 高级特性存储 SKYCloud 与 SKYOJ 的微服务业务逻辑" },
      { name: "RabbitMQ", projects: "异步任务解耦::解耦 SKYOJ 高耗时的代码沙盒评测任务，实现异步削峰与系统高可用" },
      { name: "Docker", projects: "沙盒与服务容器化::将安全受限的智能体环境与基础服务全面容器化部署，保证资源隔离" },
      { name: "MCP 协议", projects: "SKYCloud 交互规范::基于模型上下文协议统一多智能体之间的数据传输与接口规范" }
    ]
  },
  {
    category: "编程语言",
    theme: "sky",
    skills: [
      { name: "Python", projects: "核心算法实现::主导所有的模型微调(PyTorch)、智能体流(LangGraph)与 FastAPI 后端开发" },
      { name: "Java", projects: "后端基座::参与早期业务系统、服务解耦与数据处理流的强类型开发实践" },
      { name: "SQL", projects: "数据分析支撑::编写复杂的高并发查询、数据统计分析以及核心业务表结构设计" },
      { name: "JavaScript", projects: "全栈交互设计::构建 React / Vue3 动态面板与个人主页的高级动效逻辑" }
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
