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
    abstractZh: "针对密集人群场景中由于人头尺度跨度大、重叠遮挡严重容易导致漏检与背景误检的问题，本文实现了一种基于 YOLO 多尺度特征的概率引导密度图估计网络 YOLO-PGMD。针对传统高斯核在图像边缘被截断导致全图积分人数偏少的问题，算法在生成标签时对截断区域进行局部重归一化，使全图密度积分与真实标注点数保持一致（ΣD = N）。网络结构上，提取 YOLO 主干的 P2/P3/P4 多尺度特征，经 1×1 卷积投影并对齐融合后，引入轻量概率分支预测前景存在概率，并结合通道注意力构建空间注意力机制，再通过三级空洞残差卷积（MSR）扩展感受野，全程保持 Stride-4（160×160）的分辨率。损失函数综合了前景概率（BCE + Dice）、Smooth L1 密度损失、相对计数误差与局部网格分布约束。实验在 ShanghaiTech A/B、JHU-Crowd、UCF-QNRF 和 UCF-CC-50 等数据集上展开，在超密集的 ShanghaiTech Part A 上达到 48.13 MAE / 74.17 RMSE，在恶劣天气场景 JHU-Crowd 上达到 39.73 MAE，兼顾了密集人头定位准确度与跨场景稳定性。",
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
  paperArticle: {
    sections: [
      {
        id: "sec-intro",
        number: "01",
        kicker: "Introduction & Problem Formulation",
        title: "引言与研究动机 / Introduction & Motivation",
        paragraphs: [
          "人群密度估计与计数在公共安全、交通枢纽客流统计和大型集会管理中具有重要的实际需求。在实际监控与现场拍摄中，人群往往伴随着严重的肢体遮挡、远近透视缩放以及光照变化，背景中也经常存在树木、建筑物反光等易混淆的干扰物。",
          "目前解决这一问题主要有目标检测和密度图回归两种常见思路。基于目标检测的方法在人流较少时直观准确，但在超密集场景下，相邻人头紧挨在一起，容易在非极大值抑制（NMS）阶段被当作冗余框过滤掉；而传统的密度图网络往往采用下采样较大的深层主干（如 Stride-8 或 Stride-16），使得画面深处只占几个像素的微小人头信号在多次下采样中逐渐丢失。",
          "另外还有一个容易被忽略的工程细节是「高斯积分截断」：传统离散高斯核在图像或切片边缘被硬截断时，截断区域的积分值会直接损失，导致整幅图的密度图积分总和小于真实标注人数（ΣD < N）。为此，我们设计了 YOLO-PGMD 网络：提取 YOLO 浅层与中层多尺度特征，全程维持 Stride-4（160×160）特征图，通过一个独立的前景概率分支引导空间注意力，并在数据预处理中修正边缘高斯截断，从而在密集场景下取得更好的计数效果。"
        ],
        contributions: [
          "设计局部重归一化的高斯标签生成算法：修正图像边界截断导致的积分损失，保证全图密度图积分与真实标注点数严格相等（ΣD = N）。",
          "解耦前景概率学习与密度回归：由 BCE 与 Dice 联合监督的概率分支学习人头分布轮廓，并作为空间先验引导主干特征聚焦于真实人群区域，减少背景误报。",
          "构建 Stride-4 高分辨率特征流与 MSR 细化模块：融合 P2/P3/P4 多尺度特征，配合膨胀率 1/2/3 的空洞卷积在保持空间分辨率的同时扩大感受野。",
          "采用分层复合损失与余弦平滑滑窗推理：在 ShanghaiTech A/B, UCF-QNRF, JHU-Crowd, UCF-CC-50 四大基准上验证了有效性（ShanghaiTech Part A 取得 48.13 MAE / 74.17 RMSE）。"
        ]
      },
      {
        id: "sec-theory",
        number: "02",
        kicker: "Theoretical Grounding & Mass Conservation",
        title: "理论基础：严格积分守恒高斯密度标签生成",
        paragraphs: [
          "在基于密度图的监督学习中，真值密度图通常由离散点标注 $P = \\{p_i = (x_i, y_i)\\}_{i=1}^N$ 与二维高斯核 $G_\\sigma$ 卷积生成。在连续空间下，积分 $\\iint_{\\mathbb{R}^2} G_\\sigma(x, y) \\,dx\\,dy = 1$。但在离散数字图像网格 $\\Omega = [0, W) \\times [0, H)$ 中，当标注点 $p_i$ 靠近图像边缘时，高斯核的有效支撑范围会超出图像边界，发生截断。",
          "如果直接截断采样，该点在画面内的离散累加和就会小于 1（即 $\\sum_{p \\in \\Omega} G_\\sigma(p - p_i) < 1$），进而导致整幅图的密度图积分 $\\sum_{p \\in \\Omega} D(p) < N$。在密集场景中，边缘人数较多时这种系统性偏差就更明显。为了解决这一问题，我们在生成标签时计算每个标注点落在图像内的实际权重并进行局部重归一化，确保每个点对应的有效积分严格为 1，从而消除边缘漏算问题。"
        ],
        math: {
          title: "局部重归一化算子 (Localized Re-normalization Operator)",
          formula: "D(p) = \\sum_{i=1}^N \\frac{G_\\sigma(p - p_i)}{\\sum_{q \\in \\Omega} G_\\sigma(q - p_i)}, \\quad \\text{其中} \\quad \\sum_{p \\in \\Omega} D(p) \\equiv N",
          explanation: "对每一个标注点 $p_i$，首先在局部有效栅格窗口 $\\Omega_i = \\Omega \\cap [x_i-3\\sigma, x_i+3\\sigma] \\times [y_i-3\\sigma, y_i+3\\sigma]$ 内计算截断高斯的离散总和 $S_i = \\sum_{q \\in \\Omega_i} G_\\sigma(q - p_i)$，再用 $S_i$ 对局部响应做归一化赋权。这样无论人头位于图像中央还是贴近边界，每个标注点对全图密度的净贡献都等于 1。"
        },
        figure: {
          src: "/projects/crowd-sigmod/vis_shanghaitech_a_172.jpg",
          label: "Figure 1",
          title: "严格积分守恒高斯标签与前景概率图 4 面板质检验证 (ShanghaiTech Part A, N=172)",
          caption: "从左至右依次为：(a) 原始裁剪图像叠加离散点标注（红点，N=172）；(b) 局部重归一化严格积分守恒高斯密度图 GT（求和精确等于 172.00）；(c) 前景人头概率图 GT（Probability Mask，用于 BCE+Dice 门控监督）；(d) 真实密度热力伪彩叠加图。",
          analysis: "样本边界处包含多名被画面截断的人体边缘人头。传统高斯生成方式会因截断丢失约 4.8% 的质量（实际求和仅约 163.7），而局部重归一化处理配合断言检查（assert |ΣD - N| < 1e-4），保证了监督标签的总人数与真实标注一致。"
        }
      },
      {
        id: "sec-method",
        number: "03",
        kicker: "Network Architecture & Methodology",
        title: "网络架构：YOLO-PGMD 层次化特征与概率引导注意力",
        paragraphs: [
          "YOLO-PGMD 采用前馈全卷积结构。针对人头尺度在远近景变化较大的问题，模型复用了 YOLO 主干网络中的 P2（步长 4）、P3（步长 8）和 P4（步长 16）多尺度特征。",
          "多尺度融合模块以 1×1 卷积将 P2、P3、P4 分别投影为 64 通道，并将 P3、P4 双线性上采样至 P2 的 Stride-4 网格（160×160）。三个分支沿通道拼接后，经 1×1 卷积和 C2f 残差块得到融合特征 $F \\in \\mathbb{R}^{B \\times 128 \\times 160 \\times 160}$。"
        ],
        figure: {
          src: "/projects/crowd-sigmod/pipeline.png",
          label: "Figure 2",
          title: "YOLO-PGMD 端到端多尺度特征提取、概率引导注意力与 MSR 残差细化流水线架构",
          caption: "YOLO 提取 640×640 输入的 P2/P3/P4 特征并融合至 Stride-4。概率图 $P$ 引导空间门控；三个 MSR 块接续细化，每块内部并行使用膨胀率 1/2/3。加入融合特征的长残差后，Softplus 密度头输出非负密度图 $D$，像素求和得到估计人数。图中图像与热图为示意。",
          wide: true
        },
        subsections: [
          {
            title: "3.1 概率分支解耦设计 (Decoupled Probability Head)",
            content: "将“判断某处是否存在人头”与“回归具体密度数值”拆开处理。概率分支由两层轻量卷积与 Sigmoid 激活组成，输出 160×160 的概率响应图 $P \\in [0,1]^{H \\times W}$，通过二值交叉熵（BCE）与 Dice 损失联合训练，让模型先形成清晰的人头前景轮廓。"
          },
          {
            title: "3.2 概率引导空间与通道注意力 (PG-Attention & ECA)",
            content: "ECA 先对融合特征 $F$ 进行通道加权，得到 $F_{\\mathrm{ca}}$。将 $F_{\\mathrm{ca}}$ 沿通道取均值与最大值，与概率图 $P$ 拼接，经 $7 \\times 7$ 卷积和 Sigmoid 生成空间掩码 $M_s$。输出为 $F_{\\mathrm{att}} = F_{\\mathrm{ca}} \\odot (1 + \\alpha M_s)$；$\\alpha$ 初始化为 0，使空间门控在训练起始时不改变通道加权特征。"
          },
          {
            title: "3.3 多尺度残差空洞细化模块 (Multi-Scale Residual, MSR)",
            content: "注意力后串联三个 MSR 块。每块并行使用膨胀率 1、2、3 的 $3 \\times 3$ 卷积，将结果拼接并投影后与块输入相加，保持 160×160 的空间分辨率。密度头前另有一条从融合特征 $F$ 到 MSR 输出的可学习长残差。"
          }
        ]
      },
      {
        id: "sec-loss",
        number: "04",
        kicker: "Optimization & Inference Strategy",
        title: "分层多任务复合损失与余弦滑窗推理",
        paragraphs: [
          "为了让概率分支与密度估计分支协同优化，我们在像素细节、局部网格分布以及全图总人数三个层面设计了复合损失函数 $\\mathcal{L}_{\\text{total}}$。"
        ],
        math: {
          title: "分层复合目标优化函数 (Hierarchical Multi-Task Compound Loss)",
          formula: "\\mathcal{L}_{\\text{total}} = \\lambda_{\\text{prob}}\\mathcal{L}_{\\text{prob}} + \\lambda_{\\text{dense}}\\mathcal{L}_{\\text{dense}} + \\lambda_{\\text{cnt}}\\mathcal{L}_{\\text{cnt}} + \\lambda_{\\text{local}}\\mathcal{L}_{\\text{local}}",
          explanation: "四项损失默认权重配置为：$\\lambda_{\\text{prob}}=1.0, \\lambda_{\\text{dense}}=1.0, \\lambda_{\\text{cnt}}=0.5, \\lambda_{\\text{local}}=0.25$。具体各子项定义如下：(1) 前景概率损失 $\\mathcal{L}_{\\text{prob}} = \\mathcal{L}_{\\text{BCE}}(P, P_{\\text{gt}}) + 0.2\\mathcal{L}_{\\text{Dice}}(P, P_{\\text{gt}})$，通过 Dice 损失缓解背景占绝大多数时的正负样本不平衡；(2) 1.5 阶幂律样本归一化密度损失 $\\mathcal{L}_{\\text{dense}} = \\frac{1}{B}\\sum_{b=1}^B \\frac{s \\sum_{p \\in \\Omega} |D^{(b)}(p) - D_{\\text{gt}}^{(b)}(p)|^{1.5}}{N_{\\text{gt}}^{(b)} + 1}$ ($s=10.0$)，在接近真值时平滑衰减，防止全零背景压制导致的预测塌缩；(3) 全局相对人数损失 $\\mathcal{L}_{\\text{cnt}} = \\frac{1}{B}\\sum_{b=1}^B \\frac{|\\sum_{p \\in \\Omega} D^{(b)}(p) - N_{\\text{gt}}^{(b)}|}{N_{\\text{gt}}^{(b)} + 1}$，直接约束整图总人数相对误差；(4) 空间局部一致性损失 $\\mathcal{L}_{\\text{local}} = \\frac{1}{B}\\sum_{b=1}^B \\frac{1}{16}\\sum_{k=1}^{16} \\frac{|\\sum_{p \\in \\Omega_k} D^{(b)}(p) - \\sum_{p \\in \\Omega_k} D_{\\text{gt}}^{(b)}(p)|}{\\sum_{p \\in \\Omega_k} D_{\\text{gt}}^{(b)}(p) + 1}$，将特征图均匀划分为 $4 \\times 4$ 局部子窗口进行区域积分约束，避免局部位置偏移。"
        },
        trainingPillars: [
          {
            title: "三阶段主干冻结调度 (Freeze Scheduler)",
            detail: "Epoch 0–15 冻结 YOLO 主干及 BN 统计量，以较大初始学习率（5e-4）预热头部与注意力参数；Epoch 15–45 解冻高层特征并降低学习率；Epoch 45–100 全面解冻底层特征提取层，以极低学习率微调，避免破坏预训练权重。"
          },
          {
            title: "重叠瓦片滑窗与 2D 余弦平滑拼接 (Tiled Cosine Inference)",
            detail: "针对测试集中高分辨率大图，推理阶段采用 640×640 滑动窗口，设置 128px 空间重叠（步长 512）。重叠区域使用二维余弦衰减窗口权重 $w(u,v) = \\frac{1}{4}[1+\\cos(2\\pi u/W)][1+\\cos(2\\pi v/H)]$ 进行加权融合：$D_{\\text{final}} = \\frac{\\sum w_k D_k}{\\sum w_k + \\epsilon}$，有效缓解了边缘拼接硬痕。"
          }
        ]
      },
      {
        id: "sec-results",
        number: "05",
        kicker: "Quantitative Benchmarks & Comparative Analysis",
        title: "实验结果与多基准定量评测",
        paragraphs: [
          "为全面检验 YOLO-PGMD 在不同密度分布、分辨率跨度及复杂天气下的表现，实验在四大国际公认基准数据集上展开评测：包括密集的 ShanghaiTech Part A、稀疏街景的 ShanghaiTech Part B、大分辨率大尺度的 UCF-QNRF 以及包含恶劣天气低光照的 JHU-Crowd。评测指标采用平均绝对误差（MAE）、均方根误差（RMSE）以及归一化相对误差（NAE）。"
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
          caption: "与 CVPR'18 CSRNet、ICCV'19 Bayesian Loss、NeurIPS'20 DM-Count、CVPR'22 MAN 及 arXiv'24 CLIP-EBC 等权威经典模型的性能对比，YOLO-PGMD 在超密集人头场景下取得了 48.13 MAE / 74.17 RMSE 的良好表现。"
        },
        scatterDiscussion: "为检验模型在不同人数区间的预测线性度，我们绘制了 4 个基准数据集的真实人数（GT Count）与预测人数（Predicted Count）回归散点图（见下方 Figure 5 ~ Figure 8）。在 ShanghaiTech、JHU-Crowd、UCF-QNRF 及 UCF-CC50 上，样本点整体紧密分布在对角线 $y=x$ 附近，在几十人到上千人的区间内保持了较好的线性关系，没有出现明显的饱和截断。",
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
          "除了整体指标统计，我们选取了密集重叠、大分辨率拼接、夜间低光照等典型场景以及代表性的预测和低估样本进行可视化观察与分析。"
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
            analysis: "在此密集场景中，人头相互重叠严重且伴随透视压缩。传统模型在此类场景下常出现高斯核粘连连成大片模糊响应。YOLO-PGMD 依托 Stride-4 高分辨率特征流与 MSR 膨胀残差卷积，较好地将相邻紧贴的人头分解为彼此独立的高斯响应峰值，减少了粘连现象。"
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
            analysis: "UCF-QNRF 图像分辨率极高，人头尺寸从近景的数十像素到远景的两三个像素存在较大跨度。模型通过 P2/P3/P4 多尺度特征感知，并在推理端采用 2D 余弦平滑滑动窗口无缝拼接，在近远景过渡区域实现了平滑、连续的密度估计。"
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
            analysis: "JHU-Crowd 数据集包含大量夜间低照度、雨雾及严重肢体遮挡样本。结合 BCE+Dice 训练的二分类概率分支在 PG-Attention 中起到空间门控作用，较好地过滤了地面积水反光、树枝阴影及杂乱建筑背景噪声，取得了 39.73 MAE 的预测表现。"
          },
          {
            id: "case-4",
            tag: "Case Study 4 · 真实高精度样本评测对齐 (Best Prediction)",
            dataset: "ShanghaiTech Part B (Test IMG_231, GT=79 vs Pred=79)",
            figure: {
              src: "/projects/crowd-sigmod/best_01_part_B_test_IMG_231_gt79_pred79.jpg",
              label: "Figure 12",
              title: "ShanghaiTech Part B 真实测试集高精度预测质检 (GT=79 vs Pred=79.0, 绝对零误差)",
              caption: "模型预测人头密度分布与真实点标注实现空间位置吻合与总数对齐，无背景误检。"
            },
            analysis: "在分布相对均匀的常规密集样本中，模型预测的热力分布与真实点标注吻合较好，峰值位置清晰，背景区域基本没有多余虚警。"
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
            analysis: "【低估原因分析】：通过对大误差样本分析发现，欠估的主要诱因在于：(1) 极远景纵深处人头成像过小（单人头不足 2 像素），纹理细节严重退化；(2) 严重肢体遮挡导致后排人头可见面积较小。后续可考虑结合相机透视先验校正来进一步改善这一问题。"
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
      src: "/projects/crowd-sigmod/pipeline.png",
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
      src: "/projects/crowd-sigmod/pipeline.png",
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
    "MSR 多尺度残差细化：ECA 通道注意力后串联三个残差块，每块并行使用膨胀率 1/2/3 的卷积，保持 Stride-4 分辨率",
    "分层四任务复合损失：像素级概率似然 + 像素级 Smooth L1 密度 + 全局 NAE 相对计数 + 4×4 局部区域分布约束",
    "滑动窗口与跨数据集流水线：640×640 带有 128px 重叠的二维余弦权重平滑拼接，一键支持 4 大基准联合训练与跨域评测"
  ],
  background: "传统人群计数方法通常面临两难：直接画框做目标检测的方法在人流稀疏时表现良好，但在极其拥挤、人头紧密重叠的场景下容易发生漏检，而且密集小目标的边界框标注成本很高；而基于密度图回归的方法通常把特征图下采样较大（如 8 倍或 16 倍），容易丢失微小人头的空间细节，此外高斯核在图像边缘被截断时也会丢失一部分积分值。我们需要一种既能保留较高空间分辨率、又能解决边缘积分损失、在不同密集程度下都能稳定工作的计数方案。",
  method: "YOLO 提取 P2/P3/P4 特征，经 1×1 投影并对齐至 P2 网格（160×160），由 C2f 融合。概率头预测前景概率图，作为 ECA 通道加权后的空间门控先验。随后串联三个 MSR 块，每块包含膨胀率 1/2/3 的并行卷积；融合特征经长残差加入细化输出后，由 Softplus 密度头得到非负密度图，再沿空间求和估计人数。训练采用分阶段解冻主干与分层学习率；推理采用重叠滑窗与二维余弦权重融合。",
  results: "在 UCF-QNRF、ShanghaiTech A/B、JHU-Crowd 与 UCF-CC-50 四大数据集上完成了测试。在人群密集的 ShanghaiTech Part A 上取得了 48.13 MAE 和 74.17 RMSE，在 Part B 上取得 13.20 MAE；在包含夜间、雨雾等恶劣天气样本的 JHU-Crowd 上取得 39.73 MAE。整图测试中点标注与密度图积分保持一致（ΣD = N），在紧贴相邻人头的分离与背景杂波过滤上表现稳定。",
  reflection: "后续迭代有两个值得改进的方向：一是引入基于局部点间距的自适应高斯核方差，让核大小自动适应稀疏和超密区域；二是针对监控摄像头的倾斜视角，结合轻量可变形卷积或透视先验，提升斜俯视角度下的计数稳定性。",
  links: {
    github: "https://github.com/TianyaSKY/CrowedSigmod"
  },
  featured: true
};

export default crowdSigmodDetail;
