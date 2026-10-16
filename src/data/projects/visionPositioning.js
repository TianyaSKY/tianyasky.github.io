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
    abstractZh: "针对海洋工程、近海渔船作业、港口堆场巡检以及室内/水下无 GPS 环境中，传统卫星导航易丢失信号、视觉人工标志物（如 AprilTag/ArUco）易污损退化，且经典透视 n 点算法（Perspective-n-Point, PnP）在共线或共面细长杆状结构上存在严重几何退化（Collinear Degeneracy）的痛点难题，本文提出一种融合级联深度学习与射线夹角不变性几何约束的单目视觉相机三维坐标重建系统。在前端感知层，构建了「YOLO 区域粗检 → Harris 候选角点提取 → 深度 CNN 局部块语义分类 → 分类别 NMS 抑制 → 亚像素精炼」的高精度级联检测流水线。首先利用轻量级 YOLO 目标检测模型（POLES.pt）定位视野中的杆状参照物并生成二值 ROI 掩膜，将关键点搜索空间大幅压缩 95% 以上；在掩膜约束的感兴趣区域内执行 Harris 算法捕获几何角点；随后由定制的三层卷积神经网络（SimpleCNN）对 64×64 局部图像块执行 9 分类推理（8 个空间物理特征点 + 1 个背景噪声类），在 1377 张样本数据集上实现了 100% 的精准分类与背景过滤，有效解决了无纹理场景下的 2D-3D 数据关联歧义；最后经按类别非极大值抑制与 cornerSubPix 迭代精炼，获取亚像素级关键点坐标。在后端几何解算层，推导并建立了基于反投影光学射线夹角守恒的非线性最小二乘位姿优化模型。通过相机内参将 2D 像点转换为归一化单位方向射线，构建两两射线夹角与空间三维世界点方向夹角的一致性残差，将原本对旋转平移耦合敏感的 PnP 求解转化为仅依赖相机三维位置参数的良态非线性优化；同时设计了融合历史帧滤波、PnP 粗估计及空间点几何中心的多候选初值策略，配合 Levenberg-Marquardt (LM) 与 Trust Region Reflective (TRF) 双优化引擎并发求解与最优残差选取。实验在仿真基准与实际场景下展开了系统性消融对比。结果表明：完整系统在测试集上达成 100% 解算成功率与 1.1×10⁻⁵ m 理论重构精度；消融实验证实，移除 CNN 语义分类会导致启发式分配失效，位置误差急剧恶化至 5.38 m；移除 NMS 与后处理会导致冗余点干扰，误差增至 6.13 m。系统在边缘计算终端 Jetson Orin 上实现 26 FPS 实时稳定运行，并在大连沿海实测中取得 10–15 cm RMSE 的高可靠定位精度，为无 GPS 复杂环境下的低成本高精度视觉定位提供了完整的理论与工程落地范式。",
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
  bibtex: "@article{chen2026monocularposereconstruction,\n  title={Monocular Camera 3D Coordinate Reconstruction via Structured Pole Keypoint Cascaded Networks and Ray-Angle Invariant Optimization},\n  author={Chen, Minxiang and Li, Mingzhi},\n  journal={Academic Thesis & Project Report},\n  year={2026},\n  institution={Dalian Ocean University}\n}",
  paperArticle: {
    sections: [
      {
        id: "sec-intro",
        number: "01",
        kicker: "Introduction & Problem Formulation",
        title: "引言与研究动机 / Introduction & Motivation",
        paragraphs: [
          "高精度、高可靠的空间三维位姿估计（Visual Pose Estimation）是自主移动机器人、近海养殖船舶作业、水下特种作业载具及工业数字孪生系统的关键核心使能技术。在海洋开阔水域、近海港口、桥梁涵洞以及室内仓储等 GPS 信号受限或完全拒止（GPS-Denied）的严苛环境中，传统卫星导航（GNSS）往往因多径效应、遮挡和海上电磁干扰发生严重漂移甚至失效；而依赖双目立体视觉或激光雷达（LiDAR）的方案则面临成本高昂、能耗巨大、透雾透水性能衰减严重以及机械尺寸难以适装等局限。",
          "单目视觉定位凭借其轻量化、低功耗、硬件成本低廉以及丰富的语义感知维度，成为受限场景下极具前景的替代方案。然而，在真实工程环境中采用单目视觉进行位姿解算仍面临两大根本性瓶颈：其一，经典透视 n 点算法（Perspective-n-Point, PnP及其变体 EPnP、UPnP 等）在面对空间中呈垂直分布、细长共线形态的杆状参照物（如港口系缆柱、海洋标杆、桥梁立柱）时，投影射线几何极易退化为共线/共面奇异临界曲面（Collinear Critical Surfaces），导致代数求解器产生严重的数值不稳定、旋转多义性以及数米乃至数十米的位置漂移；其二，在纹理稀疏、光照剧烈起伏的开放场景中，传统手工特征描述子（SIFT、ORB）无法建立 2D 像素与先验 3D 世界锚点的无歧义对应关系，传统方案通常依赖人工交互匹配或粘贴易受海水腐蚀的人工标志码（AprilTag），维护成本极高。",
          "为彻底突破上述理论与工程桎梏，本文提出一套端到端集成的「基于射线夹角不变性与级联深度学习的单目视觉相机三维坐标重建系统」。系统以场景中预设已知三维几何坐标的结构化杆体为参照物，前端通过「YOLO 区域粗检 → Harris 亚像素候选角点提取 → 深度 CNN 局部块语义分类 → 分类别 NMS 抑制 → 亚像素精炼」构建五级级联感知网络，自动建立 2D 像素与 3D 世界锚点的无歧义映射；后端摒弃传统 6-DoF 耦合的 PnP 求解思路，推导并建立了基于光心反投影射线夹角守恒的非线性最小二乘位姿优化方程，将位姿求解降维解耦为仅依赖相机三维位置的良态非线性优化，并辅以多初值并发与双求解器机制，实现了高精度、高鲁棒的全局位置解算。"
        ],
        contributions: [
          "提出五级级联式结构化关键点感知流水线：融合 YOLO 目标检测（ROI 掩膜生成，搜索空间缩小 95%+）、Harris 几何角点提取与轻量 9 分类 Patch CNN（SimpleCNN），在 1377 张样本数据集上实现 100% 的角点语义识别率，全自动完成 2D 像素与 3D 世界点的映射关联，无需任何手工匹配或人工标志码。",
          "创立基于反投影射线夹角不变性的位置解算理论：将 2D 像点反投影为归一化单位方向向量，推导了两两光线夹角与三维世界点方向夹角的守恒约束，将极易发生共线奇异退化的 6-DoF PnP 估计解耦为仅关于相机三维坐标 $C$ 的 3-DoF 非线性最小二乘优化，从数学机理上根除了共线退化问题。",
          "设计多候选初值生成与 LM/TRF 双优化求解机制：融合历史时序滤波先验 $C_{t-1}$、PnP 粗估计与空间点几何中心构建候选初值池，并发调用 Levenberg-Marquardt 与 Trust Region Reflective 双求解器进行最优残差收敛选取，保证了 100% 的求解成功率与高精度几何解算。",
          "完成系统原型研发与海上实测验证：开发了基于 PyQt5 与 SQLite 的视觉定位分析桌面软件，支持相机标定、多场景世界点云管理、实时 26 FPS 流水线阶段质检与轨迹绘制；大连沿海实测试验达成 10–15 cm RMSE 综合定位精度，获辽宁省创新创业年会推荐与国家计算机软件著作权登记。"
        ]
      },
      {
        id: "sec-theory",
        number: "02",
        kicker: "Geometric Invariance & Ray-Angle Formulation",
        title: "理论推导：反投影射线夹角守恒与非线性几何解算",
        paragraphs: [
          "在标准针孔相机成像模型（Pinhole Camera Model）中，设相机的内参矩阵为 $K \\in \\mathbb{R}^{3 \\times 3}$。对于图像平面上检测到的任意亚像素关键点 $u_i = (u_i^*, v_i^*)^T$，其对应的归一化相机坐标系反投影射线单位方向向量 $r_i \\in \\mathbb{R}^3$ 可由内参矩阵解析求得：",
          "对于视野内同时观测到的任意两点 $u_i$ 与 $u_j$，由几何内积定义可计算其在相机坐标系下的夹角 $\\theta_{ij}$。由于内积操作对任意正交旋转矩阵具有等距保角不变性（$\\langle Rr_i, Rr_j \\rangle = \\langle r_i, r_j \\rangle$），因此观测夹角 $\\theta_{ij}$ 与相机的三维旋转姿态 $R$ 完全解耦，仅取决于空间相对几何。",
          "设对应特征点在世界坐标系下的已知三维物理坐标为 $P_i, P_j \\in \\mathbb{R}^3$，未知相机光学中心在世界坐标系下的三维坐标为 $C = (X_c, Y_c, Z_c)^T$。从相机光心 $C$ 指向空间点 $P_i, P_j$ 的视线方向向量分别为 $v_i(C) = P_i - C$ 与 $v_j(C) = P_j - C$。此时两视线向量在空间中张开的物理夹角 $\\phi_{ij}(C)$ 同样由内积公式给出。"
        ],
        math: {
          title: "射线夹角不变性与非线性最小二乘残差优化模型 (Ray-Angle NLLS Model)",
          formula: "\\min_{C \\in \\mathbb{R}^3} \\mathcal{F}(C) = \\frac{1}{2} \\sum_{1 \\le i < j \\le N} \\left[ \\arccos\\left( \\frac{(P_i - C) \\cdot (P_j - C)}{\\|P_i - C\\| \\|P_j - C\\|} \\right) - \\arccos\\left( \\frac{K^{-1} \\tilde{u}_i \\cdot K^{-1} \\tilde{u}_j}{\\|K^{-1} \\tilde{u}_i\\| \\|K^{-1} \\tilde{u}_j\\|} \\right) \\right]^2",
          explanation: "其中 $\\tilde{u}_i = [u_i^*, v_i^*, 1]^T$ 为第 $i$ 个角点的齐次像素坐标，$K$ 为相机内参矩阵，$P_i \\in \\mathbb{R}^3$ 为第 $i$ 个关键点在世界坐标系下的已知三维位置，$C = (X_c, Y_c, Z_c)^T$ 为待求解的相机光学中心三维世界坐标。该模型将复杂的 6-DoF 旋转/平移耦合估计解耦为仅关于位置 $C$ 的 3-DoF 几何残差优化，有效缓解了共线点在旋转参数估计上的病态矩阵奇异退化。"
        },
        figure: {
          src: "/projects/vision-positioning/figure_geometric_model.png",
          label: "Figure 1",
          title: "相机光心、像平面反投影射线与三维空间特征点射线夹角一致性几何模型",
          caption: "空间几何模型展示了相机光心 $C$、归一化像平面上的观测像点 $u_1, u_2$（对应反投影射线 $r_1, r_2$ 及夹角 $\\theta_{12}$）与世界坐标系下已知特征锚点 $P_1, P_2$（对应空间视线向量 $v_1, v_2$ 及夹角 $\\phi_{12}$）之间的投影对应关系。",
          analysis: "在理想无噪成像条件下，像面反投影射线夹角 $\\theta_{12}$ 恒等于三维空间方向夹角 $\\phi_{12}$。通过联合优化所有观测点对的夹角残差，可在无需先验初始姿态角的前提下精确收敛到相机中心坐标 $C$。"
        }
      },
      {
        id: "sec-method",
        number: "03",
        kicker: "Cascaded Perception Pipeline & Landmark CNN",
        title: "感知架构：五级级联检测流水线与 9 分类 Patch CNN",
        paragraphs: [
          "为了向几何求解器提供零虚警、高精度的 2D 亚像素关键点及其与 3D 世界点的确定性语义对应关系，本文设计了五级级联感知检测流水线。传统方法直接在整幅图上提取特征容易受到复杂背景杂波干扰，且无法识别特征点的物理语义身份；本文方案通过「宏观目标定位 → 局部几何提取 → 微观深度分类 → 空间去冗余 → 亚像素级精炼」的递进收敛架构，确保了感知输出的绝对纯净性。"
        ],
        figure: {
          src: "/projects/vision-positioning/figure_overall_pipeline.svg",
          label: "Figure 2",
          title: "前端五级级联视觉感知与后端射线夹角几何解算整体系统流水线",
          caption: "系统分为前端视觉感知与后端几何定位两大核心子系统：输入图像经 YOLO 杆体检测得到二值掩膜，在感兴趣区域内提取 Harris 角点，裁切 64×64 Patch 送入 CNN 进行 9 分类推理；经置信度过滤、类别 NMS 与亚像素精炼得到最终关键点，输入后端进行反投影射线转换与多初值并发优化。",
          wide: true
        },
        subsections: [
          {
            title: "3.1 YOLO 杆体区域检测与掩膜生成 (YOLO ROI Mask Gating)",
            content: "使用针对杆状参照物专门微调训练的 YOLO 目标检测模型（POLES.pt），以 640×640 分辨率对输入视频帧进行实时推理。模型输出所有可见标杆的高置信度边界框（Bounding Box），并将其转化为二值化感兴趣区域（ROI Mask）。该阶段直接过滤掉了画面中 95% 以上的非标杆背景区域（如天空、水面、地面杂物），从源头上杜绝了背景噪声生成虚假角点。"
          },
          {
            title: "3.2 掩膜约束下的 Harris 候选角点提取 (Constrained Harris Corner Extraction)",
            content: "在二值掩膜限定的 ROI 区域内执行高灵敏度 Harris 角点检测。算法计算局部图像梯度自相关矩阵 $M_H(p)$，利用响应函数 $R(p) = \\det(M_H) - 0.10 \\cdot (\\operatorname{tr}(M_H))^2$ 捕获灰度梯度剧烈变化的空间转折点。邻域窗口设为 block_size=2，Sobel 核为 k_size=3，响应阈值比例为 0.03，确保标杆边缘所有真实物理转折点被高召回率捕获。"
          },
          {
            title: "3.3 定制 9 分类 Patch CNN 局部语义判别器 (9-Class Deep SimpleCNN)",
            content: "以每个 Harris 候选角点为几何中心，从原图中裁切 64×64 像素的局部彩色图像块（Patch）。将 Patch 输入自主设计的轻量级卷积分类网络（SimpleCNN）：包含 3 个卷积-池化块（通道数分别为 16、32、64，均配合 ReLU 激活与 MaxPool 2×2 下采样），展平后经过 4096→512 全连接层与 Dropout 正则化，最终由 512→9 全连接层输出 Softmax 概率分布。类别 0–7 严格对应标杆三维几何结构上的 8 个固定物理关键点（下层 z=4.0 的 4 个角点与上层 z=8.0 的 4 个角点），类别 8 为背景虚警类。网络在验证集上取得 100% 分类准确率。"
          },
          {
            title: "3.4 分类别非极大值抑制 (Class-wise NMS)",
            content: "移除所有被预测为背景类（class=8）以及最大类别置信度低于阈值（τ_conf=0.85）的候选点。随后对保留的角点按类别分组，在每一个类别分组内部，按照 Harris 响应值从高到低排序，贪心地选取响应最强的角点，并抑制其空间邻域半径（r_nms=25 px）内的其他同类别候选点，有效消除局部多重密集响应。"
          },
          {
            title: "3.5 亚像素角点梯度正交精炼 (Sub-pixel Corner Refinement)",
            content: "对 NMS 后保留的唯一关键点坐标，调用 OpenCV 的 cornerSubPix 算法进行亚像素级迭代精炼。基于角点邻域内任意像素的灰度梯度向量 $\\nabla I(q)$ 与位移向量 $(q - p^*)$ 相互正交的物理性质，通过最小二乘法求解最佳亚像素中心点 $p^*$，将坐标定位精度由整数像素级提升至 0.01–0.05 像素级，为后端高精度几何解算奠定坚实基础。"
          }
        ]
      },
      {
        id: "sec-loss",
        number: "04",
        kicker: "Multi-Start Optimization & Industrial Desktop Suite",
        title: "优化求解：多初值并发策略、双求解器保障与工业级桌面系统",
        paragraphs: [
          "射线夹角残差目标函数 $\\mathcal{F}(C)$ 属于非线性、非凸优化问题，在复杂空间几何布局下可能存在局部极小值甚至鞍点。为了确保优化求解过程具备 100% 的全局收敛可靠性与快速高效求解，本文提出了多候选初值生成策略与 Levenberg-Marquardt (LM) / Trust Region Reflective (TRF) 双求解器协同机制。"
        ],
        math: {
          title: "多初值生成与双求解器联合优化准则",
          formula: "\\mathcal{S} = \\left\\{ C_{t-1}, \\; -R_{\\text{pnp}}^T t_{\\text{pnp}}, \\; \\frac{1}{N}\\sum_{i=1}^N P_i \\right\\}, \\quad C^* = \\arg\\min_{C \\in \\{\\text{LM}(s), \\text{TRF}(s) \\mid s \\in \\mathcal{S}\\}} \\|\\mathbf{r}(C)\\|^2",
          explanation: "候选初始点集 $\\mathcal{S}$ 分别来自历史时序连续性先验 $C_{t-1}$、传统代数 PnP 粗估计 $-R^T t$ 以及可见三维特征点的几何中心。对每个候选起点分别使用 Levenberg-Marquardt (LM, 自适应阻尼) 与 Trust Region Reflective (TRF, 边界信赖域) 两种数值求解器进行优化，最终选取残差二范数最小的收敛解作为当前帧的相机全局世界坐标。"
        },
        trainingPillars: [
          {
            title: "多候选初值生成机制 (Multi-Candidate Initialization)",
            detail: "构建包含 3 组不同先验维度的初值池：(1) 历史时序初值 $C_{t-1}$，利用移动载体轨迹平滑性保证连续帧快速收敛；(2) 传统 solvePnP 粗解初值 $-R^T t$，为剧烈机动变位提供全局跳变先验；(3) 空间点几何中心 $\\bar{P} = \\frac{1}{N}\\sum P_i$，为冷启动无先验状态提供稳定的锚点约束。"
          },
          {
            title: "LM / TRF 双求解器自适应容错 (Dual-Solver Optimization & Fallback)",
            detail: "针对不同初值分别调用 LM（擅长无约束非线性最小二乘二次收敛）与 TRF（擅长具有空间包围盒边界的信赖域反射优化）两种求解器。若优化收敛且残差低于容差阈值，则选取最优残差解；若发生罕见极值退化，系统自动平滑回退至 PnP 粗估计或卡尔曼滤波预测值，构建了具备平滑容错机制的高可用容错闭环。"
          },
          {
            title: "工业级 PyQt5 桌面定位系统 (Industrial Desktop Application)",
            detail: "开发了基于 PyQt5 的全功能桌面应用程序，集成 RTSP 网络流/本地视频采集、相机内参/畸变矩阵数据库管理（SQLite）、3D 世界点云交互式编辑预览、实时 X/Y/Z 坐标曲线绘制（pyqtgraph）以及 6 阶段流水线中间质检窗口（Stage Previewer），为算法验证与现场调试提供了交互式工具支持。"
          }
        ]
      },
      {
        id: "sec-results",
        number: "05",
        kicker: "Quantitative Ablation Suite & Error Diagnostics",
        title: "实验评测：系统消融实验与误差物理归因分析",
        paragraphs: [
          "为系统性验证各模块在整套系统中的独立功效与抗退化性能，我们在仿真基准与真实视频数据集上开展了详尽的消融实验。对比方案涵盖：(1) Ours-Full 完整流水线；(2) Ablation-1 (No Mask，关闭 YOLO 掩膜)；(3) Ablation-2 (No CNN，关闭 CNN 语义分类，采用纯几何启发式分配)；(4) Ablation-3 (No Post-processing，关闭 NMS 与亚像素精炼)；(5) Ablation-4 (Pure Harris，无掩膜无分类纯角点基线)；(6) Traditional PnP (完整关键点检测，但后端使用传统 solvePnP 解算)。"
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
        sotaTitle: "关键点检测各阶段对定位精度的决定性影响分析",
        sotaNarrative: "消融实验结果（见表 1）揭示了感知流水线与几何求解器各组件之间的紧密协同关系：(1) Ours-Full 取得了 1.10×10⁻⁵ m 的极高几何解算精度，成功率达 100%；(2) 当移除 CNN 语义分类时（Ablation-2），由于缺乏角点语义 ID，启发式匹配发生严重错配，导致平均位置误差增至 5.380 m，证实了语义识别对 2D-3D 几何关联的关键作用；(3) 当移除 NMS 与亚像素精炼时（Ablation-3），由于同一角点周围存在 75+ 个冗余候选点，残差场被密集聚类的非正交梯度严重扭曲，平均误差达 6.132 m；(4) 纯 Harris 基线（Ablation-4）产生 217 个杂乱无序角点，定位误差达 5.655 m；(5) 相比传统 PnP 算法（3.21×10⁻⁴ m），射线夹角法将平均误差降低了一个数量级，展现出卓越的抗几何退化与抗噪能力。",
        scatterDiscussion: "在数据集构建与训练评测方面，Patch CNN 分类器在 1377 张样本（验证集 276 张）上实现了全部 8 个空间角点类别与 1 个背景类的 100% Precision、100% Recall 与 100% F1-Score，混淆矩阵呈现完美的对角线分布，有效避免了关键点物理身份错判；YOLO 检测模型在 640×640 分辨率下训练收敛平稳，验证集 mAP@0.5 超过 99.2%（见下方 Figure 5 训练全景面板）。",
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
            title: "三维标杆仿真渲染图与 8 类空间特征角点（0–7）投影及背景类标注分布",
            caption: "渲染图像直观呈现了空间标杆各转折点的语义 ID 分配：0–3 为上层特征角点，4–7 为下层特征角点，背景噪点被标记为第 8 类并予以剔除。"
          },
          {
            src: "/projects/vision-positioning/ray_angle_pose_principle.png",
            label: "Figure 7",
            title: "像平面观测射线反投影与利用射线夹角不变性恢复位姿全流程原理图",
            caption: "详细阐述了从像平面像素坐标到单位方向向量提取（Panel 1）以及利用射线夹角余弦定理方程组联立求解空间深度与位姿（Panel 2）的完整几何物理过程。"
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
          "为了全面检验算法在复杂现实物理环境中的可靠性与工程成熟度，项目组不仅在实验室进行了极限光照与遮挡测试，还在大连沿海港口及实验水域开展了长周期的现场实测试验。"
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
            analysis: "在包含大范围背景杂波的复杂视场中，YOLO 掩膜成功框定有效计算域，Harris 提取出边缘候选点，CNN 精确识别出 0、1、2、3 等正样本关键点并赋予坐标，位姿求解器以小于 0.02 mm 的残差收敛，验证了感知与几何层的高效闭环。"
          },
          {
            id: "case-2",
            tag: "Case Study 2 · 多初值非线性优化收敛态势",
            dataset: "Multi-Start NLLS Schematic",
            figure: {
              src: "https://media.tianyasky.top/site/projects/vision-positioning/multi_start_nlls_schematic.png",
              label: "Figure 10",
              title: "多候选初值生成与 Levenberg-Marquardt / TRF 优化残差收敛流向图",
              caption: "对比了时序初值、PnP 粗解与几何重心初值在非凸残差曲面上的优化轨迹与收敛特性。"
            },
            analysis: "在单目大角度旋转或初始视角剧烈跳变的极限工况下，单一初值容易陷入局部极小；多初值并发机制结合双求解器使得系统在 100% 的试验帧中均能捕获到全局最优解。"
          },
          {
            id: "case-3",
            tag: "Case Study 3 · 系统软件架构与分层设计",
            dataset: "System Engineering Blueprint",
            figure: {
              src: "https://media.tianyasky.top/site/projects/vision-positioning/system_architecture_blue.png",
              label: "Figure 11",
              title: "基于单目视觉与射线夹角约束的相机三维坐标重建系统分层软件架构图",
              caption: "涵盖视频采集层、深度学习感知层、几何优化计算层、数据持久化存储层（SQLite）与交互式可视化界面层（PyQt5）。"
            },
            analysis: "系统采用高内聚低耦合的模块化设计，解耦了视频推流采集与耗时检测计算，支持多线程异步并发，在边缘计算设备 Jetson Orin 上维持稳定 26 FPS 帧率输出。"
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
            analysis: "通过 stage-by-stage 质检，清晰验证了 NMS 将局部密集丛状角点（200+点）精确精简为唯一的孤立最高响应点，消除了密集聚类对优化残差梯度的严重扭曲。"
          },
          {
            id: "case-5",
            tag: "Case Study 5 · 省级创新创业年会答辩与成果鉴定",
            dataset: "Liaoning Innovation Summit & IP Registration",
            figure: {
              src: "https://media.tianyasky.top/site/projects/vision-positioning/academic_poster.png",
              label: "Figure 13",
              title: "第十三届辽宁省大学生创新年会参展学术海报与项目成果全景展示",
              caption: "全景展示了国家级大创项目编号 202510158006 的学术创新点、实验数据、软著证书与实物系统成果。"
            },
            analysis: "项目成果荣获第十三届辽宁省大学生创新年会推荐项目、2024一带一路暨金砖国家技能大赛国家三等奖、第十九届iCAN创新创业大赛全国总决赛国家三等奖，并成功登记国家计算机软件著作权《基于射线夹角约束的杆体关键点视觉定位系统软件》。"
          }
        ]
      },
      {
        id: "sec-ablation-discussion",
        number: "07",
        kicker: "Ablation Studies & Future Perspectives",
        title: "工程反思、技术演进与未来展望",
        paragraphs: [
          "回顾从理论推导、Blender 仿真合成、算法编码到现场海试的完整研发周期，项目在单目几何定位这一经典但极具挑战的领域探索出了一条「深度语义引导 + 物理几何约束」的实用路径。消融实验不仅证明了各组件在算法闭环中的必要性，也为后续技术迭代提供了深刻洞见：",
          "1. 语义与几何的深度融合不可或缺：单纯依赖深度学习回归位姿易受跨域光照和视场泛化影响，而单纯依赖几何传统 PnP 则在共线退化时无法求解。通过让 CNN 专职负责局部语义分类、让几何优化专职负责高精度坐标求解，实现了优势互补；",
          "2. 仿真数据与领域自适应（Domain Randomization）是降低采集成本的利器：通过 Blender 脚本自动化合成多样化光照、视角与背景的渲染样本，节省了超过 70% 的外场数据标注开销。"
        ],
        reflection: "如果从头重构本系统，我会在两方面进行深化：一是将当前的单帧优化升级为结合扩展卡尔曼滤波（EKF）或因子图优化（Factor Graph Optimization）的时空滑动窗口连续定位框架，进一步压制海浪剧烈晃动带来的单帧抖动；二是引入镜头水滴折射与海洋大气前向散射物理光学模型，以提高在极端恶劣天气与水下折射介质中的空间重构精度。",
        futurePillars: [
          {
            title: "时空滑窗因子图优化 (Spatio-Temporal Factor Graph Fusion)",
            desc: "结合 IMU 惯导高频角速度与加速度数据，构建融合射线夹角视觉重投影误差因子与惯导预积分因子的平滑位姿估计图，在剧烈波浪起伏下实现厘米级平滑轨迹。"
          },
          {
            title: "非线性水下折射光线追踪补偿 (Subsea Refraction Compensation)",
            desc: "引入基于 Snell 定律的水-气双层介质光线追踪折射模型，针对水下巡检机器人（AUV/ROV）修正反投影射线的偏折角，拓展单目视觉在水下海洋装备定位中的应用广度。"
          }
        ]
      }
    ]
  },
  caseFigures: {
    background: {
      src: "/projects/vision-positioning/figure_geometric_model.png",
      caption: "相机光心与三维标杆特征点射线夹角不变性几何拓扑模型"
    },
    method: {
      src: "/projects/vision-positioning/figure_overall_pipeline.svg",
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
      src: "/projects/vision-positioning/figure_overall_pipeline.svg",
      caption: "系统整体架构图：前端五级级联感知与后端多初值射线夹角优化",
      aspect: "wide"
    },
    {
      src: "/projects/vision-positioning/figure_geometric_model.png",
      caption: "射线夹角不变性三维空间几何投影与角度一致性约束模型",
      aspect: "wide"
    },
    {
      src: "/projects/vision-positioning/ray_angle_pose_principle.png",
      caption: "反投影单位方向向量提取与射线夹角位姿恢复核心原理图",
      aspect: "wide"
    },
    {
      src: "/projects/vision-positioning/figure_cnn_structure.png",
      caption: "轻量级 9 分类 Patch CNN 局部语义判别网络层次结构与通道流向图",
      aspect: "wide"
    },
    {
      src: "/projects/vision-positioning/figure_corner_order.png",
      caption: "三维空间标杆关键点几何拓扑与 8 类特征角点（z=4 与 z=8）排序定义",
      aspect: "chart"
    },
    {
      src: "/projects/vision-positioning/figure_corner_order_render.png",
      caption: "仿真环境渲染视场下的 8 个特征角点与背景类标签投影定位展示",
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
      src: "https://media.tianyasky.top/site/projects/vision-positioning/system_architecture_blue.png",
      caption: "单目视觉定位系统分层软件架构蓝图",
      aspect: "wide"
    },
    {
      src: "https://media.tianyasky.top/site/projects/vision-positioning/multi_start_nlls_schematic.png",
      caption: "多初值非线性最小二乘优化（时序初值、PnP粗解、空间重心）收敛拓扑图",
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
    "级联感知网络：YOLO ROI 提取 + Harris 角点检测 + 9分类 Patch CNN（100% 验证准确率）+ NMS 亚像素精炼",
    "非线性几何优化：推导射线夹角不变性守恒方程，解耦 6-DoF 姿态，有效消除共线细长标杆退化奇异性",
    "多初值双求解器：融合时序滤波、PnP 粗解与空间重心先验，LM 与 TRF 双引擎并发保证 100% 全局收敛",
    "系统实现与海试验证：开发 PyQt5/SQLite 桌面工作站，边缘 Jetson Orin 达 26 FPS，大连沿海实测 10–15cm RMSE",
    "学术与知识产权：辽宁省大学生创新年会推荐成果 · iCAN/金砖大赛国家三等奖 · 国家计算机软件著作权登记"
  ],
  background: "在近海渔业捕捞、养殖网箱巡检、港口堆场以及室内/水下无 GPS 环境中，传统卫星导航易受遮挡、多径干扰而失效；而传统视觉定位（如 AprilTag/ArUco）易受海洋腐蚀与污损。利用场景中天然或预设的结构化杆状物作为几何锚点是一种低成本高可行性方案，但细长共线杆体在传统 PnP 算法中极易诱发共线退化奇异性，导致旋转多义性与数米级位置漂移。因此亟需一套兼具强抗退化性、高精度与抗复杂光照噪声的实时单目视觉定位系统。",
  method: "系统采用感知与几何深度解耦的两阶段架构。感知层：微调轻量级 YOLO 检测标杆并生成 ROI 二值掩膜，过滤 95%+ 背景；在掩膜内提取 Harris 角点；由 3 层卷积网络（SimpleCNN）对 64×64 局部 Patch 进行 9 分类推理（8 个空间物理特征点 + 1 个背景类），并经类别 NMS 与 cornerSubPix 迭代精炼，全自动建立 2D 像素与 3D 世界点的无歧义亚像素映射。几何层：推导反投影射线夹角守恒约束，将 6-DoF 位姿解耦为仅依赖相机三维坐标 C 的 3-DoF 非线性最小二乘优化；设计融合时序连续性、PnP 粗估计及空间重心的多初值策略，配合 LM 与 TRF 双求解器并发求解与最优残差选取。",
  results: "在仿真基准与大连沿海 8 个点位实测展开系统验证。仿真消融实验中，完整系统取得 100% 解算成功率与 1.1×10⁻⁵ m 理论重构误差；消融实验证明去除 CNN 语义分类会导致误差暴增至 5.38 m，去除 NMS 会导致误差增至 6.13 m。实际工况下在 Jetson Orin 边缘计算终端实现 26 FPS 实时运行，综合定位 RMSE 稳定在 10–15 cm，相对航向角度误差小于 0.6°。成果已获辽宁省大学生创新年会推荐，并取得计算机软件著作权《基于射线夹角约束的杆体关键点视觉定位系统软件》。",
  reflection: "如果从头重构本系统，我会在数据生成与时空融合上进一步深化：一是建立更完备的 Blender 物理渲染管线与领域随机化（Domain Randomization），模拟海水飞溅、镜头雾气与水下散射光，降低现场实测采集成本；二是引入滑动窗口因子图优化（Factor Graph）与 IMU 惯导紧耦合，在剧烈波浪晃动下提供更高阶的平滑动力学轨迹约束。",
  links: {
    github: "https://github.com/TianyaSKY",
    gitee: "https://gitee.com/TianyaSKY"
  },
  video: "https://media.tianyasky.top/site/projects/vision-positioning/demo.mp4",
  featured: true,
  legacyHasDemo: true
};

export default visionPositioningDetail;
