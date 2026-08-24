// 项目目录概览：卡片/列表所需的轻量字段，首页与列表页同步加载。
// 详情字段见 ./projectDetails.js，两模块通过 id 关联。
export const projectCatalog = [
  {
    id: "vision-positioning",
    type: "research",
    title: "单目视觉三维坐标重建系统",
    subtitle: "级联神经网络 · 射线夹角几何约束 · 近海 10–15cm 厘米级定位",
    badge: "国家级大创 · 论文与软著",
    category: "Computer Vision & Geometric Pose Reconstruction",
    cover: "/projects/vision-positioning/cover.png",
    accent: "blue",
    bento: {
      size: "lg",
      col: 1,
      row: 1
    },
    tech: [
      "Python",
      "PyTorch",
      "YOLO11",
      "OpenCV",
      "Nonlinear Least Squares",
      "Jetson Orin"
    ],
    stats: [
      {
        label: "仿真解算精度",
        value: "1.1×10⁻⁵ m"
      },
      {
        label: "海试 RMSE 精度",
        value: "10–15 cm"
      },
      {
        label: "角点分类 F1-Score",
        value: "100.0 %"
      },
      {
        label: "实时解算帧率",
        value: "26 FPS"
      }
    ],
    description: "针对近海与无 GPS 复杂环境下传统 PnP 在共线标志物上的几何退化难题，提出 YOLO 掩膜 + Harris 提取 + 9 分类 Patch CNN 的五级级联感知流水线，结合基于反投影射线夹角守恒的多初值非线性最小二乘位姿优化算法。仿真基准达亚毫米级重构，实测 10–15cm RMSE 精度，获辽宁省大学生创新年会推荐及软件著作权。"
  },
  {
    id: "crowd-sigmod",
    type: "research",
    title: "YOLO-PGMD 人群计数系统",
    subtitle: "概率引导注意力 · 积分守恒密度图 · 4 大公开基准通用评测",
    badge: "独立研发 · 计算机视觉",
    category: "Computer Vision & Crowd Density Estimation",
    cover: "/projects/crowd-sigmod/cover.png",
    accent: "blue",
    bento: {
      size: "lg",
      col: 1,
      row: 1
    },
    tech: [
      "PyTorch",
      "Ultralytics YOLO",
      "PG-Attention",
      "ECA Net",
      "Smooth L1",
      "Tile Inference"
    ],
    stats: [
      {
        label: "ShanghaiTech A",
        value: "48.13 MAE"
      },
      {
        label: "ShanghaiTech B",
        value: "13.20 MAE"
      },
      {
        label: "JHU-Crowd",
        value: "39.73 MAE"
      },
      {
        label: "输出分辨率",
        value: "Stride-4 (160×160)"
      }
    ],
    description: "针对密集人群大尺度跨度与极端遮挡难题，设计基于 YOLO 多尺度特征的概率引导密度图（PGMD）估计网络。提出边缘截断重归一化的高斯积分守恒算法（ΣD = N），结合 BCE+Dice 空间概率先验与 MSR 空洞残差细化，全程保持 Stride-4（160×160）高分辨率输出。ShanghaiTech Part A 取得 48.13 MAE / 74.17 RMSE 优异指标，在 4 大国际基准上验证了强劲的跨域泛化能力。"
  },
  {
    id: "cixin-singularity",
    type: "research",
    title: "科幻奇点",
    subtitle: "Qwen3.6-27B · 4bit QLoRA · 单卡 RTX 5090 文风续写",
    badge: "项目负责人",
    category: "LLM Fine-Tuning & SFT",
    cover: "/projects/cixin-singularity/cover.png",
    accent: "indigo",
    bento: {
      size: "md",
      col: 2,
      row: 1
    },
    tech: [
      "Qwen3.6-27B",
      "4bit NF4",
      "LoRA",
      "trl",
      "RTX 5090"
    ],
    stats: [
      {
        label: "训练语料",
        value: "2375 条"
      },
      {
        label: "可训练参数",
        value: "0.039 %"
      },
      {
        label: "训练时长",
        value: "3.1 h"
      },
      {
        label: "LoRA 权重",
        value: "20 MB"
      }
    ],
    description: "单卡 RTX 5090（32GB）上以 4bit NF4 QLoRA 微调 Qwen3.6-27B：2375 条刘慈欣续写样本教会模型「接上文续写、保持文风」；可训练参数仅 0.039%（10.5M），适配器每份 20MB，2 epoch / 238 步仅 3 小时完成。"
  },
  {
    id: "rl-racing",
    type: "research",
    title: "3D 赛车自动驾驶",
    subtitle: "PPO + 9 向雷达的 3D 赛车控制环境",
    badge: "独立开发 · 开源",
    category: "Reinforcement Learning & Environment Design",
    cover: "/projects/rl-racing/cover.png",
    accent: "sky",
    bento: {
      size: "sm",
      col: 2,
      row: 2
    },
    tech: [
      "Python",
      "Gymnasium",
      "Stable-Baselines3",
      "PPO",
      "Pygame",
      "OpenGL"
    ],
    stats: [
      {
        label: "观察空间",
        value: "16 维"
      },
      {
        label: "动作空间",
        value: "7 个离散动作"
      },
      {
        label: "并行采样",
        value: "8 env"
      },
      {
        label: "默认训练预算",
        value: "10M steps"
      }
    ],
    description: "从零搭建兼容 Gymnasium 的 3D 赛车环境，将位置、姿态、速度、赛道偏差与 9 向障碍雷达编码为 16 维观察；用 PPO 在 8 个子进程环境中并行采样，并提供训练、续训、检查点、可视化评估与手动驾驶的完整实验闭环。"
  },
  {
    id: "sky-cloud",
    type: "engineering",
    title: "SKYCloud",
    subtitle: "把云存储、知识库与受控 Agent 合并为一个 AI Workspace",
    badge: "中软国际 AI 挑战赛省一等奖",
    category: "AI Workspace · RAG · Agent Runtime",
    cover: "/projects/sky-cloud/cover.png",
    accent: "cyan",
    bento: {
      size: "lg",
      col: 1,
      row: 2
    },
    tech: [
      "Vue 3",
      "FastAPI",
      "PostgreSQL",
      "pgvector",
      "RabbitMQ",
      "FastMCP",
      "Docker",
      "OpenCode"
    ],
    stats: [
      {
        label: "AI 助手",
        value: "快速 / 专家"
      },
      {
        label: "工具 / Prompt / 资源",
        value: "16 / 4 / 2"
      },
      {
        label: "向量索引",
        value: "1024 维"
      },
      {
        label: "工作区隔离",
        value: "独立 Docker"
      }
    ],
    description: "面向个人与团队的 AI Workspace：在分片上传、预览、分享等云盘能力之上，串联 RAG 检索、AI 自动整理、双模式助手、独立 Docker 工作区与 MCP 服务，让模型不仅能回答文件内容，还能在授权边界内编辑文件、运行代码并返回 Diff。"
  },
  {
    id: "sky-douyin",
    type: "engineering",
    title: "SKYDouyin",
    subtitle: "从上传、行为事件到向量召回的短视频推荐闭环",
    badge: "端到端推荐系统 MVP",
    category: "Recommendation System & Event Pipeline",
    cover: "/projects/sky-douyin/cover.png",
    accent: "indigo",
    bento: {
      size: "md",
      col: 1,
      row: 3
    },
    tech: [
      "React 18",
      "Spring Boot 3",
      "FastAPI",
      "MySQL",
      "Redis",
      "RabbitMQ",
      "Milvus"
    ],
    stats: [
      {
        label: "产品端",
        value: "Web + Android"
      },
      {
        label: "上传能力",
        value: "分片 / 续传 / 秒传"
      },
      {
        label: "推荐召回",
        value: "热门 + 向量"
      },
      {
        label: "异步事件总线",
        value: "RabbitMQ"
      }
    ],
    description: "围绕短视频产品的真实数据流搭建完整 MVP：Web 与 Android 客户端完成上传、播放和行为上报，Spring Boot 管理业务真相，FastAPI 生成推荐向量，RabbitMQ 解耦事件，Milvus 承担向量召回，并用标签均值向量完成新用户兴趣冷启动。"
  },
  {
    id: "sky-oj",
    type: "engineering",
    title: "SKYOJ",
    subtitle: "面向高校教学的 ACM / OOP / Kaggle 多模式评测平台",
    badge: "独立开发 · 开源",
    category: "Online Judge & Secure Sandbox",
    cover: "/projects/sky-oj/cover.png",
    accent: "blue",
    bento: {
      size: "tall",
      col: 2,
      row: 2
    },
    tech: [
      "Vue 3",
      "FastAPI",
      "MySQL",
      "RabbitMQ",
      "Celery",
      "Docker",
      "Nginx"
    ],
    stats: [
      {
        label: "评测模式",
        value: "ACM / OOP / Kaggle"
      },
      {
        label: "异步队列",
        value: "judge / ai / file"
      },
      {
        label: "网络隔离",
        value: "network=none"
      },
      {
        label: "资源边界",
        value: "CPU / 内存 / PID"
      }
    ],
    description: "为高校编程与数据科学教学设计的 AI 在线评测平台：同一套题目系统支持 ACM 标准输入输出、OOP 黑盒单元测试与 Kaggle 自定义评分，判题任务经 RabbitMQ / Celery 异步调度，在禁网且受 CPU、内存、PID 限制的 Docker 沙箱中执行。"
  }
];

