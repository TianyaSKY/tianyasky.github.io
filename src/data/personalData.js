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

// 统一项目模型：合并自旧的 researchProjects / engineeringProjects。
// 每个项目均含 cover、subtitle、stats、background、method、results、reflection、gallery、links，
// 用 image 字段保持向后兼容（legacy 字段保留，但默认渲染使用 cover/gallery）。
export const projects = [
  {
    id: "vision-positioning",
    type: "research",
    title: "单目视觉定位系统",
    subtitle: "近海 10–15cm 厘米级单目姿态估计与解算",
    badge: "国家级大创 · 第一负责人",
    category: "Computer Vision & Pose Estimation",
    cover: "./projects/vision-positioning/cover.svg",
    gallery: [
      "./projects/vision-positioning/01.svg",
      "./projects/vision-positioning/02.svg",
      "./projects/vision-positioning/03.svg"
    ],
    accent: "blue",
    bento: { size: "lg", col: 1, row: 1 },
    tech: ["Python", "PyTorch", "YOLO11", "OpenCV", "Jetson Orin"],
    description: "针对近海环境 GPS 信号易受干扰、传统 PnP 在共线杆状结构上几何退化的致命痛点，自主设计低成本单目视觉定位系统。海上实测 10–15cm RMSE 精度，26 FPS 实时解算。",
    stats: [
      { label: "RMSE 定位精度", value: "10–15 cm" },
      { label: "实时帧率", value: "26 FPS" },
      { label: "角点识别准确率", value: "96.8 %" },
      { label: "硬件平台", value: "Jetson Orin" }
    ],
    highlights: [
      "级联检测网络：YOLO11 ROI 提取 + Harris 亚像素角点精炼 + 轻量 CNN 语义识别（96.8% 准确率）",
      "非线性求解：提出光线夹角不变性几何约束，LM/TRR 双并发求解器克服共线点退化",
      "海上实操验证：大连沿海实测 10–15cm RMSE 定位精度，具备强抗光照与抗波浪抖动能力",
      "学术与知识产权：辽宁省创新创业年会三等奖 · 软件著作权《基于单目视觉的相机定位系统》"
    ],
    background:
      "渔船在近海作业时常常失去 GPS 信号或定位抖动，传统基于 GNSS 的路径记录与作业溯源就此失效；项目组观察到沿海标杆与旗杆具有「同方向、垂直分布、共线几何」的特征，恰好可以作为视觉锚点，但同一类共线几何又恰好是 PnP 求解器的退化样本。我们需要一种在低成本摄像头 + 边缘计算设备上能稳定运行的实时定位系统，且对光照、波浪晃动、雨雾具有鲁棒性。",
    method:
      "整体方案分为三层。感知层：YOLO11 提取杆状物 ROI，Harris 角点 + 亚像素精炼给出亚像素坐标，辅以轻量 CNN 做语义 ID 区分；几何层：自定义「光线夹角不变性」几何约束，把共线退化场景转成良态优化问题，给出 LM 与 Trust-Region-Reflective 双并发求解器；工程层：Jetson Orin 上 TensorRT 量化推理，端到端流水线 26 FPS，可与原渔船作业流程兼容。",
    results:
      "在大连沿海 8 个测试点位上累计采集 240 段视频、约 12 万帧图像。静态与动态工况下定位 RMSE 稳定在 10–15 厘米，相对位姿 yaw/roll 误差小于 0.6°；在 8 级阵风与小雨环境下退化不超过 18%。系统已通过辽宁省创新创业年会答辩，并获软件著作权一项。",
    reflection:
      "如果重做一次，我会把训练数据采集协议做得更前置：早期模型对镜头雾气、防水罩反光的鲁棒度不够，本质是缺数据；后续可以引入合成数据 + domain randomization 节省 2/3 的现场采集成本；同时把整套管线打包成 Docker 镜像，让渔业合作社的非工程同事也能一键升级。",
    links: {
      github: "https://github.com/TianyaSKY",
      bilibili: "BV1EBqSBcEnL"
    },
    featured: true,
    hasVisionDemo: true,
    legacyHasDemo: true
  },
  {
    id: "cixin-singularity",
    type: "research",
    title: "科幻奇点",
    subtitle: "刘慈欣风格长文本生成的轻量化 SFT",
    badge: "项目负责人",
    category: "LLM Fine-Tuning & SFT",
    cover: "./projects/cixin-singularity/cover.svg",
    gallery: [
      "./projects/cixin-singularity/01.svg",
      "./projects/cixin-singularity/02.svg",
      "./projects/cixin-singularity/03.svg"
    ],
    accent: "indigo",
    bento: { size: "md", col: 2, row: 1 },
    tech: ["Qwen2.5-7B", "LoRA", "PyTorch", "SFT"],
    description: "双卡 T4 有限算力约束下，高效微调 Qwen2.5-7B 赋能「慈欣体」风格生成。清洗 120 万字语料，LoRA 注入 Attention 层，可训练参数仅 0.3%，权重不足 50MB。",
    stats: [
      { label: "训练语料", value: "120 万字" },
      { label: "可训练参数", value: "0.3 %" },
      { label: "权重体积", value: "< 50 MB" },
      { label: "首 Token 响应", value: "< 2 s" }
    ],
    highlights: [
      "滑动窗口 + 语义切分构建高质量 SFT 训练集，文风逼真度显著超越基线大模型",
      "轻量化 LoRA 注入 Attention 投影层，显存占用降低 70%，推演响应时间 < 2s",
      "竞赛荣誉：辽宁省大学生智能技术应用大赛一等奖"
    ],
    background:
      "在做 LLM 应用的过程中我发现，「慈欣体」那种把硬科学概念、宏大时空尺度与冷峻英雄主义糅在一起的文风，是任何基础模型都模仿不出来的；这类风格如果想让模型掌握，要么用 RLHF 让 50B+ 模型自悟，要么在小模型上做指令微调。我们组没有大算力，只有两卡 T4，于是走 LoRA 微调这条路。",
    method:
      "数据侧：用自研的语料切分器把《三体》《球状闪电》等公开文本按章节与对话切片，结合「中心句识别」剔除次要叙述，得到约 120 万字高质量 SFT 数据；模型侧：在 Qwen2.5-7B 的 Attention 投影层注入 rank=16 的 LoRA，所有可训练参数占比 0.3%，权重文件约 48MB；推理侧：采用 vLLM-style 的 PagedAttention 推理，单卡 T4 上首 Token 响应 1.7 秒。",
    results:
      "在自建的「慈欣体风格一致度」盲评集上，由 12 位科幻迷做 A/B 盲评，我们的微调模型相较基座 Qwen2.5-7B 在「宏大叙事感」「硬设定感」两个维度胜出比例分别为 71% 和 68%。同一套流程后来被组里迁移到「传统武侠体」与「法庭辩论体」两个项目，可复用性强。",
    reflection:
      "两个值得改进的点：一是数据多样性，单一作家的风格迁移容易过拟合到该作家的「口头禅」上，后续应该引入多种相似风格作家并控制采样权重；二是评估，「风格一致度」目前只能用人类盲评，建议建立一套 LLM-as-a-judge 的自动评测流程，并把奖励信号直接反哺 RLHF。",
    links: {
      github: "https://github.com/TianyaSKY"
    },
    featured: true,
    hasTerminalSim: true
  },
  {
    id: "rl-racing",
    type: "research",
    title: "3D 赛车自动驾驶",
    subtitle: "雷达 + PPO 的端到端赛道巡航",
    badge: "独立开发",
    category: "Reinforcement Learning",
    cover: "./projects/rl-racing/cover.svg",
    gallery: [
      "./projects/rl-racing/01.svg",
      "./projects/rl-racing/02.svg"
    ],
    accent: "sky",
    bento: { size: "sm", col: 2, row: 2 },
    tech: ["Python", "PyTorch", "Stable-Baselines3", "PPO", "Pygame"],
    description: "基于 Pygame 与物理引擎构建 3D 赛车运动学仿真环境，结合多维雷达传感器，采用 PPO 算法训练无人驾驶智能体，实现 100% 自动绕障与最优路径巡航。",
    stats: [
      { label: "训练并行度", value: "16 env" },
      { label: "训练加速", value: "4×" },
      { label: "绕障成功率", value: "100 %" },
      { label: "奖励收敛步数", value: "≈ 2.4 M" }
    ],
    highlights: [
      "运动学环境：构建 3D 赛车物理运动模型，配备多方向雷达射线束进行毫米级边界感知",
      "复合奖励设计：设计速度与轨迹偏离度惩罚的连续动作空间 PPO 训练逻辑",
      "并行训练加速：利用 SubprocVecEnv 多进程并行采样，训练效率提升 4 倍以上"
    ],
    background:
      "我对强化学习的兴趣是从一个简单的问题开始的：如果只给赛车智能体「到下一帧我离左右墙多远、前方障碍多远」这种简单雷达信号，它能否自己学会拐弯避障？这个问题看似简单，主流 RL 库里却几乎没有轻量、可读的教学实现，所以我自己搭了一套。",
    method:
      "环境：用 Pygame + 自研运动学模型实现 3D 物理仿真，参赛车辆以 8 方向雷达射线获取前方扇区距离，构成 8 维连续状态；动作空间为 (油门、刹车、转向) 连续；算法：Stable-Baselines3 的 PPO，奖励由「当前速度 + 沿中心线偏差惩罚 + 碰撞惩罚」组成；并行：SubprocVecEnv 起 16 个进程采样，单卡 RTX 3060 上训练速度提升到原版 4 倍以上。",
    results:
      "训练 2.4M 步后策略在 5 条随机生成赛道上绕障成功率 100%、平均圈速相比纯 PID 基线提升 22%。训练好的策略可直接部署到同一仿真环境实时推理，单帧耗时 2.6 毫秒。",
    reflection:
      "下一步我打算引入课程学习（curriculum learning）让智能体从短直道逐步过渡到复杂弯道，期望能再压低 10% 圈速；同时把雷达信号换成像车载 LiDAR 一样的扇区点云，观察策略迁移性。",
    links: {
      github: "https://github.com/TianyaSKY/RacingCar",
      bilibili: "BV1EBqSBcEnL"
    },
    featured: false,
    bilibiliBvid: "BV1EBqSBcEnL"
  },
  {
    id: "sky-cloud",
    type: "engineering",
    title: "SKYCloud",
    subtitle: "AI 原生云盘：智能归档 + 多模态语义搜索",
    badge: "中软国际 AI 挑战赛省一等奖",
    category: "AI Agent & RAG Architecture",
    cover: "./projects/sky-cloud/cover.svg",
    gallery: [
      "./projects/sky-cloud/01.svg",
      "./projects/sky-cloud/02.svg",
      "./projects/sky-cloud/03.svg"
    ],
    accent: "cyan",
    bento: { size: "lg", col: 1, row: 2 },
    tech: ["FastAPI", "Redis", "PostgreSQL", "pgvector", "LangGraph", "Docker"],
    description: "大模型驱动的智能云盘系统：文件智能自动归档、多模态语义搜索、沙箱智能体自主运维。",
    stats: [
      { label: "运维工具数", value: "17 个" },
      { label: "首 Token 响应", value: "4 s" },
      { label: "秒传分片大小", value: "8 MB" },
      { label: "权限校验", value: "Bloom + Redis" }
    ],
    highlights: [
      "沙箱工作区：Docker SDK 动态调度隔离容器，FastMCP 暴露 17 个运维工具，大模型无感鉴权",
      "RAG 混合召回：6 维关键词改写 + Multi-Query 并行召回 + RRF 融合 + Rerank 重排，首 Token 响应 4s",
      "海量存储：大文件分片秒传、断点续传；布隆过滤器 + Redis Bitmap 实现高并发权限预判"
    ],
    background:
      "国内云盘普遍把 AI 当「营销关键词」，但真正能让 AI 帮你管文件——自动归档、智能搜索、甚至让 AI 自己进沙箱修 bug——几乎没有产品。我们想做的是把 AI 真正当成云盘的一等公民，而不是搜索框里的一个小开关。",
    method:
      "整体三段式：存储层用 FastAPI + PostgreSQL/pgvector，前端 React，后台用 LangGraph + FastMCP 把 17 个运维工具暴露给大模型，并封装成 Docker 沙箱；搜索层做 6 维关键词改写 + Multi-Query 并行召回 + RRF 融合 + Rerank 重排；权限层用布隆过滤器前置黑白名单 + Redis Bitmap 二级缓存，让 90% 请求零数据库 IO。",
    results:
      "实际运行后，用户从「在万千 PDF 里翻一份发票」变成「和 AI 对话：『把 Q3 报销里所有超过 1000 元的发票汇总成一张表』」；首 Token 响应 4 秒，权限校验 95% 走布隆缓存，秒传命中率 78%。该项目拿到中软国际 AI 挑战赛辽宁赛区一等奖。",
    reflection:
      "目前最大的痛点是工具调用错误率随工具数量上升而指数级膨胀（17 个工具 → 9% 错调），下一步要做的两件事：一是把工具描述做语义 embedding 化，让模型按相似度选工具而不是按字符串匹配；二是引入用户级「确认模式」，高风险操作必须人工二次确认。",
    links: {
      github: "https://github.com/TianyaSKY/SKYCloud",
      bilibili: "BV1Ez5x6kE1R"
    },
    featured: true,
    bilibiliBvid: "BV1Ez5x6kE1R"
  },
  {
    id: "sky-douyin",
    type: "engineering",
    title: "SKYDouyin",
    subtitle: "多模态召回 + 三层画像的短视频推荐引擎",
    badge: "多模态推荐引擎",
    category: "High Performance Backend",
    cover: "./projects/sky-douyin/cover.svg",
    gallery: [
      "./projects/sky-douyin/01.svg",
      "./projects/sky-douyin/02.svg"
    ],
    accent: "indigo",
    bento: { size: "md", col: 1, row: 3 },
    tech: ["MySQL", "Redis", "RabbitMQ", "Milvus", "FastAPI"],
    description: "多模态大模型 + 三层用户画像 + 双路召回，构建毫秒级高并发短视频推荐引擎。",
    stats: [
      { label: "召回双路", value: "向量 + 热门" },
      { label: "消息解耦", value: "RabbitMQ 削峰" },
      { label: "画像层级", value: "3 层" },
      { label: "缓存击穿防护", value: "Redis 单飞" }
    ],
    highlights: [
      "多模态向量化：联合视频标题、封面与音频语义向量，基于 Milvus 实现向量 + 热门双路召回",
      "消息队列解耦：用户行为上报、实时画像更新与统计聚合全链路 RabbitMQ 削峰解耦",
      "高可用存储：唯一键幂等写入与 Redis 缓存击穿防护，保障双写一致性"
    ],
    background:
      "我想做一个真正能模拟「抖音推荐」复杂度的玩具项目：从客户端上报行为，到后台实时聚合用户画像，再到在线推理召回，每一环都不能省。真实的工业推荐我会做不动，但把每一层的关键决策都跑通，可以用来给自己做教学演示。",
    method:
      "三层画像：实时层（最近 5 分钟行为，落 Redis）、短期层（最近 24 小时，落 MySQL 分区）、长期层（兴趣标签与稳定特征，落 Milvus）。召回层先 Milvus 向量召回 1000 条，再与热门池按比例融合；消费层 RabbitMQ 接住客户端行为上报，多个 consumer 异步聚合到不同画像层。",
    results:
      "在自建的 10 万条视频 + 5000 模拟用户的 demo 上，端到端 P99 推荐响应 85ms；用户停留时长模拟信号相比随机推荐提升 2.7 倍。多模态向量比纯文本向量在冷启动用户上的 CTR 高 18%。",
    reflection:
      "该项目我最有成就感的是把整个推荐链路「真实可跑」，但最不满意的是排序模型仍是 LR，缺少交叉特征；下一步会接入 DeepFM，并且把模型上线从「导出 + 在线加载」改成 Triton Inference Server，保证线上线下一致。",
    links: {
      github: "https://github.com/TianyaSKY/MyDouyin"
    },
    featured: false
  },
  {
    id: "sky-oj",
    type: "engineering",
    title: "SKYOJ",
    subtitle: "支持 ACM/OOP/Notebook 的在线评测与教学平台",
    badge: "独立开发",
    category: "Microservice Platform",
    cover: "./projects/sky-oj/cover.svg",
    gallery: [
      "./projects/sky-oj/01.svg",
      "./projects/sky-oj/02.svg"
    ],
    accent: "blue",
    bento: { size: "tall", col: 2, row: 2 },
    tech: ["Vue3", "Flask", "Docker", "RabbitMQ", "PostgreSQL"],
    description: "基于微服务架构的在线评测平台，支持 ACM 判题、OOP 测试与 Notebook 数据科学评测，集成 LLM 智能代码分析。",
    stats: [
      { label: "支持评测模式", value: "3 种" },
      { label: "沙箱隔离", value: "Docker + cgroup" },
      { label: "判题并发", value: "32 worker" },
      { label: "AI 教学辅助", value: "✓" }
    ],
    highlights: [
      "Docker 安全沙箱：容器隔离执行用户提交代码，严格限制 CPU/内存/网络权限，杜绝恶意脚本",
      "多模式评测：支持 ACM 标准对拍、OOP 单元测试以及 Jupyter Notebook 自动化评分",
      "AI 教学辅助：接入大模型对错误代码进行静态分析与优化诊断建议"
    ],
    background:
      "学院的 OJ 系统大多是十多年前的，UI 难看，扩展性差，更别说支持数据科学作业。我做这个项目最初是想给我们学院内部用：让老师能直接配置 OJ 作业，让 AI 帮学生 debug，让数据科学课的 Notebook 也能自动评分。",
    method:
      "架构分四层：API 网关 (Vue3 + Flask)，任务编排（RabbitMQ），判题 worker（Docker + cgroup + seccomp），评测结果聚合（PostgreSQL）。OJ 模式可插拔：ACM 标准 I/O 对拍、OOP 单测模式、Jupyter Notebook 走 nbgrader 协议评分。AI 教学辅助接自家 Qwen 微调模型，给出错误诊断 + 优化建议。",
    results:
      "学院 CS101/CS102 课程当年直接接入该 OJ，覆盖约 280 名学生、5000+ 次提交，平均判题时延 4.6 秒。沙箱在 5 次「红队测试」中成功阻断所有 fork-bomb / 网络探测 / 容器逃逸尝试。",
    reflection:
      "重做的话我想把判题 worker 改造成 K8s 上的 Job，让高峰期自动扩容；把 AI 教学辅助从「报错后调用」改成「提交前先解释」会更受欢迎；还要给非 CS 课程（数学建模、工科实验）预留更通用的评测模式。",
    links: {
      github: "https://github.com/TianyaSKY/SKYOJ"
    },
    featured: false
  }
];

// 兼容旧 import 名
export const researchProjects = projects.filter((p) => p.type === "research");
export const engineeringProjects = projects.filter((p) => p.type === "engineering");

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
