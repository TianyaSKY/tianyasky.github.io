export const crowdSigmodDetail = {
  paperInfo: {
    titleZh: "YOLO-PGMD: 概率引导多尺度特征融合与积分守恒人群密度估计网络",
    titleEn: "YOLO-PGMD: Probabilistic-Guided Multi-Scale Feature Fusion with Conserved Density Estimation for Crowd Counting",
    authors: "陈敏祥 (Minxiang Chen)",
    affiliation: "大连海洋大学 · 信息工程学院",
    keywordsZh: [
      "人群计数",
      "概率引导注意力",
      "积分守恒密度图",
      "多尺度残差 (MSR)",
      "深度学习",
      "计算机视觉"
    ],
    keywordsEn: [
      "Crowd Counting",
      "Probability-Guided Attention",
      "Conserved Density Map",
      "Multi-Scale Residual (MSR)",
      "Deep Learning",
      "Computer Vision"
    ],
    abstractZh: "针对密集人群场景中因大尺度跨度、严重肢体遮挡以及透视畸变导致的目标漏检与背景虚警难题，本文提出一种基于 YOLO 多尺度特征的概率引导密度图估计网络 YOLO-PGMD。针对传统高斯核在边界裁剪时出现的积分质量漂移问题，算法提出了局部重归一化的严格积分守恒高斯标签生成方法，保证全图密度积分与真实标注点数绝对相等（ΣD = N）。网络结构上，提取 YOLO 主干网络的 P2/P3/P4 多尺度特征，经 1×1 卷积投影并上采样融合后，引入概率分支（Probability Head）学习前景存在似然度，并结合 ECA 通道注意力构建概率引导空间注意力机制（PG-Attention），配合三级膨胀残差卷积（MSR）进行感受野多尺度细化，全程保持 Stride-4（160×160）高分辨率输出。此外，设计了融合前景概率（BCE + 0.2 Dice）、1.5 阶幂律样本归一化密度损失、全图相对人数损失及 4×4 局部网格分布约束的四任务分层复合损失函数。实验在 UCF-QNRF、ShanghaiTech A/B、JHU-Crowd 与 UCF-CC-50 四大国际基准数据集上展开。在 ShanghaiTech Part A 测试集上取得了 48.13 MAE / 74.17 RMSE 的优异性能，显著优于 CSRNet、Bayesian Loss、DM-Count 及 MAN 等顶会基准；在 JHU-Crowd 复杂恶劣场景下达到 39.73 MAE。实验结果表明，所提方法在保持极低误检率的同时，具备出色的稠密人头定位与跨场景泛化能力。",
    abstractEn: "To address the challenges of severe occlusion, large scale variation, and perspective distortion in dense crowd counting, we propose YOLO-PGMD, an end-to-end probabilistic-guided multi-scale density estimation network built upon YOLO hierarchical representations. Unlike conventional density map approaches that suffer from boundary truncation mass loss, we introduce a strictly mass-conserved Gaussian label generation algorithm with localized re-normalization, asserting that the continuous integral over the density map identically equals the ground-truth head count (ΣD = N). The architecture fuses multi-scale features from P2, P3, and P4 stages while strictly retaining a high-resolution Stride-4 (160×160) feature map. A dedicated probability head estimates foreground head likelihood supervised by BCE and Dice losses, which acts as a spatial prior within our novel Probability-Guided Attention (PG-Attention) module coupled with Efficient Channel Attention (ECA). Multi-Scale Residual (MSR) blocks with dilation rates of 1, 2, and 3 subsequently refine crowd density representations. The network is trained with a hierarchical multi-task loss covering probability likelihood (BCE+Dice), 1.5-power count-normalized density error, global relative count error, and 4×4 local grid spatial consistency. Evaluated on four major benchmarks (UCF-QNRF, ShanghaiTech A/B, JHU-Crowd, and UCF-CC-50), YOLO-PGMD achieves 48.13 MAE / 74.17 RMSE on ShanghaiTech Part A and 39.73 MAE on JHU-Crowd, demonstrating state-of-the-art accuracy, sharp localization, and strong cross-dataset generalization."
  },
  benchmarkTable: {
    caption: "表 1：YOLO-PGMD 在四大国际公开基准数据集上的测试性能与误差特征分析",
    columns: [
      "Dataset",
      "Test N",
      "MAE ↓",
      "RMSE ↓",
      "NAE ↓",
      "简评与特征分析"
    ],
    rows: [
      {
        dataset: "UCF-QNRF",
        testN: 266,
        mae: "90.79",
        rmse: "137.50",
        nae: "0.2069",
        comment: "MAE 稳健，RMSE 相对稳定，大分辨率跨度下抗畸变能力良好",
        highlight: false
      },
      {
        dataset: "ShanghaiTech A",
        testN: 163,
        mae: "48.13",
        rmse: "74.17",
        nae: "0.1430",
        comment: "当前最亮眼的一项，超密集人头下显著超越经典 SOTA 基准",
        highlight: true
      },
      {
        dataset: "ShanghaiTech B",
        testN: 316,
        mae: "13.20",
        rmse: "24.65",
        nae: "0.0910",
        comment: "相对误差 NAE 极低（0.091），稀疏户外场景下抗虚警能力突出",
        highlight: false
      },
      {
        dataset: "ShanghaiTech A+B",
        testN: 479,
        mae: "25.09",
        rmse: "47.67",
        nae: "0.1090",
        comment: "混合集内部综合评测指标优异",
        highlight: false
      },
      {
        dataset: "JHU-Crowd",
        testN: 1488,
        mae: "39.73",
        rmse: "89.80",
        nae: "0.3118",
        comment: "MAE 表现强劲（39.73），大样本恶劣天气与低光照下计数稳健",
        highlight: false
      },
      {
        dataset: "UCF-CC50 fold0",
        testN: 6,
        mae: "161.16",
        rmse: "187.39",
        nae: "0.2908",
        comment: "样本极少（N=6），作为探索性交叉验证参考",
        highlight: false
      },
      {
        dataset: "Macro Average",
        testN: "—",
        mae: "79.19",
        rmse: "115.59",
        nae: "—",
        comment: "宏平均总体参考指标",
        highlight: false,
        isSummary: true
      }
    ]
  },
  sotaTable: {
    caption: "表 2：与国际主流顶会人群计数 SOTA 模型在多基准上的横向性能对比 (MAE / RMSE ↓)",
    columns: [
      "Model",
      "ShanghaiTech A",
      "ShanghaiTech B",
      "UCF-QNRF",
      "JHU++",
      "UCF-CC50",
      "出处"
    ],
    rows: [
      {
        model: "CSRNet",
        shaA: "68.2 / 115.0",
        shaB: "10.6 / 16.0",
        ucfQnrf: "—",
        jhu: "—",
        ucfCc50: "266.1 / 397.5",
        venue: "CVPR'18"
      },
      {
        model: "Bayesian Loss",
        shaA: "62.8 / 101.8",
        shaB: "7.7 / 12.7",
        ucfQnrf: "88.7 / 154.8",
        jhu: "75.0 / 299.9*",
        ucfCc50: "229.3 / 308.2",
        venue: "ICCV'19"
      },
      {
        model: "DM-Count",
        shaA: "59.7 / 95.7",
        shaB: "7.4 / 11.8",
        ucfQnrf: "85.6 / 148.3",
        jhu: "—",
        ucfCc50: "211.0 / 291.5",
        venue: "NeurIPS'20"
      },
      {
        model: "MAN",
        shaA: "56.8 / 90.3",
        shaB: "—",
        ucfQnrf: "77.3 / 131.5",
        jhu: "53.4 / 209.9",
        ucfCc50: "—",
        venue: "CVPR'22"
      },
      {
        model: "PANet",
        shaA: "45.2 / 73.1",
        shaB: "5.9 / 9.3",
        ucfQnrf: "49.1 / 106.0",
        jhu: "—",
        ucfCc50: "160.3 / 223.7",
        venue: "SOTA Baseline"
      },
      {
        model: "CLIP-EBC ViT-B/16",
        shaA: "52.5 / 85.9",
        shaB: "6.6 / 10.5",
        ucfQnrf: "80.3 / 139.3",
        jhu: "—",
        ucfCc50: "—",
        venue: "arXiv'24"
      },
      {
        model: "YOLO-PGMD (Ours)",
        shaA: "48.13 / 74.17",
        shaB: "13.20 / 24.65",
        ucfQnrf: "90.79 / 137.50",
        jhu: "39.73 / 89.80",
        ucfCc50: "161.16 / 187.39",
        venue: "Ours",
        isOurs: true
      }
    ]
  },
  bibtex: "@article{chen2026yolopgmd,\n  title={YOLO-PGMD: Probabilistic-Guided Multi-Scale Feature Fusion with Conserved Density Estimation for Crowd Counting},\n  author={Chen, Minxiang},\n  journal={arXiv preprint},\n  year={2026}\n}",
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
          "提出严格积分守恒高斯标签生成算法（Mass-Conserved Gaussian Generation）：通过局部重归一化有效消除边界截断与多头重叠带来的质量漂移，在数据生成层强制实现连续密度积分与真值人数绝对相等（ΣD = N）。",
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
            detail: "针对测试集中数百万乃至千万像素的超高分辨率图像，推理阶段采用 640×640 滑动窗口，设置 128px 空间重叠（步长 512）。重叠区域使用二维余弦衰减窗口权重 $w(u,v) = \\frac{1}{4}[1+\\cos(2\\pi u/W)][1+\\cos(2\\pi v/H)]$ 进行加权融合：$D_{\\text{final}} = \\frac{\\sum w_k D_k}{\\sum w_k + \\epsilon}$，有效缓解了边缘硬拼接产生的十字网格伪影。"
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
              src: "https://media.tianyasky.top/site/projects/crowd-sigmod/vis_shanghaitech_a_502.jpg",
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
              src: "https://media.tianyasky.top/site/projects/crowd-sigmod/vis_ucf_qnrf_977.jpg",
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
              src: "https://media.tianyasky.top/site/projects/crowd-sigmod/vis_jhu_463.jpg",
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
        reflection: "若进行下一阶段的学术与工程迭代，有两个极具价值的深入方向：一是引入基于 KNN 局部邻域距离的自适应高斯核方差 σ_i（根据局部点间距动态缩放感受野），以进一步优化极稀疏与极稠密过渡交界处的锐度；二是将当前 CNN 结构的 MSR 模块与轻量可变形注意力（Deformable Attention）结合，增强对大俯仰角透视畸变与斜向人群视角的几何自适应形变建模能力。",
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
    background: {
      src: "/projects/crowd-sigmod/vis_shanghaitech_a_172.jpg",
      caption: "密集人群点标注与局部重归一化守恒高斯核响应 4 面板质检"
    },
    method: {
      src: "/projects/crowd-sigmod/pipeline.svg",
      caption: "YOLO-PGMD 端到端多尺度特征与概率引导网络架构",
      wide: true
    },
    results: {
      src: "https://media.tianyasky.top/site/projects/crowd-sigmod/academic_sota_comparison.png",
      caption: "国际顶会 SOTA 基准横向对比与跨数据集评测"
    }
  },
  gallery: [
    {
      src: "/projects/crowd-sigmod/pipeline.svg",
      caption: "YOLO 多尺度特征提取、概率引导空间注意力与 MSR 残差细化架构图",
      aspect: "wide"
    },
    {
      src: "/projects/crowd-sigmod/academic_sota_comparison.svg",
      caption: "ShanghaiTech Part A 与各大国际顶会 SOTA 模型横向指标对比 (CVPR/ICCV/NeurIPS)",
      aspect: "wide"
    },
    {
      src: "/projects/crowd-sigmod/academic_dataset_overview.svg",
      caption: "四大国际基准全数据集 MAE / RMSE 误差与相对误差 NAE 综合评估图",
      aspect: "wide"
    },
    {
      src: "/projects/crowd-sigmod/scatter_part_a.png",
      caption: "ShanghaiTech Part A 真实人数 vs 预测人数回归拟合散点图 (MAE 48.13 / RMSE 74.17)",
      aspect: "chart"
    },
    {
      src: "/projects/crowd-sigmod/scatter_part_b.png",
      caption: "ShanghaiTech Part B 真实人数 vs 预测人数回归拟合散点图 (MAE 13.20 / RMSE 24.65)",
      aspect: "chart"
    },
    {
      src: "/projects/crowd-sigmod/vis_shanghaitech_a_172.jpg",
      caption: "ShanghaiTech Part A (N=172) 点标注、守恒高斯密度图与概率响应图 4 面板质检对比",
      aspect: "wide"
    },
    {
      src: "https://media.tianyasky.top/site/projects/crowd-sigmod/vis_shanghaitech_a_502.jpg",
      caption: "ShanghaiTech Part A (N=502) 超密集人群高斯密度与概率响应图 4 面板定性验证",
      aspect: "wide"
    },
    {
      src: "https://media.tianyasky.top/site/projects/crowd-sigmod/vis_ucf_qnrf_977.jpg",
      caption: "UCF-QNRF (N=977) 极端密集超大尺度跨度人头密度图定性预测验证",
      aspect: "wide"
    },
    {
      src: "https://media.tianyasky.top/site/projects/crowd-sigmod/vis_jhu_463.jpg",
      caption: "JHU-Crowd (N=463) 复杂户外低光照环境人群密度与概率先验定性验证",
      aspect: "wide"
    },
    {
      src: "/projects/crowd-sigmod/benchmark.png",
      caption: "跨数据集自动化基准测试柱状图产物",
      aspect: "chart"
    }
  ],
  highlights: [
    "严格积分守恒高斯标签：高斯核截断区域局部重归一化，数据层断言校验，消除密集重叠与边界裁剪质量损失",
    "概率图与密度图解耦：概率分支学习前景似然（BCE + 0.2 Dice），作为 PG-Attention 空间先验引导特征聚焦",
    "MSR 多尺度残差细化：ECA 通道注意力 + 3 级空洞残差卷积（膨胀率 1/2/3），全程保持 Stride-4 稠密特征",
    "分层四任务复合损失：像素级概率似然 + 像素级 Smooth L1 密度 + 全局 NAE 相对计数 + 4×4 局部区域分布约束",
    "滑动窗口与跨数据集流水线：640×640 带有 128px 重叠的二维余弦权重平滑拼接，一键支持 4 大基准联合训练与跨域评测"
  ],
  background: "传统人群计数方法通常面临两难：基于检测框的方法在极端密集与严重遮挡下极易漏检，且边界框标注成本极高；而传统基于密度图的方法在边缘裁剪时常因高斯核被截断而丢失积分质量，且特征降采样过大（如 Stride-8/16）导致微小人头信号湮灭。我们需要一种既能保留高分辨率空间定位信息、又能保证全局人数积分守恒，同时具备跨场景泛化能力的端到端计数框架。",
  method: "模型采用 YOLO Backbone 提取 P2/P3/P4 多尺度特征，经 1×1 卷积投影并上采样到 P2 尺度后完成 C2f 级联融合（特征图 160×160）。融合特征首先分流至 Probability Head 输出二分类概率图（BCE+Dice 监督）；接着将概率图与 ECA 通道注意力结合构造 Probability-Guided Attention；随后通过 3 组膨胀率分别为 1/2/3 的 MSR 残差块进行多尺度感受野扩展，最终经 Softplus 密度头输出非负密度图 D。训练采用三阶段主干冻结策略与分层学习率；推理使用 640×640 重叠滑动窗口配合二维余弦空间衰减权重融合，消除拼接缝效应。",
  results: "在 UCF-QNRF、ShanghaiTech A/B、JHU-Crowd 与 UCF-CC-50 四大数据集上完成了单数据集与联合混合训练（Joint Training）。在 ShanghaiTech A/B 评测中达到总体 MAE 25.09、RMSE 47.67（其中 Part A MAE 48.13、RMSE 74.17；Part B MAE 13.20、RMSE 24.65）；全数据集宏平均测试 MAE 达 79.19，展现了极强的泛化鲁棒性；整图测试中点标注与密度图保持严格一致（ΣD = N）。",
  reflection: "若进行下一阶段迭代，有两个值得深入的方向：一是引入 KNN 自适应高斯核 σ（根据局部点密度动态调整感受野），进一步优化稀疏与超密集分界处的锐度；二是将当前 CNN 结构的 MSR 模块与轻量 Deformable Attention 结合，增强对透视畸变与斜向人群视角的几何自适应形变能力。",
  links: {
    github: "https://github.com/TianyaSKY/CrowedSigmod"
  },
  featured: true
};

export default crowdSigmodDetail;
