export const personalInfo = {
  name: "陈敏祥",
  englishName: "Chen Minxiang",
  title: "计算机视觉 · AI 原生系统 · 智能体工程",
  school: "大连海洋大学 · 信息工程学院",
  major: "计算机科学与技术 · 本科 (2023.09 — 2027.07)",
  avatar: "./avatar.png",
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
  { id: "rank", label: "专业排名", value: "9", sub: "/117", icon: "Trophy", color: "#2563eb" },
  { id: "gpa", label: "GPA 成绩", value: "3.74", sub: "", icon: "GraduationCap", color: "#0284c7" },
  { id: "projects", label: "国家级大创", value: "2", sub: "项", icon: "Rocket", color: "#3b82f6" },
  { id: "awards", label: "竞赛获奖", value: "10+", sub: "项", icon: "Award", color: "#1d4ed8" }
];

export const interestTags = [
  "单目视觉与位姿解算",
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
  tags: ["CET-4 510", "排名 9/117", "GPA 3.74", "二等奖学金"],
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
    cover: "/projects/vision-positioning/cover.png",
    gallery: [],
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
      github: "https://github.com/TianyaSKY"
    },
    featured: true,
    hasVisionDemo: true,
    legacyHasDemo: true
  },
  {
    id: "cixin-singularity",
    type: "research",
    title: "科幻奇点",
    subtitle: "Qwen3.6-27B · 4bit QLoRA · 单卡 RTX 5090 文风续写",
    badge: "项目负责人",
    category: "LLM Fine-Tuning & SFT",
    cover: "/projects/cixin-singularity/cover.png",
    gallery: [
      { src: "/projects/cixin-singularity/pipeline.png", caption: "数据与训练管线" },
      { src: "/projects/cixin-singularity/loss-curves.svg", caption: "训练与验证损失曲线" },
      { src: "/projects/cixin-singularity/dynamics.svg", caption: "训练动态指标面板" }
    ],
    caseFigures: {
      method: { src: "/projects/cixin-singularity/pipeline.png", caption: "数据与训练管线" },
      results: { src: "/projects/cixin-singularity/loss-curves.svg", caption: "训练与验证损失曲线" }
    },
    accent: "indigo",
    bento: { size: "md", col: 2, row: 1 },
    tech: ["Qwen3.6-27B", "4bit NF4", "LoRA", "trl", "RTX 5090"],
    description: "单卡 RTX 5090（32GB）上以 4bit NF4 QLoRA 微调 Qwen3.6-27B：2375 条刘慈欣续写样本教会模型「接上文续写、保持文风」；可训练参数仅 0.039%（10.5M），适配器每份 20MB，2 epoch / 238 步仅 3 小时完成。",
    stats: [
      { label: "训练语料", value: "2375 条" },
      { label: "可训练参数", value: "0.039 %" },
      { label: "训练时长", value: "3.1 h" },
      { label: "LoRA 权重", value: "20 MB" }
    ],
    highlights: [
      "单卡 RTX 5090 训 27B：4bit NF4 + BF16（Blackwell 原生加速），2 epoch / 238 步 / 3h04m，显存峰值 16–18GB / 32GB",
      "completion-only loss 只对续写输出计梯度：train 4.59 → 2.97，eval 收敛至 3.122，token 准确率 0.22 → 0.43",
      "1.0 / 1.5 / 2.0 epoch 三份 checkpoint 精确落盘；eval 在 1.5 epoch 后走平，最终靠人工对比续写风格选型"
    ],
    background:
      "「慈欣体」那种把硬科学概念、宏大时空尺度与冷峻英雄主义糅在一起的文风，是任何基础模型都模仿不出来的。让模型掌握它的两条路：要么 RLHF 训 50B+ 级模型，要么在目标风格数据上做低资源微调。后者的关键是算力约束下「接上文续写」任务本身很轻——单卡 RTX 5090 的 32GB 显存足够放下 27B 模型的 4bit 量化权重，于是把目标定为：Qwen3.6-27B 上做 4bit QLoRA 文风续写微调，从 2375 条刘慈欣小说续写样本中学到「给一段上文、续下一段」的能力。",
    method:
      "数据侧：2375 条 instruction/input/output 续写对（《宇宙坍缩》等公开文本），按书序连续切分为 train 1900 / val 238 / test 237，同书内容不跨切分；按 ChatML 组装 prompt/completion，由 trl 的 completion_mask 把上文与指令的 labels 置 -100——只学续写、不学提示。模型侧：Qwen3.6-27B 以 4bit NF4 + double_quant 量化、BF16 计算加载，在 q/k/v/o_proj 注入 rank=16、alpha=32 的 LoRA，可训练参数 10.5M（0.039%）。训练侧：paged_adamw_8bit，lr 5e-5 cosine + 3% warmup，有效 batch 16（1×16 梯度累积），2048 ctx，梯度检查点；小数 epoch 回调在 1.0 / 1.5 / 2.0 epoch 精确落盘三份 checkpoint。",
    results:
      "2 epoch / 238 步 / 3h04m 完成，无 OOM、无 NaN。train loss 4.59 → 2.97（最低 2.79），eval loss 3.243 → 3.122，token 预测准确率 0.22 → 0.43；grad_norm 在 warmup 后稳定 0.2–0.5，梯度裁剪未触发。eval 在第 1.5 epoch 后完全走平（3.124 → 3.122）——额外训练不再带来验证集收益，最终选型落在人工对比 epoch-1.5 / epoch-2 的续写风格上。三份 checkpoint 各含 20MB LoRA 适配器，支持从任意中间点断点续训。",
    reflection:
      "两个值得改进的点：一是 Qwen3.6-27B 实为多模态 VLM（64 层中 48 层为线性注意力 DeltaNet），当前只跑了文本分支（AutoModelForCausalLM），vision tower 未覆盖，下一步应换 VLM 加载入口并适配混合注意力层的 LoRA target_modules；二是数据仅 2375 条、单作者文风，train/eval 差距约 0.2 说明存在轻微过拟合，风格泛化到其他作者未验证——后续应扩大多作者数据、拉长上下文到 4096、追加 MLP target_modules，并建立 LLM-as-a-judge 自动评测流程。",
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
    subtitle: "PPO + 9 向雷达的 3D 赛车控制环境",
    badge: "独立开发 · 开源",
    category: "Reinforcement Learning & Environment Design",
    cover: "/projects/rl-racing/cover.png",
    gallery: [
      { src: "/projects/rl-racing/game.png", caption: "3D 赛道环境实机画面" },
      { src: "/projects/rl-racing/training_curves.png", caption: "PPO 训练奖励曲线" },
      { src: "/projects/rl-racing/training_curves_diag.png", caption: "训练诊断曲线" }
    ],
    caseFigures: {
      method: { src: "/projects/rl-racing/game.png", caption: "3D 赛道环境实机画面" },
      results: { src: "/projects/rl-racing/training_curves.png", caption: "PPO 训练奖励曲线" }
    },
    video: "https://media.tianyasky.top/RacingCar.webm",
    accent: "sky",
    bento: { size: "sm", col: 2, row: 2 },
    tech: ["Python", "Gymnasium", "Stable-Baselines3", "PPO", "Pygame", "OpenGL"],
    description: "从零搭建兼容 Gymnasium 的 3D 赛车环境，将位置、姿态、速度、赛道偏差与 9 向障碍雷达编码为 16 维观察；用 PPO 在 8 个子进程环境中并行采样，并提供训练、续训、检查点、可视化评估与手动驾驶的完整实验闭环。",
    stats: [
      { label: "观察空间", value: "16 维" },
      { label: "动作空间", value: "7 个离散动作" },
      { label: "并行采样", value: "8 env" },
      { label: "默认训练预算", value: "10M steps" }
    ],
    highlights: [
      "环境建模：归一化车辆坐标、朝向、速度、中心线距离与方向，并用左右 90° 范围内的 9 条射线感知障碍物",
      "决策与奖励：定义无操作、加减速、左右转及组合控制等 7 个动作，以速度、贴近中心线、碰撞和出界共同塑造奖励",
      "训练工程：Stable-Baselines3 PPO + SubprocVecEnv 并行采样，固定随机种子，支持定期检查点、断点续训与 TensorBoard 监控",
      "评估入口：同一套 CLI 覆盖从头训练、加载续训、模型可视化与随机策略对照，另保留手动驾驶入口核验环境逻辑"
    ],
    background:
      "项目的目标不是堆叠一个看起来会移动的赛车 Demo，而是把三维赛道、车辆控制和障碍感知整理成一个可以被强化学习算法稳定调用的标准环境。为此，我需要同时解决状态如何表达、动作如何离散化、奖励怎样避免投机，以及无渲染并行训练与有渲染评估如何共用同一套环境逻辑。",
    method:
      "RacingEnv 按 Gymnasium 接口实现 reset / step：每个回合重新生成赛道、车辆和障碍物，输出由 7 个车辆与赛道特征、9 个归一化射线距离组成的 16 维观察；动作空间包含 7 种离散控制，碰撞、出界或达到 2000 步时终止。训练侧采用 MlpPolicy 的 PPO，学习率 3e-4、n_steps 512、batch size 256、γ=0.99，8 个 SubprocVecEnv 进程只在 CPU 上采样；默认训练 1000 万步，每 10 万步保存一次模型。",
    results:
      "仓库已交付可直接加载的 PPO 权重、完整训练脚本与四类命令入口：train、continue、viz、random。训练过程可持续写入 TensorBoard，并能从任意检查点保留累计步数继续优化；可视化模式切回单环境 Pygame / OpenGL 渲染，从而把“批量训练”和“肉眼检查策略”放进同一条可复现实验链。",
    reflection:
      "当前版本更适合作为可读的强化学习实验场，而不是真实自动驾驶模拟器：传感器仍是规则化射线，动力学模型较轻，策略效果也依赖人工奖励塑形。下一步应先加入课程学习、随机赛道难度与传感噪声，再讨论从状态向量迁移到视觉输入，避免用更复杂的网络掩盖环境设计问题。",
    links: {
      github: "https://github.com/TianyaSKY/RacingCar"
    },
    featured: false
  },
  {
    id: "sky-cloud",
    type: "engineering",
    title: "SKYCloud",
    subtitle: "把云存储、知识库与受控 Agent 合并为一个 AI Workspace",
    badge: "中软国际 AI 挑战赛省一等奖",
    category: "AI Workspace · RAG · Agent Runtime",
    cover: "/projects/sky-cloud/cover.png",
    gallery: [
      { src: "/projects/sky-cloud/agent_chat.png", caption: "RAG 智能助手与文件引用" },
      { src: "/projects/sky-cloud/workspace.png", caption: "独立 OpenCode 工作区" },
      { src: "/projects/sky-cloud/work-finish.png", caption: "Agent 创建并回传文件" },
      { src: "/projects/sky-cloud/work_file.png", caption: "生成文档在线预览" },
      { src: "/projects/sky-cloud/mcp.png", caption: "MCP Token 与客户端配置" },
      { src: "/projects/sky-cloud/token-usage.png", caption: "模型 Token 用量统计" },
      { src: "/projects/sky-cloud/file_preview.png", caption: "Markdown 文件在线预览" },
      { src: "/projects/sky-cloud/share.png", caption: "带有效期的文件分享管理" }
    ],
    caseFigures: {
      background: { src: "/projects/sky-cloud/agent_chat.png", caption: "文件管理与 RAG 智能助手" },
      method: { src: "/projects/sky-cloud/architecture.png", caption: "Frontend / API / Worker / Data 四层架构" },
      results: { src: "/projects/sky-cloud/rag_pipeline.png", caption: "Multi-Query、RRF 与 Rerank 检索链路" }
    },
    accent: "cyan",
    bento: { size: "lg", col: 1, row: 2 },
    tech: ["Vue 3", "FastAPI", "PostgreSQL", "pgvector", "RabbitMQ", "FastMCP", "Docker", "OpenCode"],
    description: "面向个人与团队的 AI Workspace：在分片上传、预览、分享等云盘能力之上，串联 RAG 检索、AI 自动整理、双模式助手、独立 Docker 工作区与 MCP 服务，让模型不仅能回答文件内容，还能在授权边界内编辑文件、运行代码并返回 Diff。",
    stats: [
      { label: "AI 助手", value: "快速 / 专家" },
      { label: "工具 / Prompt / 资源", value: "16 / 4 / 2" },
      { label: "向量索引", value: "1024 维" },
      { label: "工作区隔离", value: "独立 Docker" }
    ],
    highlights: [
      "文件底座：支持分片上传、断点续传、秒传、预览、批量操作、格式转换、分享链接与收件箱通知",
      "RAG 检索：离线经 RabbitMQ 异步生成描述与 Embedding，在线完成 6 维关键词改写、Multi-Query 并行召回、RRF 融合、可选 Rerank 与 SSE 流式输出",
      "双模式助手：快速模式只读当前工作空间；专家模式按用户与工作空间启动独立 OpenCode Runtime，支持权限确认、取消、文件 Diff 和会话恢复",
      "Agent 接入：FastMCP 暴露 16 个 Tool、4 个 Prompt、2 个 Resource，并为每位用户签发可刷新 Token，兼容 Claude Desktop、Cursor 与沙箱工作区"
    ],
    background:
      "传统云盘解决的是“文件放在哪里”，但当资料规模增长后，真正耗时的是理解、查找、重组和执行。SKYCloud 因此不把 AI 做成搜索框旁的附加按钮，而是把文件存储、索引、知识问答和受控执行放在同一个工作空间里：用户既能问“这份合同写了什么”，也能授权 Agent 汇总目录、转换格式或在隔离环境中运行代码。",
    method:
      "系统分为四个协作平面。数据平面由 FastAPI、PostgreSQL/pgvector 与 Vue 3 承担文件、目录、分享和会话；索引平面通过 RabbitMQ Worker 并行完成分块、描述生成与 1024 维向量写入，在线检索再做改写、融合和重排；执行平面用 LangGraph ReAct 完成自动整理，并为专家助手动态创建 OpenCode Runtime；安全平面以角色权限、短期 MCP Token、命令确认、Diff 和独立 Docker 容器限制 Agent 能力。Redis 与 Bloom Filter 用于缓存和权限前置判断，Token 用量则按对话、索引和整理分别统计。",
    results:
      "仓库已经形成一套可通过 Docker Compose 启动的完整产品链：文件管理、图片引用式 RAG、快速与专家两套互不污染的会话、自动整理通知、分享管理、Token 统计，以及可被外部客户端直接调用的 MCP 服务。专家模式把会话、消息和运行记录持久化，并用专用凭证隔离普通 REST 与 Runtime 访问；项目也因此从“AI 云盘”推进为可持续扩展的 AI 工作空间。",
    reflection:
      "这个系统最重要的工程判断不是继续增加工具数量，而是区分“读取知识”和“执行动作”。快速模式保持只读，专家模式才启动 Runtime；高风险命令必须确认，改动必须能看 Diff，凭证必须短期且可撤销。继续生产化时，应优先完善 Runtime 生命周期回收、镜像版本固定、密钥轮换与审计追踪，而不是让 Agent 获得更宽的默认权限。",
    links: {
      github: "https://github.com/TianyaSKY/SKYCloud"
    },
    video: "https://media.tianyasky.top/SKYCloudPromo.mp4",
    featured: true
  },
  {
    id: "sky-douyin",
    type: "engineering",
    title: "SKYDouyin",
    subtitle: "从上传、行为事件到向量召回的短视频推荐闭环",
    badge: "端到端推荐系统 MVP",
    category: "Recommendation System & Event Pipeline",
    cover: "/projects/sky-douyin/cover.png",
    gallery: [
      "/projects/sky-douyin/01.svg",
      "/projects/sky-douyin/02.svg"
    ],
    accent: "indigo",
    bento: { size: "md", col: 1, row: 3 },
    tech: ["React 18", "Spring Boot 3", "FastAPI", "MySQL", "Redis", "RabbitMQ", "Milvus"],
    description: "围绕短视频产品的真实数据流搭建完整 MVP：Web 与 Android 客户端完成上传、播放和行为上报，Spring Boot 管理业务真相，FastAPI 生成推荐向量，RabbitMQ 解耦事件，Milvus 承担向量召回，并用标签均值向量完成新用户兴趣冷启动。",
    stats: [
      { label: "产品端", value: "Web + Android" },
      { label: "上传能力", value: "分片 / 续传 / 秒传" },
      { label: "推荐召回", value: "热门 + 向量" },
      { label: "异步事件总线", value: "RabbitMQ" }
    ],
    highlights: [
      "上传发布链：前端计算文件哈希，依次完成初始化、分片、合并与元数据创建，再异步生成视频 Embedding 写入 Milvus",
      "推荐链路：热门候选与向量候选共同进入 Feed；React 页面与 Android 客户端统一上报播放、停留、点赞等用户行为",
      "冷启动建模：按已发布视频标签聚合向量并缓存到 Redis，新用户注册时对所选标签求均值，生成第一版兴趣向量",
      "一致性设计：点赞关系以 user_video_relations 真相表保证幂等，业务服务、推荐服务与消息消费各自保留清晰边界"
    ],
    background:
      "推荐系统最容易被简化成一个“猜你喜欢”接口，但真正的难点分散在上传、内容入库、行为采集、特征更新、候选召回和客户端反馈之间。这个项目以可运行的短视频 MVP 为目标，不跳过任何关键链路：先让一条视频可靠发布，再让一次用户行为可靠流动，最后让这些数据真正影响下一次 Feed。",
    method:
      "前端使用 React 18，Android 端负责移动播放与上传；Spring Boot 3 + MyBatis-Plus 维护用户、视频和关系数据，MySQL 保存业务真相，Redis 承担热点状态和标签向量缓存。视频发布后由 RabbitMQ 投递 event.video_embedding，消费者调用 FastAPI 推荐服务，经 PyTorch / DashScope 生成向量并写入 Milvus。注册冷启动则定时聚合管理员已发布视频的标签向量，用户勾选兴趣后取均值作为初始画像；Docker Compose 统一拉起 MySQL、Redis、RabbitMQ、Milvus 与 Attu。",
    results:
      "当前仓库已经打通注册与登录、兴趣选择、视频分片上传、审核发布、沉浸式 Feed、点赞幂等、个人主页、行为上报和向量入库等端到端路径，并同时保留 Web 与 Android 两类客户端。推荐服务、业务服务和基础设施可以分别启动和测试，使它不只是界面原型，而是一套可继续替换召回与排序策略的完整实验底座。",
    reflection:
      "该版本明确定位为 MVP：它先验证数据能否从客户端稳定流向画像和召回，而不是提前追求复杂排序模型。继续迭代时，优先级应是补齐离线评测集、曝光与转化归因、消费者幂等和失败重放，再比较多路召回权重或引入学习排序；否则模型指标很容易建立在不可靠的事件数据之上。",
    links: {
      github: "https://github.com/TianyaSKY/SKYDouyin"
    },
    featured: false
  },
  {
    id: "sky-oj",
    type: "engineering",
    title: "SKYOJ",
    subtitle: "面向高校教学的 ACM / OOP / Kaggle 多模式评测平台",
    badge: "独立开发 · 开源",
    category: "Online Judge & Secure Sandbox",
    cover: "/projects/sky-oj/cover.png",
    gallery: [
      { src: "/projects/sky-oj/homepage-landing.png", caption: "平台首页落地页" },
      { src: "/projects/sky-oj/problem-list.png", caption: "题目列表与筛选" },
      { src: "/projects/sky-oj/problem-detail-editor.png", caption: "题目详情与在线编辑器" },
      { src: "/projects/sky-oj/problem-draft.png", caption: "题目草稿与发布" },
      { src: "/projects/sky-oj/submission-result.png", caption: "提交与判题结果" },
      { src: "/projects/sky-oj/teacher-dashboard.png", caption: "教师工作台" },
      { src: "/projects/sky-oj/admin-problem-management.png", caption: "管理员题目管理" }
    ],
    caseFigures: {
      method: { src: "/projects/sky-oj/problem-detail-editor.png", caption: "题目详情与在线编辑器" },
      results: { src: "/projects/sky-oj/submission-result.png", caption: "提交与判题结果" }
    },
    accent: "blue",
    bento: { size: "tall", col: 2, row: 2 },
    tech: ["Vue 3", "FastAPI", "MySQL", "RabbitMQ", "Celery", "Docker", "Nginx"],
    description: "为高校编程与数据科学教学设计的 AI 在线评测平台：同一套题目系统支持 ACM 标准输入输出、OOP 黑盒单元测试与 Kaggle 自定义评分，判题任务经 RabbitMQ / Celery 异步调度，在禁网且受 CPU、内存、PID 限制的 Docker 沙箱中执行。",
    stats: [
      { label: "评测模式", value: "ACM / OOP / Kaggle" },
      { label: "异步队列", value: "judge / ai / file" },
      { label: "网络隔离", value: "network=none" },
      { label: "资源边界", value: "CPU / 内存 / PID" }
    ],
    highlights: [
      "多模式评测：兼容标准 I/O 对拍、面向对象 Test 脚本黑盒验证，以及按 RMSE、Accuracy 等自定义脚本评分的数据科学任务",
      "可靠任务链：API 先持久化任务与 Outbox 记录，再向 RabbitMQ 发布任务 ID；judge、ai、file 三类 Celery Worker 串行执行，租约过期任务由 job-recovery 回收重投",
      "安全沙箱：判题容器断开网络，并以 Linux Cgroups 限制 CPU、内存和 PID；只有 judge Worker 挂载 Docker Socket，缩小高权限边界",
      "AI 助教：兼容 OpenAI / DeepSeek 接口，通过角色与引导式提示帮助定位逻辑问题，同时避免直接泄露完整题解"
    ],
    background:
      "传统 OJ 擅长算法题，却很难覆盖面向对象设计和数据科学作业；如果把这些任务继续交给教师手工批改，反馈慢且评分口径难统一。SKYOJ 从教学场景出发，把三类评测协议放进同一平台，并把 AI 定位为“引导学生定位问题的助教”，而不是替学生生成答案的捷径。",
    method:
      "界面层由 Vue 3、Vite 与 Monaco Editor 提供接近 IDE 的答题体验，Nginx 统一代理静态资源与 API；业务层采用 FastAPI、SQLAlchemy 与 MySQL 管理用户、题目、考试、数据集和提交；调度层使用 RabbitMQ + Celery，将判题、AI 与文件任务拆成三个队列，单个 Worker 以 solo 模式串行执行，需要吞吐时横向增加容器；执行层准备独立 runner 与 generator 镜像，通过 network=none、Cgroups 配额和 PID 上限隔离用户代码与测试数据生成。",
    results:
      "仓库已提供完整前后端、判题与测例生成镜像、数据库初始化、三队列 Worker、任务恢复进程和 Docker Compose 编排。教师可以配置 ACM、OOP 或 Kaggle 题目，学生在浏览器编写并提交多语言代码，系统异步返回评测结果；LLM 同时服务于智能助教和测试数据生成，但不进入判题真值链路。",
    reflection:
      "判题系统首先是安全与一致性系统，其次才是高并发系统。当前采用单进程 Worker 是保守但清晰的选择：每个任务独占执行上下文，扩容通过增加容器完成。后续优化应继续围绕镜像供应链、Docker Socket 权限、任务幂等、超时回收与审计日志展开；AI 提示质量可以迭代，但不能削弱沙箱和标准答案的确定性。",
    links: {
      github: "https://github.com/TianyaSKY/SKYOJ"
    },
    video: "https://media.tianyasky.top/skyoj-intro.mp4",
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
      { name: "PyTorch", projects: "单目定位、PPO 赛车与多模态向量生成" },
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

// Search dataset for Quick Search Command Palette (⌘K)
export const searchDataset = [
  { type: "Research", title: "单目视觉定位系统", subtitle: "国家级大创 · 共线标志物几何解算", href: "/projects/vision-positioning" },
  { type: "Research", title: "科幻奇点 — 慈欣体生成", subtitle: "Qwen3.6-27B · 4bit QLoRA 微调", href: "/projects/cixin-singularity" },
  { type: "Research", title: "3D 赛车自动驾驶系统", subtitle: "Gymnasium · PPO · 9 向雷达", href: "/projects/rl-racing" },
  { type: "Engineering", title: "SKYCloud AI Workspace", subtitle: "双模式助手 · RAG · MCP 运行时", href: "/projects/sky-cloud" },
  { type: "Engineering", title: "SKYDouyin 短视频推荐", subtitle: "Spring Boot + FastAPI + Milvus", href: "/projects/sky-douyin" },
  { type: "Engineering", title: "SKYOJ 在线评测平台", subtitle: "三模式评测 · Docker 安全沙箱", href: "/projects/sky-oj" },
  { type: "Open Source", title: "SKYCity · LLM 驱动的 AI 小镇", subtitle: "9 位居民 · 记忆关系 · 经济闭环", href: "https://github.com/TianyaSKY/SKYCity" },
  { type: "Open Source", title: "NonameSkill · 扩展开发检索工具", subtitle: "SQLite 双数据源 · 多路改写检索", href: "https://github.com/TianyaSKY/NonameSkill" },
  { type: "Award", title: "蓝桥杯全国一等奖", subtitle: "第17届 Python 组全国第 10 名", href: "#awards" },
  { type: "Award", title: "卓越杯 AI 挑战赛一等奖", subtitle: "中软国际 辽宁赛区", href: "#awards" },
  { type: "Course", title: "算法分析与设计 (95分)", subtitle: "大连海洋大学 核心高分课程", href: "#education" },
  { type: "Course", title: "机器学习 (95分)", subtitle: "大连海洋大学 核心高分课程", href: "#education" },
  { type: "Course", title: "概率论与数理统计 (98分)", subtitle: "大连海洋大学 核心高分课程", href: "#education" },
  { type: "Contact", title: "Email: tianyaguest@qq.com", subtitle: "点击直接发送邮件交流", href: "mailto:tianyaguest@qq.com" },
  { type: "Contact", title: "GitHub: github.com/TianyaSKY", subtitle: "查看全部开源代码库", href: "https://github.com/TianyaSKY" }
];
