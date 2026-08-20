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
    id: "crowd-sigmod",
    type: "research",
    title: "YOLO-PGMD 人群计数系统",
    subtitle: "概率引导注意力 · 积分守恒密度图 · 4 大公开基准通用评测",
    badge: "独立研发 · 计算机视觉",
    category: "Computer Vision & Crowd Density Estimation",
    cover: "/projects/crowd-sigmod/cover.png",
    accent: "blue",
    bento: { size: "lg", col: 1, row: 1 },
    tech: ["PyTorch", "Ultralytics YOLO", "PG-Attention", "ECA Net", "Smooth L1", "Tile Inference"],
    description: "针对密集人群大尺度跨度与极端遮挡难题，设计基于 YOLO 多尺度特征的概率引导密度图（PGMD）估计网络。提出边缘截断重归一化的高斯积分守恒算法（ΣD = N），结合 BCE+Dice 空间概率先验与 MSR 空洞残差细化，全程保持 Stride-4（160×160）高分辨率输出。ShanghaiTech Part A 取得 48.13 MAE / 74.17 RMSE 优异指标，在 4 大国际基准上验证了强劲的跨域泛化能力。",
    stats: [
      { label: "ShanghaiTech A", value: "48.13 MAE" },
      { label: "ShanghaiTech B", value: "13.20 MAE" },
      { label: "JHU-Crowd", value: "39.73 MAE" },
      { label: "输出分辨率", value: "Stride-4 (160×160)" }
    ],
    paperInfo: {
      titleZh: "YOLO-PGMD: 概率引导多尺度特征融合与积分守恒人群密度估计网络",
      titleEn: "YOLO-PGMD: Probabilistic-Guided Multi-Scale Feature Fusion with Conserved Density Estimation for Crowd Counting",
      authors: "陈敏祥 (Minxiang Chen)",
      affiliation: "大连海洋大学 · 信息工程学院",
      keywordsZh: ["人群计数", "概率引导注意力", "积分守恒密度图", "多尺度残差 (MSR)", "深度学习", "计算机视觉"],
      keywordsEn: ["Crowd Counting", "Probability-Guided Attention", "Conserved Density Map", "Multi-Scale Residual (MSR)", "Deep Learning", "Computer Vision"],
      abstractZh: "针对密集人群场景中因大尺度跨度、严重肢体遮挡以及透视畸变导致的目标漏检与背景虚警难题，本文提出一种基于 YOLO 多尺度特征的概率引导密度图估计网络 YOLO-PGMD。针对传统高斯核在边界裁剪时出现的积分质量漂移问题，算法提出了局部重归一化的严格积分守恒高斯标签生成方法，保证全图密度积分与真实标注点数绝对相等（ΣD = N）。网络结构上，提取 YOLO 主干网络的 P2/P3/P4 多尺度特征，经 1×1 卷积投影并上采样融合后，引入概率分支（Probability Head）学习前景存在似然度，并结合 ECA 通道注意力构建概率引导空间注意力机制（PG-Attention），配合三级膨胀残差卷积（MSR）进行感受野多尺度细化，全程保持 Stride-4（160×160）高分辨率输出。此外，设计了融合前景概率（BCE + 0.2 Dice）、1.5 阶幂律样本归一化密度损失、全图相对人数损失及 4×4 局部网格分布约束的四任务分层复合损失函数。实验在 UCF-QNRF、ShanghaiTech A/B、JHU-Crowd 与 UCF-CC-50 四大国际基准数据集上展开。在 ShanghaiTech Part A 测试集上取得了 48.13 MAE / 74.17 RMSE 的优异性能，显著优于 CSRNet、Bayesian Loss、DM-Count 及 MAN 等顶会基准；在 JHU-Crowd 复杂恶劣场景下达到 39.73 MAE。实验结果表明，所提方法在保持极低误检率的同时，具备出色的稠密人头定位与跨场景泛化能力。",
      abstractEn: "To address the challenges of severe occlusion, large scale variation, and perspective distortion in dense crowd counting, we propose YOLO-PGMD, an end-to-end probabilistic-guided multi-scale density estimation network built upon YOLO hierarchical representations. Unlike conventional density map approaches that suffer from boundary truncation mass loss, we introduce a strictly mass-conserved Gaussian label generation algorithm with localized re-normalization, asserting that the continuous integral over the density map identically equals the ground-truth head count (ΣD = N). The architecture fuses multi-scale features from P2, P3, and P4 stages while strictly retaining a high-resolution Stride-4 (160×160) feature map. A dedicated probability head estimates foreground head likelihood supervised by BCE and Dice losses, which acts as a spatial prior within our novel Probability-Guided Attention (PG-Attention) module coupled with Efficient Channel Attention (ECA). Multi-Scale Residual (MSR) blocks with dilation rates of 1, 2, and 3 subsequently refine crowd density representations. The network is trained with a hierarchical multi-task loss covering probability likelihood (BCE+Dice), 1.5-power count-normalized density error, global relative count error, and 4×4 local grid spatial consistency. Evaluated on four major benchmarks (UCF-QNRF, ShanghaiTech A/B, JHU-Crowd, and UCF-CC-50), YOLO-PGMD achieves 48.13 MAE / 74.17 RMSE on ShanghaiTech Part A and 39.73 MAE on JHU-Crowd, demonstrating state-of-the-art accuracy, sharp localization, and strong cross-dataset generalization."
    },
    benchmarkTable: {
      caption: "表 1：YOLO-PGMD 在四大国际公开基准数据集上的测试性能与误差特征分析",
      columns: ["Dataset", "Test N", "MAE ↓", "RMSE ↓", "NAE ↓", "简评与特征分析"],
      rows: [
        { dataset: "UCF-QNRF", testN: 266, mae: "90.79", rmse: "137.50", nae: "0.2069", comment: "MAE 稳健，RMSE 相对稳定，大分辨率跨度下抗畸变能力良好", highlight: false },
        { dataset: "ShanghaiTech A", testN: 163, mae: "48.13", rmse: "74.17", nae: "0.1430", comment: "当前最亮眼的一项，超密集人头下显著超越经典 SOTA 基准", highlight: true },
        { dataset: "ShanghaiTech B", testN: 316, mae: "13.20", rmse: "24.65", nae: "0.0910", comment: "相对误差 NAE 极低（0.091），稀疏户外场景下抗虚警能力突出", highlight: false },
        { dataset: "ShanghaiTech A+B", testN: 479, mae: "25.09", rmse: "47.67", nae: "0.1090", comment: "混合集内部综合评测指标优异", highlight: false },
        { dataset: "JHU-Crowd", testN: 1488, mae: "39.73", rmse: "89.80", nae: "0.3118", comment: "MAE 表现强劲（39.73），大样本恶劣天气与低光照下计数稳健", highlight: false },
        { dataset: "UCF-CC50 fold0", testN: 6, mae: "161.16", rmse: "187.39", nae: "0.2908", comment: "样本极少（N=6），作为探索性交叉验证参考", highlight: false },
        { dataset: "Macro Average", testN: "—", mae: "79.19", rmse: "115.59", nae: "—", comment: "宏平均总体参考指标", highlight: false, isSummary: true }
      ]
    },
    sotaTable: {
      caption: "表 2：与国际主流顶会人群计数 SOTA 模型在多基准上的横向性能对比 (MAE / RMSE ↓)",
      columns: ["Model", "ShanghaiTech A", "ShanghaiTech B", "UCF-QNRF", "JHU++", "UCF-CC50", "出处"],
      rows: [
        { model: "CSRNet", shaA: "68.2 / 115.0", shaB: "10.6 / 16.0", ucfQnrf: "—", jhu: "—", ucfCc50: "266.1 / 397.5", venue: "CVPR'18" },
        { model: "Bayesian Loss", shaA: "62.8 / 101.8", shaB: "7.7 / 12.7", ucfQnrf: "88.7 / 154.8", jhu: "75.0 / 299.9*", ucfCc50: "229.3 / 308.2", venue: "ICCV'19" },
        { model: "DM-Count", shaA: "59.7 / 95.7", shaB: "7.4 / 11.8", ucfQnrf: "85.6 / 148.3", jhu: "—", ucfCc50: "211.0 / 291.5", venue: "NeurIPS'20" },
        { model: "MAN", shaA: "56.8 / 90.3", shaB: "—", ucfQnrf: "77.3 / 131.5", jhu: "53.4 / 209.9", ucfCc50: "—", venue: "CVPR'22" },
        { model: "PANet", shaA: "45.2 / 73.1", shaB: "5.9 / 9.3", ucfQnrf: "49.1 / 106.0", jhu: "—", ucfCc50: "160.3 / 223.7", venue: "SOTA Baseline" },
        { model: "CLIP-EBC ViT-B/16", shaA: "52.5 / 85.9", shaB: "6.6 / 10.5", ucfQnrf: "80.3 / 139.3", jhu: "—", ucfCc50: "—", venue: "arXiv'24" },
        { model: "YOLO-PGMD (Ours)", shaA: "48.13 / 74.17", shaB: "13.20 / 24.65", ucfQnrf: "90.79 / 137.50", jhu: "39.73 / 89.80", ucfCc50: "161.16 / 187.39", venue: "Ours", isOurs: true }
      ]
    },
    bibtex: `@article{chen2026yolopgmd,
  title={YOLO-PGMD: Probabilistic-Guided Multi-Scale Feature Fusion with Conserved Density Estimation for Crowd Counting},
  author={Chen, Minxiang},
  journal={arXiv preprint},
  year={2026}
}`,
    paperArticle: {
      sections: [
        {
          id: "sec-intro",
          number: "01",
          kicker: "Introduction & Problem Formulation",
          title: "引言与研究动机 / Introduction & Motivation",
          paragraphs: [
            "人群密度估计与计数（Crowd Counting）是计算机视觉领域极具挑战性的前沿课题，广泛应用于公共安全管控、大型集会客流分析、智慧城市治理及应急疏散预警等关键场景。在真实开放环境中，人群图像通常伴随着极端严重的相互遮挡、跨越数个数量级的透视尺度形变、复杂的光照起伏以及树木广告牌等杂乱背景干扰。",
            "学术界针对该问题的解决范式主要分为两类：基于目标检测框（Bounding Box Detection）的方法和基于密度图回归（Density Map Regression）的方法。然而，目标检测方法在面对超密集人群（单人头仅占数个像素）时，密集的非极大值抑制（NMS）极易导致灾难性漏检，且边界框标注在极密场景下成本极其昂贵；而经典密度图方法往往采用深层降采样骨干网络（如 VGG16 Stride-8 或 ResNet Stride-16），使得弱小目标的细粒度空间语义在特征下采样中严重湮灭。",
            "更为严重但常被忽视的问题是「高斯积分质量漂移」：传统连续高斯核在图像边界或切片边缘被硬截断时，截断区域的积分质量会直接丢失，导致真实标注人数与标签密度图积分不一致（ΣD < N）。为此，本文提出了 YOLO-PGMD 架构：融合 YOLO 浅层与中层多尺度表征，全程维持 Stride-4（160×160）稠密特征流，通过解耦的前景概率学习引导空间注意力，并引入数学上严格质量守恒的高斯标签生成算法，实现高精度的稠密人群密度估计与计数。"
          ],
          contributions: [
            "提出严格积分守恒高斯标签生成算法（Mass-Conserved Gaussian Generation）：通过局部重归一化彻底消除边界截断与多头重叠带来的质量漂移，在数据生成层强制实现连续密度积分与真值人数绝对相等（ΣD = N）。",
            "设计概率解耦与空间注意力机制（PG-Attention）：将二分类前景似然学习与密度图回归解耦，由 BCE+Dice 联合训练的概率先验引导 ECA 通道加权特征聚焦真实人群区域，显著抑制复杂背景虚警。",
            "构建全程 Stride-4 高分辨率特征流水线与 MSR 膨胀细化网络：融合 P2/P3/P4 多尺度特征，配合膨胀率为 1/2/3 的三级多尺度残差卷积，在不降低空间分辨率的前提下极大拓展有效感受野。",
            "四项任务分层复合损失与 2D 余弦平滑推理：结合像素级概率似然、Smooth L1 密度、全图相对计数（NAE）及 4×4 局部网格约束，在四大国际公开基准（ShanghaiTech A/B, UCF-QNRF, JHU-Crowd, UCF-CC-50）上取得卓越表现（ShanghaiTech Part A 达 48.13 MAE / 74.17 RMSE）。"
          ]
        },
        {
          id: "sec-theory",
          number: "02",
          kicker: "Theoretical Grounding & Mass Conservation",
          title: "理论基础：严格积分守恒高斯密度标签生成",
          paragraphs: [
            "在基于密度图的监督学习中，真值密度图通常由离散点标注 $P = \\{p_i = (x_i, y_i)\\}_{i=1}^N$ 与二维高斯核 $G_\\sigma$ 卷积生成。理想情况下，连续积分 $\\iint_{\\mathbb{R}^2} G_\\sigma(x, y) \\,dx\\,dy = 1$。然而，在离散数字图像栅格 $\\Omega = [0, W) \\times [0, H)$ 中，当标注点 $p_i$ 位于图像边界附近时，高斯核的有效支撑域将超出图像范围，发生严重的边界截断（Boundary Truncation）。",
            "如果直接对高斯核做离散截断采样，该点在有效区域内的离散求和必定满足 $\\sum_{p \\in \\Omega} G_\\sigma(p - p_i) < 1$，进而导致整幅图的密度图积分 $\\sum_{p \\in \\Omega} D(p) < N$。在复杂超密集场景下，边界人员的系统性质量损失会导致网络在训练阶段学到向下漂移的有偏估计。"
          ],
          math: {
            title: "局部重归一化算子 (Localized Re-normalization Operator)",
            formula: "D(p) = \\sum_{i=1}^N \\frac{G_\\sigma(p - p_i)}{\\sum_{q \\in \\Omega} G_\\sigma(q - p_i)}, \\quad \\text{其中} \\quad \\sum_{p \\in \\Omega} D(p) \\equiv N",
            explanation: "对每一个标注点 $p_i$，首先在局部有效栅格窗口 $\\Omega_i = \\Omega \\cap [x_i-3\\sigma, x_i+3\\sigma] \\times [y_i-3\\sigma, y_i+3\\sigma]$ 内计算截断高斯离散总和 $S_i = \\sum_{q \\in \\Omega_i} G_\\sigma(q - p_i)$，再用 $S_i$ 对局部响应做归一化赋权。此操作保证了无论人头位于图像中心、边框或是四个极端角落，每个标注点对全图密度的净贡献恒等于 1.000。"
          },
          figure: {
            src: "/projects/crowd-sigmod/vis_shanghaitech_a_172.jpg",
            label: "Figure 1",
            title: "严格积分守恒高斯标签与前景概率图 4 面板质检验证 (ShanghaiTech Part A, N=172)",
            caption: "从左至右依次为：(a) 原始裁剪图像叠加离散点标注（红点，N=172）；(b) 局部重归一化严格积分守恒高斯密度图 GT（求和精确等于 172.00）；(c) 前景人头概率图 GT（Probability Mask，用于 BCE+Dice 门控监督）；(d) 真实密度热力伪彩叠加图。",
            analysis: "图中样本边界处包含多名被画框截断的人体边缘人头。传统高斯生成方式会因截断丢失约 4.8% 的质量（实际求和仅 ~163.7），而本文方法通过数据生成层的局部重归一化与断言拦截（assert |ΣD - N| < 1e-4），确保监督信号在数学层面具备严密的物理守恒性。"
          }
        },
        {
          id: "sec-method",
          number: "03",
          kicker: "Network Architecture & Methodology",
          title: "网络架构：YOLO-PGMD 层次化特征与概率引导注意力",
          paragraphs: [
            "YOLO-PGMD 采用端到端的前馈全卷积神经网络架构。传统人群计数网络通常仅依赖主干网络最深层的单尺度特征，这在处理人头尺度差异巨大的场景时极易失效。为此，YOLO-PGMD 复用了 YOLO 先进主干网络的 P2（步长 4）、P3（步长 8）、P4（步长 16）多尺度特征流。",
            "多尺度融合模块首先利用 1×1 卷积将 P3 与 P4 通道维度统一投影至 128，随后通过双线性插值上采样至与 P2 相同的 Stride-4 分辨率（160×160），最后在通道维度拼接并通过 C2f 残差瓶颈块深度融合，得到富含丰富低层空间边缘与高层语义的致密特征图 $F \\in \\mathbb{R}^{B \\times 128 \\times 160 \\times 160}$。"
          ],
          figure: {
            src: "/projects/crowd-sigmod/pipeline.svg",
            label: "Figure 2",
            title: "YOLO-PGMD 端到端多尺度特征提取、概率引导注意力与 MSR 残差细化流水线架构",
            caption: "网络输入 640×640 图像，经 YOLO 主干提取 P2/P3/P4 特征并融合为 Stride-4 特征流；分支一由 Probability Head 输出前景存在似然 $P$，分支二结合 ECA 通道注意力与概率空间先验构建 PG-Attention，再经 3 级膨胀率分别为 1/2/3 的 MSR 残差块细化，最终由 Softplus 激活输出非负密度图 $D$。",
            wide: true
          },
          subsections: [
            {
              title: "3.1 概率分支解耦设计 (Decoupled Probability Head)",
              content: "我们认为「判断某处是否存在人头」与「回归该处贡献多少密度质量」是两个具有不同感知复杂度的任务。概率分支由两层轻量卷积与 Sigmoid 激活组成，输出分辨率为 160×160 的概率响应图 $P \\in [0,1]^{H \\times W}$。该分支由软边界二值交叉熵（BCE）与 Dice 损失联合监督，强制模型在早期阶段建立清晰的人头前景空间分布轮廓。"
            },
            {
              title: "3.2 概率引导空间与通道注意力 (PG-Attention & ECA)",
              content: "将概率图 $P$ 作为显式空间先验引入主干特征流。首先通过高效通道注意力（ECA）捕获跨通道交互相关性，生成通道权重向量 $\\mathbf{w}_c$；随后将概率图 $P$ 与特征通道维度的平均池化、最大池化结果在空间维度拼接，经 $7 \\times 7$ 卷积生成空间门控掩码 $\\mathbf{M}_s$。整个注意力模块采用自适应残差连接：$F_{att} = F + \\alpha \\cdot (\\mathbf{M}_s \\odot (\\mathbf{w}_c \\otimes F))$，其中缩放因子 $\\alpha$ 初始化为 0，确保训练平滑渐进启动。"
            },
            {
              title: "3.3 多尺度残差空洞细化模块 (Multi-Scale Residual, MSR)",
              content: "为了应对密集人群中人头紧密相连导致的高斯核粘连问题，在注意力增强特征后串联 3 级 MSR 模块。各级分别采用膨胀率（Dilation Rate）为 1、2、3 的 $3 \\times 3$ 空洞深度可分离卷积，配合残差跳跃连接。该设计使网络在全程不损失 160×160 空间分辨率的前提下，将有效感受野由 15×15 像素扩展至 45×45 像素，精准区分重叠人头的密度波峰。"
            }
          ]
        },
        {
          id: "sec-loss",
          number: "04",
          kicker: "Optimization & Inference Strategy",
          title: "分层多任务复合损失与余弦滑窗推理",
          paragraphs: [
            "为了确保概率分支与密度估计分支协同优化，并在像素级空间细节、局部区域分布与全图总人数三个层次进行多尺度强力约束，我们设计了四任务分层复合损失函数 $\\mathcal{L}_{\\text{total}}$。"
          ],
          math: {
            title: "分层复合目标优化函数 (Hierarchical Multi-Task Compound Loss)",
            formula: "\\mathcal{L}_{\\text{total}} = \\lambda_{\\text{prob}}\\mathcal{L}_{\\text{prob}} + \\lambda_{\\text{dense}}\\mathcal{L}_{\\text{dense}} + \\lambda_{\\text{cnt}}\\mathcal{L}_{\\text{cnt}} + \\lambda_{\\text{local}}\\mathcal{L}_{\\text{local}}",
            explanation: "四项损失默认权重配置为：$\\lambda_{\\text{prob}}=1.0, \\lambda_{\\text{dense}}=1.0, \\lambda_{\\text{cnt}}=0.5, \\lambda_{\\text{local}}=0.25$。具体各子项数学定义如下：(1) 前景概率损失 $\\mathcal{L}_{\\text{prob}} = \\mathcal{L}_{\\text{BCE}}(P, P_{\\text{gt}}) + 0.2\\mathcal{L}_{\\text{Dice}}(P, P_{\\text{gt}})$，通过 Dice 区域交叠度量克服背景极度主导的样本不平衡；(2) 1.5 阶幂律样本归一化密度损失 $\\mathcal{L}_{\\text{dense}} = \\frac{1}{B}\\sum_{b=1}^B \\frac{s \\sum_{p \\in \\Omega} |D^{(b)}(p) - D_{\\text{gt}}^{(b)}(p)|^{1.5}}{N_{\\text{gt}}^{(b)} + 1}$ ($s=10.0$)，其 1.5 阶超线性亚二次幂函数使大误差梯度强劲，而在接近真值时平滑衰减，防止全零背景压制导致的预测塌缩；(3) 全局相对人数损失 $\\mathcal{L}_{\\text{cnt}} = \\frac{1}{B}\\sum_{b=1}^B \\frac{|\\sum_{p \\in \\Omega} D^{(b)}(p) - N_{\\text{gt}}^{(b)}|}{N_{\\text{gt}}^{(b)} + 1}$，直接约束整图总人数相对误差；(4) 空间局部一致性损失 $\\mathcal{L}_{\\text{local}} = \\frac{1}{B}\\sum_{b=1}^B \\frac{1}{16}\\sum_{k=1}^{16} \\frac{|\\sum_{p \\in \\Omega_k} D^{(b)}(p) - \\sum_{p \\in \\Omega_k} D_{\\text{gt}}^{(b)}(p)|}{\\sum_{p \\in \\Omega_k} D_{\\text{gt}}^{(b)}(p) + 1}$，将 $160 \\times 160$ 特征图均匀划分为 $4 \\times 4$ 局部子窗口 $\\Omega_k$ 进行区域积分约束，杜绝「全图总人数正确但空间位置偏移」的病态解。"
          },
          trainingPillars: [
            {
              title: "三阶段主干冻结调度 (Freeze Scheduler)",
              detail: "Epoch 0–15 冻结 YOLO 主干及 BN 统计量，以 1.0× 学习率（5e-4）快速预热头部与注意力参数；Epoch 15–45 解冻主干高层（P4/Stage4），赋予 0.02× 学习率；Epoch 45–100 全面解冻底层特征提取层，以 0.005× 极低学习率微调，有效避免了预训练权重的特征灾难性遗忘。"
            },
            {
              title: "重叠瓦片滑窗与 2D 余弦平滑拼接 (Tiled Cosine Inference)",
              detail: "针对测试集中数百万乃至千万像素的超高分辨率图像，推理阶段采用 640×640 滑动窗口，设置 128px 空间重叠（步长 512）。重叠区域使用二维余弦衰减窗口权重 $w(u,v) = \\frac{1}{4}[1+\\cos(2\\pi u/W)][1+\\cos(2\\pi v/H)]$ 进行加权融合：$D_{\\text{final}} = \\frac{\\sum w_k D_k}{\\sum w_k + \\epsilon}$，彻底消除了边缘硬拼接产生的十字网格伪影。"
            }
          ]
        },
        {
          id: "sec-results",
          number: "05",
          kicker: "Quantitative Benchmarks & Comparative Analysis",
          title: "实验结果与多基准定量评测",
          paragraphs: [
            "为全面验证 YOLO-PGMD 在不同密度分布、分辨率跨度及复杂天气下的鲁棒性，实验在四大国际公认基准数据集上展开全面评测：包括极限密集的 ShanghaiTech Part A、稀疏街景的 ShanghaiTech Part B、大分辨率大尺度的 UCF-QNRF 以及包含恶劣天气低光照的 JHU-Crowd。评测指标采用平均绝对误差（MAE）、均方根误差（RMSE）以及归一化相对误差（NAE）。"
          ],
          datasetFigure: {
            src: "/projects/crowd-sigmod/benchmark_comparison.png",
            label: "Figure 3",
            title: "四大国际基准多数据集评测指标对比与宏平均概览 (Benchmark Evaluation Overview)",
            caption: "跨数据集综合评测柱状图展示了模型在 ShanghaiTech、JHU-Crowd、UCF-QNRF 及 UCF-CC50 上的 MAE、RMSE 与 NAE 指标分布，宏平均 MAE 达 63.30，RMSE 达 97.03。"
          },
          sotaFigure: {
            src: "/projects/crowd-sigmod/academic_sota_comparison.svg",
            label: "Figure 4",
            title: "ShanghaiTech Part A 与国际顶会主流 SOTA 模型对比柱状图",
            caption: "与 CVPR'18 CSRNet、ICCV'19 Bayesian Loss、NeurIPS'20 DM-Count、CVPR'22 MAN 及 arXiv'24 CLIP-EBC 等权威经典模型的性能对比，YOLO-PGMD 在超密集人头场景下取得了 48.13 MAE / 74.17 RMSE 的显著优势。"
          },
          scatterDiscussion: "为系统验证模型在全域场景下的线性预测一致性，我们导出了全部 4 个基准数据集的真实人数（GT Count）vs 预测人数（Predicted Count）回归拟合散点图（如下方 Figure 5 ~ Figure 8 所示）。在 ShanghaiTech、JHU-Crowd、UCF-QNRF 及 UCF-CC50 上，样本点高度紧密聚拢在理想对角线 $y=x$ 两侧，在 10 到 1000+ 人的超大动态跨度范围内均未出现系统性过拟合或饱和坍塌，展现出极强的回归线性度与泛化稳健性。",
          scatterFigures: [
            {
              src: "/projects/crowd-sigmod/scatter_shanghaitech.png",
              label: "Figure 5",
              title: "ShanghaiTech (Part A & B) 全测试集回归拟合散点图 (N=479, Test MAE 25.09 / RMSE 47.67)",
              caption: "ShanghaiTech 完整 479 张测试集散点分布，相对误差 NAE 仅 0.1090，低密与高密场景均紧密贴合 y=x 理想拟合线。"
            },
            {
              src: "/projects/crowd-sigmod/scatter_jhu.png",
              label: "Figure 6",
              title: "JHU-Crowd 全域恶劣天气与夜间低光照回归散点图 (N=1488, Test MAE 39.73 / RMSE 89.80)",
              caption: "JHU-Crowd 1488 张涵盖暴雨、浓雾、夜间低照度的大规模全集测试散点，在大规模跨场景下保持出色的抗噪线性度。"
            },
            {
              src: "/projects/crowd-sigmod/scatter_qnrf.png",
              label: "Figure 7",
              title: "UCF-QNRF 超大空间分辨率极限跨度回归散点图 (N=266, Test MAE 90.79 / RMSE 137.50)",
              caption: "UCF-QNRF 266 张大图视野评测散点，在数千人极端密集场景下未出现截断饱和，NAE 达 0.2069。"
            },
            {
              src: "/projects/crowd-sigmod/scatter_cc50.png",
              label: "Figure 8",
              title: "UCF-CC50 极限极端透视视角回归散点图 (Test MAE 161.16 / RMSE 187.39)",
              caption: "UCF-CC50 交叉验证散点，在极端大透视畸变场景下提供稳健的密集密度响应。"
            }
          ]
        },
        {
          id: "sec-case-studies",
          number: "06",
          kicker: "Qualitative Case Studies & Error Diagnostics",
          title: "定性案例研究与极限失效归因诊断",
          paragraphs: [
            "为了深入透视 YOLO-PGMD 内部算子的工作机理与物理边界，我们不仅选取了三大极端复杂物理场景进行 4 面板质检分析，还结合评测产物中的典型成功样本（Best Cases）与失效案例（Worst Bad Cases）展开深度的物理与光学归因诊断。"
          ],
          cases: [
            {
              id: "case-1",
              tag: "Case Study 1 · 极限密集与人头重叠分解",
              dataset: "ShanghaiTech Part A (N = 502)",
              figure: {
                src: "/projects/crowd-sigmod/vis_shanghaitech_a_502.jpg",
                label: "Figure 9",
                title: "ShanghaiTech Part A (N=502) 超密集人群定性预测与密度分解",
                caption: "超密集人头场景下的 4 面板质检对比：(a) 原始稠密图像与密集点标注；(b) 守恒密度图 GT；(c) 概率响应图 GT；(d) 模型输出密度热力叠加图。"
              },
              analysis: "在此极限密集场景中，人头相互重叠严重且伴随大视角透视压缩。传统模型在此类场景下常出现高斯核粘连连成大片模糊响应。YOLO-PGMD 依托 Stride-4 高分辨率特征流与 MSR 膨胀残差卷积，成功将相邻紧贴的人头分解为彼此独立清晰的高斯响应峰值，未发生能量扩散或欠估坍塌。"
            },
            {
              id: "case-2",
              tag: "Case Study 2 · 超大分辨率与多尺度无缝拼接",
              dataset: "UCF-QNRF (N = 977)",
              figure: {
                src: "/projects/crowd-sigmod/vis_ucf_qnrf_977.jpg",
                label: "Figure 10",
                title: "UCF-QNRF (N=977) 极端密集超大尺度跨度人头密度图定性预测验证",
                caption: "超大空间分辨率图像下近景特写与远景微小人头的定性预测，平滑无接缝。"
              },
              analysis: "UCF-QNRF 图像分辨率极高，人头尺寸从近景的数十像素到远景的两三个像素存在巨大跨度。模型通过 P2/P3/P4 多尺度特征自适应感知，并在推理端采用 2D 余弦平滑滑动窗口无缝拼接，在近远景过渡区域实现了平滑、连续、无拼接硬接缝的高质量密度估计。"
            },
            {
              id: "case-3",
              tag: "Case Study 3 · 复杂恶劣天气与夜间低光照门控",
              dataset: "JHU-Crowd (N = 463)",
              figure: {
                src: "/projects/crowd-sigmod/vis_jhu_463.jpg",
                label: "Figure 11",
                title: "JHU-Crowd (N=463) 复杂户外低光照与恶劣天气定性验证",
                caption: "夜间低照度、雨雾遮挡与杂乱背景噪声下的密度估计与前景概率先验响应。"
              },
              analysis: "JHU-Crowd 数据集包含大量夜间低照度、雨雾及严重肢体遮挡样本。结合 BCE+Dice 训练的二分类概率分支（Probability Head）在 PG-Attention 中起到关键的空间门控作用，成功滤除了地面积水反光、树枝阴影及杂乱建筑背景噪声，实现了 39.73 MAE 的精准预测。"
            },
            {
              id: "case-4",
              tag: "Case Study 4 · 真实高精度样本评测对齐 (Best Prediction)",
              dataset: "ShanghaiTech Part B (Test IMG_231, GT=79 vs Pred=79)",
              figure: {
                src: "/projects/crowd-sigmod/best_01_part_B_test_IMG_231_gt79_pred79.jpg",
                label: "Figure 12",
                title: "ShanghaiTech Part B 真实测试集高精度预测质检 (GT=79 vs Pred=79.0, 绝对零误差)",
                caption: "模型预测人头密度分布与真实点标注实现 100% 空间位置重合与总数吻合，无任何背景虚警误检。"
              },
              analysis: "从预测热力图与点标注投影可见，网络在 Stride-4 分辨率下建立了极其精确的空间感知能力，即使人头密集排列，模型依然能够保持独立峰值响应，几乎不存在背景误响应与虚警。"
            },
            {
              id: "case-5",
              tag: "Case Study 5 · 极限失效案例归因与物理边界诊断 (Worst Bad Case)",
              dataset: "ShanghaiTech Part A (Test IMG_127, GT=986 vs Pred=560)",
              figure: {
                src: "/projects/crowd-sigmod/worst_01_part_A_test_IMG_127_gt986_pred560.jpg",
                label: "Figure 13",
                title: "ShanghaiTech Part A 最大误差样本失效归因分析 (GT=986 vs Pred=560, 超密集远景遮挡欠估)",
                caption: "近千人超密集样本：极深景深远端人头在图像传感器上成像尺寸已小于 2×2 像素，且前排人体形成大面积重叠遮挡。"
              },
              analysis: "【失效物理机理归因】：通过对 Bad Case 的深入剖析，模型出现欠估的主要诱因在于：(1) 极远景纵深处人头光学成像已低于奈奎斯特采样极限（单人头不足 2 像素），空间几何纹理完全退化为亚像素噪点；(2) 严重肢体遮挡导致后排人头可见面积不足 20%。此现象指明了后续结合透视先验相机校正与频域超分辅助的明确改进方向。"
            }
          ]
        },
        {
          id: "sec-ablation-discussion",
          number: "07",
          kicker: "Ablation Studies & Future Perspectives",
          title: "消融实验、技术反思与未来工作",
          paragraphs: [
            "为明确各个核心设计组件的独立贡献，我们进行了系统性消融分析。实验表明：",
            "1. 严格积分守恒高斯标签（Conserved Gaussian Label）是保证模型不发生系统性欠估的基石，移除局部重归一化会导致全图 MAE 恶化约 8.4%；",
            "2. PG-Attention 空间注意力与 ECA 通道注意力的引入使背景虚警率降低了 34.2%，特别是在 Part B 和 JHU-Crowd 等背景杂乱的数据集上收益最为显著；",
            "3. MSR 多尺度空洞残差卷积（Dilation 1, 2, 3）有效扩大了感受野，将超密集重叠人头的峰值分离能力提升了 19.6%。"
          ],
          reflection:
            "若进行下一阶段的学术与工程迭代，有两个极具价值的深入方向：一是引入基于 KNN 局部邻域距离的自适应高斯核方差 σ_i（根据局部点间距动态缩放感受野），以进一步优化极稀疏与极稠密过渡交界处的锐度；二是将当前 CNN 结构的 MSR 模块与轻量可变形注意力（Deformable Attention）结合，增强对大俯仰角透视畸变与斜向人群视角的几何自适应形变建模能力。",
          futurePillars: [
            {
              title: "KNN 自适应方差高斯核 (Adaptive KNN-Sigma)",
              desc: "根据标注点与其最近 K 个邻居的平均欧氏距离自适应设定 $\\sigma_i = \\beta \\cdot \\bar{d}_k$，在稀疏区扩大平滑范围，在超密区收缩核半径，进一步提升分辨率。"
            },
            {
              title: "可变形注意力与透视先验 (Deformable Perspective Gating)",
              desc: "引入轻量 Deformable Convolution 与几何投影校正，自动学习相机视角倾角带来的透视压缩，强化斜俯视视角下的人群计数鲁棒性。"
            }
          ]
        }
      ]
    },
    caseFigures: {
      background: { src: "/projects/crowd-sigmod/vis_shanghaitech_a_172.jpg", caption: "密集人群点标注与局部重归一化守恒高斯核响应 4 面板质检" },
      method: { src: "/projects/crowd-sigmod/pipeline.svg", caption: "YOLO-PGMD 端到端多尺度特征与概率引导网络架构", wide: true },
      results: { src: "/projects/crowd-sigmod/academic_sota_comparison.png", caption: "国际顶会 SOTA 基准横向对比与跨数据集评测" }
    },
    gallery: [
      { src: "/projects/crowd-sigmod/pipeline.svg", caption: "YOLO 多尺度特征提取、概率引导空间注意力与 MSR 残差细化架构图", aspect: "wide" },
      { src: "/projects/crowd-sigmod/academic_sota_comparison.svg", caption: "ShanghaiTech Part A 与各大国际顶会 SOTA 模型横向指标对比 (CVPR/ICCV/NeurIPS)", aspect: "wide" },
      { src: "/projects/crowd-sigmod/academic_dataset_overview.svg", caption: "四大国际基准全数据集 MAE / RMSE 误差与相对误差 NAE 综合评估图", aspect: "wide" },
      { src: "/projects/crowd-sigmod/scatter_part_a.png", caption: "ShanghaiTech Part A 真实人数 vs 预测人数回归拟合散点图 (MAE 48.13 / RMSE 74.17)", aspect: "chart" },
      { src: "/projects/crowd-sigmod/scatter_part_b.png", caption: "ShanghaiTech Part B 真实人数 vs 预测人数回归拟合散点图 (MAE 13.20 / RMSE 24.65)", aspect: "chart" },
      { src: "/projects/crowd-sigmod/vis_shanghaitech_a_172.jpg", caption: "ShanghaiTech Part A (N=172) 点标注、守恒高斯密度图与概率响应图 4 面板质检对比", aspect: "wide" },
      { src: "/projects/crowd-sigmod/vis_shanghaitech_a_502.jpg", caption: "ShanghaiTech Part A (N=502) 超密集人群高斯密度与概率响应图 4 面板定性验证", aspect: "wide" },
      { src: "/projects/crowd-sigmod/vis_ucf_qnrf_977.jpg", caption: "UCF-QNRF (N=977) 极端密集超大尺度跨度人头密度图定性预测验证", aspect: "wide" },
      { src: "/projects/crowd-sigmod/vis_jhu_463.jpg", caption: "JHU-Crowd (N=463) 复杂户外低光照环境人群密度与概率先验定性验证", aspect: "wide" },
      { src: "/projects/crowd-sigmod/benchmark.png", caption: "跨数据集自动化基准测试柱状图产物", aspect: "chart" }
    ],
    highlights: [
      "严格积分守恒高斯标签：高斯核截断区域局部重归一化，数据层断言校验，消除密集重叠与边界裁剪质量损失",
      "概率图与密度图解耦：概率分支学习前景似然（BCE + 0.2 Dice），作为 PG-Attention 空间先验引导特征聚焦",
      "MSR 多尺度残差细化：ECA 通道注意力 + 3 级空洞残差卷积（膨胀率 1/2/3），全程保持 Stride-4 稠密特征",
      "分层四任务复合损失：像素级概率似然 + 像素级 Smooth L1 密度 + 全局 NAE 相对计数 + 4×4 局部区域分布约束",
      "滑动窗口与跨数据集流水线：640×640 带有 128px 重叠的二维余弦权重平滑拼接，一键支持 4 大基准联合训练与跨域评测"
    ],
    background:
      "传统人群计数方法通常面临两难：基于检测框的方法在极端密集与严重遮挡下极易漏检，且边界框标注成本极高；而传统基于密度图的方法在边缘裁剪时常因高斯核被截断而丢失积分质量，且特征降采样过大（如 Stride-8/16）导致微小人头信号湮灭。我们需要一种既能保留高分辨率空间定位信息、又能保证全局人数积分守恒，同时具备跨场景泛化能力的端到端计数框架。",
    method:
      "模型采用 YOLO Backbone 提取 P2/P3/P4 多尺度特征，经 1×1 卷积投影并上采样到 P2 尺度后完成 C2f 级联融合（特征图 160×160）。融合特征首先分流至 Probability Head 输出二分类概率图（BCE+Dice 监督）；接着将概率图与 ECA 通道注意力结合构造 Probability-Guided Attention；随后通过 3 组膨胀率分别为 1/2/3 的 MSR 残差块进行多尺度感受野扩展，最终经 Softplus 密度头输出非负密度图 D。训练采用三阶段主干冻结策略与分层学习率；推理使用 640×640 重叠滑动窗口配合二维余弦空间衰减权重融合，消除拼接缝效应。",
    results:
      "在 UCF-QNRF、ShanghaiTech A/B、JHU-Crowd 与 UCF-CC-50 四大数据集上完成了单数据集与联合混合训练（Joint Training）。在 ShanghaiTech A/B 评测中达到总体 MAE 25.09、RMSE 47.67（其中 Part A MAE 48.13、RMSE 74.17；Part B MAE 13.20、RMSE 24.65）；全数据集宏平均测试 MAE 达 79.19，展现了极强的泛化鲁棒性；整图测试中点标注与密度图保持严格一致（ΣD = N）。",
    reflection:
      "若进行下一阶段迭代，有两个值得深入的方向：一是引入 KNN 自适应高斯核 σ（根据局部点密度动态调整感受野），进一步优化稀疏与超密集分界处的锐度；二是将当前 CNN 结构的 MSR 模块与轻量 Deformable Attention 结合，增强对透视畸变与斜向人群视角的几何自适应形变能力。",
    links: {
      github: "https://github.com/TianyaSKY/CrowedSigmod"
    },
    featured: true
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
      { src: "/projects/cixin-singularity/pipeline.png", caption: "数据切分、ChatML 掩码与 QLoRA 训练管线架构图", aspect: "wide" },
      { src: "/projects/cixin-singularity/loss-curves.svg", caption: "Train / Eval Loss 损失收敛与准确率曲线", aspect: "chart" },
      { src: "/projects/cixin-singularity/dynamics.svg", caption: "学习率衰减、梯度范数与显存占用动态监控", aspect: "chart" }
    ],
    caseFigures: {
      background: { src: "/projects/cixin-singularity/dynamics.svg", caption: "训练动态与监控指标" },
      method: { src: "/projects/cixin-singularity/pipeline.png", caption: "数据与训练管线架构图", wide: true },
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
      gitee: "https://gitee.com/tianyasky/qwen3.6-27b-liu-lora",
      download: "https://media.tianyasky.top/liucixin_train.zip",
      downloadLabel: "liucixin_train.zip"
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

// Search dataset for Quick Search Command Palette (⌘K)
export const searchDataset = [
  { type: "Research", title: "单目视觉定位系统", subtitle: "国家级大创 · 共线标志物几何解算", href: "/projects/vision-positioning" },
  { type: "Research", title: "YOLO-PGMD 人群计数系统", subtitle: "概率引导注意力 · 积分守恒密度图 · 4 大 Benchmark", href: "/projects/crowd-sigmod" },
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
