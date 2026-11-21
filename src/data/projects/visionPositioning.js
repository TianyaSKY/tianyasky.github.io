const patchCnnFigure = {
  src: "/projects/vision-positioning/patch-cnn-architecture.png",
  label: "Figure 2a",
  title: "SimpleCNN 的卷积特征与九类输出",
  caption: "64×64 RGB 图像块依次经过三个卷积池化块与两层全连接，再由 Softmax 输出八个角点类别和一个背景类别的概率。",
  aspect: "wide"
};

const landmarkFigure = {
  src: "/projects/vision-positioning/landmark-ids.png",
  label: "Figure 2b",
  title: "标杆的八个三维锚点",
  caption: "上层 z=8 为 1、3、5、7，下层 z=4 为 0、2、4、6。类别 8 表示背景，不对应三维锚点。",
  aspect: "chart"
};

export const visionPositioningDetail = {
  paperInfo: {
    titleZh: "基于射线夹角几何约束与级联神经网络的结构化杆体单目视觉位姿重建系统",
    titleEn: "Monocular Camera 3D Coordinate Reconstruction via Structured Pole Keypoint Cascaded Networks and Ray-Angle Invariant Optimization",
    authors: "陈敏祥 (Minxiang Chen), 指导教师: 李明智",
    affiliation: "大连海洋大学 · 信息工程学院 (Dalian Ocean University · School of Information Engineering)",
    keywordsZh: [
      "单目视觉定位",
      "射线夹角不变性",
      "级联检测流水线",
      "Harris 亚像素精炼",
      "CNN 语义分类",
      "非线性最小二乘 (NLLS)",
      "共线几何退化",
      "结构化参照物"
    ],
    keywordsEn: [
      "Monocular Visual Localization",
      "Ray-Angle Invariance",
      "Cascaded Detection Pipeline",
      "Harris Sub-Pixel Refinement",
      "CNN Patch Classification",
      "Nonlinear Least Squares (NLLS)",
      "Collinear Geometric Degeneracy",
      "Structured Reference Anchors"
    ],
    abstractZh: "针对近海作业、港口堆场巡检以及室内仓储等 GPS 信号易丢失的环境中，传统卫星定位失效、二维码标志物易腐蚀污损，且传统透视 n 点算法（PnP）在面对垂直细长标杆时容易出现共线几何退化的问题，本文实现了一套基于级联感知与反投影射线夹角约束的单目视觉定位系统。前端感知部分设计了五级级联流程：先用 YOLO 粗检标杆生成区域掩膜，缩小计算范围；在掩膜内提取 Harris 角点；由轻量卷积网络（SimpleCNN）对局部图像块进行 9 分类判别（8 个物理特征点与 1 个背景类），并经类别 NMS 与亚像素精炼获取高精度角点坐标，建立了 2D 像素与 3D 已知坐标的对应关系。后端几何解算部分推导了反投影射线夹角守恒公式，将相机位姿求解转化为仅依赖相机三维位置的非线性最小二乘优化，避免了传统 PnP 的共线退化敏感性；同时引入包含时序连续性与粗解先验的多初值机制，配合 LM 与 TRF 双求解器提高收敛稳定性。在仿真与大连沿海港口实测中，系统在边缘计算设备 Jetson Orin 上达到 26 FPS，实测定位 RMSE 保持在 10–15 cm，为弱 GPS 环境下的单目视觉定位提供了一套实用的工程落地参考。",
    abstractEn: "In marine engineering, coastal vessel operations, port surveillance, and GPS-denied indoor/underwater environments, conventional satellite navigation is prone to signal degradation, and artificial visual fiducial tags (e.g., AprilTag/ArUco) suffer from surface fouling. Furthermore, standard Perspective-n-Point (PnP) solvers suffer from severe collinear geometric degeneracy when feature points lie along slender structural rods or poles. To resolve these challenges, this paper presents an end-to-end monocular camera 3D coordinate reconstruction system integrating cascaded neural networks with ray-angle invariant nonlinear optimization. In the front-end perception module, a five-stage detection pipeline is proposed: YOLO coarse region proposal (POLES.pt) generates binary ROI masks to compress the search space by over 95%; Harris corner detection extracts high-gradient geometric landmarks within the mask; a lightweight 3-stage patch CNN (SimpleCNN) performs 9-class semantic categorization over 64×64 local patches (8 distinct spatial pole corners + 1 background class) with 100% precision, fully eliminating 2D-to-3D landmark correspondence ambiguities without manual matching; and class-wise NMS coupled with cornerSubPix refinement achieves sub-pixel localization accuracy. In the back-end geometric solver, we establish a nonlinear least-squares optimization formulation based on back-projected ray-angle conservation. By back-projecting 2D pixels into normalized camera directional rays, we enforce congruence between optical ray angles and spatial world subtended angles, transforming the ill-conditioned 6-DoF PnP into a well-conditioned 3-DoF camera position optimization. A multi-start initialization scheme (combining temporal tracking, coarse PnP estimation, and 3D centroid priors) coupled with dual Levenberg-Marquardt (LM) and Trust Region Reflective (TRF) solvers guarantees global convergence. Ablation experiments demonstrate that our full system achieves a 100% success rate with 1.1×10⁻⁵ m theoretical reconstruction error. Removing CNN semantic classification causes heuristic mismatching with error jumping to 5.38 m, while disabling NMS post-processing causes cluster drift to 6.13 m. Deployed on an embedded Jetson Orin platform, the pipeline operates at 26 FPS in real-time, achieving 10–15 cm RMSE accuracy in coastal field trials in Dalian, delivering a robust, low-cost solution for visual localization in harsh environments."
  },
  benchmarkTable: {
    caption: "表 1：消融实验性能对比与关键点检测各阶段对定位误差的影响分析 (Ablation Benchmark)",
    columns: [
      "方案变体 (Variant)",
      "ROI 掩膜",
      "CNN 语义分类",
      "NMS & 亚像素",
      "位姿求解器",
      "候选 / 最终点数",
      "解算成功率",
      "平均位置误差 (Error ↓)",
      "误差标准差 (Std)",
      "简评与机理分析"
    ],
    rows: [
      {
        cells: [
          { text: "Ours-Full (完整流水线)", badge: "BEST", ours: true },
          "启用 (YOLO 掩膜)",
          "启用 (9分类 CNN)",
          "启用 (NMS+Subpix)",
          "射线夹角优化 (Vector)",
          "235.5 / 4.0",
          "100.0 %",
          { text: "1.10 × 10⁻⁵ m", className: "col-num val-mae" },
          "4.00 × 10⁻⁶ m",
          "解算稳定，4个角点准确对应先验锚点，无背景虚警"
        ],
        highlight: true,
        isOurs: true
      },
      {
        cells: [
          { text: "Ablation-1 (无掩膜)" },
          "禁用 (全图搜索)",
          "启用 (9分类 CNN)",
          "启用 (NMS+Subpix)",
          "射线夹角优化 (Vector)",
          "217.3 / 4.0",
          "100.0 %",
          { text: "1.20 × 10⁻⁵ m", className: "col-num" },
          "3.00 × 10⁻⁶ m",
          "在干净背景下误差相近，但复杂背景下候选点增多、推理耗时增加"
        ]
      },
      {
        cells: [
          { text: "Ablation-2 (无 CNN 语义)" },
          "启用 (YOLO 掩膜)",
          "禁用 (几何启发式分配)",
          "启用 (NMS+Subpix)",
          "射线夹角优化 (Vector)",
          "235.5 / 17.5",
          "100.0 %",
          { text: "5.380 m", className: "col-num val-rmse" },
          "1.180 m",
          "缺少语义ID导致2D-3D映射发生错配，误差显著增加"
        ]
      },
      {
        cells: [
          { text: "Ablation-3 (无后处理)" },
          "启用 (YOLO 掩膜)",
          "启用 (9分类 CNN)",
          "禁用 (无NMS/精炼)",
          "射线夹角优化 (Vector)",
          "235.5 / 75.0",
          "100.0 %",
          { text: "6.132 m", className: "col-num val-rmse" },
          "0.528 m",
          "冗余密集角点未被抑制，干扰残差场并影响优化收敛"
        ]
      },
      {
        cells: [
          { text: "Ablation-4 (纯 Harris 基线)" },
          "禁用 (全图搜索)",
          "禁用 (无分类)",
          "禁用 (无后处理)",
          "射线夹角优化 (Vector)",
          "217.3 / 217.3",
          "100.0 %",
          { text: "5.655 m", className: "col-num val-rmse" },
          "1.919 m",
          "无掩膜与分类过滤时杂乱角点较多，导致几何解算偏差较大"
        ]
      },
      {
        cells: [
          { text: "Traditional PnP (传统 PnP 基线)" },
          "启用 (YOLO 掩膜)",
          "启用 (9分类 CNN)",
          "启用 (NMS+Subpix)",
          "传统迭代 PnP (solvePnP)",
          "235.5 / 4.0",
          "100.0 %",
          { text: "3.21 × 10⁻⁴ m", className: "col-num" },
          "2.34 × 10⁻⁴ m",
          "具备可行性，但对共线点与图像噪声敏感，误差略大于射线夹角法"
        ]
      }
    ],
    footnote: "注：↓ 表示数值越小越优；仿真基准中世界真值已知，Ablation-2 与 Ablation-3 说明了 CNN 语义分类与 NMS 抑制对几何优化收敛的重要作用。"
  },
  sotaTable: {
    caption: "表 2：单目视觉位姿求解算法在共线/结构化参照物场景下的横向特性对比",
    columns: [
      "算法方案 (Method)",
      "空间几何退化抵抗",
      "2D-3D 自动关联",
      "计算复杂度",
      "抗噪声鲁棒性",
      "旋转/平移解耦",
      "代表文献 / 来源"
    ],
    rows: [
      {
        cells: [
          { text: "EPnP (Lepetit et al.)" },
          "低 (共线/共面退化)",
          "需显式特征匹配",
          "O(n) 线性解算",
          "中等",
          "否 (6-DoF 耦合)",
          "IJCV 2009"
        ]
      },
      {
        cells: [
          { text: "UPnP (Kneip et al.)" },
          "中等 (极值多项式求解)",
          "需显式特征匹配",
          "O(n) 多项式根",
          "中等",
          "否 (6-DoF 耦合)",
          "ECCV 2014"
        ]
      },
      {
        cells: [
          { text: "SQPnP (Terzakis et al.)" },
          "中等 (SQP 二次规划)",
          "需显式特征匹配",
          "O(n) 二次收敛",
          "良好",
          "否 (6-DoF 耦合)",
          "ECCV 2020"
        ]
      },
      {
        cells: [
          { text: "AprilTag / ArUco 标志物" },
          "低 (平面退化+污损易丢)",
          "自带二维码编码",
          "O(1) 快速",
          "较弱 (易受环境污损)",
          "否 (依赖平面对角)",
          "ICRA / IROS"
        ]
      },
      {
        cells: [
          { text: "PoseNet 端到端回归" },
          "较低 (泛化性受限)",
          "隐式端到端",
          "神经网络推理",
          "较弱 (跨域易产生抖动)",
          "否 (直接回归 7-DoF)",
          "ICCV 2015"
        ]
      },
      {
        cells: [
          { text: "Ours (级联CNN + 射线夹角 NLLS)", isOurs: true },
          "良好 (夹角不变性缓解退化)",
          "9分类 CNN 自动关联",
          "O(n²) 极小规模残差优化",
          "良好 (LM+TRF 多初值保障)",
          "是 (位置与旋转显式解耦)",
          "Ours (本系统)"
        ],
        isOurs: true
      }
    ],
    footnote: "对比涵盖经典代数 PnP (EPnP/UPnP/SQPnP)、人工二维码标志物与端到端深度学习回归算法。"
  },
  paperArticle: {
    sections: [
      {
        id: "sec-intro",
        number: "01",
        kicker: "Introduction & Problem Formulation",
        title: "引言与研究动机 / Introduction & Motivation",
        paragraphs: [
          "在港口码头、桥梁涵洞、室内仓储及近海养殖等环境中，由于建筑物遮挡和环境干扰，GPS 信号经常出现漂移甚至完全丢失。激光雷达和双目相机虽然能提供三维深度，但硬件成本相对较高、功耗较大，在海风和高湿度环境下镜头维护要求也高。单目相机依靠硬件简单、成本低以及可以直接获取图像语义信息的特点，常常作为这些场景下的辅助定位手段。",
          "不过在工程实践中，单目视觉定位容易遇到两个具体问题：首先，当参照物呈现细长、垂直或近乎共线的形态（例如港口系缆柱、桥梁立柱或警示标杆）时，传统 PnP 算法（如 EPnP、UPnP）容易出现几何退化，解算对微小的像素噪声非常敏感，容易产生明显的旋转多义性和数米的位置偏差；其次，在户外复杂光照与大面积无纹理背景下，SIFT 或 ORB 等传统手工特征点很难稳定找到标杆上的对应部位，而现场粘贴的人工二维码标志在潮湿和盐雾环境中又容易污损褪色。",
          "针对上述情况，我们实现了一套基于级联感知与反投影射线夹角约束的单目视觉定位方案。系统利用场景中已知三维几何坐标的结构化标杆作为参考物，前端通过「YOLO 区域粗检 → Harris 候选角点提取 → 局部块 CNN 语义分类 → 分类别 NMS 抑制 → 亚像素精炼」构建级联流程，自动建立 2D 像素与 3D 物理角点的对应关系；后端推导了反投影射线夹角守恒公式，把求解转化为仅优化相机三维位置的非线性最小二乘问题，并加入多初值机制，提高了在复杂视角下的解算稳定性。"
        ],
        contributions: [
          "设计级联式结构化关键点感知流程：结合 YOLO 目标检测生成 ROI 掩膜、Harris 提取候选角点以及轻量 9 分类 Patch CNN 识别角点部位，在 1377 张样本数据集上完成角点语义识别，自动建立 2D 像素与 3D 已知坐标的对应关系，无需手工交互或粘贴二维码。",
          "推导基于反投影射线夹角守恒的位置解算方程：将 2D 像点反投影为归一化单位方向向量，利用视线夹角与世界坐标夹角的一致性约束，把容易发生共线退化的 6-DoF 位姿解耦为只关于相机三维坐标 $C$ 的非线性最小二乘优化，改善了共线标杆下的解算敏感性。",
          "设计多初值生成与 LM/TRF 双求解器机制：结合历史帧时序先验 $C_{t-1}$、PnP 粗估计与空间点中心生成初值池，调用 LM 与 TRF 求解器进行残差优化，提高了非凸优化在不同视角下的收敛稳定性。",
          "完成系统实现与现场测试：开发了基于 PyQt5 与 SQLite 的桌面调测分析软件，支持参数管理、点位预览、流水线阶段质检与轨迹绘制；在大连沿海开展了实测，综合定位 RMSE 保持在 10–15 cm 范围，成果登记了计算机软件著作权并获大创年会推荐。"
        ]
      },
      {
        id: "sec-theory",
        number: "02",
        kicker: "Geometric Invariance & Ray-Angle Formulation",
        title: "理论推导：反投影射线夹角守恒与非线性几何解算",
        paragraphs: [
          "在标准针孔相机成像模型中，设相机的内参矩阵为 $K \\in \\mathbb{R}^{3 \\times 3}$。对于图像平面上检测到的任意亚像素关键点 $u_i = (u_i^*, v_i^*)^T$，其对应的归一化相机坐标系反投影射线单位方向向量 $r_i \\in \\mathbb{R}^3$ 可由内参矩阵计算求得：",
          "对于视野内同时观测到的任意两点 $u_i$ 与 $u_j$，由几何内积定义可计算其在相机坐标系下的夹角 $\\theta_{ij}$。由于内积操作对任意正交旋转矩阵具有等距保角不变性（$\\langle Rr_i, Rr_j \\rangle = \\langle r_i, r_j \\rangle$），因此观测夹角 $\\theta_{ij}$ 与相机的三维旋转姿态 $R$ 解耦，仅取决于空间相对几何关系。",
          "设对应特征点在世界坐标系下的已知三维物理坐标为 $P_i, P_j \\in \\mathbb{R}^3$，未知相机光学中心在世界坐标系下的三维坐标为 $C = (X_c, Y_c, Z_c)^T$。从相机光心 $C$ 指向空间点 $P_i, P_j$ 的视线方向向量分别为 $v_i(C) = P_i - C$ 与 $v_j(C) = P_j - C$。此时两视线向量在空间中张开的物理夹角 $\\phi_{ij}(C)$ 同样由内积公式给出。"
        ],
        math: {
          title: "射线夹角不变性与非线性最小二乘残差优化模型 (Ray-Angle NLLS Model)",
          formula: "\\min_{C \\in \\mathbb{R}^3} \\mathcal{F}(C) = \\frac{1}{2} \\sum_{1 \\le i < j \\le N} \\left[ \\arccos\\left( \\frac{(P_i - C) \\cdot (P_j - C)}{\\|P_i - C\\| \\|P_j - C\\|} \\right) - \\arccos\\left( \\frac{K^{-1} \\tilde{u}_i \\cdot K^{-1} \\tilde{u}_j}{\\|K^{-1} \\tilde{u}_i\\| \\|K^{-1} \\tilde{u}_j\\|} \\right) \\right]^2",
          explanation: "其中 $\\tilde{u}_i = [u_i^*, v_i^*, 1]^T$ 为第 $i$ 个角点的齐次像素坐标，$K$ 为相机内参矩阵，$P_i \\in \\mathbb{R}^3$ 为第 $i$ 个关键点在世界坐标系下的已知三维位置，$C = (X_c, Y_c, Z_c)^T$ 为待求解的相机光学中心三维世界坐标。该模型将复杂的旋转与平移耦合估计解耦为仅关于位置 $C$ 的 3-DoF 几何残差优化，缓解了共线特征点在求解旋转矩阵时的病态敏感问题。"
        },
        figure: {
          src: "/projects/vision-positioning/ray-angle-geometry.png",
          label: "Figure 1",
          title: "相机光心、像平面反投影射线与三维空间特征点射线夹角一致性几何模型",
          caption: "空间几何模型展示了相机光心 $C$、归一化像平面上的观测像点 $u_1, u_2$（对应反投影射线 $r_1, r_2$ 及夹角 $\\theta_{12}$）与世界坐标系下已知特征锚点 $P_1, P_2$（对应空间视线向量 $v_1, v_2$ 及夹角 $\\phi_{12}$）之间的投影对应关系。",
          analysis: "在理想成像条件下，像面反投影射线夹角 $\\theta_{12}$ 理论上等于空间视线夹角 $\\phi_{12}$。通过联合优化所有观测点对的夹角残差，可以在不依赖初始姿态角的前提下收敛求解相机中心坐标 $C$。"
        }
      },
      {
        id: "sec-method",
        number: "03",
        kicker: "Cascaded Perception Pipeline & Landmark CNN",
        title: "感知架构：五级级联检测流水线与 9 分类 Patch CNN",
        paragraphs: [
          "为了在复杂户外背景下稳定提取标杆上的物理特征点，感知部分采用了级联检测策略：先大范围定位标杆区域，再提取候选角点并做分类过滤，最后对保留的关键点进行亚像素精炼，尽量避免背景杂波干扰。"
        ],
        figure: {
          src: "/projects/vision-positioning/figure_overall_pipeline.png",
          label: "Figure 2",
          title: "前端五级级联视觉感知与后端射线夹角几何解算整体系统流水线",
          caption: "系统分为前端视觉感知与后端几何定位两大核心子系统：输入图像经 YOLO 杆体检测得到二值掩膜，在感兴趣区域内提取 Harris 角点，裁切 64×64 Patch 送入 CNN 进行 9 分类推理；经置信度过滤、类别 NMS 与亚像素精炼得到最终关键点，输入后端进行反投影射线转换与多初值并发优化。",
          wide: true
        },
        subsections: [
          {
            title: "3.1 YOLO 杆体区域检测与掩膜生成 (YOLO ROI Mask Gating)",
            content: "使用针对标杆目标专门微调训练的轻量 YOLO 检测模型（POLES.pt）对输入图像进行实时推理，输出标杆的边界框并生成二值 ROI 掩膜。这一阶段过滤掉了画面中 95% 以上的天空、水面和地面等无关背景，缩小了后续角点检测的计算范围。"
          },
          {
            title: "3.2 掩膜约束下的 Harris 候选角点提取 (Constrained Harris Corner Extraction)",
            content: "在二值掩膜限定的区域内执行 Harris 角点检测。算法计算局部图像梯度自相关矩阵 $M_H(p)$，利用响应函数 $R(p) = \\det(M_H) - 0.10 \\cdot (\\operatorname{tr}(M_H))^2$ 捕获灰度变化剧烈的边缘转折点，确保标杆边缘的真实物理转折点被高召回率捕获。"
          },
          {
            title: "3.3 定制 9 分类 Patch CNN 局部语义判别器 (9-Class Deep SimpleCNN)",
            content: "以每个 Harris 候选角点为中心裁剪 64×64 像素的局部彩色图像块，送入自主设计的轻量卷积分类网络（SimpleCNN）：包含 3 个卷积-池化块（通道数分别为 16、32、64，均使用 ReLU 激活与 MaxPool 2×2 下采样），展平后经过全连接层输出 9 分类概率。类别 0–7 对应标杆三维几何结构上的 8 个已知物理特征点（下层 z=4.0 的 4 个角点与上层 z=8.0 的 4 个角点），类别 8 为背景噪声类，用于过滤非标杆角点。",
            figures: [patchCnnFigure, landmarkFigure]
          },
          {
            title: "3.4 分类别非极大值抑制 (Class-wise NMS)",
            content: "先移除被预测为背景类（class=8）以及置信度低于阈值（τ_conf=0.85）的候选点；随后对保留的角点按类别分组，在每个分组内部按 Harris 响应值从高到低排序，保留响应最强的角点并抑制其邻域半径（r_nms=25 px）内的同类候选点，消除局部密集的重复响应。"
          },
          {
            title: "3.5 亚像素角点梯度正交精炼 (Sub-pixel Corner Refinement)",
            content: "对 NMS 后保留的关键点调用 OpenCV 的 cornerSubPix 算法进行亚像素级迭代精炼，利用角点邻域灰度梯度与位移向量的正交性质，把定位精度从整像素级提升至亚像素级，为后续几何求解提供更精准的输入。"
          }
        ]
      },
      {
        id: "sec-loss",
        number: "04",
        kicker: "Multi-Start Optimization & Industrial Desktop Suite",
        title: "优化求解：多初值并发策略、双求解器保障与工业级桌面系统",
        paragraphs: [
          "射线夹角残差目标函数 $\\mathcal{F}(C)$ 属于非线性最小二乘优化问题，在复杂空间几何布局下可能存在局部极小值。为了提高求解稳定性和收敛速度，我们设计了多候选初值生成策略，并配合 LM 与 TRF 求解器协同优化。"
        ],
        math: {
          title: "多初值生成与双求解器联合优化准则",
          formula: "\\mathcal{S} = \\left\\{ C_{t-1}, \\; -R_{\\text{pnp}}^T t_{\\text{pnp}}, \\; \\frac{1}{N}\\sum_{i=1}^N P_i \\right\\}, \\quad C^* = \\arg\\min_{C \\in \\{\\text{LM}(s), \\text{TRF}(s) \\mid s \\in \\mathcal{S}\\}} \\|\\mathbf{r}(C)\\|^2",
          explanation: "候选初始点集 $\\mathcal{S}$ 分别来自历史时序连续性先验 $C_{t-1}$、传统 PnP 粗估计 $-R^T t$ 以及可见三维特征点的几何中心。对每个候选起点分别调用 Levenberg-Marquardt (LM) 与 Trust Region Reflective (TRF) 两种数值求解器进行优化，最终选取残差二范数最小的解作为当前帧的相机全局世界坐标。"
        },
        trainingPillars: [
          {
            title: "多候选初值生成机制 (Multi-Candidate Initialization)",
            detail: "构建包含 3 组先验维度的初值池：(1) 历史时序初值 $C_{t-1}$，利用运动连续性加速平稳运动时的收敛；(2) 传统 solvePnP 粗解初值 $-R^T t$，应对位置跳变较大的情况；(3) 空间已知点的几何中心 $\\bar{P} = \\frac{1}{N}\\sum P_i$，作为冷启动无先验时的基础参考。"
          },
          {
            title: "LM / TRF 双求解器自适应容错 (Dual-Solver Optimization & Fallback)",
            detail: "针对不同初值分别调用 LM（适合平滑非线性最小二乘二次收敛）与 TRF（支持边界约束的信赖域反射优化）两种求解器。若求解收敛且残差满足阈值，则选取最优残差解；若出现异常发散，系统可平滑回退至 PnP 粗解或滤波预测值，提高运行连续性。"
          },
          {
            title: "PyQt5 桌面调测工具 (Industrial Desktop Application)",
            detail: "基于 PyQt5 开发了桌面调测程序，支持网络视频流与本地视频输入、相机内参配置管理（SQLite）、3D 点位可视化预览、实时轨迹曲线绘制以及各级流水线中间结果质检预览，方便算法调优与现场排查。"
          }
        ]
      },
      {
        id: "sec-results",
        number: "05",
        kicker: "Quantitative Ablation Suite & Error Diagnostics",
        title: "实验评测：系统消融实验与误差物理归因分析",
        paragraphs: [
          "为系统性验证各模块在整套系统中的具体作用与抗退化性能，我们在仿真基准与实际视频数据集上开展了消融实验。对比方案涵盖：(1) Ours-Full 完整流程；(2) Ablation-1 (关闭 YOLO 掩膜)；(3) Ablation-2 (关闭 CNN 语义分类，改用纯几何启发式分配)；(4) Ablation-3 (关闭 NMS 与亚像素精炼)；(5) Ablation-4 (无掩膜无分类的纯角点基线)；(6) Traditional PnP (同样角点输入下使用常规 solvePnP 解算)。"
        ],
        datasetFigure: {
          src: "https://media.tianyasky.top/site/projects/vision-positioning/figure_ablation_grid.png",
          label: "Figure 3",
          title: "消融实验各变体关键点检测与分类定性对比 (Ablation Qualitative Grid)",
          caption: "展示了 Ours-Full、Ablation-1 (No Mask)、Ablation-2 (No CNN)、Ablation-3 (No Post-processing)、Ablation-4 (Pure Harris) 以及核心机理总结的 6 面板定性对比图。"
        },
        sotaFigure: {
          src: "/projects/vision-positioning/figure_ablation_statistics.png",
          label: "Figure 4",
          title: "各消融变体候选角点数与最终保留关键点数统计对比柱状图",
          caption: "统计柱状图清晰揭示了掩膜与 NMS 在过滤背景噪点（从 235.5 压缩至 4.0）中的核心作用，以及无后处理时冗余角点剧增（75.0 个）对解算造成的严重干扰。"
        },
        sotaTitle: "关键点检测各阶段对定位精度的影响分析",
        sotaNarrative: "消融实验结果（见表 1）反映了各感知环节与几何求解器的配合关系：(1) 完整流程在仿真基准下解算保持稳定；(2) 移除 CNN 语义分类时（Ablation-2），由于缺乏物理 ID，关键点匹配容易出错，平均位置误差升至 5.380 m，说明语义分类对建立 2D-3D 对应关系很关键；(3) 移除 NMS 与亚像素精炼时（Ablation-3），同一角点周围存在大量冗余点，导致梯度受密集点群干扰，平均误差达 6.132 m；(4) 纯 Harris 基线（Ablation-4）产生的无序角点较多，误差达到 5.655 m；(5) 相比传统 PnP 算法在共线标杆下的敏感表现，射线夹角优化在抗几何退化和噪声稳定性上表现更优。",
        scatterDiscussion: "在数据集与分类器训练方面，Patch CNN 在 1377 张样本（验证集 276 张）上对 8 个标杆关键点与背景类的分类混淆矩阵呈现清晰的对角线分布，避免了关键点身份错判；YOLO 检测模型在 640×640 分辨率下训练收敛平稳，验证集 mAP@0.5 达到 99.2%（见下方 Figure 5 训练面板）。",
        scatterFigures: [
          {
            src: "https://media.tianyasky.top/site/projects/vision-positioning/figure_training_panel.png",
            label: "Figure 5",
            title: "YOLO 训练收敛曲线、归一化混淆矩阵与 Patch CNN 混淆矩阵三联全景面板",
            caption: "展示了 (a) YOLO 目标检测训练损失与指标收敛曲线；(b) YOLO 杆体检测归一化混淆矩阵；(c) Patch CNN 9 分类混淆矩阵，验证集分类准确率达 100.0%。"
          },
          {
            src: "/projects/vision-positioning/figure_corner_order_render.png",
            label: "Figure 6",
            title: "三维标杆仿真视场中的角点投影与背景类别",
            caption: "图中标出仿真视场内可见的 0、1、2、3 号角点。类别 8 表示背景，不参与 2D–3D 对应。"
          },
          {
            src: "/projects/vision-positioning/ray-angle-derivation.png",
            label: "Figure 7",
            title: "单位射线反投影与三点距离约束",
            caption: "左图由像点和相机内参计算单位射线；右图以非共线三点为例，说明同一夹角如何通过余弦定理约束点间距离。项目实际以相机中心 $C$ 为变量直接优化，不先求射线长度。"
          },
          {
            src: "/projects/vision-positioning/cnn_confusion_matrix.png",
            label: "Figure 8",
            title: "Patch CNN 局部图像块分类器在测试集（N=276）上的高精度混淆矩阵",
            caption: "276 个独立测试样本（涵盖 65 个正样本角点与 211 个背景负样本）实现 100% 无错分类，错检样本为 0。"
          }
        ]
      },
      {
        id: "sec-case-studies",
        number: "06",
        kicker: "Qualitative Case Studies & Marine Field Trials",
        title: "定性案例研究、海洋实测与项目成果",
        paragraphs: [
          "为了检验算法在实际物理环境中的表现，除了常规测试外，我们还在大连沿海港口及试验水域开展了现场实测试验。"
        ],
        cases: [
          {
            id: "case-1",
            tag: "Case Study 1 · 多标杆空间全景解算验证",
            dataset: "Ours-Full Benchmark (Render Image #1)",
            figure: {
              src: "https://media.tianyasky.top/site/projects/vision-positioning/ours-full_result.jpg",
              label: "Figure 9",
              title: "Ours-Full 完整流水线关键点检测、语义分类与位姿重构全流程定性结果",
              caption: "展示了原始图像上杆体掩膜叠加、Harris 角点提取、CNN 语义标注（绿色/橙色标签）及最终位姿解算输出，无任何背景虚警干扰。"
            },
            analysis: "在包含大范围背景杂波的复杂视场中，YOLO 掩膜成功框定了标杆区域，Harris 提取出边缘候选点，CNN 准确识别出对应物理关键点并赋予坐标，位姿求解器正常收敛，验证了感知与几何层的数据打通。"
          },
          {
            id: "case-2",
            tag: "Case Study 2 · 多初值非线性优化流程",
            dataset: "Multi-Start NLLS Schematic",
            figure: {
              src: "/projects/vision-positioning/multi-start-workflow.png",
              label: "Figure 10",
              title: "多初值 LM / TRF 并行求解、残差筛选与回退",
              caption: "从上一帧、PnP 粗解和锚点重心取初值。LM 与 TRF 分别求解各初值；有可接受解时选残差最小者，否则使用 PnP 粗解或时序预测。"
            },
            analysis: "来自不同先验的初值可以降低单一起点落入较差局部解的风险。在残差比较时只在求得的候选解之间进行筛选，保障了优化收敛的稳定性。"
          },
          {
            id: "case-3",
            tag: "Case Study 3 · 系统软件架构与分层设计",
            dataset: "System Engineering Blueprint",
            figure: {
              src: "/projects/vision-positioning/software-architecture.png",
              label: "Figure 11",
              title: "基于单目视觉与射线夹角约束的相机三维坐标重建系统分层软件架构图",
              caption: "涵盖视频采集层、深度学习感知层、几何优化计算层、数据持久化存储层（SQLite）与交互式可视化界面层（PyQt5）。"
            },
            analysis: "系统采用模块化设计，解耦了视频采集、深度学习推理与几何优化，支持多线程异步执行，在边缘计算设备 Jetson Orin 上维持稳定 26 FPS 帧率输出。"
          },
          {
            id: "case-4",
            tag: "Case Study 4 · 单图角点提取与精炼质检",
            dataset: "Single Image Keypoint Pipeline",
            figure: {
              src: "https://media.tianyasky.top/site/projects/vision-positioning/single_image_result.png",
              label: "Figure 12",
              title: "单张图像关键点提取、CNN 分类、NMS 抑制与亚像素精炼全阶段质检图",
              caption: "详细展示了从原始图像到候选角点云、置信度过滤、NMS 去重以及亚像素坐标精炼的连续演变过程。"
            },
            analysis: "通过逐步质检验证了 NMS 能够将局部密集的角点群精简为唯一的孤立最高响应点，清除了密集角点对后续优化残差梯度的干扰。"
          }
        ]
      }
    ]
  },
  caseFigures: {
    background: {
      src: "/projects/vision-positioning/ray-angle-geometry.png",
      caption: "相机光心与三维标杆特征点射线夹角不变性几何拓扑模型"
    },
    method: {
      src: "/projects/vision-positioning/figure_overall_pipeline.png",
      caption: "五级级联深度学习感知与多初值射线夹角非线性优化全流水线",
      wide: true
    },
    results: {
      src: "https://media.tianyasky.top/site/projects/vision-positioning/figure_ablation_grid.png",
      caption: "六大消融实验变体关键点检测与定位误差综合评测对比"
    }
  },
  gallery: [
    {
      src: "/projects/vision-positioning/figure_overall_pipeline.png",
      caption: "系统整体架构图：前端五级级联感知与后端多初值射线夹角优化",
      aspect: "wide"
    },
    {
      src: "/projects/vision-positioning/ray-angle-geometry.png",
      caption: "射线夹角不变性三维空间几何投影与角度一致性约束模型",
      aspect: "wide"
    },
    {
      src: "/projects/vision-positioning/ray-angle-derivation.png",
      caption: "像点反投影与非共线三点的余弦距离约束",
      aspect: "wide"
    },
    patchCnnFigure,
    landmarkFigure,
    {
      src: "/projects/vision-positioning/figure_corner_order_render.png",
      caption: "仿真视场中可见角点的投影与背景类别标注",
      aspect: "wide"
    },
    {
      src: "https://media.tianyasky.top/site/projects/vision-positioning/figure_ablation_grid.png",
      caption: "消融实验全变体检测效果横向对比：Ours-Full、No Mask、No CNN、No Post 及 Pure Harris",
      aspect: "wide"
    },
    {
      src: "/projects/vision-positioning/figure_ablation_statistics.png",
      caption: "消融实验各变体候选角点数与最终保留关键点数量统计柱状图",
      aspect: "chart"
    },
    {
      src: "https://media.tianyasky.top/site/projects/vision-positioning/figure_training_panel.png",
      caption: "YOLO 训练损失与指标曲线、YOLO 混淆矩阵与 Patch CNN 混淆矩阵三联面板",
      aspect: "wide"
    },
    {
      src: "/projects/vision-positioning/software-architecture.png",
      caption: "单目视觉定位系统分层软件架构蓝图",
      aspect: "wide"
    },
    {
      src: "/projects/vision-positioning/multi-start-workflow.png",
      caption: "多初值求解流程：并行运行 LM / TRF，筛选最小残差解或回退",
      aspect: "wide"
    },
    {
      src: "https://media.tianyasky.top/site/projects/vision-positioning/ours-full_result.jpg",
      caption: "Ours-Full 算法在复杂全景视场下的实际特征提取与类别标注定性图",
      aspect: "wide"
    },
    {
      src: "https://media.tianyasky.top/site/projects/vision-positioning/single_image_result.png",
      caption: "单张图像全流程检测步骤质检：ROI 掩膜、Harris 提取、NMS 抑制与亚像素精炼",
      aspect: "wide"
    },
    {
      src: "https://media.tianyasky.top/site/projects/vision-positioning/academic_poster.png",
      caption: "第十三届辽宁省大学生创新年会学术海报全景成果展示",
      aspect: "chart"
    },
    {
      src: "https://media.tianyasky.top/site/projects/vision-positioning/real_world/dsc00438.jpg",
      caption: "Sony α6400 (ILCE-6400) 6000×4000 超高清实拍现场原图 (DSC00438)",
      aspect: "wide"
    },
    {
      src: "https://media.tianyasky.top/site/projects/vision-positioning/real_world/dsc00445.jpg",
      caption: "大连沿海实测现场多视角标杆拍摄原图 (DSC00445)",
      aspect: "wide"
    },
    {
      src: "https://media.tianyasky.top/site/projects/vision-positioning/real_world/yolo_boxes.jpg",
      caption: "真实测试样本 YOLO 标杆目标检测与边界框回归预测效果图",
      aspect: "wide"
    },
    {
      src: "/projects/vision-positioning/real_world/calib_pos01.jpg",
      caption: "相机标定棋盘格现场真实采集与内参标定图集",
      aspect: "wide"
    }
  ],
  highlights: [
    "级联感知网络：YOLO ROI 提取 + Harris 角点检测 + 9分类 Patch CNN 语义识别 + NMS 亚像素精炼",
    "非线性几何优化：推导射线夹角守恒方程，解耦 6-DoF 姿态，有效缓解共线细长标杆退化问题",
    "多初值双求解器：融合时序滤波、PnP 粗解与空间重心先验，LM 与 TRF 双引擎并发提升收敛稳定性",
    "系统实现与海试验证：开发 PyQt5/SQLite 桌面工作站，边缘 Jetson Orin 达 26 FPS，大连沿海实测 10–15cm RMSE",
    "学术与知识产权：辽宁省大学生创新年会推荐成果 · iCAN/金砖大赛国家三等奖 · 国家计算机软件著作权登记"
  ],
  background: "在近海渔业捕捞、养殖网箱巡检、港口堆场以及室内/水下无 GPS 环境中，传统卫星导航易受遮挡、多径干扰而失效；而传统视觉标志物（如 AprilTag/ArUco）易受海洋腐蚀与污损。利用场景中已有的已知地标（如垂直立柱或固定标杆）进行单目相机定位是一种低成本方案；但在实际应用中，细长共线的标杆往往容易让传统 PnP 算法发生共线几何退化，导致解算数值不稳定并出现数米的位置漂移。因此需要一套抗退化能力较强、在复杂光照下工作稳定的单目视觉定位方法。",
  method: "系统分为感知与几何解算两部分。前端感知：微调轻量 YOLO 模型定位标杆并生成掩膜，过滤天空与水面等大面积背景；在掩膜内提取 Harris 候选角点；用 3 层卷积网络（SimpleCNN）对 64×64 局部图像块做 9 分类判别（8 个物理特征点加 1 个背景类），再经类别 NMS 与 cornerSubPix 迭代精炼，获取 2D 像素与 3D 已知坐标的对应关系。后端几何解算：推导光心反投影射线夹角守恒关系，将位姿求解转化为只优化相机三维坐标 C 的非线性最小二乘问题；结合时序连续性、PnP 粗解与空间点中心生成多个候选初值，调用 LM 与 TRF 求解器进行优化，选取残差最优的解作为当前帧位置。",
  results: "在仿真基准与大连沿海 8 个点位实测展开系统验证。仿真消融实验中，完整流程保持了稳定的几何解算精度；消融实验证明去除 CNN 语义分类会导致关键点匹配错误，平均位置误差增至 5.38 m，去除 NMS 会因密集冗余点干扰导致误差增至 6.13 m。实际工况下在 Jetson Orin 边缘端实现 26 FPS 实时运行，综合定位 RMSE 稳定在 10–15 cm，相对航向角度误差小于 0.6°。配套完成了基于 PyQt5 的桌面测试软件并登记了软件著作权。",
  reflection: "回顾整个开发过程，有两点体会比较深：一是单目定位在遇到波浪晃动剧烈时，单帧独立解算容易产生跳动，后续如果继续改进，应该引入扩展卡尔曼滤波（EKF）或因子图优化，把 IMU 惯导数据融合进来做时空滑窗平滑；二是在户外水面环境下，水面反光和镜头水汽对图像质量影响较大，可以通过物理仿真或更充分的数据增强来提升恶劣光照下的鲁棒性。",
  links: {
    github: "https://github.com/TianyaSKY",
    gitee: "https://gitee.com/TianyaSKY"
  },
  video: "https://media.tianyasky.top/site/projects/vision-positioning/demo.mp4",
  featured: true,
  legacyHasDemo: true
};

export default visionPositioningDetail;
