// 全站统一深度检索数据集 (Comprehensive Search Dataset)
// 聚合了科研、工程、开源项目、深度章节、专项技术栈技能、竞赛与荣誉、高分课程以及全局导航直达

export const searchCategories = [
  { id: 'all', label: '全部', enLabel: 'All' },
  { id: 'research', label: '科研论文', enLabel: 'Research' },
  { id: 'engineering', label: '工程系统', enLabel: 'Engineering' },
  { id: 'opensource', label: '开源社区', enLabel: 'Open Source' },
  { id: 'skill', label: '技能与工具', enLabel: 'Skills' },
  { id: 'award', label: '竞赛与课程', enLabel: 'Awards & Edu' },
  { id: 'nav', label: '快捷直达', enLabel: 'Navigation' }
];

export const searchDataset = [
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 1. 科研项目与深度章节 (Research & Deep Sections)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "proj-vision-positioning",
    category: "research",
    type: "Research",
    title: "单目视觉三维坐标重建系统",
    subtitle: "级联神经网络 · 射线夹角几何约束 · 现场 10–15cm 实测精度",
    description: "针对近海与弱 GPS 环境下传统 PnP 几何退化问题，提出 YOLO 掩膜 + Harris 提取 + 9 分类 Patch CNN 级联感知与反投影射线夹角非线性优化算法。",
    tags: ["Python", "PyTorch", "YOLO11", "OpenCV", "Jetson Orin", "位姿估计", "非线性最小二乘", "国家级大创", "大创论文", "软著", "3D视觉", "三维重建"],
    aliases: ["dmwz", "wz", "mono", "pnp", "danmu", "vision", "positioning", "cascaded"],
    badge: "国家级大创 · 论文与软著",
    href: "/projects/vision-positioning"
  },
  {
    id: "section-vision-pipeline",
    category: "research",
    type: "Research",
    title: "单目定位 · 五级级联检测流水线",
    subtitle: "YOLO 区域粗检 → Harris 角点 → 9 分类 Patch CNN → NMS 亚像素精炼",
    description: "将特征点搜索空间压缩 95% 以上，彻底解决无纹理场景下的 2D-3D 数据关联歧义问题。",
    tags: ["级联感知", "Harris", "Patch CNN", "NMS", "亚像素", "单目定位"],
    aliases: ["jilian", "harris", "patchcnn", "subpix", "pipeline"],
    badge: "核心算法章节",
    href: "/projects/vision-positioning#sec-pipeline"
  },
  {
    id: "section-vision-math",
    category: "research",
    type: "Research",
    title: "单目定位 · 射线夹角守恒公式与非线性优化",
    subtitle: "反投影单位方向向量夹角残差推导 · LM 与 TRF 双优化引擎",
    description: "将 6-DoF 耦合解算退化问题转化为 3-DoF 良态非线性最小二乘相机位置优化。",
    tags: ["反投影", "射线夹角", "LM算法", "TRF", "数学公式", "非线性最小二乘"],
    aliases: ["shexian", "jiage", "nlls", "levenberg", "gongshi", "math"],
    badge: "数学推导章节",
    href: "/projects/vision-positioning#sec-math"
  },
  {
    id: "section-vision-experiments",
    category: "research",
    type: "Research",
    title: "单目定位 · 消融实验与大连沿海海试评测",
    subtitle: "100% 解算成功率 · 1.1×10⁻⁵ m 理论重构精度 · 26 FPS 边缘端部署",
    description: "在仿真基准与大连沿海现场实测中取得 10-15cm RMSE 高可靠定位精度验证。",
    tags: ["消融实验", "海试", "Jetson Orin", "FPS", "精度评测", "Benchmark"],
    aliases: ["xiaorong", "haishi", "orin", "rmse", "shiyan"],
    badge: "实验评测章节",
    href: "/projects/vision-positioning#sec-experiments"
  },
  {
    id: "proj-crowd-sigmod",
    category: "research",
    type: "Research",
    title: "YOLO-PGMD 人群计数系统",
    subtitle: "概率引导注意力 · 积分守恒密度图 · 4 大公开基准通用评测",
    description: "针对密集人群大尺度跨度与极端遮挡难题，设计基于 YOLO 多尺度特征的概率引导密度图（PGMD）估计网络，ShanghaiTech A 取得 48.13 MAE。",
    tags: ["PyTorch", "Ultralytics YOLO", "PG-Attention", "ECA Net", "Smooth L1", "Tile Inference", "人群计数", "密度估计", "ShanghaiTech", "JHU-Crowd", "目标检测"],
    aliases: ["pgmd", "crowd", "yolo", "sigmoid", "sigmod", "renqun", "jishu", "density"],
    badge: "独立研发 · 计算机视觉",
    href: "/projects/crowd-sigmod"
  },
  {
    id: "section-crowd-pipeline",
    category: "research",
    type: "Research",
    title: "YOLO-PGMD · 概率引导注意力 (PG-Attention)",
    subtitle: "空间概率先验 + MSR 空洞残差细化 · Stride-4 (160×160) 高分辨率输出",
    description: "融合 BCE 与 Dice 空间概率约束，结合 ECA 注意力通道增强多尺度人群特征。",
    tags: ["PG-Attention", "Dice Loss", "ECA Net", "MSR", "人群计数架构"],
    aliases: ["pgattention", "gailv", "zhuyili", "eca", "msr"],
    badge: "模型架构章节",
    href: "/projects/crowd-sigmod#sec-pipeline"
  },
  {
    id: "section-crowd-math",
    category: "research",
    type: "Research",
    title: "YOLO-PGMD · 积分守恒高斯密度图数学定义",
    subtitle: "边缘截断重归一化高斯核推导 · 积分总和严格等于人头总数 ΣD = N",
    description: "解决传统高斯密度图在图像边缘能量泄漏导致的计数系统性偏小问题。",
    tags: ["积分守恒", "高斯核", "能量泄露", "数学推导", "密度图"],
    aliases: ["jifen", "shouheng", "gaosi", "midutu", "math"],
    badge: "数学推导章节",
    href: "/projects/crowd-sigmod#sec-math"
  },
  {
    id: "section-crowd-experiments",
    category: "research",
    type: "Research",
    title: "YOLO-PGMD · 4 大国际基准评测 (ShanghaiTech / JHU / UCF)",
    subtitle: "ShanghaiTech A 48.13 MAE · Part B 13.20 MAE · JHU-Crowd 39.73 MAE",
    description: "全面对比 SOTA 方法，验证了网络在跨域光照变化与极端密集场景下的泛化能力。",
    tags: ["ShanghaiTech", "JHU-Crowd", "UCF-QNRF", "MAE", "RMSE", "SOTA对比"],
    aliases: ["shanghaitech", "jhu", "ucf", "mae", "sota", "pingce"],
    badge: "实验评测章节",
    href: "/projects/crowd-sigmod#sec-experiments"
  },
  {
    id: "proj-cixin-singularity",
    category: "research",
    type: "Research",
    title: "科幻奇点 — 慈欣体生成",
    subtitle: "Qwen3.6-27B · 4bit QLoRA · 单卡 RTX 5090 文风续写",
    description: "单卡 RTX 5090（32GB）上以 4bit NF4 QLoRA 微调 Qwen3.6-27B，2375 条刘慈欣续写样本教会模型接上文续写并保持硬科幻冷峻文风。",
    tags: ["Qwen3.6-27B", "4bit NF4", "LoRA", "SFT", "微调", "大语言模型", "大模型", "trl", "RTX 5090", "刘慈欣", "三体", "科幻"],
    aliases: ["khqd", "cixin", "singularity", "qwen", "lora", "sft", "weidiao", "llm", "ai"],
    badge: "项目负责人 · LLM 微调",
    href: "/projects/cixin-singularity"
  },
  {
    id: "section-cixin-terminal",
    category: "research",
    type: "Research",
    title: "科幻奇点 · 交互式刘慈欣文风生成终端 (Live Demo)",
    subtitle: "内置二向箔降维打击、水滴穿透阵列、面壁者广播等预设指令",
    description: "在 Web 端直接体验 Qwen-27B LoRA 微调后生成的硬科幻文风长文本与思维链。",
    tags: ["终端", "交互Demo", "二向箔", "水滴", "面壁者", "在线体验"],
    aliases: ["demo", "zhongduan", "erxiangbo", "shuidi", "tiyan"],
    badge: "交互终端 Demo",
    href: "/projects/cixin-singularity#sec-pipeline"
  },
  {
    id: "proj-rl-racing",
    category: "research",
    type: "Research",
    title: "3D 赛车自动驾驶系统",
    subtitle: "Gymnasium · PPO · 9 向雷达与 16 维状态空间",
    description: "从零搭建兼容 Gymnasium 的 3D 赛车仿真环境，编码位置、姿态、速度与 9 向障碍雷达为 16 维观察，使用 PPO 在 8 子进程中并行训练。",
    tags: ["Python", "Gymnasium", "Stable-Baselines3", "PPO", "Pygame", "OpenGL", "强化学习", "自动驾驶", "环境设计", "连续控制"],
    aliases: ["rl", "racing", "ppo", "saiche", "qianghuaxuexi", "sb3", "gym", "autonomous"],
    badge: "独立开发 · 开源",
    href: "/projects/rl-racing"
  },
  {
    id: "section-rl-env",
    category: "research",
    type: "Research",
    title: "3D 赛车 · Gymnasium 仿真环境与 9 向雷达观测空间",
    subtitle: "16 维状态编码 · 7 个离散动作空间 · 8 进程并行异步采样",
    description: "包含赛道边界检测、曲率感知、连续平滑奖励函数设计与碰撞惩罚机制。",
    tags: ["环境设计", "9向雷达", "观测空间", "奖励函数", "强化学习"],
    aliases: ["huanjing", "leida", "guance", "jiangli", "sheji"],
    badge: "算法设计章节",
    href: "/projects/rl-racing#sec-pipeline"
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 2. 工程系统与架构 (Engineering & Systems)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "proj-sky-cloud",
    category: "engineering",
    type: "Engineering",
    title: "SKYCloud AI Workspace",
    subtitle: "把云存储、知识库与受控 Agent 合并为一个 AI 工作区",
    description: "面向个人与团队的 AI Workspace：串联分片上传、RAG 多路召回、双模式助手、独立 Docker 工作区与 FastMCP 服务，实现文件检索与代码运行。",
    tags: ["Vue 3", "FastAPI", "PostgreSQL", "pgvector", "RabbitMQ", "FastMCP", "Docker", "OpenCode", "RAG", "Agent", "知识库", "云盘"],
    aliases: ["skycloud", "cloud", "workspace", "rag", "mcp", "fastapi", "docker", "gongzuoqu"],
    badge: "中软国际 AI 挑战赛省一等奖",
    href: "/projects/sky-cloud"
  },
  {
    id: "section-skycloud-mcp",
    category: "engineering",
    type: "Engineering",
    title: "SKYCloud · FastMCP 协议与 16 智能体工具集成",
    subtitle: "16 Tool / 4 Prompt / 2 Resource · 受控 OpenCode 运行时 · 代码 Diff",
    description: "让大模型不仅能回答文件内容，还能在授权边界内编辑文件、执行脚本并安全返回 Diff。",
    tags: ["FastMCP", "MCP", "智能体工具", "代码执行", "OpenCode", "Diff"],
    aliases: ["mcp", "tools", "gongju", "opencode", "daima"],
    badge: "系统架构章节",
    href: "/projects/sky-cloud#sec-pipeline"
  },
  {
    id: "section-skycloud-rag",
    category: "engineering",
    type: "Engineering",
    title: "SKYCloud · RAG 知识库多路召回与重排机制",
    subtitle: "6 维问题改写 + Multi-Query 向量检索 + RRF 融合 + 交叉重排",
    description: "基于 PostgreSQL 与 pgvector 的 1024 维密集语义索引，实现企业级知识精准召回。",
    tags: ["RAG", "pgvector", "PostgreSQL", "RRF", "重排", "MultiQuery", "知识库"],
    aliases: ["rag", "pgvector", "zhaohui", "chongpai", "zhishiku"],
    badge: "检索链路章节",
    href: "/projects/sky-cloud#sec-math"
  },
  {
    id: "proj-sky-douyin",
    category: "engineering",
    type: "Engineering",
    title: "SKYDouyin 短视频推荐闭环",
    subtitle: "Spring Boot 3 + FastAPI + Milvus + RabbitMQ 推荐链路",
    description: "围绕短视频真实数据流搭建完整 MVP：客户端上传播放与行为上报，Spring Boot 业务服务，FastAPI 生成特征向量，Milvus 向量召回，冷启动均值向量。",
    tags: ["React 18", "Spring Boot 3", "FastAPI", "MySQL", "Redis", "RabbitMQ", "Milvus", "推荐系统", "短视频", "向量检索", "冷启动", "高并发"],
    aliases: ["skydouyin", "douyin", "tuijian", "recommendation", "milvus", "springboot", "duanshipin"],
    badge: "端到端推荐系统 MVP",
    href: "/projects/sky-douyin"
  },
  {
    id: "section-douyin-pipeline",
    category: "engineering",
    type: "Engineering",
    title: "SKYDouyin · 推荐系统数据链路与特征工程",
    subtitle: "Spring Boot 业务事实表 + RabbitMQ 事件总线 + Milvus 向量召回",
    description: "用户点赞、播放时长、完播率实时流式接入，构建动态兴趣偏好特征向量。",
    tags: ["推荐链路", "Milvus", "RabbitMQ", "特征工程", "实时流"],
    aliases: ["tuijianxianlu", "shujuliu", "tezheng", "shishiliu"],
    badge: "系统架构章节",
    href: "/projects/sky-douyin#sec-pipeline"
  },
  {
    id: "proj-sky-oj",
    category: "engineering",
    type: "Engineering",
    title: "SKYOJ 在线评测平台",
    subtitle: "ACM / OOP / Kaggle 多模式评测 · Docker 安全隔离沙箱",
    description: "高校编程与数据科学教学 AI 评测平台：支持 ACM I/O、OOP 单元测试与 Kaggle 自定义评分，Celery 异步队列在禁网资源受限 Docker 中安全判题。",
    tags: ["Vue 3", "FastAPI", "MySQL", "RabbitMQ", "Celery", "Docker", "Nginx", "在线判题", "安全沙箱", "OJ", "评测系统", "异步架构"],
    aliases: ["skyoj", "oj", "judge", "panti", "sandbox", "docker", "acm", "kaggle"],
    badge: "独立开发 · 开源",
    href: "/projects/sky-oj"
  },
  {
    id: "section-skyoj-sandbox",
    category: "engineering",
    type: "Engineering",
    title: "SKYOJ · Docker 安全沙箱与资源配额隔离",
    subtitle: "network=none 禁网 · CPU/内存/PID 硬限制 · 防止恶意代码逃逸",
    description: "保障高校实验判题与数据科学评测在受控隔离容器中高并发毫秒级执行。",
    tags: ["Docker沙箱", "安全隔离", "资源配额", "禁网", "判题引擎"],
    aliases: ["shaxiang", "anquan", "geli", "peie", "docker"],
    badge: "安全架构章节",
    href: "/projects/sky-oj#sec-experiments"
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 3. 开源社区与仓库 (Open Source Repos)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "open-skycity",
    category: "opensource",
    type: "Open Source",
    title: "SKYCity · LLM 驱动的 AI 小镇仿真",
    subtitle: "9 位自主居民 · 记忆关系演化 · 自运转经济闭环",
    description: "基于多智能体架构构建的虚拟小镇，居民拥有自主对话、记忆检索、关系演化与日常作息行为机制，支持 PixiJS 瓦片地图可视化交互。",
    tags: ["Python", "FastAPI", "PixiJS", "LLM Agent", "Multi-Agent", "多智能体", "小镇仿真", "记忆图谱", "开源"],
    aliases: ["skycity", "city", "xiaozhen", "town", "multiagent", "agent", "simulation"],
    badge: "GitHub 开源仓库",
    href: "https://github.com/TianyaSKY/SKYCity"
  },
  {
    id: "open-nonameskill",
    category: "opensource",
    type: "Open Source",
    title: "NonameSkill · 扩展开发代码检索工具",
    subtitle: "SQLite 双数据源 · 6 维多路改写检索 · 开发者高效插件",
    description: "专为无名杀扩展生态打造的代码与 API 高效检索助手，采用 SQLite 双数据源与多路改写召回，极大提升开发者编写技能脚本的效率。",
    tags: ["Python", "SQLite", "RAG", "全文检索", "插件工具", "无名杀", "扩展开发", "开源"],
    aliases: ["nonameskill", "noname", "skill", "wumingsha", "chajian", "sousuo"],
    badge: "GitHub 开源仓库",
    href: "https://github.com/TianyaSKY/NonameSkill"
  },
  {
    id: "open-rl-racing-repo",
    category: "opensource",
    type: "Open Source",
    title: "RL-Racing · 3D 赛车强化学习仿真源码",
    subtitle: "基于 Gymnasium 与 Stable-Baselines3 的完整训练评估代码",
    description: "开源 3D 赛车控制仿真环境，包含环境构建、PPO 训练脚本、多进程并行采样与 Pygame/OpenGL 可视化回放代码。",
    tags: ["Gymnasium", "Stable-Baselines3", "Pygame", "OpenGL", "Python", "开源代码"],
    aliases: ["rlracing", "racingrepo", "gymcode", "sb3code"],
    badge: "GitHub 开源仓库",
    href: "https://github.com/TianyaSKY/RL-Racing"
  },
  {
    id: "open-homepage-repo",
    category: "opensource",
    type: "Open Source",
    title: "TianyaSKY.github.io · 个人学术主页源码",
    subtitle: "React 19 + Vite + KaTeX + Bento Grid + Editorial Typography",
    description: "本项目开源代码仓库，采用学术报刊版式设计、全站命令板检索、KaTeX 数学排版与 Canvas 背景交互。",
    tags: ["React 19", "Vite", "KaTeX", "Bento", "Tailwind", "CSS", "开源代码"],
    aliases: ["homepage", "portfolio", "githubio", "tianyasky", "daima"],
    badge: "GitHub 开源仓库",
    href: "https://github.com/TianyaSKY/TianyaSKY.github.io"
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 4. 专项技能与技术栈 (Specific Skills & Tech Stack)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "skill-pytorch",
    category: "skill",
    type: "Skill",
    title: "PyTorch 深度学习框架",
    subtitle: "单目视觉定位 · YOLO-PGMD · PPO 赛车强化学习 · 特征向量生成",
    description: "熟练使用 PyTorch 完成多尺度卷积神经网络、注意力机制、自定义损失函数（Dice/BCE/Smooth L1）与模型训练调优。",
    tags: ["PyTorch", "Deep Learning", "深度学习", "模型训练", "CNN", "注意力机制"],
    aliases: ["pytorch", "torch", "shenduxuexi", "nn"],
    badge: "核心技术栈",
    href: "#skills"
  },
  {
    id: "skill-yolo",
    category: "skill",
    type: "Skill",
    title: "YOLO 目标检测与姿态估计 (YOLO11 / YOLO-pose)",
    subtitle: "杆状标志物 ROI 掩膜提取 · 人群密度特征抽取 · 头部姿态追踪",
    description: "掌握 Ultralytics YOLO 模型轻量化剪枝、微调训练、导出 ONNX/TensorRT 与多尺度特征图融合技巧。",
    tags: ["YOLO", "YOLO11", "YOLO-pose", "目标检测", "Ultralytics", "ONNX", "TensorRT"],
    aliases: ["yolo", "yolo11", "mubiaojiance", "detection"],
    badge: "核心技术栈",
    href: "#skills"
  },
  {
    id: "skill-opencv",
    category: "skill",
    type: "Skill",
    title: "OpenCV 计算机视觉与几何处理",
    subtitle: "Harris 角点提取 · 亚像素 cornerSubPix 精炼 · 几何透视反投影 · 图像标定",
    description: "具备扎实的图像矩阵运算、相机内参畸变矫正、形态学滤波与空间几何映射编程能力。",
    tags: ["OpenCV", "Harris", "亚像素", "图像处理", "相机标定", "几何解算"],
    aliases: ["opencv", "cv2", "tuxiangchuli", "harris"],
    badge: "核心技术栈",
    href: "#skills"
  },
  {
    id: "skill-fastapi",
    category: "skill",
    type: "Skill",
    title: "FastAPI 异步微服务架构",
    subtitle: "SKYCloud、SKYOJ 与 SKYCity 核心后端服务 · 高吞吐异步 API",
    description: "熟练使用 Python async/await、Pydantic 模式校验、依赖注入与多进程异步任务调度。",
    tags: ["FastAPI", "Python", "异步", "RESTful", "Swagger", "后端架构"],
    aliases: ["fastapi", "yibu", "api", "pydantic"],
    badge: "核心技术栈",
    href: "#skills"
  },
  {
    id: "skill-docker",
    category: "skill",
    type: "Skill",
    title: "Docker 容器化与安全沙箱",
    subtitle: "SKYOJ 代码判题沙箱 · SKYCloud OpenCode Runtime · 隔离部署",
    description: "熟练编写 Dockerfile、网络模式隔离 (network=none)、CPU/内存硬限额配置与容器运行时管理。",
    tags: ["Docker", "容器化", "安全沙箱", "资源隔离", "Dockerfile", "Runtime"],
    aliases: ["docker", "rongqi", "shaxiang", "isolation"],
    badge: "核心技术栈",
    href: "#skills"
  },
  {
    id: "skill-milvus",
    category: "skill",
    type: "Skill",
    title: "Milvus 向量数据库与特征召回",
    subtitle: "SKYDouyin 亿级视频特征召回 · IVF_FLAT / HNSW 向量索引 · 相似度检索",
    description: "精通向量数据库集合管理、Partition 分区、标量过滤结合向量检索的高性能架构设计。",
    tags: ["Milvus", "向量数据库", "HNSW", "相似度检索", "特征召回", "推荐系统"],
    aliases: ["milvus", "xiangliang", "vector", "hnsw"],
    badge: "核心技术栈",
    href: "#skills"
  },
  {
    id: "skill-redis",
    category: "skill",
    type: "Skill",
    title: "Redis 高性能缓存与分布式协同",
    subtitle: "用户兴趣冷启动 · 推荐热点缓存 · 权限 Token · 判题状态同步",
    description: "熟练使用 Redis 字符串、哈希、ZSet 排行榜、Bitmap 与分布式锁保障高并发稳定运行。",
    tags: ["Redis", "缓存", "ZSet", "分布式锁", "高并发", "NoSQL"],
    aliases: ["redis", "huancun", "nosql", "gaobingfa"],
    badge: "核心技术栈",
    href: "#skills"
  },
  {
    id: "skill-rabbitmq-celery",
    category: "skill",
    type: "Skill",
    title: "RabbitMQ & Celery 异步任务队列",
    subtitle: "判题任务异步调度 · 推荐事件总线 · 文件异步索引解耦",
    description: "熟练配置 Direct/Topic 交换机、死信队列、任务重试机制与 Celery 异步工作节点监控。",
    tags: ["RabbitMQ", "Celery", "消息队列", "异步解耦", "事件总线", "任务调度"],
    aliases: ["rabbitmq", "celery", "xiaoxi", "duilie", "mq"],
    badge: "核心技术栈",
    href: "#skills"
  },
  {
    id: "skill-rag-pgvector",
    category: "skill",
    type: "Skill",
    title: "RAG 多路召回与 pgvector 向量检索",
    subtitle: "6 维问题改写 · Multi-Query 向量扩展 · RRF 排名融合 · 交叉重排",
    description: "在 PostgreSQL 中集成 pgvector，构建 1024 维密集语义索引并结合关键词全文检索。",
    tags: ["RAG", "pgvector", "PostgreSQL", "RRF", "知识召回", "语义检索"],
    aliases: ["rag", "pgvector", "zhaohui", "chongpai"],
    badge: "核心技术栈",
    href: "#skills"
  },
  {
    id: "skill-fastmcp-agent",
    category: "skill",
    type: "Skill",
    title: "FastMCP 智能体协议与 Tool Runtime",
    subtitle: "16 Tool / 4 Prompt / 2 Resource · 代码执行 · 沙箱交互与状态管理",
    description: "基于 Anthropic MCP 协议标准实现大模型外部工具调用与受控工作区环境对接。",
    tags: ["FastMCP", "MCP", "Agent", "智能体", "工具调用", "大模型工程"],
    aliases: ["mcp", "fastmcp", "agent", "zhinengti", "tools"],
    badge: "核心技术栈",
    href: "#skills"
  },
  {
    id: "skill-lora-sft",
    category: "skill",
    type: "Skill",
    title: "LLM LoRA / QLoRA 风格微调",
    subtitle: "Qwen3.6-27B 4bit NF4 微调 · 0.039% 参数量高效对齐 · trl / PEFT",
    description: "熟练使用 Hugging Face PEFT、trl、bitsandbytes 进行单卡显存优化微调与文风对齐。",
    tags: ["LoRA", "QLoRA", "SFT", "微调", "Qwen", "PEFT", "trl", "大语言模型"],
    aliases: ["lora", "qlora", "sft", "weidiao", "peft"],
    badge: "核心技术栈",
    href: "#skills"
  },
  {
    id: "skill-ppo-rl",
    category: "skill",
    type: "Skill",
    title: "强化学习 (PPO) 与 Gymnasium 环境构建",
    subtitle: "16 维观察空间 · 7 个离散动作 · 8 进程并行采样 · Stable-Baselines3",
    description: "掌握 PPO / SAC 算法原理、连续与离散空间控制、奖励塑形与并行向量化训练环境搭建。",
    tags: ["强化学习", "PPO", "Gymnasium", "Stable-Baselines3", "自动驾驶", "RL"],
    aliases: ["ppo", "rl", "qianghuaxuexi", "sb3", "gym"],
    badge: "核心技术栈",
    href: "#skills"
  },
  {
    id: "skill-springboot-java",
    category: "skill",
    type: "Skill",
    title: "Java & Spring Boot 3 企业级微服务",
    subtitle: "SKYDouyin 业务真相服务 · MyBatis-Plus · MySQL · 分布式事务",
    description: "具备 Spring Boot 3、Spring Security、RESTful 接口开发与 MySQL 关系数据库设计能力。",
    tags: ["Java", "Spring Boot", "MyBatis", "MySQL", "后端开发", "企业级"],
    aliases: ["java", "springboot", "mybatis", "mysql"],
    badge: "核心技术栈",
    href: "#skills"
  },
  {
    id: "skill-vue-react",
    category: "skill",
    type: "Skill",
    title: "Vue 3 / React 现代前端工程",
    subtitle: "响应式组合式 API · React Router 7 · Vite 构建 · Tailwind / 自定义设计系统",
    description: "熟练运用 Vue 3 Pinia、React 18/19 Hooks、Lucide 图标库与 KaTeX 公式渲染构建复杂 Web 界面。",
    tags: ["Vue 3", "React", "JavaScript", "前端工程", "Vite", "响应式"],
    aliases: ["vue", "react", "qianduan", "vite", "javascript"],
    badge: "核心技术栈",
    href: "#skills"
  },
  {
    id: "skill-jetson-orin",
    category: "skill",
    type: "Skill",
    title: "Jetson Orin 边缘端嵌入式部署与加速",
    subtitle: "26 FPS 实时单目几何解算 · TensorRT / CUDA 加速 · 海上实测",
    description: "具备 NVIDIA Jetson 边缘计算平台系统搭建、OpenCV/PyTorch 硬加速及现场软硬件联调能力。",
    tags: ["Jetson Orin", "嵌入式", "边缘计算", "TensorRT", "CUDA", "硬件加速"],
    aliases: ["jetson", "orin", "qianrushi", "cuda"],
    badge: "核心技术栈",
    href: "#skills"
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 5. 竞赛荣誉与核心课程 (Awards & Courses)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "award-lanqiao",
    category: "award",
    type: "Award",
    title: "第 17 届蓝桥杯全国总决赛一等奖",
    subtitle: "Python 软件开发大学组 · 全国第 10 名 (2026)",
    description: "在全国数万名参赛高校选手中脱颖而出，以扎实的高阶算法设计、复杂数据结构与高效解题能力荣获全国一等奖（全国第 10 名）。",
    tags: ["蓝桥杯", "全国一等奖", "国一", "算法竞赛", "Python", "全国第10名", "荣誉", "竞赛"],
    aliases: ["lanqiaobei", "lqb", "guoyi", "dasai", "pingshen", "quanguo", "10"],
    badge: "National 1st Prize · Top 10",
    href: "#awards"
  },
  {
    id: "award-zhuoyue",
    category: "award",
    type: "Award",
    title: "中软国际 · 卓越杯 AI 挑战赛一等奖",
    subtitle: "辽宁赛区一等奖 · AI Workspace 智能体项目 (2026)",
    description: "凭借 SKYCloud 智能工作区项目的 RAG 知识检索、Docker 安全代码执行沙箱与 FastMCP 多工具运行时系统荣获省级一等奖第一梯队。",
    tags: ["卓越杯", "中软国际", "AI挑战赛", "省一等奖", "SKYCloud", "辽宁赛区", "竞赛"],
    aliases: ["zhuoyuebei", "zyb", "zhongruan", "shengyi", "aichallenge"],
    badge: "Provincial 1st Prize",
    href: "#awards"
  },
  {
    id: "award-smart-tech",
    category: "award",
    type: "Award",
    title: "智能技术应用大赛一等奖",
    subtitle: "辽宁赛区一等奖 · 计算机视觉与智能系统 (2026)",
    description: "聚焦智能视觉感知与三维空间定位算法落地应用，经过现场答辩与技术方案评审荣获辽宁省一等奖。",
    tags: ["智能技术应用大赛", "省一等奖", "计算机视觉", "辽宁赛区", "竞赛"],
    aliases: ["zhinengjishu", "znjs", "shengyi"],
    badge: "Provincial 1st Prize",
    href: "#awards"
  },
  {
    id: "award-ican",
    category: "award",
    type: "Award",
    title: "第 19 届 iCAN 创新创业大赛全国三等奖",
    subtitle: "全国总决赛三等奖 (2025)",
    description: "在全国总决赛现场展现了 AI 原生产品架构与算法技术落地能力，斩获国家级三等奖。",
    tags: ["iCAN", "创新创业", "全国三等奖", "国三", "总决赛", "竞赛"],
    aliases: ["ican", "cxb", "guosan", "chuangye"],
    badge: "National 3rd Prize",
    href: "#awards"
  },
  {
    id: "award-math-contest",
    category: "award",
    type: "Award",
    title: "第 16 届全国大学生数学竞赛二等奖",
    subtitle: "全国初赛/赛区二等奖 (2024)",
    description: "展现扎实的高等数学、数学分析与微积分推导功底，为后续三维空间几何重建与反投影射线夹角非线性优化奠定数学基础。",
    tags: ["数学竞赛", "CMC", "全国二等奖", "高等数学", "微积分", "竞赛"],
    aliases: ["shuxue", "cmc", "shuxuejingsai", "guoer"],
    badge: "National 2nd Prize",
    href: "#awards"
  },
  {
    id: "award-brics",
    category: "award",
    type: "Award",
    title: "金砖国家职业技能大赛全国总决赛三等奖",
    subtitle: "一带一路暨金砖国家技能发展与技术创新赛道 (2024)",
    description: "在云计算与工程实践技能国际化赛道中表现优异，荣获全国总决赛三等奖。",
    tags: ["金砖技能大赛", "一带一路", "全国三等奖", "国三", "技能大赛"],
    aliases: ["jinzhuang", "brics", "guosan", "jineng"],
    badge: "National 3rd Prize",
    href: "#awards"
  },
  {
    id: "award-ln-annual",
    category: "award",
    type: "Award",
    title: "辽宁省大学生创新创业年会三等奖",
    subtitle: "单目视觉三维坐标重建系统 · 学术论文与实测展示 (2025)",
    description: "凭借近海单目定位系统的论文成果与现场演示，荣获省级创新年会优秀学术成果奖。",
    tags: ["辽宁省创新年会", "大创年会", "省三等奖", "单目视觉", "竞赛"],
    aliases: ["nianhui", "chuangxinnianhui", "cxb"],
    badge: "Provincial 3rd Prize",
    href: "#awards"
  },
  {
    id: "award-computer-design",
    category: "award",
    type: "Award",
    title: "中国大学生计算机设计大赛三等奖",
    subtitle: "辽宁赛区 · 软件应用开发赛道 (2025)",
    description: "在全栈应用系统架构与工程规范化评审中荣获省级三等奖。",
    tags: ["计算机设计大赛", "4C大赛", "省三等奖", "软件开发", "竞赛"],
    aliases: ["jisuanjisheji", "4c", "jsjsj"],
    badge: "Provincial 3rd Prize",
    href: "#awards"
  },
  {
    id: "edu-overview",
    category: "award",
    type: "Course",
    title: "大连海洋大学 · 计算机科学与技术本科",
    subtitle: "专业排名 9/117 · GPA 3.74 · CET-4 510 · 校二等奖学金",
    description: "主修计算机科学与技术专业，核心课程成绩优异：算法分析 95分、机器学习 95分、概率论 98分、高数 97分、数据库 93分。",
    tags: ["大连海洋大学", "计算机科学与技术", "专业排名", "GPA", "奖学金", "教育", "高分课程"],
    aliases: ["dlmu", "dalian", "jiaoyu", "daxue", "paiming", "gpa", "chengji"],
    badge: "排名 9/117 · GPA 3.74",
    href: "#education"
  },
  {
    id: "course-algorithms",
    category: "award",
    type: "Course",
    title: "算法分析与设计 (95分)",
    subtitle: "核心专业高分课程 · 动态规划 · 贪心 · 图论算法",
    description: "大连海洋大学信息工程学院专业核心课，综合评定 95 分，掌握复杂时空复杂度优化与高阶算法架构。",
    tags: ["算法分析与设计", "95分", "高分课程", "动态规划", "图论", "课程"],
    aliases: ["suanfafenxi", "suanfa", "algorithms", "95"],
    badge: "课程成绩 95 分",
    href: "#education"
  },
  {
    id: "course-machine-learning",
    category: "award",
    type: "Course",
    title: "机器学习 (95分)",
    subtitle: "核心专业高分课程 · 统计学习 · 神经网络 · 聚类与回归",
    description: "大连海洋大学信息工程学院专业核心课，综合评定 95 分，深入理解统计学习理论与深度网络优化原理。",
    tags: ["机器学习", "95分", "高分课程", "深度学习", "神经网络", "课程"],
    aliases: ["jiqixuexi", "ml", "machinelearning", "95"],
    badge: "课程成绩 95 分",
    href: "#education"
  },
  {
    id: "course-probability",
    category: "award",
    type: "Course",
    title: "概率论与数理统计 (98分)",
    subtitle: "核心高分课程 · 随机过程 · 假设检验 · 参数估计",
    description: "大连海洋大学核心基础课，综合评定 98 分，为 YOLO-PGMD 概率注意力与几何位姿估计提供数理支撑。",
    tags: ["概率论与数理统计", "98分", "高分课程", "概率论", "数理统计", "课程"],
    aliases: ["gailvlon", "gl", "probability", "98"],
    badge: "课程成绩 98 分",
    href: "#education"
  },
  {
    id: "course-math",
    category: "award",
    type: "Course",
    title: "高等数学 (97分)",
    subtitle: "核心基础高分课程 · 微积分 · 级数 · 空间解析几何",
    description: "综合评定 97 分，奠定三维空间坐标解算与反投影几何推导的微积分与线性代数底座。",
    tags: ["高等数学", "97分", "微积分", "高分课程", "课程"],
    aliases: ["gaodengshuxue", "gaoshu", "math", "97"],
    badge: "课程成绩 97 分",
    href: "#education"
  },
  {
    id: "course-db",
    category: "award",
    type: "Course",
    title: "数据库系统 (93分)",
    subtitle: "核心专业高分课程 · 关系代数 · SQL 优化 · 范式与事务",
    description: "综合评定 93 分，掌握高并发数据库索引优化、事务隔离级别与持久化存储设计。",
    tags: ["数据库系统", "93分", "SQL", "关系数据库", "高分课程", "课程"],
    aliases: ["shujuku", "db", "database", "93"],
    badge: "课程成绩 93 分",
    href: "#education"
  },
  {
    id: "course-java",
    category: "award",
    type: "Course",
    title: "Java 程序设计 (92分)",
    subtitle: "核心专业高分课程 · 面向对象 · 多线程 · JVM 基础",
    description: "综合评定 92 分，为 Spring Boot 推荐后端与大型企业级系统开发奠定语言基础。",
    tags: ["Java", "92分", "面向对象", "高分课程", "课程"],
    aliases: ["java", "oop", "92"],
    badge: "课程成绩 92 分",
    href: "#education"
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 6. 快捷导航与直达动作 (Navigation & Quick Actions)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "nav-all-projects",
    category: "nav",
    type: "Navigation",
    title: "全站精选项目总览 (Projects Index)",
    subtitle: "浏览 7 项精选科研与工程项目案例全景",
    description: "跳转至独立精选项目库，包含单目定位、YOLO-PGMD、科幻奇点、RL赛车、SKYCloud、SKYDouyin、SKYOJ 等完整案例拆解。",
    tags: ["项目", "Projects", "Index", "案例库", "导航", "科研", "工程"],
    aliases: ["xiangmu", "projects", "index", "allprojects"],
    badge: "页面导航",
    href: "/projects"
  },
  {
    id: "nav-hero-top",
    category: "nav",
    type: "Navigation",
    title: "回到首页顶部 (Hero Section)",
    subtitle: "陈敏祥 · 视觉智能与 AI 原生系统编辑寄语",
    description: "回到首页顶端查看作者简介、专业排名与实时打字机动态寄语。",
    tags: ["首页", "顶部", "Hero", "寄语", "导航"],
    aliases: ["shouye", "dingbu", "hero", "home"],
    badge: "锚点直达",
    href: "#hero"
  },
  {
    id: "nav-about-section",
    category: "nav",
    type: "Navigation",
    title: "关于我 / 个人背景与编辑寄语",
    subtitle: "计算机视觉 · AI 原生系统 · 智能体工程",
    description: "了解作者陈敏祥（Chen Minxiang）的研究方向、教育经历与技术理念。",
    tags: ["关于", "About", "作者", "简介", "经历", "陈敏祥"],
    aliases: ["guanyu", "about", "geren", "chenminxiang"],
    badge: "锚点直达",
    href: "#about"
  },
  {
    id: "nav-education-section",
    category: "nav",
    type: "Navigation",
    title: "教育经历与核心课程",
    subtitle: "大连海洋大学 · 计算机科学与技术 (2023.09 — 2027.07)",
    description: "查看专业排名 9/117、GPA 3.74、高分专业课程与英语四级 CET-4 510 详情。",
    tags: ["教育", "Education", "大连海洋大学", "课程", "成绩", "排名"],
    aliases: ["jiaoyu", "education", "xuexiao", "chengji"],
    badge: "锚点直达",
    href: "#education"
  },
  {
    id: "nav-projects-bento-section",
    category: "nav",
    type: "Navigation",
    title: "精选项目 Bento 卡片总览",
    subtitle: "首页 7 大精选科研与工程项目交互矩阵",
    description: "在首页直接查看单目定位、人群计数、大模型微调与 AI Workspace 等 Bento 卡片。",
    tags: ["项目", "Bento", "Projects", "科研", "工程"],
    aliases: ["bento", "xiangmu", "projects"],
    badge: "锚点直达",
    href: "#projects"
  },
  {
    id: "nav-awards-section",
    category: "nav",
    type: "Navigation",
    title: "竞赛荣誉与学术奖项",
    subtitle: "蓝桥杯国一、中软卓越杯省一、iCAN 国三、数学竞赛等",
    description: "查看大学期间在算法、AI、创新创业与数学竞赛中取得的 10+ 项国家级与省级荣誉。",
    tags: ["竞赛", "Awards", "荣誉", "蓝桥杯", "卓越杯", "数学竞赛", "大创"],
    aliases: ["jingsai", "awards", "rongyu", "huojiang"],
    badge: "锚点直达",
    href: "#awards"
  },
  {
    id: "nav-skills-section",
    category: "nav",
    type: "Navigation",
    title: "全栈与 AI 技能矩阵",
    subtitle: "计算机视觉、大模型与 Agent、高并发后端、编程语言",
    description: "查看 4 大技术板块与 20+ 项具体技术框架的实战应用经历。",
    tags: ["技术栈", "Skills", "技能", "PyTorch", "FastAPI", "OpenCV", "Docker"],
    aliases: ["jineng", "skills", "jishuzhan", "matrix"],
    badge: "锚点直达",
    href: "#skills"
  },
  {
    id: "nav-contact-section",
    category: "nav",
    type: "Navigation",
    title: "联系方式与合作交流",
    subtitle: "Email: tianyaguest@qq.com · GitHub: TianyaSKY",
    description: "获取作者的电子邮箱、GitHub 主页与微信/电话联系渠道。",
    tags: ["联系", "Contact", "Email", "邮箱", "GitHub", "交流", "合作"],
    aliases: ["lianxi", "contact", "email", "youxiang", "weixin"],
    badge: "锚点直达",
    href: "#contact"
  },
  {
    id: "nav-email-direct",
    category: "nav",
    type: "Contact",
    title: "直接发送邮件交流 (Email)",
    subtitle: "tianyaguest@qq.com · 点击唤起默认邮件客户端",
    description: "唤起系统默认邮件客户端给作者发送交流邮件。",
    tags: ["Email", "邮件", "邮箱", "tianyaguest", "QQ邮箱"],
    aliases: ["email", "youjian", "qqyouxiang"],
    badge: "外部动作",
    href: "mailto:tianyaguest@qq.com"
  },
  {
    id: "nav-github-profile",
    category: "nav",
    type: "Contact",
    title: "GitHub 个人主页 (TianyaSKY)",
    subtitle: "github.com/TianyaSKY · 关注开源项目与代码仓库",
    description: "在新标签页中打开作者的 GitHub 个人主页并查看全部开源代码库。",
    tags: ["GitHub", "开源", "代码库", "Repo", "TianyaSKY"],
    aliases: ["github", "git", "kaiyuan", "daima"],
    badge: "外部链接",
    href: "https://github.com/TianyaSKY"
  }
];

// 推荐热门搜索词（空输入时展示）
export const popularSearchTags = [
  "单目视觉",
  "YOLO-PGMD",
  "SKYCloud",
  "科幻奇点",
  "蓝桥杯",
  "FastAPI",
  "Docker",
  "PyTorch",
  "RAG",
  "PPO 赛车",
  "Milvus",
  "大连海洋大学"
];
