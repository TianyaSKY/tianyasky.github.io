export const projectCatalog = [
  {
    id: "vision-positioning",
    type: "research",
    title: "Monocular Vision 3D Reconstruction System",
    subtitle: "Cascaded Neural Pipeline · Ray Angle Constraints · 10–15cm RMSE Coastal Field Accuracy",
    badge: "National Innovation Project · Patent/Copyright",
    category: "Computer Vision & Geometric Pose Reconstruction",
    cover: "https://media.tianyasky.top/site/projects/vision-positioning/cover.png",
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
        label: "Simulation Accuracy",
        value: "1.1×10⁻⁵ m"
      },
      {
        label: "Sea Trial RMSE",
        value: "10–15 cm"
      },
      {
        label: "Corner F1-Score",
        value: "100.0 %"
      },
      {
        label: "Real-time FPS",
        value: "26 FPS"
      }
    ],
    description: "Addressing the geometric degeneracy of conventional PnP algorithms on collinear landmarks in offshore GPS-denied environments, we propose a 5-stage cascaded perception pipeline (YOLO mask + Harris corner + 9-class Patch CNN) combined with a multi-initial-guess nonlinear least squares pose optimizer based on back-projection ray angle conservation. Validated through rigorous simulation and real-world trials in Dalian coastal waters (10–15cm RMSE), earning recommendation at the Provincial Innovation Conference and computer software copyright."
  },
  {
    id: "crowd-sigmod",
    type: "research",
    title: "YOLO-PGMD: Probability-Guided Crowd Density Estimation",
    subtitle: "Probability-Guided Attention · Integral Conservation Density Map · 4 Public Benchmarks",
    badge: "Independent R&D · Computer Vision",
    category: "Computer Vision & Crowd Density Estimation",
    cover: "https://media.tianyasky.top/site/projects/crowd-sigmod/cover.png",
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
        label: "Resolution",
        value: "Stride-4 (160×160)"
      }
    ],
    description: "Designed a probability-guided density map (PGMD) network based on YOLO multi-scale features for high-density crowds with drastic scale variations and severe occlusions. Proposed a boundary-truncated renormalized Gaussian integral conservation algorithm (ΣD = N) combined with BCE+Dice spatial probability priors and multi-scale dilated residual refinement. Maintained high-resolution Stride-4 (160×160) outputs throughout, achieving 48.13 MAE / 74.17 RMSE on ShanghaiTech Part A and demonstrating strong cross-domain generalization across 4 international benchmarks."
  },
  {
    id: "cixin-singularity",
    type: "research",
    title: "Sci-Fi Singularity: Qwen3.6-27B Fine-Tuning",
    subtitle: "Qwen3.6-27B · 4-bit QLoRA · Single RTX 5090 Sci-Fi Prose Continuation",
    badge: "Project Lead · LLM SFT",
    category: "LLM Fine-Tuning & SFT",
    cover: "https://media.tianyasky.top/site/projects/cixin-singularity/cover.png",
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
        label: "Training Samples",
        value: "2,375"
      },
      {
        label: "Trainable Params",
        value: "0.039 %"
      },
      {
        label: "Training Time",
        value: "3.1 h"
      },
      {
        label: "LoRA Weights",
        value: "20 MB"
      }
    ],
    description: "Fine-tuned Qwen3.6-27B on a single RTX 5090 (32GB) using 4-bit NF4 QLoRA across 2,375 curated Cixin Liu-style continuation samples. Trained only 0.039% (10.5M) parameters with 20MB adapter weights, completing 2 epochs / 238 steps in 3.1 hours while maintaining authentic literary tone, rigorous physics descriptions, and coherent cosmic perspective."
  },
  {
    id: "rl-racing",
    type: "research",
    title: "3D Autonomous Racing Environment",
    subtitle: "PPO + 9-Directional Raycast LiDAR in a Custom 3D Gym Environment",
    badge: "Independent Dev · Open Source",
    category: "Reinforcement Learning & Environment Design",
    cover: "https://media.tianyasky.top/site/projects/rl-racing/cover.png",
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
        label: "Observation Space",
        value: "16-D Vector"
      },
      {
        label: "Action Space",
        value: "7 Discrete"
      },
      {
        label: "Parallel Envs",
        value: "8 Subprocesses"
      },
      {
        label: "Training Budget",
        value: "10M Steps"
      }
    ],
    description: "Built a Gymnasium-compatible 3D racing simulator from scratch with Pygame and OpenGL. Encoded vehicle position, heading, velocity, track deviation, and 9-ray LiDAR distances into a 16-dimensional observation vector. Trained with PPO parallelized across 8 sub-process environments, providing a full experimental pipeline for training, checkpointing, visualization, and manual teleoperation."
  },
  {
    id: "sky-cloud",
    type: "engineering",
    title: "SKYCloud: AI Workspace",
    subtitle: "Unifying Cloud Storage, RAG Knowledge Base, and Controlled Agents",
    badge: "Provincial 1st Prize · AI Challenge",
    category: "AI Workspace · RAG · Agent Runtime",
    cover: "https://media.tianyasky.top/site/projects/sky-cloud/cover.png",
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
        label: "AI Assistants",
        value: "Fast / Expert"
      },
      {
        label: "FastMCP Tools",
        value: "16 Tools / 4 Prompts"
      },
      {
        label: "Vector Index",
        value: "1024-D"
      },
      {
        label: "Workspace Isolation",
        value: "Dedicated Docker"
      }
    ],
    description: "A comprehensive AI Workspace for individuals and teams: integrates chunked upload and cloud file management with multi-route RAG retrieval, dual-mode AI assistants (Fast/Expert), isolated Docker workspaces, and a 16-tool FastMCP server allowing agents to read, edit, execute code, and review Git diffs within authorized permission boundaries."
  },
  {
    id: "sky-douyin",
    type: "engineering",
    title: "SKYDouyin: Video Recommendation Pipeline",
    subtitle: "Full-Stack MVP from Video Ingestion to Vector Retrieval & Event Bus",
    badge: "End-to-End RecSys MVP",
    category: "Recommendation System & Event Pipeline",
    cover: "https://media.tianyasky.top/site/projects/sky-douyin/cover.png",
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
        label: "Clients",
        value: "Web + Android"
      },
      {
        label: "Upload Features",
        value: "Chunked / Resumable"
      },
      {
        label: "Recall Strategies",
        value: "Trending + Vector"
      },
      {
        label: "Event Pipeline",
        value: "RabbitMQ Async"
      }
    ],
    description: "An end-to-end short video recommendation platform: Web and Android clients handle chunked video uploads, smooth playback, and interaction events; Spring Boot manages transactional data; FastAPI generates multimodal embeddings; RabbitMQ decouples event pipelines; and Milvus performs vector recall with user cold-start clustering."
  },
  {
    id: "sky-oj",
    type: "engineering",
    title: "SKYOJ: Distributed Online Judge",
    subtitle: "Multi-Paradigm Judge Platform for ACM / OOP / Kaggle Competitions",
    badge: "Independent Dev · Open Source",
    category: "Online Judge & Secure Sandbox",
    cover: "https://media.tianyasky.top/site/projects/sky-oj/cover.png",
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
        label: "Judge Paradigms",
        value: "ACM / OOP / Kaggle"
      },
      {
        label: "Async Queues",
        value: "judge / ai / file"
      },
      {
        label: "Network Boundary",
        value: "network=none"
      },
      {
        label: "Resource Isolation",
        value: "CPU / Mem / PID"
      }
    ],
    description: "A high-concurrency online evaluation system tailored for CS education: supports standard ACM I/O, black-box OOP unit tests, and Kaggle custom metric evaluations under a unified schema. Submissions are scheduled via RabbitMQ/Celery and executed in network-disabled, CPU/memory/PID-restricted Docker sandboxes."
  }
];
